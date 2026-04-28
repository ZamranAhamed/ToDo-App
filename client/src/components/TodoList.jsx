import TodoItem from "./TodoItem.jsx";

const TodoList = ({
  todos,
  totalTodos,
  onUpdateTodo,
  onToggleDone,
  onDeleteTodo,
  disabled,
  pendingAction
}) => {
  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">
          +
        </div>
        <p className="font-medium text-gray-700">
          {totalTodos === 0 ? "No tasks yet. Add your first task!" : "No matching tasks found."}
        </p>
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
