import React from 'react'
import './css/index.css'
import { Route, Routes } from 'react-router-dom'

//import AdminDashboard from './pages/admin/AdminDashboard'
//import Tourism from './pages/TourismGovernorDashboard'
import SellerDashboard from './Pages/seller/SellerDashboard'
// import AdminDashboard from './pages/admin/AdminDashboard'
import Tourism from './pages/TourismGovernorDashboard'
import Signup from './pages/LoginSignup/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import TourGuideDashboard from './pages/tourGuide/TourGuideDashboard'


import AdvertiserDashboard from './Pages/Advertiser/AdvertiserDashboard'



function App() {

  return (
    <>
      <div>
         {/* <SellerDashboard /> */}

          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path='/tourGuide/*' element={<TourGuideDashboard />} />
            <Route path='/tourGuide' element={<h1>Tour Guide Dashboard</h1>} />
            <Route path='/advertiser/*' element={<AdvertiserDashboard />} />
          </Routes>
      </div>
    </>
  )
}

export default App;
