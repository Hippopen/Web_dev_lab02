/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
//import { TodoApp } from './todo-app';
//import { Counter } from './counter';
//import { DashboardApp } from './dashboard';
import { AppShell } from './AppShell';

// 1. Tìm container "root"
const container = document.getElementById('root');

if (container) {
  //mount(() => <TodoApp />, container);

  // Thử test với Counter:
  //mount(() => <Counter initialCount={0} />, container);

  // Chúng ta mount DashboardApp thay vì TodoApp
  //mount(() => <DashboardApp />, container);

  mount(() => <AppShell />, container);

} else {
  console.error("Failed to find the root element. Check your index.html.");
}