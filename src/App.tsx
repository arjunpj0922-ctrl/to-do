import { useState, useEffect, useRef } from "react";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  /* MODAL STATES */

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [alertMsg, setAlertMsg] = useState("");

  /* SAVE TODOS */

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  /* AUTO FOCUS */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ADD / UPDATE TODO */

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
      setAlertMsg("Task already exists");
      return;
    }

    if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: trimmed } : todo
        )
      );
      setEditId(null);
    } else {
      const newTodo: Todo = {
        id: Date.now(),
        text: trimmed,
        completed: false,
      };

      setTodos([...todos, newTodo]);
    }

    setInput("");
    inputRef.current?.focus();
  };

  /* DELETE REQUEST */

  const requestDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  /* CONFIRM DELETE */

  const confirmDelete = () => {
    if (deleteId !== null) {
      setTodos(todos.filter((todo) => todo.id !== deleteId));
    }

    setDeleteId(null);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowConfirm(false);
  };

  /* EDIT */

  const handleEdit = (todo: Todo) => {
    if (todo.completed) {
      setAlertMsg("Completed tasks cannot be edited");
      return;
    }

    setInput(todo.text);
    setEditId(todo.id);
    inputRef.current?.focus();
  };

  /* TOGGLE COMPLETE */

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="input-section">
        <input
          ref={inputRef}
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
              <button
                onClick={() => handleEdit(todo)}
                disabled={todo.completed}
              >
                Edit
              </button>

              <button onClick={() => requestDelete(todo.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* DELETE CONFIRM MODAL */}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>

            <div className="modal-buttons">
              <button onClick={cancelDelete}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT MODAL */}

      {alertMsg && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Notice</h2>
            <p>{alertMsg}</p>

            <div className="modal-buttons">
              <button onClick={() => setAlertMsg("")}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;