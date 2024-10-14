import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminProductsView from "../../components/AdminProductsView";
import ActivitiesView from "../../components/tourGuideComponents/ActivitiesView";
import ItinerariesView from "../../components/tourGuideComponents/ItinerariesView";
import MuseumsAndHistoricalPlaceCard from "../../components/tourGuideComponents/MuseumsAndHistoricalPlacesSubNavbar";
import AdminNavbar from '../../components/AdminNavbar';
import TouristNavbar from '../../components/touristComponents/TouristNavbar';
import TouristItinerariesView from '../../components/touristComponents/TouristItinerariesView';
import TouristActivitiesView from '../../components/touristComponents/TouristActivitiesView';
import TouristProfile from '../../components/touristComponents/TouristProfile'

// import Admin from "../../../../backend/src/Models/Admin";

function AdminDashboard(){
  return(
    <div>
      <TouristNavbar />
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/profile" element={<TouristProfile />}/>
        <Route path="/products" element={<AdminProductsView />}/>
        <Route path="/activities" element={<TouristActivitiesView />}/>
        <Route path="/itineraries" element={<TouristItinerariesView />}/>
        <Route path="/museums" element={<MuseumsAndHistoricalPlaceCard />}/>
    </Routes>       
    </div>
  );
}

export default AdminDashboard;