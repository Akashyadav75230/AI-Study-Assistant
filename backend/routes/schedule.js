import express from "express";
import auth from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/", auth, async (req,res)=>{
  const tasks = await Task.find({ owner: req.user.id }).sort({ dueDate: 1 });
  res.json(tasks);
});

router.post("/", auth, async (req,res)=>{
  const { title, dueDate } = req.body;
  const t = await Task.create({ owner: req.user.id, title, dueDate });
  res.json(t);
});

router.patch("/:id", auth, async (req,res)=>{
  const t = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  res.json(t);
});

router.delete("/:id", auth, async (req,res)=>{
  await Task.deleteOne({ _id: req.params.id, owner: req.user.id });
  res.json({ ok: true });
});

export default router;