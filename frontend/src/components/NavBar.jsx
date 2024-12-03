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
