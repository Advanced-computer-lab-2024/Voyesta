import axios from "axios";
import React, { useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import { Routes, Route } from "react-router-dom";

import ActivitiesView from "../newComponents/ActivitiesView";
import ItineraryView from "../newComponents/ItineraryView";
import MuseumsAndHistoricalPlacesView from "../newComponents/MuseumsAndHistoricalPlacesView";
import LandingPage from "./LandingPage";
import InteractiveVacationGuide from "../newComponents/InteractiveVactionGuide";

const navLinks = [
    { path: "/guest/activities", label: "Activities" },
    { path: "/guest/itineraries", label: "Itineraries" },
    { path: "/guest/museums", label: "Museums" },
    { path: "/guest", label: "Home" }
  ];


function Dashboard(){



    const getAuthHeaders = () =>{
        console.log(token);
        return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }}
    };

    


    return (
        <>
            <NavBar role='guest'  user = {'guest'}/>
            <Routes>
                
                    <Route path="/activities" element={
                        <ActivitiesView baseUrl="http://localhost:3000/api/tourist" role="tourist"/>
                    }/>
                    <Route path="/itineraries" element={
                        <ItineraryView baseUrl="http://localhost:3000/api/tourist" role="tourist" />
                    }/>
                    <Route path="/museums" element={
                        <MuseumsAndHistoricalPlacesView baseUrl="http://localhost:3000/api/tourist" role="tourist" />
                    }/>
                    <Route path="/" element={
                        <LandingPage />
                    }/>
                    
                    <Route path="/guide" element={<InteractiveVacationGuide userType="guest" />} />
                </Routes>
        </>
    );
}

export default Dashboard;