import dotenv from "dotenv";
import path from "path";

// ✅ Load .env correctly on Windows
dotenv.config({ path: path.resolve(".env") });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

// ✅ Import Routes
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import aiRoutes from "./routes/ai.js";
import scheduleRoutes from "./routes/schedule.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ Database
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/talkfile";
mongoose.connect(MONGO_URI).then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("MongoDB error", err));

// ✅ Static Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/schedule", scheduleRoutes);

// ✅ Server
app.get("/", (req,res)=>res.send("✅ TalkFile Backend running"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`🚀 Server running on http://localhost:${PORT}`));
