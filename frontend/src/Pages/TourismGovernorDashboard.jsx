import React from "react";
import { Routes, Route } from "react-router-dom";
import CreatePlacesOfInterest from "../components/CreatePlacesOfInterest";
import TourismGovernorNavbar from "../components/TourismGovernorNavbar";
import TourismGovernorAccount from "../components/TourismGovernorAccount";





function TourismGovernorDashboard(){
  return(
    <div>
    <TourismGovernorNavbar />
      <Routes>
        <Route exact path="/" element={<div>Tourism Governor Home</div>}/>
        <Route path="/places-of-interest" element={
          <CreatePlacesOfInterest
            baseUrl="http://localhost:3000/api/tourismGoverner"
            title = "Create Places of Interest" 
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
