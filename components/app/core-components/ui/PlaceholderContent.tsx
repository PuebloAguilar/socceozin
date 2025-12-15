
import React from 'react';

export const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-white dark:bg-[var(--bg-card)] rounded-lg shadow-sm border border-gray-200 dark:border-[var(--border-color)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Página em construção.</p>
      </div>
    </div>
);
