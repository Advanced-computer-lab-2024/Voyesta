import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './css/index.css'


//importing the login & signup components
import Signup from './Pages/LoginSignup/Signup'
import Login from './Pages/LoginSignup/Login'

//importing the main dashboard component
import Dashboard from './pages/Dashboard'

// Importing the persona dashboard components
import AdminDashboard from './Pages/Dashboards/AdminDashboard'
import TourGuideDashboard from './Pages/Dashboards/TourGuideDashboard'
import AdvertiserDashboard from './Pages/Dashboards/AdvertiserDashboard'
import SellerDashboard from './Pages/Dashboards/SellerDashboard'
import TourismGovernorDashboard from './Pages/Dashboards/TourismGovernorDashboard'
import TouristDashboard from './Pages/Dashboards/TouristDashboard';
import MapView from './newComponents/MapView'






function App() {

  return (
    <>
      <div>
         {/* <SellerDashboard /> */}

          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route exact path="/login" element={<Login />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path='/tourGuide/*' element={<TourGuideDashboard />} />
            <Route path='/advertiser/*' element={<AdvertiserDashboard />} />
            <Route path='/seller/*' element={< SellerDashboard />} />
            <Route path='/tourismGovernor/*' element={< TourismGovernorDashboard />} />
            <Route path='/tourist/*' element={< TouristDashboard />} />
            <Route path='/map' element={<MapView lat="30.0648" lng="31.5102" />} />
          </Routes>
      </div>
    </>
  )
}

export default App;
