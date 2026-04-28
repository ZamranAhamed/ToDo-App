import { useEffect, useRef, useState } from "react";

const getDateValue = (daysFromToday) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DUE_DATE_SHORTCUTS = [
  { label: "Today", value: getDateValue(0) },
  { label: "Tomorrow", value: getDateValue(1) },
  { label: "Next week", value: getDateValue(7) }
];

const TodoForm = ({ onAddTodo, isSubmitting, onSuccess, onCancel, autoFocus = false }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [validationError, setValidationError] = useState("");
  const titleInputRef = useRef(null);
  const dueDateInputRef = useRef(null);

  const isTitleValid = title.trim().length > 0;

  useEffect(() => {
    if (autoFocus) {
      titleInputRef.current?.focus();
    }
  }, [autoFocus]);

  const openDatePicker = () => {
    if (dueDateInputRef.current?.showPicker) {
      dueDateInputRef.current.showPicker();
      return;
    }

    dueDateInputRef.current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isTitleValid) {
      setValidationError("Title is required");
      return;
    }

    const wasAdded = await onAddTodo({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null
    });

    if (wasAdded) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setValidationError("");
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="grid gap-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            ref={titleInputRef}
            id="title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setValidationError("");
            }}
            placeholder="Add a task"
            disabled={isSubmitting}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? "title-error" : undefined}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
          />
          {validationError && (
            <p id="title-error" className="mt-1 text-sm text-red-600">
              {validationError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional details"
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="priority" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Due date
            </label>
            <div className="relative">
              <input
                ref={dueDateInputRef}
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-emerald-900"
              />
              <button
                type="button"
                onClick={openDatePicker}
                disabled={isSubmitting}
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Open calendar"
              >
                <span className="relative block h-5 w-5" aria-hidden="true">
                  <span className="absolute inset-x-0 bottom-0 top-1 rounded-sm border-2 border-current" />
                  <span className="absolute left-0 right-0 top-2 border-t-2 border-current" />
                  <span className="absolute left-1 top-0 h-2 w-0.5 rounded-full bg-current" />
                  <span className="absolute right-1 top-0 h-2 w-0.5 rounded-full bg-current" />
                </span>
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {DUE_DATE_SHORTCUTS.map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  onClick={() => setDueDate(shortcut.value)}
                  disabled={isSubmitting}
                  className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  {shortcut.label}
                </button>
              ))}
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate("")}
                  disabled={isSubmitting}
                  className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300 dark:hover:bg-red-950"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-md border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!isTitleValid || isSubmitting}
            className="rounded-md bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:scale-[1.02] hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:scale-100"
          >
            {isSubmitting ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
