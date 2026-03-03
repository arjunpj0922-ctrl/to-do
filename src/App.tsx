import { useState } from "react";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (
      todos.some(
        (todo) =>
          todo.text.toLowerCase() === trimmed.toLowerCase() &&
          todo.id !== editId
      )
    ) {
      alert("Task already exists");
      return;
    }

    if (editId !== null) {
      // update
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: trimmed } : todo
        )
      );
      setEditId(null);
    } else {
      // add
      setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }]);
    }

    setInput("");
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = (todo: Todo) => {
    setInput(todo.text);
    setEditId(todo.id);
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAdd}>
          {editId !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <div className="todo-left">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
              />
              <span>{todo.text}</span>
            </div>
            <div className="buttons">
              <button onClick={() => handleEdit(todo)}>Edit</button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;