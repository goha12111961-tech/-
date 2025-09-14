import React, { useState } from 'react';
import type { FormData } from '../types';
import { GRADES, TASK_TYPES } from '../constants';

interface TaskGeneratorFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

export const TaskGeneratorForm: React.FC<TaskGeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState(GRADES[1]); // Default to 6th grade
  const [taskType, setTaskType] = useState(TASK_TYPES[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit({ topic, grade, taskType });
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-3xl mb-8 border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Тема уроку
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="напр. Іменник як частина мови"
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Клас
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тип завдання
            </label>
            <select
              id="taskType"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            >
              {TASK_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-indigo-500/50 disabled:from-indigo-400 disabled:to-violet-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Генерація...
            </>
          ) : 'Згенерувати завдання'}
        </button>
      </form>
    </div>
  );
};