import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BowArrow } from 'lucide-react'
import FleetOSLogin from './components/LoginPage.jsx'
import Dashboard from './components/DashBoard.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<FleetOSLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
)

