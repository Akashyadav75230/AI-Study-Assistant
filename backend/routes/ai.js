import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import auth from "../middleware/auth.js";

import File from "../models/File.js";
import Summary from "../models/Summary.js";
import FlashcardSet from "../models/FlashcardSet.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash";


// ✅ SUMMARIZE
router.post("/summarize/:fileId", auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.fileId, owner: req.user.id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Summarize the following content clearly and simply:\n\n${file.text.slice(0, 15000)}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const content = result.response.text();
    const saved = await Summary.create({ owner: req.user.id, file: file._id, content });

    res.json(saved);

  } catch (e) {
    console.error("AI summarize error:", e);
    res.status(500).json({ error: "AI summarize failed" });
  }
});


// ✅ GET SUMMARY
router.get("/summary/:fileId", auth, async (req, res) => {
  const s = await Summary.findOne({ owner: req.user.id, file: req.params.fileId }).sort({ createdAt: -1 });
  res.json(s || { content: "" });
});


// ✅ CREATE FLASHCARDS
router.post("/flashcards/:fileId", auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.fileId, owner: req.user.id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Create 10 study flashcards in JSON format:
    [{"front":"question","back":"answer"}]
    TEXT: ${file.text.slice(0, 12000)}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jsonText = result.response.text().replace(/```json|```/g, "").trim();
    const cards = JSON.parse(jsonText);

    const saved = await FlashcardSet.create({ owner: req.user.id, file: file._id, cards });
    res.json({ cards: saved.cards }); // ✅ keeps frontend consistent

  } catch (e) {
    console.error("AI flashcards error:", e);
    res.status(500).json({ error: "AI flashcards failed" });
  }
});


// ✅ GET FLASHCARDS BY FILE ID (matches your frontend flow)
router.get("/flashcards/:fileId", auth, async (req, res) => {
  try {
    const set = await FlashcardSet.findOne({ file: req.params.fileId, owner: req.user.id });
    if (!set) return res.json({ cards: [] }); // allow frontend to auto-create
    res.json({ cards: set.cards });
  } catch (e) {
    console.error("Flashcards load error:", e);
    res.status(500).json({ error: "Failed to load flashcards" });
  }
});



// ✅ CREATE QUIZ
router.post("/quiz/:fileId", auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.fileId, owner: req.user.id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Create an 8-question multiple choice quiz in JSON format:
    {"questions":[{"question":"","options":["A","B","C","D"],"correctIndex":0}]}
    TEXT: ${file.text.slice(0, 12000)}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jsonText = result.response.text().replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonText);

    const saved = await Quiz.create({
      owner: req.user.id,
      file: file._id,
      questions: data.questions
    });

    res.json({ questions: saved.questions }); // ✅ Important

  } catch (e) {
    console.error("AI quiz error:", e);
    res.status(500).json({ error: "AI quiz failed" });
  }
});


// ✅ GET QUIZ BY FILE ID (NOT quizId)
router.get("/quiz/:fileId", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ file: req.params.fileId, owner: req.user.id });
    if (!quiz) return res.json({ questions: [] }); // allow frontend fallback to POST-create
    res.json({ questions: quiz.questions });
  } catch (e) {
    console.error("Get quiz error:", e);
    res.status(500).json({ error: "Failed to load quiz" });
  }
});


export default router;

