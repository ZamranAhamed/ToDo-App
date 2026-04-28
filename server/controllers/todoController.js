import mongoose from "mongoose";
import Todo from "../models/Todo.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getValidationMessage = (error, fallback) => {
  if (error.name === "ValidationError") {
    return Object.values(error.errors)[0]?.message || fallback;
  }

  return fallback;
};

const PRIORITIES = ["low", "medium", "high"];

const normalizeTodoFields = ({ title, description, priority, dueDate }, requireTitle = false) => {
  const data = {};

  if (requireTitle || title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return { error: "Title is required" };
    }

    data.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return { error: "Description must be a string" };
    }

    data.description = description.trim();
  }

  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      return { error: "Priority must be low, medium, or high" };
    }

    data.priority = priority;
  }

  if (dueDate !== undefined) {
    if (dueDate === null || dueDate === "") {
      data.dueDate = null;
    } else {
      const parsedDate = new Date(dueDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return { error: "Due date must be a valid date" };
      }

      data.dueDate = parsedDate;
    }
  }

  return { data };
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
    const { data, error } = normalizeTodoFields(req.body, true);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const todo = await Todo.create(data);

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

    const { data: updateData, error } = normalizeTodoFields(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Provide todo details to update" });
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
