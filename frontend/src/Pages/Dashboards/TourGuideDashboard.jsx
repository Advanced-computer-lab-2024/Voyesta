import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileView from "../../components/tourGuideComponents/TourGuideProfile";
// import ItinerariesView from "../../components/tourGuideComponents/ItinerariesView";
// import ActivitiesView from "../../components/tourGuideComponents/ActivitiesView";
// import MuseumsView from "../../components/tourGuideComponents/MuseumsAndHistoricalPlacesSubNavbar";
import NavBar from "../../components/NavBar";
import ActivitiesView from "../../newComponents/ActivitiesView";
import ItineraryView from "../../newComponents/ItineraryView";
import MuseumsAndHistoricalPlacesView from "../../newComponents/MuseumsAndHistoricalPlacesView";


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
        <Route path="/itineraries" element={<ItineraryView baseUrl="http://localhost:3000/api/tourGuide" role="tourGuide"/>} />
        <Route path="/activities" element={<ActivitiesView baseUrl="http://localhost:3000/api/tourGuide" />} />
        <Route path="/museums" element={ <MuseumsAndHistoricalPlacesView baseUrl="http://localhost:3000/api/tourGuide" /> } />
      </Routes>       
    </div>
  );
}

export default TourGuideDashboard;
