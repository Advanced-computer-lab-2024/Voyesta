import React from "react";
import { Routes, Route } from "react-router-dom";

// import CreatePlacesOfInterest from "../../components/CreatePlacesOfInterest";
import TourismGovernorAccount from "../../components/EditPlacesOfInterest";
import NavBar from "../../components/NavBar";
import MuseumsAndHistoricalPlacesView from "../../newComponents/MuseumsAndHistoricalPlacesView";


const navLinks = [
  { path: "/tourismGovernor/places-of-interest", label: "Create Places Of Interest" },
  { path: "/tourismGovernor/account-list", label: "Account list" }
];

function TourismGovernorDashboard(){
  
  return(
    <div>
    <NavBar navLinks={navLinks} />
            
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
        <Route path="/account-list" element={
          <TourismGovernorAccount 
            baseUrl="http://localhost:3000/api/tourismGoverner"
            title = "Account list" 
          />    
        }/>

      </Routes>       
    </div>
  );
}

export default TourismGovernorDashboard;
