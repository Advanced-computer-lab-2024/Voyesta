import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/dropDown.css'; // Create a CSS file for styling

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    return (
        <div className="dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to="/bookings" className="dropdown-link">Bookings</Link>
            {isOpen && (
                <div className="dropdown-content">
                    <Link to="/tourist/flight">Book Flight</Link>
                    <Link to="/tourist/hotel">Book Hotel</Link>
                    <Link to="/tourist/transport">Book Transportation</Link>
                    <Link to="/tourist/bookings">My Bookings</Link>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;