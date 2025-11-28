import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  front: String,
  back: String
}, { _id: false });

const FlashcardSetSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  cards: [CardSchema]
}, { timestamps: true });

export default mongoose.model("FlashcardSet", FlashcardSetSchema);