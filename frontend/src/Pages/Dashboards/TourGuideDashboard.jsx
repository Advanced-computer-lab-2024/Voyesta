import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "../../components/tourGuideComponents/TourGuideProfile";
import ItinerariesView from "../../components/tourGuideComponents/ItinerariesView";
import ActivitiesView from "../../components/tourGuideComponents/ActivitiesView";
import MuseumsView from "../../components/tourGuideComponents/MuseumsAndHistoricalPlacesSubNavbar";
import NavBar from "../../components/NavBar";

const navLinks = [
  { path: "/tourGuide/", label: "Home" },
  { path: "/tourGuide/profile", label: "Profile" },
  { path: "/tourGuide/itineraries", label: "Itineraries" },
  { path: "/tourGuide/activities", label: "Activities" },
  { path: "/tourGuide/museums", label: "Museums" }
];

function TourGuideDashboard() {
  return (
    <div>
      <NavBar navLinks={navLinks} />
      
      <Routes>
        <Route exact path="/" element={<div>Welcome to the Tour Guide Dashboard</div>} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/itineraries" element={<ItinerariesView />} />
        <Route path="/activities" element={<ActivitiesView />} />
        <Route path="/museums" element={<MuseumsView />} />
      </Routes>       
    </div>
  );
}

export default TourGuideDashboard;
