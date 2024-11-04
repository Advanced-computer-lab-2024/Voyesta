import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminListView from "../../components/adminListView";
import AdminAccountManagementNavbar from "../../components/AdminAccountManagementNavbar";
import NavBar from "../../components/NavBar";
import ProductsView from "../../newComponents/ProuductView";

const navLinks = [
  { path: "/admin/activity-category", label: "Activity Category" },
  { path: "/admin/preference-tag", label: "Preference Tag" },
  { path: "/admin/products", label: "Products" },
  { path: "/admin/account-management", label: "Account Management" }
];

function AdminDashboard(){
  return(
    <div>
      <NavBar navLinks={navLinks} />
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/activity-category" element={
          <AdminListView 
            baseUrl="http://localhost:3000/api/admin/"
            target = "ActivityCategory"
            title = "Activity Categories" 
          />
        }/>
        <Route path="/preference-tag" element={
          <AdminListView 
          baseUrl="http://localhost:3000/api/admin/"
          target = "PrefernceTag"
          title="Preference Tags" 
        />}/>
        <Route path="/products" element={
          <ProductsView role="admin" />
        }/>
        <Route path="/account-management" element={
          <AdminAccountManagementNavbar
            title = "Account Management" 
          />}/>
      </Routes>       
    </div>
  );
}

export default AdminDashboard;