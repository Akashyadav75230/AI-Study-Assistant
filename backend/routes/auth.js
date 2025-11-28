import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(409).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, password: hash });

    return res.json({ message: "Registered successfully", id: user._id });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// ✅ LOGIN (email or username)
router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // find by username OR email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user)
      return res.status(401).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "supersecretjwt",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username },
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ✅ FORGOT PASSWORD (generate reset token)
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({
        message: "If the email exists, a reset link has been sent.",
      });

    const token =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    user.reset = { token, expiresAt: new Date(Date.now() + 1000 * 60 * 15) };
    await user.save();

    // ⚠️ For demo purposes — in production, you'd send this via email
    return res.json({ message: "Reset token generated", token });
  } catch (e) {
    console.error("Forgot password error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ RESET PASSWORD
router.post("/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      "reset.token": token,
      "reset.expiresAt": { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.reset = undefined;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error("Reset password error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
