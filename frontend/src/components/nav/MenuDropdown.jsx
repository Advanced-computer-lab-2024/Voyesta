// import React from 'react';
// import { NavLink } from 'react-router-dom';

// export const MenuDropdown = ({ label, items, isVisible, onMouseEnter, onMouseLeave }) => {
//     return (
//       <div 
//         className="relative" 
//         onMouseEnter={onMouseEnter} 
//         onMouseLeave={onMouseLeave}
//       >
//         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500">
//           {label}
//         </button>
//         {isVisible && (
//           <div className="z-50 absolute left-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
//             <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
//               {items.map((item, index) => (
//                 <li key={index}>
//                   <NavLink
//                     to={item.path}
//                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                   >
//                     {item.label}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     );
//   };



// src/components/nav/MenuDropdown.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export const MenuDropdown = ({ label, items, isVisible, onMouseEnter, onMouseLeave }) => (
  <div 
    className="relative group" 
    onMouseEnter={onMouseEnter} 
    onMouseLeave={onMouseLeave}
  >
    <button className="block py-2 px-3 text-lg font-medium transition-all duration-300 text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">
      {label}
    </button>
    {isVisible && (
      <div className="z-50 absolute left-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 group-hover:block">
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