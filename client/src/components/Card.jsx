import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hoverEffect = true
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800
        rounded-xl
        p-6
        shadow-md dark:shadow-gray-700/50
        ${hoverEffect ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;