import mongoose from "mongoose";
import Todo from "../models/Todo.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getValidationMessage = (error, fallback) => {
  if (error.name === "ValidationError") {
    return Object.values(error.errors)[0]?.message || fallback;
  }

  return fallback;
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos", error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : ""
    });

    res.status(201).json(todo);
  } catch (error) {
    const message = getValidationMessage(error, "Failed to create todo");
    const statusCode = error.name === "ValidationError" ? 400 : 500;

    res.status(statusCode).json({ message, error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const { title, description } = req.body;
    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Title is required" });
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({ message: "Description must be a string" });
      }

      updateData.description = description.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Provide title or description to update" });
    }

    const todo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    const message = getValidationMessage(error, "Failed to update todo");
    const statusCode = error.name === "ValidationError" ? 400 : 500;

    res.status(statusCode).json({ message, error: error.message });
  }
};

export const toggleDone = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.done = !todo.done;
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo status", error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo", error: error.message });
  }
};
