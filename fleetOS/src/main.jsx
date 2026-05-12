import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BowArrow } from 'lucide-react'
import FleetOSLogin from './components/LoginPage.jsx'
import Dashboard from './components/DashBoard.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TripDetails from './components/TripDetails.jsx'
import AddExpense from './components/AddExpense.jsx'
import AllTrips from './components/AllTrips.jsx'
import AddTrip from './components/AddTrip.jsx'
import VehicleList from './components/AllVehicles.jsx'
import DriverList from './components/AllDrivers.jsx'
import OwnerList from './components/AllOwners.jsx'
import AddVehicle from './components/AddVehicle.jsx'
import AddDriver from './components/AddDriver.jsx'
import AddOwner from './components/AddOwner.jsx'
import OwnerBalanceSheet from './components/OwnerBalanceSheet.jsx'
import AddPayment from './components/AddPayment.jsx'
createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<FleetOSLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/trip/:tripId" element = {<TripDetails  />} />
        <Route path="/trip/:tripId/add-expense" element = {<AddExpense  />} />
        <Route path="/allTrips" element = {<AllTrips  />} />
        <Route path="/create-trip" element = {<AddTrip  />} />
        <Route path="/allVehicles" element = {<VehicleList  />} />
        <Route path="/allDrivers" element = {<DriverList  />} />
        <Route path="/allOwners" element = {<OwnerList  />} />
        <Route path="/addVehicle" element = {<AddVehicle  />} />
        <Route path="/addDriver" element = {<AddDriver  />} />
        <Route path="/addOwner" element = {<AddOwner  />} />
        <Route path="/owner/balance-sheet/:ownerId" element = {<OwnerBalanceSheet  />} />
        <Route path="/owner/:ownerId/add-payment" element = {<AddPayment  />} />
      </Routes>
    </BrowserRouter>
)

