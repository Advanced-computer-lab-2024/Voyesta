import React from "react";
import { Routes, Route } from "react-router-dom";
// import MuseumsAndHistoricalPlaceCard from "../../components/tourGuideComponents/MuseumsAndHistoricalPlacesSubNavbar";
// import TouristItinerariesView from '../../components/touristComponents/TouristItinerariesView';
// import TouristActivitiesView from '../../components/touristComponents/TouristActivitiesView';
import TouristProfile from '../../components/touristComponents/TouristProfile'
import NavBar from "../../components/NavBar";
import ProductsView from "../../newComponents/ProuductView";
import ActivitiesView from '../../newComponents/ActivitiesView';
import ItineraryView from "../../newComponents/ItineraryView";
import MuseumsAndHistoricalPlacesView from "../../newComponents/MuseumsAndHistoricalPlacesView";

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
        <Route path="/activities" element={
          // <TouristActivitiesView />
          <ActivitiesView baseUrl="http://localhost:3000/api/tourist" role="tourist"/>
        }/>
        <Route path="/itineraries" element={
          // <TouristItinerariesView />
          <ItineraryView baseUrl="http://localhost:3000/api/tourist" role="tourist" />
        }/>
        <Route path="/museums" element={
          // <MuseumsAndHistoricalPlaceCard />
          <MuseumsAndHistoricalPlacesView baseUrl="http://localhost:3000/api/tourist" role="tourist" />
        }/>
    </Routes>       
    </div>
  );
}

export default TouristDashboard;