import React from "react";
import { Routes, Route } from "react-router-dom";
import createPlacesOfInterest from "../components/CreatePlacesOfInterest";




function tourismGovernerDashboard(){
  return(
    <div>
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/places-of-interest" element={<createPlacesOfInterest
        baseUrl="http://localhost:3000/api/placeOfInterest"
        title="Places of Interest"
        />} />
      

      </Routes>       
    </div>
  );
}

export default tourismGovernerDashboard;
