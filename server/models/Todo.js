import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [1, "Title is required"]
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  dueDate: {
    type: Date,
    default: null
  },
  done: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Todo", todoSchema);
