/** @jsx createElement */
import { createElement, VNode } from './jsx-runtime';

// Import cả 3 ứng dụng
import { TodoApp } from './todo-app';
import { Counter } from './counter';
import { DashboardApp } from './dashboard';

export const AppShell = (): VNode => {
  return (
    <div className="app-shell-container">
      
      {/* Ứng dụng 1: Dashboard */}
      <section className="app-widget">
        <DashboardApp />
      </section>

      <hr />

      {/* Ứng dụng 2: Todo List */}
      <section className="app-widget">
        <TodoApp />
      </section>

      <hr />

      {/* Ứng dụng 3: Counter */}
      <section className="app-widget">
        {/* Truyền initialCount cho Counter */}
        <Counter initialCount={0} />
      </section>

    </div>
  );
};