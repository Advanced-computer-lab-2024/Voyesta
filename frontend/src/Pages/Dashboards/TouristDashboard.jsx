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
import HotelBookingConfirmation from '../../newComponents/HotelBookingConfirmaton';
//import FlightBookingConfirmation from '../../newComponents/FlightBookingConfirmation';
import BookTransportation from "../../newComponents/BookTransportation";
import Cart from "../../newComponents/cart";
import Wishlist from "../../newComponents/Wishlist";
import CheckOutPage from "../../newComponents/CheckOutPage";
import PaymentPage from "../../newComponents/PaymentPage";
import OrdersPage from "../../newComponents/OrdersPage";

const navLinks = [
  { path: "/tourist/", label: "Home" },
  { path: "/tourist/profile", label: "Profile" },
  { path: "/tourist/products", label: "Products" },
  { path: "/tourist/activities", label: "Activities" },
  { path: "/tourist/itineraries", label: "Itineraries" },
  { path: "/tourist/complaints", label: "Complaints" },
  { path: "/tourist/museums", label: "Museums" },
  { path: "/tourist/bookings", label: "Bookings" },
  { path: "/tourist/purchases", label: "Purchases" },
  { path: "/tourist/cart", label: "Cart" },
  { path: "/tourist/Wishlist", label: "Wishlist" },
  { path: "/tourist/orders", label: "My Orders" }
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
          <ActivitiesView baseUrl="http://localhost:3000/api/tourist" role="tourist"/>
        }/>
        <Route path="/itineraries" element={
          <ItineraryView baseUrl="http://localhost:3000/api/tourist" role="tourist" />
        }/>
        <Route path="/complaints" element={
          <CombinedComplaints baseUrl="http://localhost:3000/api/tourist" role="tourist" />
        }/>
        <Route path="/museums" element={
          <MuseumsAndHistoricalPlacesView baseUrl="http://localhost:3000/api/tourist" role="tourist" />
        }/>
       {/*  {/* <Route path="/bookings" element={<BookingDropDownMenu />}
        />  */}
        <Route path="/cart" element={<Cart baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path="/Wishlist" element={<Wishlist baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path="/flight" element={<BookFlight baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path="/hotel" element={<BookHotel baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path="/transport" element={
          <BookTransportation baseUrl="http://localhost:3000/api/tourist" role={"tourist"} />
        } />
        <Route path="/bookings" element={<BookingsPage baseUrl="http://localhost:3000/api/tourist" />} />
          <Route path="/hotel-booking-confirmation" element={<HotelBookingConfirmation />} />
        <Route path="/purchases" element={
          <TouristPurchasesView />
        }/>
        <Route path="/checkout" element={<CheckOutPage  baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path="/payment" element={<PaymentPage baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path= "/orders" element={<OrdersPage baseUrl="http://localhost:3000/api/tourist" />}/>
      </Routes>       
    </div>
  );
}

export default TouristDashboard;
