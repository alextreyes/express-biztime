const request = require("supertest");
const app = require("../app");
const db = require("../db");

beforeEach(async () => {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  await db.query(
    "INSERT INTO companies (code, name, description) VALUES ('apple', 'Apple', 'Maker of iPhone')"
  );
  await db.query(
    `INSERT INTO invoices (id, comp_code, amt, paid, add_date, paid_date) 
     VALUES (1, 'apple', 100, false, '2023-01-01', null)`
  );
});

afterAll(async () => {
  await db.end();
});

describe("GET /invoices", () => {
  test("It should respond with an array of invoices", async () => {
    const response = await request(app).get("/invoices");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoices: [{ id: 1, comp_code: "apple" }],
    });
  });
});

describe("GET /invoices/:id", () => {
  test("It should return a single invoice", async () => {
    const response = await request(app).get("/invoices/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoice: {
        id: 1,
        amt: 100,
        paid: false,
        add_date: "2023-01-01T05:00:00.000Z",
        paid_date: null,
        company: {
          code: "apple",
          name: "Apple",
          description: "Maker of iPhone",
        },
      },
    });
  });

  test("It should return 404 for non-existing invoice", async () => {
    const response = await request(app).get("/invoices/999");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /invoices", () => {
  test("It should add an invoice", async () => {
    const response = await request(app)
      .post("/invoices")
      .send({ comp_code: "apple", amt: 200 });

    expect(response.statusCode).toBe(201);
    expect(response.body.invoice).toMatchObject({
      comp_code: "apple",
      amt: 200,
      paid: false,
      paid_date: null,
    });
  });
});

describe("PUT /invoices/:id", () => {
  test("It should update an invoice", async () => {
    const response = await request(app)
      .put("/invoices/1")
      .send({ amt: 150, paid: true });

    expect(response.statusCode).toBe(200);
    expect(response.body.invoice).toMatchObject({
      id: 1,
      comp_code: "apple",
      amt: 150,
      paid: true,
    });
  });

  test("It should return 404 for non-existing invoice", async () => {
    const response = await request(app).put("/invoices/999").send({ amt: 150 });

    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /invoices/:id", () => {
  test("It should delete an invoice", async () => {
    const response = await request(app).delete("/invoices/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "deleted" });
  });
});
