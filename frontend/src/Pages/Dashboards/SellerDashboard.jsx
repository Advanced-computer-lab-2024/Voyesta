import React from "react";
import { Routes, Route } from "react-router-dom";

import SellerCreateProduct from '../../components/sellerComponents/SellerCreateProduct';
import SellerProfile from '../../components/sellerComponents/SellerProfileMangement';
import NavBar from "../../components/NavBar";
import ProductsView from "../../newComponents/ProuductView";


const navLinks = [
  { path: "/seller/", label: "Home" },
  { path: "/seller/create-product", label: "Create Product" },
  { path: "/seller/view-products", label: "View Products" },
  { path: "/seller/view-my-products", label: "View My Products" },
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
        
        <Route path="/my-profile" element={
          <SellerProfile
            baseUrl="http://localhost:3000/api/seller"
            title = "My Profile" 
          />
        }/>
    </Routes>       
    </div>
  );
}

export default SellerDashboard;