import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <header>
        <h1>My App</h1>
        <nav>
          {/* Add navigation items here */}
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>&copy; 2026 My App</p>
      </footer>
    </div>
  );
};

export default MainLayout;
