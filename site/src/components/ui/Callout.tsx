import React from 'react';

interface CalloutProps {
  title: string;
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'danger';
}

const Callout: React.FC<CalloutProps> = ({ title, children, type = 'info' }) => {
  const baseClasses = "my-6 rounded-lg border border-l-4 p-4";
  const typeClasses = {
    info: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
    warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
    danger: "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300",
  };
  const titleClasses = {
    info: "text-blue-800 dark:text-blue-300",
    warning: "text-yellow-800 dark:text-yellow-300",
    danger: "text-red-800 dark:text-red-300",
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <h3 className={`mb-2 text-lg font-semibold ${titleClasses[type]}`}>{title}</h3>
      <div className="prose max-w-none">{children}</div>
    </div>
  );
};

export default Callout;