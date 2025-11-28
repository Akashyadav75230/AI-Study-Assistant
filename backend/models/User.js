import mongoose from "mongoose";

const ResetSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date
},{ _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  reset: ResetSchema
},{ timestamps: true });

export default mongoose.model("User", UserSchema);