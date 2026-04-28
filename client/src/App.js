import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoDone,
  updateTodo
} from "./services/api.js";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load todos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (todoData) => {
    try {
      setIsSubmitting(true);
      setError("");
      const newTodo = await createTodo(todoData);
      setTodos((currentTodos) => [newTodo, ...currentTodos]);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      setError("");
      const updatedTodo = await updateTodo(id, todoData);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update todo");
    }
  };

  const handleToggleDone = async (id) => {
    try {
      setError("");
      const updatedTodo = await toggleTodoDone(id);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update todo status");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setError("");
      await deleteTodo(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete todo");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            MERN TODO
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Tasks</h1>
        </header>

        <TodoForm onAddTodo={handleAddTodo} isSubmitting={isSubmitting} />

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6">
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
              Loading tasks...
            </div>
          ) : (
            <TodoList
              todos={todos}
              onUpdateTodo={handleUpdateTodo}
              onToggleDone={handleToggleDone}
              onDeleteTodo={handleDeleteTodo}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
