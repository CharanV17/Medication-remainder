// check-reminders.js
import * as dbModule from "./db.js";
const db = dbModule.default || dbModule;

(async () => {
  try {
    // 1️⃣  All reminders
    const reminders = await db("reminders").select("*");
    console.log("🧾 Reminders:");
    console.table(reminders);

    // 2️⃣  Join with medications for clarity
    const joined = await db("reminders as r")
      .join("medications as m", "r.medication_id", "m.id")
      .select(
        "r.id",
        "m.name as medication",
        "r.time_of_day",
        "r.timezone",
        "r.repeat_pattern"
      );

    console.log("\n🕒 Reminders with Medications:");
    console.table(joined);

    // 3️⃣  Summary per medication
    const summary = await db("medications as m")
      .leftJoin("reminders as r", "m.id", "r.medication_id")
      .groupBy("m.id", "m.name")
      .select("m.name as medication")
      .count("r.id as reminder_count");

    console.log("\n📊 Medication Summary:");
    console.table(summary);
  } catch (err) {
    console.error("❌ Error reading reminders:", err.message);
  } finally {
    process.exit();
  }
})();
