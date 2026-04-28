import TodoItem from "./TodoItem.jsx";

const TodoList = ({
  todos,
  totalTodos,
  onUpdateTodo,
  onToggleDone,
  onDeleteTodo,
  disabled,
  pendingAction,
  onAddClick
}) => {
  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          +
        </div>
        <p className="font-medium text-gray-700 dark:text-gray-200">
          {totalTodos === 0 ? "No tasks yet. Add your first task!" : "No matching tasks found."}
        </p>
        {totalTodos === 0 && (
          <button
            type="button"
            onClick={onAddClick}
            className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-emerald-700"
          >
            Add Task
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onToggleDone={onToggleDone}
          onDeleteTodo={onDeleteTodo}
          disabled={disabled}
          pendingType={pendingAction?.id === todo._id ? pendingAction.type : null}
        />
      ))}
    </ul>
  );
};

export default TodoList;
