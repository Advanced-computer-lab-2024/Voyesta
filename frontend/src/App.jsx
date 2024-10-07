import React from 'react'
import './css/index.css'
import { Route, Routes } from 'react-router-dom'


import Signup from './pages/LoginSignup/Signup'
import Dashboard from './pages/Dashboard'

import AdminDashboard from './pages/AdminDashboard'
import TourGuideDashboard from './pages/tourGuide/TourGuideDashboard'
import AdvertiserDashboard from './Pages/Advertiser/AdvertiserDashboard'
import SellerDashboard from './pages/seller/SellerDashboard'
import TourismGovernorDashboard from './pages/TourismGovernorDashboard'
import Login from './pages/LoginSignup/Login'


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
          </Routes>
      </div>
    </>
  )
}

export default App;
