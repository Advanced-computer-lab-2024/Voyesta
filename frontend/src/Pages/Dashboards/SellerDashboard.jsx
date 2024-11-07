import React from "react";
import { Routes, Route } from "react-router-dom";

import SellerCreateProduct from '../../components/sellerComponents/SellerCreateProduct';
import NavBar from "../../components/NavBar";
import ProductsView from "../../newComponents/ProuductView";
import ProductSalesView from "../../newComponents/ProductSalesView";
import ProfileManagement from "../../newComponents/ProfileManagement";


const navLinks = [
  { path: "/seller/", label: "Home" },
  { path: "/seller/create-product", label: "Create Product" },
  { path: "/seller/view-products", label: "All Products" },
  { path: "/seller/view-my-products", label: "My Products" },
  { path: "/seller/sales", label: "Sales" },
  { path: "/seller/profile", label: "Profile" }
];


function SellerDashboard(){
  return(
    <div>
      <NavBar navLinks={navLinks} />
      
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/create-product" element={
          <SellerCreateProduct
            baseUrl="http://localhost:3000/api/seller"
            title = "Create Product" 
          />
        }/>
        
        <Route path="/view-products" element={
          <ProductsView role="seller" />
        }/>
        
        <Route path="/view-my-products" element={
          <ProductsView role="sellerMyProducts" />
        }/>

        <Route path="/sales" element={
          <ProductSalesView userType="seller" />
        }/>
        
        <Route path="/profile" element={
          // <SellerProfile
          //   baseUrl="http://localhost:3000/api/seller"
          //   title = "My Profile" 
          // />
          <ProfileManagement userType="seller" baseUrl="http://localhost:3000/api/seller" />
        }/>
    </Routes>       
    </div>
  );
}

export default SellerDashboard;