import { useState } from 'react'
import TestPage from './pages/TestPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TestPage />
    </>
  )
}

export default App
