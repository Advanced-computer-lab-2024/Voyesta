// src/components/nav/BadgedIcon.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const BadgedIcon = ({ icon, count, onClick, className, items }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    if (items) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (items) {
      setIsVisible(false);
    }
  };

  return (
    <div 
      className={`relative ${className}`} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={onClick}
        className="relative p-2 text-gray-500 hover:text-blue-700 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-500"
      >
        <i className={`fas ${icon} text-xl`}></i>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {count}
          </span>
        )}
      </button>
      {items && isVisible && (
        <div className="z-50 absolute left-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {items.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};