import db from "./db.js";

(async () => {
  try {
    console.log("🧾 Users in DB:");
    const users = await db("users").select("*");
    console.table(users);

    console.log("\n📌 Table structure:");
    const structure = await db.raw("PRAGMA table_info('users');");
    console.table(structure);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    process.exit();
  }
})();
