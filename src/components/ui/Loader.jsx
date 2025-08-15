import React from 'react';

const Loader = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizes[size]}`}></div>
    </div>
  );
};

export default Loader;