// backend/routes/medications.js
import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------------------
   1️⃣ CREATE Medication (POST)
------------------------------------------ */
router.post("/", authenticateToken, async (req, res) => {
  const { name, dose, notes } = req.body;

  if (!name || !dose) {
    return res.status(400).json({ error: "Name and dose are required" });
  }

  try {
    const [id] = await db("medications").insert({
      user_id: req.user.id,
      name,
      dose,
      notes,
    });

    res.json({ message: "Medication added successfully", id });
  } catch (err) {
    res.status(500).json({ error: "Failed to add medication" });
  }
});

/* -----------------------------------------
   2️⃣ READ All Medications (GET)
------------------------------------------ */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const meds = await db("medications")
      .where({ user_id: req.user.id })
      .select("*");

    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medications" });
  }
});

/* -----------------------------------------
   3️⃣ READ Single Medication (GET /:id)
------------------------------------------ */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const med = await db("medications")
      .where({ id: req.params.id, user_id: req.user.id })
      .first();

    if (!med) {
      return res
        .status(404)
        .json({ error: "Medication not found or unauthorized" });
    }

    res.json(med);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medication" });
  }
});

/* -----------------------------------------
   4️⃣ UPDATE Medication (PUT /:id)
------------------------------------------ */
// Update medication
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, dose, notes } = req.body;

  const updated = await db("medications")
    .where({ id, user_id: req.user.id })
    .update({ name, dose, notes });

  if (!updated)
    return res.status(404).json({ error: "Medication not found or unauthorized" });

  res.json({ message: "Medication updated successfully" });
});


/* -----------------------------------------
   5️⃣ DELETE Medication (DELETE /:id)
------------------------------------------ */
// Delete medication
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const deleted = await db("medications")
    .where({ id, user_id: req.user.id })
    .del();

  if (!deleted)
    return res.status(404).json({ error: "Medication not found or unauthorized" });

  res.json({ message: "Medication deleted successfully" });
});

export default router;
