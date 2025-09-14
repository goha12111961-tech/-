import React, { useState, useCallback, useRef } from 'react';
import { TaskGeneratorForm } from './components/TaskGeneratorForm';
import { TaskDisplay } from './components/TaskDisplay';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateTask } from './services/geminiService';
import type { FormData, GeneratedTask } from './types';

const App: React.FC = () => {
  const [generatedTask, setGeneratedTask] = useState<GeneratedTask | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateTask = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedTask(null);
    try {
      const task = await generateTask(formData.topic, formData.grade, formData.taskType);
      setGeneratedTask(task);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadTaskClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Не вдалося прочитати файл.');
        }
        const task = JSON.parse(text) as GeneratedTask;
        if (task.title && task.instructions && task.task && task.key) {
          setGeneratedTask(task);
          setError(null);
          setIsLoading(false);
        } else {
          throw new Error('Неправильний формат файлу завдання.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не вдалося завантажити завдання.');
      }
    };
    reader.onerror = () => {
        setError('Помилка при читанні файлу.');
    };
    reader.readAsText(file);
    event.target.value = ''; 
  };
  
  const handleCreateNew = () => {
    setGeneratedTask(null);
    setError(null);
  }

  return (
    <div className="relative isolate overflow-hidden bg-violet-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 p-4 sm:p-8 flex flex-col items-center">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-indigo-200/40 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>
      <div className="w-full max-w-3xl mx-auto">
        <Header />

        {generatedTask ? (
           <div className="w-full text-center mb-8">
             <button
               onClick={handleCreateNew}
               className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mr-4"
             >
               + Створити нове завдання
             </button>
           </div>
        ) : (
          <>
            <TaskGeneratorForm onSubmit={handleGenerateTask} isLoading={isLoading} />
            <div className="text-center my-4 text-gray-500 dark:text-gray-400">
                або
            </div>
            <div className="w-full text-center mb-8">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={handleLoadTaskClick}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Завантажити завдання з файлу
                  </button>
            </div>
          </>
        )}

        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        {generatedTask && <TaskDisplay task={generatedTask} />}
      </div>
    </div>
  );
};

export default App;