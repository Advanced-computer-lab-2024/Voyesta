// export const NavTabs = ({ tabs, activeTab, onTabChange }) => (
//     <div className="flex flex-grow justify-center space-x-6 relative">
//       {tabs.map((tab, index) => (
//         <button
//           key={index}
//           onClick={() => onTabChange(tab.id)}
//           className={`px-6 py-3 text-lg font-medium transition-all duration-300 
//           ${activeTab === tab.id ? "text-blue-600 underline" : "text-white hover:text-blue-600 hover:underline"}`}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );


// src/components/nav/NavTabs.jsx
// src/components/nav/NavTabs.jsx
// src/components/nav/NavTabs.jsx
import React from 'react';

export const NavTabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex flex-grow justify-center space-x-6 relative mr-10">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => onTabChange(tab.id)}
        className={`block py-2 px-3 text-lg font-medium transition-all duration-300 
          ${activeTab === tab.id 
            ? "text-blue-700 dark:text-blue-500" 
            : "text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500"}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);