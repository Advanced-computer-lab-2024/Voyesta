import { useState } from 'react'
import tourismGovernerDashboard from './Pages.tourismGovernerDashboard'

function App() {
  const [count, setCount] = useState(0)

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
