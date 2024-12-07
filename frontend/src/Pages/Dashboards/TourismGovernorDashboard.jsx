import React from "react";
import { Routes, Route , useLocation } from "react-router-dom";

import NavBar from "../../components/NavBar";
import MuseumsAndHistoricalPlacesView from "../../newComponents/MuseumsAndHistoricalPlacesView";
import CreateTag from "../../newComponents/CreateTag";
import ProfileManagement from "../../newComponents/ProfileManagement";
import ChangePassword from "../../newComponents/ChangePassword";


const navLinks = [
  { path: "/tourismGovernor/places-of-interest", label: "Create Places Of Interest" },
  { path: "/tourismGovernor/create-tag", label: "Create Tag" },
  { path: "/tourismGovernor/account-list", label: "Change password" },
];

function TourismGovernorDashboard(){
  const Location = useLocation();
  const currentUser = Location.state?.user || "tourist";



  return(
    <div>
    <NavBar role='tourismGovernor' user={currentUser} />
            
      <Routes>
        <Route exact path="/" element={<div>Tourism Governor Home</div>}/>
        <Route path="/places-of-interest" element={
          // <CreatePlacesOfInterest
          //   baseUrl="http://localhost:3000/api/tourismGoverner"
          //   title = "Create Places of Interest" 
          // />
          <MuseumsAndHistoricalPlacesView 
            baseUrl="http://localhost:3000/api/tourismGoverner"
            role="tourismGovernor"
          />
        }/>
        <Route path="/create-tag" element={
          <CreateTag
            baseUrl="http://localhost:3000/api/tourismGoverner"
            title = "Create Tag" 
          />
        }/>
        <Route path="/account-list" element={
          <ProfileManagement
            baseUrl="http://localhost:3000/api/tourismGoverner"
            userType="tourismGovernor"
          />
        }/>

      </Routes>       
    </div>
  );
}

export default TourismGovernorDashboard;
