import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  UserSquare2, 
  FileText, 
  Settings, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Package,
  RotateCcw,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios'
import api from '../service/api'; // Import the configured axios instance

const Dashboard = () => {
    const navigate = useNavigate();
    const [isValidated, setIsValidated] = useState(false); // New state
    const [dashboardData, setDashboardData] = useState({}); // State to hold dashboard data
    const [tripDetails, setTripDetails] = useState([]); // State for selected trip details
  

useEffect(() => {

  const verifyToken = async () => {
    const raw = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.substring('token='.length);

    if (!raw) {
      return;
    }

    const formattedToken = decodeURIComponent(raw);
    console.log("Sending token:", formattedToken); // ✅ log before the request

    try {
      await api.get('/auth/verify', {
        headers: { 'Authorization': formattedToken }
      });
    setIsValidated(true); // ✅ set validated on success
    } catch (err) {
      console.error("Verify failed:", err.response?.status, err.response?.data);
    navigate('/login'); // ✅ navigate on failure
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/balance');
      const responsedata = response.data;
      setDashboardData(responsedata); // ✅ update state with fetched data
      console.log("Dashboard data:", response.data); // ✅ log the fetched data
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err.response?.data || err.message);
    }
  };

  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/trip/`);
      console.log("Trip details:", response.data);
      setTripDetails(response.data); // Update state with trip details
    } catch (err) {
      console.error("Failed to fetch trip details:", err.response?.data || err.message);
    }
 };

  verifyToken();
  fetchDashboardData();
  fetchTripDetails(); // You can pass a specific tripId if needed   

}, []);

    // If not validated yet, show nothing or a spinner
    if (!isValidated) return <div className="bg-[#0f172a] min-h-screen text-white p-10">Verifying session...</div>;

    const stats = [
    { label: 'TOTAL TRIPS', value: dashboardData.totalTrips || 0, icon: <Truck className="text-gray-400" />, color: 'text-gray-800' },
    { label: 'ACTIVE TRIPS', value: dashboardData.activeTrips || 0, icon: <RotateCcw className="text-blue-500" />, color: 'text-gray-800' },
    { label: 'TOTAL FREIGHT', value: dashboardData.totalFreightEarned || 0, icon: <TrendingUp className="text-orange-500" />, color: 'text-gray-800' },
    { label: 'NET PROFIT', value: dashboardData.profit || 0, icon: <Package className="text-green-500" />, color: 'text-green-600' },
  ];

    const recentTrips = Array.isArray(tripDetails) 
        ? tripDetails.map(trip => ({
            route: `${trip.source} → ${trip.destination}`,
            truck: trip.vehicleNumber,
            driver: trip.driverName,
            freight: trip.freightPrice,
            profit: trip.profit,
            status: trip.status === 'ACTIVE' ? 'Active' : 'Completed',
            }))
        : []; // Fallback to empty array if data isn't ready

  return (
    
  
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] flex-col text-gray-400">
        <div className="p-6">
          <h1 className="text-2xl font-black text-white tracking-tight">
            FLEET<span className="text-orange-500">OS</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Truck size={20}/>} label="Trips" />
          <NavItem icon={<Truck size={20} className="rotate-180"/>} label="Vehicles" />
          <NavItem icon={<UserSquare2 size={20}/>} label="Drivers" />
          <NavItem icon={<Users size={20}/>} label="Owners" />
          <NavItem icon={<FileText size={20}/>} label="Reports" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        
        {/* HEADER */}
        <header className="bg-[#0f172a] md:bg-white p-6 md:px-8 md:py-4 flex justify-between items-center">
          <div className="text-white md:text-[#0f172a]">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <span className="md:hidden">Namaste, Shri Ram 🙏</span>
              <span className="hidden md:block text-gray-800">Dashboard</span>
            </h2>
            <p className="text-sm text-gray-400 md:hidden">May 2026 ka overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all">
              <Plus size={18} /> Nayi Trip
            </button>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20">
              SR
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
          
          {/* METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[120px] md:min-h-[140px]">
                <div className="flex flex-col gap-1">
                  <div className="p-1 rounded-md mb-1">{stat.icon}</div>
                  <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-wider uppercase">{stat.label}</span>
                </div>
                <span className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* RECENT TRIPS SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">Recent Trips</h3>
              <button className="text-blue-600 text-sm font-semibold hover:underline">Sab dekho</button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Truck</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Freight</th>
                    <th className="px-6 py-4">Profit</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTrips.map((trip, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800 text-sm">{trip.route}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{trip.truck}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{trip.driver}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{trip.freight}</td>
                      <td className={`px-6 py-4 font-bold ${trip.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>{trip.profit}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${trip.status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="bg-[#0f172a] text-white px-4 py-1.5 rounded-lg text-xs font-bold">Dekho</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-gray-100">
              {recentTrips.map((trip, idx) => (
                <div key={idx} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{trip.route}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                        <Truck size={12} /> {trip.truck} | <Users size={12} /> {trip.driver}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${trip.status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-400">Freight: {trip.freight}</div>
                    <div className={`text-lg font-black ${trip.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {trip.profit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 px-2 shadow-lg z-50">
        <MobileTab icon={<Home size={20}/>} label="Home" active />
        <MobileTab icon={<Truck size={20}/>} label="Trips" />
        <MobileTab icon={<Users size={20}/>} label="Owners" />
        <MobileTab icon={<UserSquare2 size={20}/>} label="Profile" />
      </div>
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white/10 text-white border-l-4 border-orange-500 rounded-l-none' : 'hover:bg-white/5'}`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const MobileTab = ({ icon, label, active = false }) => (
  <div className={`flex flex-col items-center gap-1 ${active ? 'text-[#0f172a]' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </div>
);

export default Dashboard;