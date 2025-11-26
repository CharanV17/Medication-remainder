import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import medicationRoutes from "./routes/medications.js";
import reminderRoutes from "./routes/reminders.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Medication Reminder API running 🚀");
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/reminders", reminderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
