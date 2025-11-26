// backend/migrate.js
import db from "./db.js";

(async () => {
  try {
    // USERS TABLE
    const hasUsers = await db.schema.hasTable("users");
    if (!hasUsers) {
      await db.schema.createTable("users", (t) => {
        t.increments("id").primary();
        t.string("email").unique().notNullable();
        t.string("password_hash").notNullable();
        t.string("name");
      });
      console.log("✅ Created table: users");
    }

    // MEDICATIONS TABLE
    const hasMeds = await db.schema.hasTable("medications");
    if (!hasMeds) {
      await db.schema.createTable("medications", (t) => {
        t.increments("id").primary();
        t.integer("user_id").references("id").inTable("users");
        t.string("name").notNullable();
        t.string("dose");
        t.text("notes");
      });
      console.log("✅ Created table: medications");
    }

    // REMINDERS TABLE
    const hasReminders = await db.schema.hasTable("reminders");
    if (!hasReminders) {
      await db.schema.createTable("reminders", (t) => {
        t.increments("id").primary();
        t.integer("user_id").references("id").inTable("users");
        t.integer("medication_id").references("id").inTable("medications");
        t.string("time_of_day").notNullable();
        t.string("timezone").notNullable();
        t.string("repeat_pattern").notNullable();
      });
      console.log("✅ Created table: reminders");
    }

    console.log("🎉 All migrations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
})();
