import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctIndex: Number
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  questions: [QuestionSchema]
}, { timestamps: true });

export default mongoose.model("Quiz", QuizSchema);