import React from 'react'
import './css/index.css'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/admin/adminDashboard'
import ActivityCategory from './pages/admin/ActivityCategory'
import AdminNavbar from './components/adminNavbar'


function App() {

  return (
    <div className="h-screen">
      <AdminDashboard />
    </div>
  )
}

export default App
