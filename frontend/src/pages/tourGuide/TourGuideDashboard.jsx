import React from "react";
import TourGuideNavbar from "../../components/tourGuideComponents/TourGuideNavbar";
import { Routes, Route } from "react-router-dom";
import ProfileView from "../../components/tourGuideComponents/TourGuideProfile";
import ItinerariesView from "../../components/tourGuideComponents/ItinerariesView";
import ActivitiesView from "../../components/tourGuideComponents/ActivitiesView";
import MuseumsView from "../../components/tourGuideComponents/MuseumsAndHistoricalPlacesSubNavbar";

function TourGuideDashboard() {
  return (
    <div>
      <TourGuideNavbar />
      
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
