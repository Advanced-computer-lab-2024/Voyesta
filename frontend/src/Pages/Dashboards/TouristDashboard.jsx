import React from "react";
import { Routes, Route } from "react-router-dom";
// import AdminProductsView from "../../components/AdminProductsView";
import MuseumsAndHistoricalPlaceCard from "../../components/tourGuideComponents/MuseumsAndHistoricalPlacesSubNavbar";
import TouristItinerariesView from '../../components/touristComponents/TouristItinerariesView';
import TouristActivitiesView from '../../components/touristComponents/TouristActivitiesView';
import TouristProfile from '../../components/touristComponents/TouristProfile'
import NavBar from "../../components/NavBar";
import ProductsView from "../../newComponents/ProuductView";

const navLinks = [
  { path: "/tourist/", label: "Home" },
  { path: "/tourist/profile", label: "Profile" },
  { path: "/tourist/products", label: "Products" },
  { path: "/tourist/activities", label: "Activities" },
  { path: "/tourist/itineraries", label: "Itineraries" },
  { path: "/tourist/museums", label: "Museums" }
];

function TouristDashboard(){
  return(
    <div>
      <NavBar navLinks={navLinks} />
      <Routes>
        <Route exact path="/" element={<div>Home</div>}/>
        <Route path="/profile" element={<TouristProfile />}/>
        <Route path="/products" element={<ProductsView role="tourist" />}/>
        <Route path="/activities" element={<TouristActivitiesView />}/>
        <Route path="/itineraries" element={<TouristItinerariesView />}/>
        <Route path="/museums" element={<MuseumsAndHistoricalPlaceCard />}/>
    </Routes>       
    </div>
  );
}

export default TouristDashboard;