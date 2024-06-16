const express = require("express");
const router = new express.Router();
const db = require("../db");

// POST /industries - Adds an industry
router.post("/", async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const result = await db.query(
      `INSERT INTO industries (code, industry) 
       VALUES ($1, $2)
       RETURNING code, industry`,
      [code, industry]
    );
    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// GET /industries - Lists all industries
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`SELECT code, industry FROM industries`);
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

// POST /industries/:code/companies - Associates an industry to a company
router.post("/:code/companies", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { company_code } = req.body;
    const result = await db.query(
      `INSERT INTO industries_companies (industry_code, company_code) 
       VALUES ($1, $2)
       RETURNING industry_code, company_code`,
      [code, company_code]
    );
    return res.status(201).json({ association: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
