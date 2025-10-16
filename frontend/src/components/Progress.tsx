import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  return (
    <div className={`progress ${className}`}>
      <div className="progress-bar" style={{ width: `${value}%` }}></div>
    </div>
  );
};
