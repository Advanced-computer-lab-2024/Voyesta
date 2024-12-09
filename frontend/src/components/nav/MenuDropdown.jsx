import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

export const MenuDropdown = ({ label, items }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 50); // Adjust the delay as needed (300ms in this example)
  };

  return (
    <div 
      className="relative group" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button className="block py-2 px-3 text-lg font-medium transition-all duration-300 text- dark:text-white hover:text-blue-700 dark:hover:text-background">
        {label}
      </button>
      {isVisible && (
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