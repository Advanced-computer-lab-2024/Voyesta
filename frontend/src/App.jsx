import React from 'react'
import './css/index.css'
<<<<<<< HEAD
//import AdminDashboard from './pages/admin/AdminDashboard'
import Tourism from './pages/TourismGovernorDashboard'
import SellerDashboard from './Pages/seller/SellerDashboard'
=======
// import AdminDashboard from './pages/admin/AdminDashboard'
import Tourism from './pages/TourismGovernorDashboard'
import Signup from './pages/LoginSignup/Signup'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

>>>>>>> 7fa2223b6bf91657244f74816ae4e47541a266f3


function App() {

  return (
    <>
      <div>
<<<<<<< HEAD
          <SellerDashboard />

=======
          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/tourGuide' element={<h1>Tour Guide Dashboard</h1>} />
          </Routes>
>>>>>>> 7fa2223b6bf91657244f74816ae4e47541a266f3
      </div>
    </>
  )
}

export default App
