import mongoose from "mongoose";
import Todo from "../models/Todo.js";

// Validation: checks if route params contain a valid MongoDB ObjectId.
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Error handling: extracts useful Mongoose validation messages.
const getValidationMessage = (error, fallback) => {
  if (error.name === "ValidationError") {
    return Object.values(error.errors)[0]?.message || fallback;
  }

  return fallback;
};

const PRIORITIES = ["low", "medium", "high"];

// Validation: normalizes and validates request body fields before database writes.
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
    // Status code: 200 means todos fetched successfully.
    res.status(200).json(todos);
  } catch (error) {
    // Error handling + status code: 500 means unexpected server/database error.
    res.status(500).json({ message: "Failed to fetch todos", error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { data, error } = normalizeTodoFields(req.body, true);

    if (error) {
      // Status code: 400 means the client sent invalid todo data.
      return res.status(400).json({ message: error });
    }

    const todo = await Todo.create(data);

    // Status code: 201 means a new todo was created.
    res.status(201).json(todo);
  } catch (error) {
    const message = getValidationMessage(error, "Failed to create todo");
    const statusCode = error.name === "ValidationError" ? 400 : 500;

    // Error handling: returns validation errors as 400 and unknown errors as 500.
    res.status(statusCode).json({ message, error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      // Validation + status code: invalid MongoDB id is a bad request.
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
      // Status code: 404 means the todo id is valid but no document exists.
      return res.status(404).json({ message: "Todo not found" });
    }

    // Status code: 200 means todo updated successfully.
    res.status(200).json(todo);
  } catch (error) {
    const message = getValidationMessage(error, "Failed to update todo");
    const statusCode = error.name === "ValidationError" ? 400 : 500;

    // Error handling: returns validation errors as 400 and unknown errors as 500.
    res.status(statusCode).json({ message, error: error.message });
  }
};

export const toggleDone = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      // Validation + status code: invalid MongoDB id is a bad request.
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      // Status code: 404 means the todo id is valid but no document exists.
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.done = !todo.done;
    await todo.save();

    // Status code: 200 means todo status toggled successfully.
    res.status(200).json(todo);
  } catch (error) {
    // Error handling + status code: 500 means unexpected server/database error.
    res.status(500).json({ message: "Failed to update todo status", error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      // Validation + status code: invalid MongoDB id is a bad request.
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      // Status code: 404 means the todo id is valid but no document exists.
      return res.status(404).json({ message: "Todo not found" });
    }

    // Status code: 200 means todo deleted successfully.
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    // Error handling + status code: 500 means unexpected server/database error.
    res.status(500).json({ message: "Failed to delete todo", error: error.message });
  }
};
