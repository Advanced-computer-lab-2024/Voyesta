import React from "react";
import AdminNavbar from "../../components/adminNavbar";
import ActivityCategory from "./ActivityCategory";
import { Routes, Route } from "react-router-dom";

function AdminDashboard(){
    return(
        <div>
            <AdminNavbar />
            <Routes>
                <Route path="/" element={<div>Home</div>}/>
            <Route path="/activity-category" element={<ActivityCategory />}/>

        </Routes>       
        </div>
    );
}

export default AdminDashboard;