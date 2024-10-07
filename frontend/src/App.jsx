import React from 'react'
import './css/index.css'
// import AdminDashboard from './pages/admin/AdminDashboard'
// import Tourism from './pages/TourismGovernorDashboard'
import Signup from './pages/LoginSignup/Signup'



function App() {

  return (
    <>
      <div>
          <Routes>
            <Route exact path="/" element={<Signup />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            {/* <Route path='/tourGuide/*' element={<TourGuideDashboard />} /> */}
          </Routes>
      </div>
    </>
  )
}

export default App
