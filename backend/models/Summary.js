import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  content: String
},{ timestamps: true });

export default mongoose.model("Summary", SummarySchema);