import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chats from './pages/Chats'
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <>
    <Toaster
       position="top-right"
  reverseOrder={false}
  gutter={12}
  containerStyle={{
    top: 20,
    right: 20,
  }}
  toastOptions={{
    duration: 3000,
    style: {
      background: "#1f2937",
      color: "#fff",
      padding: "16px 20px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "500",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      border: "1px solid #374151",
    },
    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#ffffff",
      },
      style: {
        background: "#14532d",
        color: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#ffffff",
      },
      style: {
        background: "#7f1d1d",
        color: "#fff",
      },
    },
       }}
       />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chats" element={<Chats />} />
    </Routes>
    </>
  )
}

export default App