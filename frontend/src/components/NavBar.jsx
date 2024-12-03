import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHome, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import { assets } from "../assets/assets";
import BookingDropDownMenu from '../newComponents/BookingDropDownMenu'; // Import the BookingDropDownMenu component
import DropdownMenu from './DropdownMenuTourist'; // Import the DropdownMenu component

function NavBar({ navLinks, role }) {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Define the items for the dropdown menu
    const dropdownItems = [
        { path: "/tourist/profile", label: "Profile" },
        { path: "/tourist/complaints", label: "Complaints" },
        { path: "/tourist/Wishlist", label: "Wishlist" },
        { path: "/tourist/orders", label: "My Orders" },
        { path: "/tourist/purchases", label: "Purchases" }
    ];

    return (
        <div className="flex items-center justify-between text-[#f5e1b4] bg-[#003366] px-5 py-5 font-medium">
            <div className="text-2xl font-bold cursor-default">V O Y E S T A</div>

            <ul>
                <div className="flex items-center gap-6">
                    <img onClick={() => { setVisible(true) }} src={assets.menuIcon} className="w-5 cursor-pointer sm:hidden" />
                </div>
            </ul>

            <ul className="hidden sm:flex gap-3 text-lg font-medium p-2">
                {navLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        {link.label === 'Bookings' ? (
                            <BookingDropDownMenu />
                        ) : (
                            <NavLink to={link.path} className="flex flex-col items-center gap-1">
                                {link.label === 'Cart' ? (
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                ) : link.label === 'Home' ? (
                                    <FontAwesomeIcon icon={faHome} />
                                ) : link.label === 'Notifications' ? (
                                    <FontAwesomeIcon icon={faBell} />
                                ) : (
                                    <p>{link.label}</p>
                                )}
                            </NavLink>
                        )}
                        {index < navLinks.length - 1 && <div className="w-0 border-r border-[#f5e1b4]" />}
                    </React.Fragment>
                ))}
                {role !== 'guest' && 
                <button
                    onClick={handleLogout}
                    className="bg-transparent text-white py-2 px-4 rounded-lg hover:text-red-500"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>}
                <DropdownMenu items={dropdownItems} />
            </ul>

            {/* Sidebar Menu for small screens */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className="flex flex-col text-gray-600">
                    <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                        <img src={assets.dropdown_icon} className="h-4 rotate-180" />
                        <p>Back</p>
                    </div>
                    {navLinks.map((link, index) => (
                        <NavLink key={index} onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to={link.path}>
                            {link.label === 'Cart' ? (
                                <FontAwesomeIcon icon={faShoppingCart} />
                            ) : link.label === 'Home' ? (
                                <FontAwesomeIcon icon={faHome} />
                            ) : link.label === 'Notifications' ? (
                                <FontAwesomeIcon icon={faBell} />
                            ) : (
                                <p>{link.label}</p>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NavBar;