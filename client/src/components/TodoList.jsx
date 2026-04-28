import TodoItem from "./TodoItem.jsx";

const TodoList = ({ todos, onUpdateTodo, onToggleDone, onDeleteTodo }) => {
  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
        No tasks yet
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
        />
      ))}
    </ul>
  );
};

export default TodoList;
