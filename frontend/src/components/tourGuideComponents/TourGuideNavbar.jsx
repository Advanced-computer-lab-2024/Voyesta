import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets"; // Adjust the import path as necessary

function TourGuideNavbar() {
  const [visible, setVisible] = useState(false);
  
  return (
    <div className="flex items-center justify-between text-[#f5e1b4] bg-[#003366] px-5 py-5 font-medium">
      <div className="text-2xl font-bold cursor-default">V O Y E S T A</div>

      <ul>
        <div className="flex items-center gap-6">
          <img onClick={() => setVisible(true)} src={assets.menuIcon} className="w-5 cursor-pointer sm:hidden" />
        </div>
      </ul>

      <ul className="hidden sm:flex gap-3 text-lg font-medium p-2">
        <NavLink to="/profile" className="flex flex-col items-center gap-1">
          <p>Profile</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <div className="w-0 border-r border-[#f5e1b4]" />

        <NavLink to="/itineraries" className="flex flex-col items-center gap-1">
          <p>Itineraries</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <div className="w-0 border-r border-[#f5e1b4]" />

        <NavLink to="/activities" className="flex flex-col items-center gap-1">
          <p>Activities</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <div className="w-0 border-r border-[#f5e1b4]" />

        <NavLink to="/museums" className="flex flex-col items-center gap-1">
          <p>Museums</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Sidebar Menu for small screens */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img src={assets.dropdown_icon} className="h-4 rotate-180" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/">Home</NavLink>
          <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/profile">Profile</NavLink>
          <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/itineraries">Itineraries</NavLink>
          <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/activities">Activities</NavLink>
          <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/museums">Museums</NavLink>
        </div>
      </div>
    </div>
  );
}

export default TourGuideNavbar;
