import React from 'react';

export const ErrorDisplay = ({ errors }: { errors: string[] }) => (
  <div className="error-container bg-red-50 border-l-4 border-red-400 p-4 mb-4">
    <div className="flex items-center">
      <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <h3 className="text-sm font-medium text-red-800">
        {errors.length > 1 ? 'There were errors with your preferences:' : 'There was an error with your preferences:'}
      </h3>
    </div>
    <div className="mt-2 text-sm text-red-700">
      <ul className="list-disc pl-5 space-y-1">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  </div>
);
