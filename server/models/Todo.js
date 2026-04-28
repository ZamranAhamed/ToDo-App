import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Todo", todoSchema);
