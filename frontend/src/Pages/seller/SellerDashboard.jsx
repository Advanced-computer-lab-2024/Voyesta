import React from "react";
import { Routes, Route } from "react-router-dom";
import SellerNavbar from '../../components/seller/SellerNavbar';
import SellerCreateProduct from '../../components/seller/SellerCreateProduct';
import SellerViewProducts from '../../components/seller/SellerViewProducts';

function SellerDashboard(){
  return(
    <div>
      <SellerNavbar />
      
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/seller-create-product" element={
          <SellerCreateProduct
            baseUrl="http://localhost:2000/api/seller"
            title = "Create Product" 
          />
        }/>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/seller-view-products" element={
          <SellerViewProducts
            baseUrl="http://localhost:2000/api/seller"
            title = "View Products" 
          />
        }/>
    </Routes>       
    </div>
  );
}

export default SellerDashboard;