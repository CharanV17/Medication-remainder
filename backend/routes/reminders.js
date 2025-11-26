// backend/routes/reminders.js
import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------------------
   1️⃣ CREATE Reminder (POST)
------------------------------------------ */
router.post("/", authenticateToken, async (req, res) => {
  const { medication_id, time_of_day, timezone, repeat_pattern } = req.body;

  if (!medication_id || !time_of_day || !timezone) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [id] = await db("reminders").insert({
      user_id: req.user.id,
      medication_id,
      time_of_day,
      timezone,
      repeat_pattern,
    });

    res.json({ message: "Reminder created successfully", id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

/* -----------------------------------------
   2️⃣ READ All Reminders (GET)
------------------------------------------ */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const reminders = await db("reminders")
      .where({ user_id: req.user.id })
      .select("*");

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

/* -----------------------------------------
   3️⃣ READ Single Reminder (GET /:id)
------------------------------------------ */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const reminder = await db("reminders")
      .where({ id: req.params.id, user_id: req.user.id })
      .first();

    if (!reminder) {
      return res
        .status(404)
        .json({ error: "Reminder not found or unauthorized" });
    }

    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reminder" });
  }
});

/* -----------------------------------------
   4️⃣ UPDATE Reminder (PUT /:id)
------------------------------------------ */
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { medication_id, time_of_day, timezone, repeat_pattern } = req.body;

  const updated = await db("reminders")
    .where({ id, user_id: req.user.id })
    .update({ medication_id, time_of_day, timezone, repeat_pattern });

  if (!updated)
    return res.status(404).json({ error: "Reminder not found or unauthorized" });

  res.json({ message: "Reminder updated successfully" });
});

/* -----------------------------------------
   5️⃣ DELETE Reminder (DELETE /:id)
------------------------------------------ */
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const deleted = await db("reminders")
    .where({ id, user_id: req.user.id })
    .del();

  if (!deleted)
    return res.status(404).json({ error: "Reminder not found or unauthorized" });

  res.json({ message: "Reminder deleted successfully" });
});

export default router;
