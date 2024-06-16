const db = require("../db");
const request = require("supertest");
const app = require("../app");

beforeEach(async () => {
  await db.query("DELETE FROM industries_companies");
  await db.query("DELETE FROM industries");
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  await db.query(`
    INSERT INTO companies (code, name, description)
    VALUES ('apple', 'Apple', 'Maker of iPhone')
  `);
  await db.query(`
    INSERT INTO industries (code, industry)
    VALUES ('tech', 'Technology')
  `);
  await db.query(`
    INSERT INTO industries (code, industry)
    VALUES ('acct', 'Accounting')
  `);
  await db.query(`
    INSERT INTO industries_companies (industry_code, company_code)
    VALUES ('tech', 'apple')
  `);
});

afterEach(async () => {
  await db.query("DELETE FROM industries_companies");
  await db.query("DELETE FROM industries");
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
});

afterAll(async () => {
  await db.end();
});

describe("GET /industries", () => {
  test("It should respond with an array of industries and related companies", async () => {
    const response = await request(app).get("/industries");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      industries: [
        { code: "tech", industry: "Technology" },
        { code: "acct", industry: "Accounting" },
      ],
    });
  });
});

describe("POST /industries", () => {
  test("It should create a new industry", async () => {
    const response = await request(app)
      .post("/industries")
      .send({ code: "finance", industry: "Financial Services" });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      industry: { code: "finance", industry: "Financial Services" },
    });
  });
});

describe("POST /industries/:code/companies", () => {
  test("It should associate a company with an industry", async () => {
    const response = await request(app)
      .post("/industries/acct/companies")
      .send({ company_code: "apple" });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      association: { industry_code: "acct", company_code: "apple" },
    });
  });
});
