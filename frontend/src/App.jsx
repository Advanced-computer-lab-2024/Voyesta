import React from 'react'
import './css/index.css'
//import AdminDashboard from './pages/admin/AdminDashboard'
//import Tourism from './pages/TourismGovernorDashboard'
import SellerDashboard from './Pages/seller/SellerDashboard'
// import AdminDashboard from './pages/admin/AdminDashboard'
import Tourism from './pages/TourismGovernorDashboard'
import Signup from './pages/LoginSignup/Signup'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'



function App() {

  return (
    <>
      <div>
         {/* <SellerDashboard /> */}

          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/tourGuide' element={<h1>Tour Guide Dashboard</h1>} />
            <Route 
            path="/seller/*" 
            element={
              <>
                <h1>Seller Dashboard</h1>
                <SellerDashboard />
              </>
            } 
          />
          </Routes>
      </div>
    </>
  )
}

export default App
