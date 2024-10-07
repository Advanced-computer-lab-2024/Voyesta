import React from 'react'
import './css/index.css'
import AdminDashboard from './pages/admin/AdminDashboard'
import TourGuideDashboard from './pages/tourGuide/TourGuideDashboard'
import Tourism from './pages/TourGuideDashboard'
import Dashboard from './pages/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/LoginSignup/Signup'



function App() {

  return (
    <>
      <div>
          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            {/* <Route path='/tourGuide' element={<h1>Tour Guide Dashboard</h1>} /> */}
          </Routes>
      </div>
    </>
  )
}

export default App
