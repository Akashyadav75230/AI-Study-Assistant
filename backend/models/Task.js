import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  dueDate: Date,
  done: { type: Boolean, default: false }
},{ timestamps: true });

export default mongoose.model("Task", TaskSchema);