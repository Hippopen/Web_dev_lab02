/** @jsx createElement */
import {createElement, useState } from './jsx-runtime';
import {ComponentProps, VNode } from './jsx-runtime';

// TODO: Define ButtonProps interface
interface ButtonProps extends ComponentProps {
// What props should a button accept?
onClick?: () => void;
className?: string;
}


// TODO: Create a Button component
const Button = (props: ButtonProps): VNode => {
    const { children, onClick, className } = props;
// Return JSX for a button element
// Handle onClick, children, className props
// Your implementation here
return (
    <button onClick={onClick} className={`btn ${className || ''}`}>
      {children}
    </button>
  );
};
// TODO: Define CounterProps interface
interface CounterProps extends ComponentProps {
// What props should the counter accept? (hint: initialCount?)
initialCount?: number;
}
// TODO: Create Counter component
const Counter = (props: CounterProps): VNode => {
// STEP 1: Use useState for count value
    const [count, setCount] = useState(props.initialCount || 0); //setCount will be a setter
// STEP 2: Create increment, decrement, reset functions
    const increment = () => {
    setCount(count() + 1);
    console.log("New count (in memory):", count());
  };

  const decrement = () => {
    setCount(count() - 1);
    console.log("New count (in memory):", count());
  };

  const reset = () => {
    setCount(props.initialCount || 0);
    console.log("New count (in memory):", count());
  };
// STEP 3: Return JSX structure with:
// - Display current count
// - Three buttons (increment, decrement, reset)
// Your implementation here
return (
    <div className="counter">
      <h1>Counter</h1>
      <h2>{count()}</h2> {}
      <div className="buttons"> {}
        <Button onClick={increment} className="btn-inc">+</Button>
        <Button onClick={decrement} className="btn-dec">-</Button>
        <Button onClick={reset} className="btn-reset">Reset</Button>
      </div>
    </div>
  );
};
// TODO: Export Counter component
export {Counter};