import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import BookingDropDownMenu from '../newComponents/BookingDropDownMenu'; // Import the BookingDropDownMenu component

function NavBar({ navLinks}) {
    const [visible, setVisible] = useState(false);

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
                                <p>{link.label}</p>
                            </NavLink>
                        )}
                        {index < navLinks.length - 1 && <div className="w-0 border-r border-[#f5e1b4]" />}
                    </React.Fragment>
                ))}
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
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default NavBar;