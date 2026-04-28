import { useState } from "react";

const TodoForm = ({ onAddTodo, isSubmitting }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const isTitleValid = title.trim().length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isTitleValid) {
      setValidationError("Title is required");
      return;
    }

    await onAddTodo({
      title: title.trim(),
      description: description.trim()
    });

    setTitle("");
    setDescription("");
    setValidationError("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setValidationError("");
            }}
            placeholder="Add a task"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional details"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <button
          type="submit"
          disabled={!isTitleValid || isSubmitting}
          className="mt-0 rounded-md bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 md:mt-6"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
