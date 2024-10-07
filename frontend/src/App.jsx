import React from 'react'
import './css/index.css'
import { Route, Routes } from 'react-router-dom'

import Signup from './pages/LoginSignup/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import TourGuideDashboard from './pages/tourGuide/TourGuideDashboard'





function App() {

  return (
    <>
      <div>
          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path='/tourGuide/*' element={<TourGuideDashboard />} />
          </Routes>
      </div>
    </>
  )
}

export default App
