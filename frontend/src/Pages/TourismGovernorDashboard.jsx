import React from "react";
import { Routes, Route } from "react-router-dom";
import CreatePlacesOfInterest from "../components/CreatePlacesOfInterest";




function TourismGovernorDashboard(){
  return(
    <div>
      <Routes>
        <Route exact path="/" element={<div>Tourism Governor Home</div>}/>
        <Route path="/places-of-interest" element={<CreatePlacesOfInterest
        baseUrl="http://localhost:3000/api/placeOfInterest"
        title="Places of Interest"
        />} />

      </Routes>       
    </div>
  );
}

export default TourismGovernorDashboard;
