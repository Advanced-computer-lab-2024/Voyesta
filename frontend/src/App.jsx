import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './css/index.css';

// Importing the login & signup components
import Signup from './Pages/LoginSignup/Signup';
import Login from './Pages/LoginSignup/Login';

// Importing the main dashboard component
import Dashboard from './pages/Dashboard';

// Importing the persona dashboard components
import AdminDashboard from './Pages/Dashboards/AdminDashboard';
import TourGuideDashboard from './pages/Dashboards/TourGuideDashboard';
import AdvertiserDashboard from './pages/Dashboards/AdvertiserDashboard';
import SellerDashboard from './pages/Dashboards/SellerDashboard';
import TourismGovernorDashboard from './pages/Dashboards/TourismGovernorDashboard';
import TouristDashboard from './pages/Dashboards/TouristDashboard';
import MapView from './newComponents/MapView';
import ActivitiesView from './newComponents/ActivitiesView';
import ActivityDetail from './newComponents/ActivityDetail';
import MuseumHistoricalPlaceDetail from './newComponents/MuseumHistoricalPlaceDetail';
import ItineraryDetail from './newComponents/ItineraryDetail'; // Import the new component

function App() {
  return (
    <Routes>

      <Route exact path="/*" element={<Dashboard />} />
      <Route exact path="/signup" element={<Signup />} />
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
    </Routes>
  );
}

export default App;
