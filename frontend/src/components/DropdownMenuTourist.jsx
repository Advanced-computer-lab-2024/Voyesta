import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function DropdownMenu({ items }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-white">
                <FontAwesomeIcon icon={faBars} />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul className="py-1">
                        {items.map((item, index) => (
                            <li key={index}>
                                <NavLink to={item.path} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DropdownMenu;