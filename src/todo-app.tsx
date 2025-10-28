/** @jsx createElement */
import { createElement, useState, VNode, ComponentProps } from './jsx-runtime';

/*
 * =================================================================
 * PHẦN 1: ĐỊNH NGHĨA CÁC INTERFACES
 * =================================================================
 */

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// BÀI 5.2: TỐI ƯU HÓA
// Props của TodoItem bây giờ chỉ cần 'todo'
interface TodoItemProps extends ComponentProps {
  todo: Todo;
}

interface AddTodoFormProps extends ComponentProps {
  onAdd: (text: string) => void;
}

/*
 * =================================================================
 * PHẦN 2: CÁC COMPONENT CON
 * =================================================================
 */

// BÀI 5.2: TỐI ƯU HÓA
// TodoItem không còn xử lý event. Nó chỉ render HTML
// và gắn 'data-id' và 'data-action'
const TodoItem = (props: TodoItemProps): VNode => {
  const { todo } = props;

  const textStyle = todo.completed ? 'text-decoration: line-through;' : '';

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        data-id={todo.id}
        data-action="toggle"
      />
      <span style={textStyle}>{todo.text}</span>
      <button
        className="btn-delete"
        data-id={todo.id}
        data-action="delete"
      >
        Delete
      </button>
    </li>
  );
};

// Component này không thay đổi
const AddTodoForm = (props: AddTodoFormProps): VNode => {
  const { onAdd } = props;
  const [text, setText] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const newText = text().trim();
    
    if (newText) {
      onAdd(newText);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={text()}
        onInput={(e: Event) => setText((e.target as HTMLInputElement).value)}
        placeholder="What needs to be done?"
        autoFocus={true}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

/*
 * =================================================================
 * PHẦN 3: COMPONENT CHÍNH (Đã cập nhật)
 * =================================================================
 */

const TodoApp = (): VNode => {
  
  const [todos, setTodos] = useState<Todo[]>([]);

  // Các hàm logic không thay đổi
  const addTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now(), text: text, completed: false };
    setTodos([...todos(), newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos().map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos().filter(todo => todo.id !== id));
  };

  // BÀI 5.2: HÀM XỬ LÝ EVENT DELEGATION
  // Hàm này được gắn vào <ul>
  const handleListClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const action = target.dataset.action;
    const idStr = target.dataset.id;
    
    if (!action || !idStr) return; // Click vào <li> hoặc <span>, bỏ qua

    const id = parseInt(idStr, 10);

    if (action === 'toggle') {
      toggleTodo(id);
    } else if (action === 'delete') {
      deleteTodo(id);
    }
  };

  const totalCount = todos().length;
  const completedCount = todos().filter(t => t.completed).length;

  return (
    <div className="todo-app">
      <header>
        <h1>Todo List</h1>
      </header>
      
      <section className="todo-form">
        <AddTodoForm onAdd={addTodo} />
      </section>

      <section className="todo-list">
        {/* BÀI 5.2: Gắn 1 event listener duy nhất vào <ul> */}
        <ul onClick={handleListClick}>
          {todos().map(todo => (
            // TodoItem không còn nhận 'onToggle' hay 'onDelete'
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          ))}
        </ul>
      </section>

      <footer className="todo-summary">
        <p>
          Total: {totalCount} | Completed: {completedCount}
        </p>
      </footer>
    </div>
  );
};

export { TodoApp };

