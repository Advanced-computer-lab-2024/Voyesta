



import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from "../../assets/assets";

export const ProfileDropdown = ({ user, isVisible, items, baseUrl = '/', onMouseEnter, onMouseLeave }) => {
    // handle get user image.
  return (
      <div 
        onMouseEnter={onMouseEnter} 
        onMouseLeave={onMouseLeave}
        className="relative"
      >
        <button className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
          <img
            className="w-8 h-8 rounded-full"
            src={user?.profilePicture || assets.placeholderProfile}
            alt="user photo"
          />
        </button>
        {isVisible && (
          <div className="z-50 absolute right-0 mt-2 w-56 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">{user?.username}</span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user?.email}</span>
            </div>
            <ul className="py-2">
              {items.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={`${baseUrl}${item.path}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    {item.icon && <i className={`fas ${item.icon} mr-2`}></i>}
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