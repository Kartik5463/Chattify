import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chats from './pages/Chats'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chats" element={<Chats />} />
    </Routes>
  )
}

export default App