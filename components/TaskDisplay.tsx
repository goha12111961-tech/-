import React, { useState, useEffect } from 'react';
import type { GeneratedTask } from '../types';
import { InteractiveTaskModal } from './InteractiveTaskModal';

interface TaskDisplayProps {
  task: GeneratedTask;
}

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ task }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopyHtml = () => {
    if (task.interactiveHtml) {
      navigator.clipboard.writeText(task.interactiveHtml).then(() => {
        setIsCopied(true);
      });
    }
  };

  const handleSaveTask = () => {
      const fileName = `завдання-${slugify(task.title) || 'untitled'}.json`;
      const taskJson = JSON.stringify(task, null, 2);
      const blob = new Blob([taskJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <>
      {isModalOpen && task.interactiveHtml && (
        <InteractiveTaskModal 
          htmlContent={task.interactiveHtml}
          title={task.title}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-3xl animate-fade-in border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4 gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {task.title}
          </h2>
          <div className="flex gap-2 flex-wrap justify-end">
            {task.interactiveHtml && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 text-sm font-medium rounded-lg flex items-center transition-colors bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-900/80"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  Інтерактивна версія
              </button>
            )}
            <button
                onClick={handleSaveTask}
                className="px-3 py-2 text-sm font-medium rounded-lg flex items-center transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Зберегти
            </button>
            {task.interactiveHtml && (
              <button
                onClick={handleCopyHtml}
                className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center transition-colors ${
                  isCopied
                    ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isCopied ? <CheckIcon className="h-5 w-5 mr-2" /> : <CopyIcon className="h-5 w-5 mr-2" />}
                {isCopied ? 'Скопійовано!' : 'Копіювати HTML'}
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">Інструкція для учня:</h3>
          <p className="p-4 bg-indigo-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-indigo-400 dark:border-indigo-500 text-gray-700 dark:text-gray-300">
            {task.instructions}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">Завдання:</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-base">
            {task.task}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">Ключ (для вчителя):</h3>
          <div className="p-4 bg-green-50 dark:bg-gray-700/50 rounded-md whitespace-pre-wrap text-green-800 dark:text-green-300 text-base">
            {task.key}
          </div>
        </div>
      </div>
    </>
  );
};