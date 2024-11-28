import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminListView from "../../components/adminComponents/AdminListView";
import AdminAccountManagementNavbar from "../../components/adminComponents/AdminAccountManagementNavbar";
import NavBar from "../../components/NavBar";
import ProductsView from "../../newComponents/ProuductView";
import ItineraryView from "../../newComponents/ItineraryView";
import CombinedComplaints from "../../newComponents/CombinedComplaints";
import ProductSalesView from "../../newComponents/ProductSalesView";
import PendingUsers from "../../newComponents/PendingUsers";
import RevenueSalesView from '../../newComponents/RevenueSalesView';

const navLinks = [
  { path: "/admin/activity-category", label: "Activity Category" },
  { path: "/admin/preference-tag", label: "Preference Tag" },
  { path: "/admin/products", label: "Products" },
  { path: "/admin/itineraries", label: "Itineraries" },
  { path: "/admin/complaints", label: "Complaints" },
  // { path: "/admin/sales", label: "Sales" },
  { path: "/admin/revenue-sales", label: "Sales" },
  { path: "/admin/pendingUsers", label: "Pending Users" },
  { path: "/admin/account-management", label: "Account Management" },
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
        <Route path="/itineraries" element={
          <ItineraryView baseUrl="http://localhost:3000/api/admin" role="admin" />
        }/>
        <Route path="/complaints" element={
          <CombinedComplaints 
            baseUrl="http://localhost:3000/api/admin/"
            title="Complaints"
            role="admin"
          />
        }/>

        <Route path="/sales" element={
          <ProductSalesView userType="admin" />
        }/>
        <Route path="/pendingUsers" element={
          <PendingUsers baseUrl= "http://localhost:3000/api/admin" />
        }/>
        <Route path="/account-management" element={
          <AdminAccountManagementNavbar
            title = "Account Management" 
          />}/>
        <Route path="/revenue-sales" element={<RevenueSalesView userType="admin" />} />
      </Routes>       
    </div>
  );
}

export default AdminDashboard;