import React from "react";
import { Routes, Route } from "react-router-dom";
import SellerNavbar from '../../components/seller/SellerNavbar';
import SellerCreateProduct from '../../components/seller/SellerCreateProduct';
import SellerViewProducts from '../../components/seller/SellerViewProducts';
import SellerViewMyProducts from '../../components/seller/SellerViewMyProducts';
import SellerProfile from '../../components/seller/SellerProfileMangement';
function SellerDashboard(){
  return(
    <div>
      <SellerNavbar />
      
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/create-product" element={
          <SellerCreateProduct
            baseUrl="http://localhost:2000/api/seller"
            title = "Create Product" 
          />
        }/>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/view-products" element={
          <SellerViewProducts
            baseUrl="http://localhost:2000/api/seller"
            title = "View Products" 
          />
        }/>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/view-my-products" element={
          <SellerViewMyProducts
            baseUrl="http://localhost:2000/api/seller"
            title = "View My Products" 
          />
        }/>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/my-profile" element={
          <SellerProfile
            baseUrl="http://localhost:2000/api/seller"
            title = "My Profile" 
          />
        }/>
    </Routes>       
    </div>
  );
}

export default SellerDashboard;