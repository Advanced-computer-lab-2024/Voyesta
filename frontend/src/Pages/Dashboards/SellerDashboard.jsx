import React, { useEffect, useState } from "react";
import { Routes, Route , useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar";
import SellerCreateProduct from '../../components/sellerComponents/SellerCreateProduct';
import ProductsView from "../../newComponents/ProuductView";
import ProductSalesView from "../../newComponents/ProductSalesView";
import ProfileManagement from "../../newComponents/ProfileManagement";
import UploadDocuments from "../../newComponents/UploadDocuments";
import AdditionalInfoForm from "../LoginSignup/AdditionalInfoForm";
import TermsAndConditions from "../LoginSignup/TermsAndConditions";
import RevenueSalesView from '../../newComponents/RevenueSalesView';
import Notifications from "../../newComponents/Notifications";
import TouristHome from "../../newComponents/TouristHome";


const navLinks = [
  { path: "/seller/", label: "Home" },
  { path: "/seller/create-product", label: "Create Product" },
  { path: "/seller/view-products", label: "All Products" },
  { path: "/seller/view-my-products", label: "My Products" },
  { path: "/seller/sales", label: "Sales" },
  { path: "/seller/profile", label: "Profile" },
  { path: "/seller/notifications", label: "Notifications" },
];

function SellerDashboard() {
  const [seller, setSeller] = useState([]);
  const [isDocumentsUploaded, setDocumentsUploaded] = useState(false);
  const [isAdditionalInfoSubmitted, setAdditionalInfoSubmitted] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const Location = useLocation();
  const currentUser = Location.state?.user || "tourist";



  const getAuthHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  }

  const fetchSeller = () => {
    axios.get("http://localhost:3000/api/seller/get", getAuthHeader())
      .then(res => {
        console.log(res.data);
        setSeller(res.data);
      })
      .catch(e => console.log(e));
  }

  useEffect(() => {
    fetchSeller();
  }, []);

  useEffect(() => {
    if (seller.personalId)
      setDocumentsUploaded(true);
    if (seller.name)
      setAdditionalInfoSubmitted(true);
    if (seller.status === 'active')
      setActive(true);
    if (seller.termsAccepted)
      setTermsAccepted(true);
  }, [seller]);

  return (
    <div>
      {
        !isDocumentsUploaded && <UploadDocuments userType={"seller"} />
      }

      {
        isDocumentsUploaded && !isActive &&
        <div className="text-2xl text-center p-52">Wait for admin approval</div>
      }

      {
        isDocumentsUploaded && isActive && !isTermsAccepted &&
        <TermsAndConditions onAccept={() => {
          axios.put("http://localhost:3000/api/seller/update", { ...seller, termsAccepted: true }, getAuthHeader())
            .then(res => {
              console.log(res);
              fetchSeller();
            })
            .catch(e => console.log(e));
        }} />
      }

      {
        isDocumentsUploaded && isActive && isTermsAccepted && !isAdditionalInfoSubmitted &&
        <AdditionalInfoForm userType="seller" user={seller} setUser={setSeller} fetchUser={fetchSeller} />
      }

      {
        isDocumentsUploaded && isActive && isAdditionalInfoSubmitted && isTermsAccepted &&
        <div>
          <NavBar role='seller' user={currentUser} />

          <Routes>
            <Route exact path="/" element={<div><TouristHome/></div>} />
            <Route path="/create-product" element={
              <SellerCreateProduct
                baseUrl="http://localhost:3000/api/seller"
                title="Create Product"
              />
            } />

            <Route path="/view-products" element={
              <ProductsView role="seller" />
            } />

            <Route path="/view-my-products" element={
              <ProductsView role="sellerMyProducts" />
            } />

            <Route path="/sales" element={<RevenueSalesView userType="seller" />} />
            <Route path="/profile" element={
              <ProfileManagement userType="seller" baseUrl="http://localhost:3000/api/seller" />
            } />
            <Route path='/notifications' element={<Notifications baseUrl="http://localhost:3000/api/seller" userType='seller' />}/>
          </Routes>
        </div>
      }
    </div>
  );
}

export default SellerDashboard;