// backend/routes/auth.js
import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  // hash password
  const hashed = await bcrypt.hash(password, 10);

  // insert using correct column name: password_hash
  const [id] = await db("users").insert({
    name,
    email,
    password_hash: hashed,
  });

  const token = jwt.sign(
    { id, email },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );

  res.json({ message: "User registered successfully", token });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db("users").where({ email }).first();
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });

  // compare with correct column
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid)
    return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );

  res.json({ message: "Login successful", token });
});

export default router;
