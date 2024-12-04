import React, { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import BookingDropDownMenu from '../newComponents/BookingDropDownMenu'; // Import the BookingDropDownMenu component

function NavBar({ navLinks, role }) {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="flex items-center justify-between bg-[#003366] px-5 py-4 text-[#f5e1b4] font-medium">
            {/* Logo */}
            <div className="text-2xl font-bold cursor-default">V O Y E S T A</div>

            {/* Desktop Menu */}
            <ul className="hidden sm:flex gap-6 items-center text-lg font-medium">
                {navLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        {link.label === 'Bookings' ? (
                            <BookingDropDownMenu />
                        ) : (
                            <NavLink
                                to={link.path}
                                className="hover:text-white transition-all"
                            >
                                {link.label}
                            </NavLink>
                        )}
                        {index < navLinks.length - 1 && (
                            <div className="h-6 border-r border-[#f5e1b4]" />
                        )}
                    </React.Fragment>
                ))}
                {role !== 'guest' && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                )}
            </ul>

            {/* Mobile Menu Icon */}
            <div className="sm:hidden">
                <img
                    onClick={() => setVisible(true)}
                    src={assets.menuIcon}
                    className="w-6 cursor-pointer"
                    alt="Menu"
                />
            </div>

            {/* Sidebar Menu for Mobile */}
            <div
                className={`absolute top-0 right-0 h-full bg-white transition-all ${
                    visible ? 'w-3/4' : 'w-0'
                } overflow-hidden`}
            >
                <div className="flex flex-col h-full text-gray-600">
                    {/* Back Button */}
                    <div
                        onClick={() => setVisible(false)}
                        className="flex items-center gap-2 px-4 py-3 cursor-pointer"
                    >
                        <img
                            src={assets.dropdown_icon}
                            className="h-4 rotate-180"
                            alt="Back"
                        />
                        <p>Back</p>
                    </div>
                    {/* Sidebar Links */}
                    {navLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.path}
                            onClick={() => setVisible(false)}
                            className="py-3 px-6 border-b text-gray-800 hover:bg-gray-200"
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NavBar;


// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";
// import DropdownMenu from "../newComponents/BookingDropDownMenu";

// function NavBar({ navLinks, role }) {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <nav className="bg-white border-gray-200 dark:bg-gray-900">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         <a href="/" className="flex items-center">
//           <img src={assets.logo} className="h-8" alt="Voyesta Logo" />
//           <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
//             Voyesta
//           </span>
//         </a>
//         <div className="flex items-center md:order-2">
//           {role !== "guest" && (
//             <button
//               onClick={handleLogout}
//               className="text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700"
//             >
//               Logout
//             </button>
//           )}
//           <button
//             data-collapse-toggle="navbar-user"
//             type="button"
//             className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//             aria-controls="navbar-user"
//             aria-expanded="false"
//             onClick={() => setMenuVisible(!menuVisible)}
//           >
//             <span className="sr-only">Open main menu</span>
//             <svg
//               className="w-5 h-5"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 17 14"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M1 1h15M1 7h15M1 13h15"
//               />
//             </svg>
//           </button>
//         </div>
//         <div
//           className={`${
//             menuVisible ? "block" : "hidden"
//           } items-center justify-between w-full md:flex md:w-auto md:order-1`}
//           id="navbar-user"
//         >
//           <ul className="flex flex-col md:flex-row md:space-x-8 font-medium">
//             {navLinks.map((link, index) => (
//               <li key={index}>
//                 {link.label === "Bookings" ? (
//                   <DropdownMenu />
//                 ) : (
//                   <NavLink
//                     to={link.path}
//                     className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
//                   >
//                     {link.label}
//                   </NavLink>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default NavBar;


// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";

// function NavBar({ navLinks, role, user }) {
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [hoverTimeout, setHoverTimeout] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   // Show dropdown with delay reset
//   const showDropdown = () => {
//     if (hoverTimeout) clearTimeout(hoverTimeout);
//     setDropdownVisible(true);
//   };

//   // Hide dropdown after a slight delay
//   const hideDropdown = () => {
//     const timeout = setTimeout(() => setDropdownVisible(false), 300); // 300ms delay
//     setHoverTimeout(timeout);
//   };

//   return (
//     <nav className="bg-white border-gray-200 dark:bg-gray-900">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         {/* Logo */}
//         <a href="/" className="flex items-center">
//           <img src={assets.logo} className="h-8" alt="Voyesta Logo" />
//           <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
//             Voyesta
//           </span>
//         </a>

//         {/* Profile Picture and Dropdown */}
//         <div
//           className="relative"
//           onMouseEnter={showDropdown}
//           onMouseLeave={hideDropdown}
//         >
//           <button
//             type="button"
//             className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
//           >
//             <img
//               className="w-10 h-10 rounded-full object-cover"
//               src={user?.profilePicture || assets.placeholderProfile}
//               alt="user profile"
//             />
//           </button>
//           {dropdownVisible && (
//             <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
//               <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
//                 <li>
//                   <NavLink
//                     to="/tourist/profile"
//                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
//                   >
//                     Profile
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink
//                     to="/tourist/orders"
//                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
//                   >
//                     My Orders
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink
//                     to="/tourist/complaints"
//                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
//                   >
//                     Complaints
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink
//                     to="/tourist/purchases"
//                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
//                   >
//                     Purchases
//                   </NavLink>
//                 </li>
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default NavBar;



