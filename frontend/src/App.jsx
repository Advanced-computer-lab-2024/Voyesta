import React from 'react'
import './css/index.css'
import AdminDashboard from './pages/admin/adminDashboard'

// get hold of user and render the correct dashboard

function App() {

  return (
    <div className="h-screen">
      <AdminDashboard />
    </div>
  )
}

export default App
