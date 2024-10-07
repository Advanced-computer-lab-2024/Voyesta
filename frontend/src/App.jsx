import React from 'react'
import './css/index.css'
import AdminDashboard from './pages/admin/AdminDashboard'
import TourGuideDashboard from './pages/tourGuide/TourGuideDashboard'
import Tourism from './pages/TourGuideDashboard'




function App() {

  return (
    <>
      <div>
          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/tourGuide' element={<h1>Tour Guide Dashboard</h1>} />
          </Routes>
      </div>
    </>
  )
}

export default App
