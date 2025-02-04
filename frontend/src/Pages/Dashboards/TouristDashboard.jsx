import React , {useState,useEffect} from "react";
import { Routes, Route , useLocation, useNavigate } from "react-router-dom";
import TouristProfile from '../../components/touristComponents/TouristProfile'
import NavBar from "../../components/NavBar";

import ProductsView from "../../newComponents/ProuductView";
import ActivitiesView from '../../newComponents/ActivitiesView';
import ItineraryView from "../../newComponents/ItineraryView";
import MuseumsAndHistoricalPlacesView from "../../newComponents/MuseumsAndHistoricalPlacesView";
import BookingsPage from "../../newComponents/BookingPage";
import CombinedComplaints from "../../newComponents/Complaint";
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
import BookmarkedActivities from "../../newComponents/BookmarksActivties";
import Notifications from "../../newComponents/Notifications";
import TouristHome from "../../newComponents/TouristHome";
import FlightBookingConfirmation from "../../newComponents/FlightBookingConfirmation";
import VacationGuide from "../../newComponents/VacGuide";
import InteractiveVacationGuide from "../../newComponents/InteractiveVactionGuide";
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
  { path: "/tourist/notifications", label: "Notifications" },,
  { path: "/tourist/cart", label: "Cart" },
  { path: "/tourist/Wishlist", label: "Wishlist" },
  { path: "/tourist/orders", label: "My Orders" }
];



function TouristDashboard(){
  const Location = useLocation();
  const currentUser = Location.state?.user || "tourist";
  const navigate = useNavigate();

  useEffect(() => {
    const guideInProgress = localStorage.getItem('guideInProgress');
    if (guideInProgress) {
      navigate('/tourist/guide');
    }
  }, []);




  return(
    <div>
      <NavBar role ="tourist" user={currentUser} />
      <Routes>
        <Route exact path="/" element={<TouristHome/>}/>
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
        <Route path="/bookmarks" element={<BookmarkedActivities baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path="/transport" element={
          <BookTransportation baseUrl="http://localhost:3000/api/tourist" role={"tourist"} />
        } />
        <Route path="/bookings" element={<BookingsPage baseUrl="http://localhost:3000/api/tourist" />} />
          <Route path="/hotel-booking-confirmation" element={<HotelBookingConfirmation />} />
          <Route path="/flight-booking-confirmation" element={<FlightBookingConfirmation/>} />

        <Route path="/purchases" element={
          <TouristPurchasesView />
        }/>
        <Route path="/checkout" element={<CheckOutPage  baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path="/payment" element={<PaymentPage baseUrl="http://localhost:3000/api/tourist" />} />
        <Route path= "/orders" element={<OrdersPage baseUrl="http://localhost:3000/api/tourist" />}/>
        <Route path="/notifications" element={<Notifications baseUrl="http://localhost:3000/api/tourist" userType="tourist" />} />
        <Route path="/help" element={<VacationGuide userType="tourist" />} />
        <Route path="/guide" element={<InteractiveVacationGuide userType="tourist" />} />
      </Routes>       
    </div>
  );
}

export default TouristDashboard;
