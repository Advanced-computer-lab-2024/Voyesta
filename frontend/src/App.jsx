import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './css/index.css'
// import 'flowbite/dist/flowbite.css';

// Importing the login & signup components
import Signup from './Pages/LoginSignup/Signup';
import Login from './Pages/LoginSignup/Login';
import ForgotPassword from './Pages/LoginSignup/ForgotPassword';
import ResetPassword from './Pages/LoginSignup/ResetPassword';

//importing the main dashboard component
import Dashboard from './pages/Dashboard'

// Importing the persona dashboard components
import AdminDashboard from './Pages/Dashboards/AdminDashboard';
import TourGuideDashboard from './pages/Dashboards/TourGuideDashboard';
import AdvertiserDashboard from './pages/Dashboards/AdvertiserDashboard';
import SellerDashboard from './pages/Dashboards/SellerDashboard';
import TourismGovernorDashboard from './pages/Dashboards/TourismGovernorDashboard';
import TouristDashboard from './Pages/Dashboards/TouristDashboard';
import MapView from './newComponents/MapView';
import ActivitiesView from './newComponents/ActivitiesView';
import ActivityDetail from './newComponents/ActivityDetail';
import MuseumHistoricalPlaceDetail from './newComponents/MuseumHistoricalPlaceDetail';
import ItineraryDetail from './newComponents/ItineraryDetail'; // Import the new component
import cart from './newComponents/cart';
import Wishlist from './newComponents/Wishlist'; // Import the Wishlist component
function App() {

  return (
          <Routes>
            <Route exact path="/*" element={<Dashboard />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route exact path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path='/tourGuide/*' element={<TourGuideDashboard />} />
            <Route path='/advertiser/*' element={<AdvertiserDashboard />} />
            <Route path='/seller/*' element={< SellerDashboard />} />
            <Route path='/tourismGovernor/*' element={< TourismGovernorDashboard />} />
            <Route path='/tourist/*' element={< TouristDashboard />} />
            <Route path='/guest/*' element={< Dashboard />} />
            <Route path='/map' element={<MapView lat="30.0648" lng="31.5102" />} />
            <Route path='/activities' element={<ActivitiesView />} />
            <Route path='/activity/:id' element={<ActivityDetail />} />
            <Route path='/museumHistoricalPlace/:id' element={<MuseumHistoricalPlaceDetail />} />
            <Route path='/itinerary/:id' element={<ItineraryDetail />} /> {/* New route for itinerary detail */}
            <Route path="/cart" element={cart} />
            <Route path="/wishlist" element={Wishlist} />
          </Routes>
  );
}
document.body.classList.add('dark');
export default App;
