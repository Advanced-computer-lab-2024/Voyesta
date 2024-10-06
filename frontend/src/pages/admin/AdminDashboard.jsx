import React from "react";
import AdminNavbar from "../../components/adminNavbar";
import { Routes, Route } from "react-router-dom";
import AdminListView from "../../components/adminListView";
import AdminAccountManagement from "../../components/AdminAccountManagement";
import AdminProductsView from "../../components/AdminProductsView";
import AdminAccountManagementNavbar from "../../components/AdminAccountManagementNavbar";

// import Admin from "../../../../backend/src/Models/Admin";

function AdminDashboard(){
  return(
    <div>
      <AdminNavbar />
      
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/activity-category" element={
          <AdminListView 
            baseUrl="http://localhost:3000/api/activityCategory"
            title = "Activity Categories" 
          />
        }/>
        <Route path="/preference-tag" element={
          <AdminListView 
          baseUrl="http://localhost:3000/api/preferenceTag"
          title="Preference Tags" 
        />}/>
        <Route path="/products" element={<AdminProductsView />}/>
        <Route path="/account-management" element={
          <AdminAccountManagementNavbar 
            baseUrl="http://localhost:3000/api/admin"
            title = "Account Management" 
          />}/>
    </Routes>       
    </div>
  );
}

export default AdminDashboard;