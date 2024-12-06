import React, { useEffect, useState } from 'react';
import { Routes, Route , useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import ActivitiesView from '../../newComponents/ActivitiesView';
import ProfileManagement from '../../newComponents/ProfileManagement';
import UploadDocuments from '../../newComponents/UploadDocuments';
import AdditionalInfoForm from '../LoginSignup/AdditionalInfoForm';
import TermsAndConditions from '../LoginSignup/TermsAndConditions';
import RevenueSalesView from '../../newComponents/RevenueSalesView';
import Notifications from '../../newComponents/Notifications';

const navLinks = [
  { path: "/advertiser/", label: "Home" },
  { path: "/advertiser/profile", label: "Profile" },
  { path: "/advertiser/activity", label: "Activity" },
  { path: "/advertiser/sales", label: "Sales" },
  { path: "/advertiser/notifications", label: "Notifications" },
];

function AdvertiserDashboard() {
  const [advertiser, setAdvertiser] = useState([]);
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

  const fetchAdvertiser = () => {
    axios.get("http://localhost:3000/api/advertiser/get", getAuthHeader())
      .then(res => {
        setAdvertiser(res.data);
      })
      .catch(e => console.log(e));
  }

  useEffect(() => {
    fetchAdvertiser();
  }, []);

  useEffect(() => {
    if (advertiser.personalId)
      setDocumentsUploaded(true);
    if (advertiser.website)
      setAdditionalInfoSubmitted(true);
    if (advertiser.status === 'active')
      setActive(true);
    if (advertiser.termsAccepted)
      setTermsAccepted(true);
  }, [advertiser]);

  return (
    <div>
      {
        !isDocumentsUploaded && <UploadDocuments userType={"advertiser"} />
      }

      {
        isDocumentsUploaded && !isActive &&
        <div className="text-2xl text-center p-52">Wait for admin approval</div>
      }

      {
        isDocumentsUploaded && isActive && !isTermsAccepted &&
        <TermsAndConditions onAccept={() => {
          axios.put("http://localhost:3000/api/advertiser/update", { ...advertiser, termsAccepted: true }, getAuthHeader())
            .then(res => {
              console.log(res);
              fetchAdvertiser();
            })
            .catch(e => console.log(e));
        }} />
      }

      {
        isDocumentsUploaded && isActive && isTermsAccepted && !isAdditionalInfoSubmitted &&
        <AdditionalInfoForm userType="advertiser" user={advertiser} setUser={setAdvertiser} fetchUser={fetchAdvertiser} />
      }

      {
        isDocumentsUploaded && isActive && isAdditionalInfoSubmitted && isTermsAccepted &&
        <div>
          <NavBar role= 'advertiser' user={currentUser} />

          <Routes>
            <Route exact path="/" element={<div>Home</div>} />
            <Route path="/profile" element={
              <ProfileManagement
                userType="advertiser"
                baseUrl="http://localhost:3000/api/advertiser"
              />
            } />
            <Route path="/activity" element={
              <ActivitiesView baseUrl="http://localhost:3000/api/advertiser" role="advertiser" />
            } />
            <Route path="/sales" element={<RevenueSalesView userType="advertiser" />} />
            <Route path="/notifications" element={<Notifications baseUrl="http://localhost:3000/api/advertiser" userType="advertiser" />} />
          </Routes>
        </div>
      }
    </div>
  );
}

export default AdvertiserDashboard;
