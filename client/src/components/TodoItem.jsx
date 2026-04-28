import { useState } from "react";

const TodoItem = ({ todo, onUpdateTodo, onToggleDone, onDeleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [validationError, setValidationError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setValidationError("Title is required");
      return;
    }

    await onUpdateTodo(todo._id, {
      title: title.trim(),
      description: description.trim()
    });

    setValidationError("");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setValidationError("");
    setIsEditing(false);
  };

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggleDone(todo._id)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                {validationError && (
                  <p className="mt-1 text-sm text-red-600">{validationError}</p>
                )}
              </div>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!title.trim()}
                  className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={todo.done ? "text-gray-400" : "text-gray-900"}>
              <h2 className={`break-words text-base font-semibold ${todo.done ? "line-through" : ""}`}>
                {todo.title}
              </h2>
              {todo.description && (
                <p className={`mt-1 break-words text-sm ${todo.done ? "line-through" : "text-gray-600"}`}>
                  {todo.description}
                </p>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDeleteTodo(todo._id)}
              className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
