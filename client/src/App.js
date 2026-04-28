import { useEffect, useRef, useState } from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoDone,
  updateTodo
} from "./services/api.js";

const FILTER_OPTIONS = ["all", "active", "completed"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "completed", label: "Completed" }
];

const App = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState(() => localStorage.getItem("todoFilter") || "all");
  const [search, setSearch] = useState(() => localStorage.getItem("todoSearch") || "");
  const [sortBy, setSortBy] = useState(() => localStorage.getItem("todoSort") || "newest");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("todoTheme") === "dark");
  const toastTimeoutRef = useRef(null);

  const getErrorMessage = (err, fallback) =>
    err.response?.data?.message || err.message || fallback;

  const showToast = (message, type = "success") => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3000);
  };

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load todos. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();

    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("todoFilter", filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem("todoSearch", search);
  }, [search]);

  useEffect(() => {
    localStorage.setItem("todoSort", sortBy);
  }, [sortBy]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("todoTheme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleAddTodo = async (todoData) => {
    try {
      setIsSubmitting(true);
      setError("");
      const newTodo = await createTodo(todoData);
      setTodos((currentTodos) => [newTodo, ...currentTodos]);
      showToast("Task added successfully");
      return true;
    } catch (err) {
      const message = getErrorMessage(err, "Unable to add todo. Please try again.");
      setError(message);
      showToast(message, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      setPendingAction({ id, type: "update" });
      setError("");
      const updatedTodo = await updateTodo(id, todoData);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      showToast("Task updated");
      return true;
    } catch (err) {
      const message = getErrorMessage(err, "Unable to update todo. Please try again.");
      setError(message);
      showToast(message, "error");
      return false;
    } finally {
      setPendingAction(null);
    }
  };

  const handleToggleDone = async (id) => {
    const previousTodos = todos;

    try {
      setPendingAction({ id, type: "toggle" });
      setError("");
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo._id === id ? { ...todo, done: !todo.done } : todo
        )
      );

      const updatedTodo = await toggleTodoDone(id);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      showToast("Task status updated");
    } catch (err) {
      setTodos(previousTodos);
      const message = getErrorMessage(err, "Unable to update todo status. Please try again.");
      setError(message);
      showToast(message, "error");
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteTodo = async (id) => {
    const todoToDelete = todos.find((todo) => todo._id === id);
    const confirmed = window.confirm(
      `Delete "${todoToDelete?.title || "this task"}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const previousTodos = todos;

    try {
      setPendingAction({ id, type: "delete" });
      setError("");
      setTodos((currentTodos) => currentTodos.filter((todo) => todo._id !== id));
      await deleteTodo(id);
      showToast("Task deleted");
    } catch (err) {
      setTodos(previousTodos);
      const message = getErrorMessage(err, "Unable to delete todo. Please try again.");
      setError(message);
      showToast(message, "error");
    } finally {
      setPendingAction(null);
    }
  };

  const areActionsDisabled = isLoading || isSubmitting || Boolean(pendingAction);
  const normalizedSearch = search.trim().toLowerCase();
  const visibleTodos = todos
    .filter((todo) => {
      if (filter === "active") {
        return !todo.done;
      }

      if (filter === "completed") {
        return todo.done;
      }

      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(normalizedSearch))
    .sort((firstTodo, secondTodo) => {
      if (sortBy === "oldest") {
        return new Date(firstTodo.createdAt) - new Date(secondTodo.createdAt);
      }

      if (sortBy === "completed") {
        return Number(secondTodo.done) - Number(firstTodo.done);
      }

      return new Date(secondTodo.createdAt) - new Date(firstTodo.createdAt);
    });

  const activeCount = todos.filter((todo) => !todo.done).length;
  const completedCount = todos.length - activeCount;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            MERN TODO
          </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">Tasks</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsDarkMode((current) => !current)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            {isDarkMode ? "Light" : "Dark"}
          </button>
        </header>

        <section className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
              <p className="mt-1 text-lg font-semibold text-gray-950 dark:text-white">
                {completedCount} of {todos.length} tasks completed
              </p>
            </div>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {progressPercent}%
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                    filter === option
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(180px,1fr)_150px]">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
              />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {activeCount} active, {completedCount} completed
          </p>
        </section>

        {toast && (
          <div
            className={`mt-4 rounded-md border px-4 py-3 text-sm shadow-sm transition ${
              toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
            }`}
            role="status"
          >
            {toast.message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <section className="mt-6">
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              Loading...
            </div>
          ) : (
            <TodoList
              todos={visibleTodos}
              totalTodos={todos.length}
              onUpdateTodo={handleUpdateTodo}
              onToggleDone={handleToggleDone}
              onDeleteTodo={handleDeleteTodo}
              disabled={areActionsDisabled}
              pendingAction={pendingAction}
              onAddClick={() => setIsAddModalOpen(true)}
            />
          )}
        </section>
      </div>

      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-3xl font-light text-white shadow-lg shadow-emerald-900/20 transition hover:scale-105 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900"
        aria-label="Add task"
      >
        +
      </button>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/50 px-4 py-6 backdrop-blur-sm transition sm:items-center">
          <div className="w-full max-w-xl animate-modal-in">
            <div className="mb-3 flex items-center justify-between rounded-t-lg bg-white px-5 py-4 shadow-sm dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Add new task</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md px-3 py-1 text-2xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                aria-label="Close add task modal"
              >
                x
              </button>
            </div>
            <TodoForm
              onAddTodo={handleAddTodo}
              isSubmitting={isSubmitting}
              onSuccess={() => setIsAddModalOpen(false)}
              onCancel={() => setIsAddModalOpen(false)}
              autoFocus
            />
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default App;
