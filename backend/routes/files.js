import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import File from "../models/File.js";
import { extractText } from "../utils/extractText.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", auth, async (req,res)=>{
  const list = await File.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
});

router.post("/upload", auth, upload.single("file"), async (req,res)=>{
  try{
    // ⬇️ CRITICAL FIX: Guard clause to prevent TypeError if the file upload fails (e.g., incorrect field name or missing file).
    if (!req.file) {
      return res.status(400).json({ 
        error: "No file received. Ensure the field name in your form is 'file' and you are using 'multipart/form-data'." 
      });
    }
    // ⬆️ FIX END

    const f = req.file;
    const text = await extractText(f.path, f.mimetype, f.originalname);
    const doc = await File.create({
      owner: req.user.id,
      originalName: f.originalname,
      storagePath: f.path,
      mime: f.mimetype,
      text
    });
    res.json(doc);
  }catch(e){
    console.error("File upload and processing error:", e); // Added context to the log
    res.status(500).json({ error:"Upload failed" });
  }
});

router.get("/:id", auth, async (req,res)=>{
  const file = await File.findOne({ _id: req.params.id, owner: req.user.id });
  if(!file) return res.status(404).json({ error:"Not found" });
  res.json(file);
});

export default router;