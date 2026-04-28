import { useState } from "react";

const PRIORITY_STYLES = {
  low: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-900",
  medium: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900",
  high: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-900"
};

const TodoItem = ({
  todo,
  onUpdateTodo,
  onToggleDone,
  onDeleteTodo,
  disabled,
  pendingType
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [priority, setPriority] = useState(todo.priority || "medium");
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
  const [validationError, setValidationError] = useState("");
  const isSaving = pendingType === "update";
  const isDeleting = pendingType === "delete";
  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : null;

  const startEditing = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setValidationError("Title is required");
      return;
    }

    const wasUpdated = await onUpdateTodo(todo._id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null
    });

    if (wasUpdated) {
      setValidationError("");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority || "medium");
    setDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
    setValidationError("");
    setIsEditing(false);
  };

  const handleEditKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  return (
    <li
      className={`todo-card rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 ${
        todo.done ? "border-l-4 border-l-emerald-500 opacity-75" : "border-l-4 border-l-sky-500"
      }`}
    >
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggleDone(todo._id)}
          disabled={disabled}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 transition focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Mark ${todo.title} as ${todo.done ? "not done" : "done"}`}
        />

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setValidationError("");
                  }}
                  onKeyDown={handleEditKeyDown}
                  disabled={isSaving}
                  aria-invalid={Boolean(validationError)}
                  autoFocus
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
                />
                {validationError && (
                  <p className="mt-1 text-sm text-red-600">{validationError}</p>
                )}
              </div>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                onKeyDown={handleEditKeyDown}
                placeholder="Description"
                disabled={isSaving}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  disabled={isSaving}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  disabled={isSaving}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!title.trim() || isSaving}
                  className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:scale-100 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-white"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              disabled={disabled}
              className={`block w-full rounded-md text-left outline-none transition hover:bg-gray-50 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed dark:hover:bg-gray-800 ${
                todo.done ? "text-gray-400" : "text-gray-900 dark:text-gray-100"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`break-words text-base font-semibold ${todo.done ? "line-through" : ""}`}>
                  {todo.title}
                </h2>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ${PRIORITY_STYLES[todo.priority || "medium"]}`}>
                  {todo.priority || "medium"}
                </span>
              </div>
              {todo.description && (
                <p className={`mt-2 break-words text-sm leading-6 ${todo.done ? "line-through" : "text-gray-600 dark:text-gray-300"}`}>
                  {todo.description}
                </p>
              )}
              {formattedDueDate && (
                <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Due {formattedDueDate}
                </p>
              )}
            </button>
          )}
        </div>

        {!isEditing && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={startEditing}
              disabled={disabled}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:scale-[1.02] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDeleteTodo(todo._id)}
              disabled={disabled}
              className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:scale-[1.02] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
