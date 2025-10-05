import React from "react"
import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"

import Dashboard from "./pages/Dashboard"
import EditResume from "./components/EditResume"
import { Toaster } from "react-hot-toast"
import UserProvider from "./context/userContext"

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume/:id" element={<EditResume />} /> {/* ✅ FIXED */}
      </Routes>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  )
}

export default App
