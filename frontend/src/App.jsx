import React from 'react'
import './css/index.css'
import AdminDashboard from './pages/admin/AdminDashboard'

// get hold of user and render the correct dashboard
import tourismGovernerDashboard from './Pages.tourismGovernerDashboard'

function App() {

  return (
    <>
      <div>
          <tourismGovernerDashboard />
          Home
      </div>
    </>
  )
}

export default App
