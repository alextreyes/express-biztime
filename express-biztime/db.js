/** Database setup for BizTime. */
const { Client } = require("pg");

const DB_URI = process.env.DATABASE_URL || "postgresql:///biztime";

let db = new Client({
  connectionString: DB_URI,
});

db.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = db;
