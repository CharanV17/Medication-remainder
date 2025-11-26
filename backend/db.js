// backend/db.js
import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

// Detect database type (SQLite or Postgres)
const dbClient = process.env.DB_CLIENT || "sqlite3";

// Configure connection depending on the client
const connection =
  dbClient === "pg" || dbClient === "postgres"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.DB_SSL === "true"
            ? { rejectUnauthorized: false }
            : false,
      }
    : {
        filename: process.env.DATABASE_URL || "./data/dev.sqlite3",
      };

// Initialize Knex instance
const db = knex({
  client: dbClient,
  connection,
  useNullAsDefault: dbClient === "sqlite3", // required for SQLite
  pool: {
    min: 1,
    max: 5,
  },
});

// --- Quick self-test to confirm DB connection ---
(async () => {
  try {
    if (dbClient === "sqlite3") {
      console.log("✅ Connected to SQLite database:", connection.filename);
    } else {
      const res = await db.raw("SELECT NOW()");
      console.log(
        "✅ Connected to Postgres:",
        res.rows ? res.rows[0].now : "OK"
      );
    }
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// ✅ Explicitly export as default (for ES module imports)
export default db;
