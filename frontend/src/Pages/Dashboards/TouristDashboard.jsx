import React from "react";
import { Routes, Route } from "react-router-dom";
import TouristProfile from '../../components/touristComponents/TouristProfile'
import NavBar from "../../components/NavBar";

import ProductsView from "../../newComponents/ProuductView";
import ActivitiesView from '../../newComponents/ActivitiesView';
import ItineraryView from "../../newComponents/ItineraryView";
import MuseumsAndHistoricalPlacesView from "../../newComponents/MuseumsAndHistoricalPlacesView";
import BookingsPage from "../../newComponents/BookingPage";
import CombinedComplaints from "../../newComponents/CombinedComplaints";
import TouristPurchasesView from "../../newComponents/TouristPurchaseView";
import BookFlight from "../../newComponents/BookFlight";
import BookHotel from "../../newComponents/BookHotel";

const navLinks = [
  { path: "/tourist/", label: "Home" },
  { path: "/tourist/profile", label: "Profile" },
  { path: "/tourist/products", label: "Products" },
  { path: "/tourist/activities", label: "Activities" },
  { path: "/tourist/itineraries", label: "Itineraries" },
  { path: "/tourist/complaints", label: "Complaints" },
  { path: "/tourist/museums", label: "Museums" },
  { path: "/tourist/bookings", label: "Bookings" },
  { path: "/tourist/purchases", label: "Purchases" }
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
        <Route path="/complaints" element={
          // <TouristComplaintsView />
          <CombinedComplaints baseUrl="http://localhost:3000/api/tourist" role="tourist" />
        }/>
        <Route path="/museums" element={
          // <MuseumsAndHistoricalPlaceCard />
          <MuseumsAndHistoricalPlacesView baseUrl="http://localhost:3000/api/tourist" role="tourist" />
        }/>
       {/* <Route path="/bookings" element={<BookingDropDownMenu />}
        />  */}
       <Route path="/flight" element={<BookFlight baseUrl="http://localhost:3000/api/tourist" />} />
         <Route path="/hotel" element={<BookHotel baseUrl="http://localhost:3000/api/tourist" />} />
          <Route path="/transport" element={<BookingsPage baseUrl="http://localhost:3000/api/tourist" />} />
          <Route path="/bookings" element={<BookingsPage baseUrl="http://localhost:3000/api/tourist" />} />
         <Route path="/purchases" element={
          <TouristPurchasesView />
        }/>
    </Routes>       
    </div>
  );
}

export default TouristDashboard;