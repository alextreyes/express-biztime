const db = require("../db");
const request = require("supertest");
const app = require("../app");

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

describe("GET /companies", () => {
  test("It should respond with an array of companies", async () => {
    const response = await request(app).get("/companies");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      companies: [{ code: "apple", name: "Apple" }],
    });
  });
});

describe("GET /companies/:code", () => {
  test("It should return a single company", async () => {
    const response = await request(app).get("/companies/apple");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      company: {
        code: "apple",
        name: "Apple",
        description: "Maker of iPhone",
        industries: [],
        invoices: [1],
      },
    });
  });

  test("It should return 404 for non-existing company", async () => {
    const response = await request(app).get("/companies/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /companies", () => {
  test("It should create a new company", async () => {
    const response = await request(app)
      .post("/companies")
      .send({ code: "ibm", name: "IBM", description: "Big Blue" });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      company: { code: "ibm", name: "IBM", description: "Big Blue" },
    });
  });
});

describe("PUT /companies/:code", () => {
  test("It should update an existing company", async () => {
    const response = await request(app)
      .put("/companies/apple")
      .send({ name: "Apple Inc.", description: "Maker of everything" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      company: {
        code: "apple",
        name: "Apple Inc.",
        description: "Maker of everything",
      },
    });
  });

  test("It should return 404 for non-existing company", async () => {
    const response = await request(app)
      .put("/companies/nonexistent")
      .send({ name: "Nonexistent", description: "Nonexistent description" });
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /companies/:code", () => {
  test("It should delete a company", async () => {
    const response = await request(app).delete("/companies/apple");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "deleted" });
  });

  test("It should return 404 for non-existing company", async () => {
    const response = await request(app).delete("/companies/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});
