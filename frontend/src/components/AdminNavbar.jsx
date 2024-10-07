import React, { useState } from "react";
import { Routes, Route,NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

function AdminNavbar(){
    const [visible, setVisible] = useState(false);
    return(
        <div className="flex items-center justify-between text-[#f5e1b4] bg-[#003366] px-5 py-5 font-medium">

        {/* <NavLink to="/"> */}
            {/* <img src={assets.logo} className="w-36" /> */}
            <div  className="text-2xl font-bold cursor-default">V O Y E S T A</div>

        {/* </NavLink> */}

        <ul>
            <div className="flex items-center gap-6">
                <img onClick={() =>{setVisible(true)}} src={assets.menuIcon} className="w-5 cursor-pointer sm:hidden" />
            </div> 
        </ul>

        <ul className="hidden sm:flex gap-3 text-lg font-medium p-2">
            <NavLink to="/admin/activity-category" className="flex flex-col items-center gap-1">
                <p>Activity Category</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
            </NavLink>

            <div className="w-0  border-r border-[#f5e1b4]"/>
            
            <NavLink to="/admin/preference-tag" className="flex flex-col items-center gap-1">
                <p>Preference Tag</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
            </NavLink>
            
            <div className="w-0  border-r border-[#f5e1b4]"/>

            <NavLink to="/admin/products" className="flex flex-col items-center gap-1">
                <p>Products</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
            </NavLink>

            <div className="w-0  border-r border-[#f5e1b4]"/>

            <NavLink to="/admin/account-management" className="flex flex-col items-center gap-1">
                <p>Account Managment</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
            </NavLink>        

        </ul>

        

        {/* sideBar Menu for small screeens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} `}>
            <div className="flex flex-col text-gray-600">
                <div onClick={() =>setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                    <img src={assets.dropdown_icon} className="h-4 rotate-180" />
                    <p>Back</p>
                </div>
                <NavLink onClick={() =>{setVisible(false)}} className="py-2 pl-6 border" to="/">HOME</NavLink>
                <NavLink onClick={() =>{setVisible(false)}} className="py-2 pl-6 border" to="/matches">Matches</NavLink>
                <NavLink onClick={() =>{setVisible(false)}} className="py-2 pl-6 border" to="/players">Players</NavLink>

            </div>
        </div>
    </div>
    );
}

export default AdminNavbar;