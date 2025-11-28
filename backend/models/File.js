import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalName: String,
  storagePath: String,
  mime: String,
  text: String
},{ timestamps: true });

export default mongoose.model("File", FileSchema);