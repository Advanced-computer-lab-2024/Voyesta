import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ActivitiesView from "../../newComponents/ActivitiesView";
import ItineraryView from "../../newComponents/ItineraryView";
import MuseumsAndHistoricalPlacesView from "../../newComponents/MuseumsAndHistoricalPlacesView";
import ProfileManagement from "../../newComponents/ProfileManagement";
import axios from "axios";
import UploadDocuments from "../../newComponents/UploadDocuments";
import AdditionalInfoForm from "../LoginSignup/AdditionalInfoForm";
import TermsAndConditions from "../LoginSignup/TermsAndConditions";

const navLinks = [
  { path: "/tourGuide/", label: "Home" },
  { path: "/tourGuide/profile", label: "Profile" },
  { path: "/tourGuide/itineraries", label: "Itineraries" },
  { path: "/tourGuide/activities", label: "Activities" },
  { path: "/tourGuide/museums", label: "Museums" }
];

function TourGuideDashboard() {

  const [tourGuide, setTourGuide] = useState([]);
  const [isDocumentsUploaded, setDocumentsUploaded] = useState(false);
  const [isAdditionalInfoSubmitted, setAdditionalInfoSubmitted] = useState(false);
  const [isActive, setActice] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);

  const getAuthHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  }

  const fetchTourGuide = () => {
    axios.get("http://localhost:3000/api/tourGuide/get", getAuthHeader())
    .then(res => {
      console.log(res.data);
      setTourGuide(res.data);
    })
    .catch(e => console.log(e));
  }

  useEffect(() => {
    fetchTourGuide();
  }, []);

  useEffect(() => {
    if(tourGuide.personalId)
      setDocumentsUploaded(true);
    if(tourGuide.mobileNumber)
      setAdditionalInfoSubmitted(true);
    if(tourGuide.status === 'active')
      setActice(true);
    if(tourGuide.termsAccepted)
      setTermsAccepted(true);
  }, [tourGuide]);

  return (
    <>
    {
      !isDocumentsUploaded && <UploadDocuments userType={"tourGuide"} />
    }

    {
      isDocumentsUploaded && !isActive && 
      <div className="text-2xl text-center p-52">Wait for admin approval</div>
    }

    {
      isDocumentsUploaded && isActive && !isTermsAccepted && 
      <TermsAndConditions onAccept={() =>{
        axios.put("http://localhost:3000/api/tourGuide/update", {...tourGuide, termsAccepted: true}, getAuthHeader())
        .then(res => {
          console.log(res);
          fetchTourGuide();
        })
        .catch(e => console.log(e));
      }} />  
    }

    {
      isDocumentsUploaded && isActive && isTermsAccepted && !isAdditionalInfoSubmitted && 
      <AdditionalInfoForm userType="tourGuide" user={tourGuide} setUser={setTourGuide} fetchUser={fetchTourGuide}/>
    }
    {
      isDocumentsUploaded && isActive && isAdditionalInfoSubmitted && isTermsAccepted &&
      <div>
        <NavBar navLinks={navLinks} />
        
        <Routes>
          <Route exact path="/" element={<div>Welcome to the Tour Guide Dashboard</div>} />
          <Route path="/profile" element={
            // <ProfileView />
            <ProfileManagement userType="tourGuide" baseUrl="http://localhost:3000/api/tourGuide" />

            } />
          <Route path="/itineraries" element={<ItineraryView baseUrl="http://localhost:3000/api/tourGuide" role="tourGuide"/>} />
          <Route path="/activities" element={<ActivitiesView baseUrl="http://localhost:3000/api/tourGuide" />} />
          <Route path="/museums" element={ <MuseumsAndHistoricalPlacesView baseUrl="http://localhost:3000/api/tourGuide" /> } />
        </Routes>       
      </div>
  }
    </>
  );
}

export default TourGuideDashboard;
