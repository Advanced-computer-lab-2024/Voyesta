import { useState } from 'react'
import TestPage from './pages/TestPage'
import './css/index.css'
import ActivityCategory from './pages/admin/ActivityCategory'


function App() {

  return (
    <div className='bg-red-50 h-screen p-7' >
        <ActivityCategory />
    </div>
  )
}

export default App
