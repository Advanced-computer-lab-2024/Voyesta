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
import AccountDeleted from './pages/AccountDeleted'


function App() {

  return (
    <>
      <div>
         {/* <SellerDashboard /> */}

          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/tourGuide' element={<h1>Tour Guide Dashboard</h1>} />
            <Route path="/seller/*" element={<SellerDashboard />} />
            <Route path="/account-deleted" element={<AccountDeleted />} />
          </Routes>
      </div>
    </>
  )
}

export default App
