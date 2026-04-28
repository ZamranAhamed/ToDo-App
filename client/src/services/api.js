import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/todos";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const getTodos = async () => {
  const response = await api.get("/");
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await api.post("/", todo);
  return response.data;
};

export const updateTodo = async (id, todo) => {
  const response = await api.put(`/${id}`, todo);
  return response.data;
};

export const toggleTodoDone = async (id) => {
  const response = await api.patch(`/${id}/done`);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
