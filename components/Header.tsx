import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400 pb-2">
        Генератор завдань
      </h1>
      <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400">
        Створюйте інтерактивні вправи з української мови для 5-9 класів
      </p>
    </header>
  );
};