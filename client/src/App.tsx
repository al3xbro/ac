import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SetMode from './pages/SetMode'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fan" element={<SetMode mode="fan" />} />
        <Route path="/cool" element={<SetMode mode="cool" />} />
        <Route path="/heat" element={<SetMode mode="heat" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
