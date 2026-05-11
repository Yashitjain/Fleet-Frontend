import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  User, 
  Fuel, 
  Wrench, 
  Plus, 
  CheckCircle2, 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  History,
  Receipt
} from 'lucide-react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect} from 'react';

import api from '../service/api'; // Import the configured axios instance

const TripDetails = () => {
  const { tripId } = useParams();
  // Mock Data - In real app, fetch this via api.get(`/trip/${id}`)
  const [trip, setTrip] = useState({});
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {

    const fetchTripDetails = async (id) => {
        try{
            const response = await api.get(`/trip/${tripId}`);
            setTrip(response.data);
            setExpenses(response.data.expenseList || []);
            console.log(response.data);
        }catch(err){
            console.error("Failed to fetch trip details:", err.response?.data || err.message);
        }
    }

    fetchTripDetails(tripId);
  },[]
)

  

  const kharche = expenses.map(exp => {
  // 1. Define UI properties based on expenseType
    let config = {
        label: 'Other',
        icon: <Receipt className="text-gray-400" />
    };

    if (exp.expenseType === 'DIESEL') {
        config = { label: 'Fuel', icon: <Fuel className="text-red-500" /> };
    } else if (exp.expenseType === 'DRIVER') {
        config = { label: 'Driver', icon: <User className="text-purple-500" /> };
    } else if (exp.expenseType === 'OTHER' || exp.expenseType === 'REPAIR') {
        config = { label: 'Repair', icon: <Wrench className="text-pink-400" /> };
    }

    // 2. Format the Date (from '2026-05-11' to '11 May')
    const dateObj = new Date(exp.date);
    const formattedDate = dateObj.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
    });

    // 3. Return the mapped object
    return {
        id: exp.id,
        type: config.label,
        note: exp.note,
        date: formattedDate,
        amount: exp.amount,
        icon: config.icon
    };
    });

    const NavItem = ({ icon, label, active, to }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => to && navigate(to)} // Navigate if "to" prop exists
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900' 
          : 'hover:bg-white/5 text-gray-400 hover:text-white'
      }`}
    >
      {icon} 
      <span className="font-medium">{label}</span>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-[#1e293b] flex-col text-gray-400 p-4">
        <h1 className="text-2xl font-black text-white mb-8 px-2">FLEET<span className="text-orange-500">OS</span></h1>
        <nav className="space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/dashboard" />
          <NavItem icon={<Truck size={20} />} label="Trips" active />
          <NavItem icon={<History size={20} />} label="Vehicles" />
          <NavItem icon={<Users size={20} />} label="Drivers" />
          <NavItem icon={<UserSquare2 size={20} />} label="Owners" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        
        {/* Header Area */}
        <header className="bg-white md:bg-transparent p-4 md:p-8 flex justify-between items-center">
          <div>
            <button className="flex items-center text-gray-500 text-sm mb-1 hover:text-gray-800 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Wapas / #{trip.id}
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">{trip.source} → {trip.destination}</h2>
              <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full uppercase">{trip.status}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm md:hidden">
              <span className="flex items-center gap-1"><Truck size={14}/> {trip.truck}</span>
              <span className="flex items-center gap-1"><User size={14}/> {trip.driver}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50">+ Kharcha Add Karo</button>
            <button className="bg-[#0f172a] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-black">
              <CheckCircle2 size={18} /> Trip Khatam Karo
            </button>
          </div>
        </header>

        <div className="px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* HISAAB KITAAB CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#1e293b] text-white p-4 text-xs font-bold uppercase tracking-widest">Hisaab Kitaab</div>
              <div className="p-6 space-y-4">
                <HisaabRow label="Maal ka Kiraya" amount={trip.freightPrice} />
                <HisaabRow label="Truck Bhada" amount={-trip.ownerRate} isNegative />
                <HisaabRow label="Kul Kharcha" amount={-trip.totalExpense} isNegative />
                <hr className="border-dashed" />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-800">Net Faida</span>
                  <span className="text-3xl font-black text-green-600">₹{trip.profit ? trip.profit.toLocaleString('en-IN') : 0}</span>
                </div>
              </div>
            </div>

            {/* TRIP INFO (Desktop Only View) */}
            <div className="hidden md:block bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Trip Info</h3>
              <div className="space-y-3">
                <InfoRow label="Truck" value={trip.vehicleNumber} />
                <InfoRow label="Driver" value={trip.driverName} />
                <InfoRow label="Start Date" value={trip.startDate} />
                <InfoRow label="End Date" value={trip.endDate} />
              </div>
            </div>
          </div>

          {/* KHARCHE LIST CARD */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <h3 className="font-bold text-gray-900 text-lg">Kharche ki List</h3>
                <button className="bg-[#0f172a] text-white text-xs font-bold px-3 py-2 rounded-md">+ Kharcha</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Note</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {kharche.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center">
                            {item.icon}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{item.note}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{item.date} 2026</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-gray-50 flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase text-sm">Kul Kharcha</span>
                <span className="text-xl font-black text-red-500">₹{trip.totalExpense ? trip.totalExpense.toLocaleString('en-IN') : 0}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE ACTION BUTTONS (Fixed at bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3 z-50">
        <button className="flex-1 bg-white border border-gray-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
          <Plus size={18} /> Kharcha
        </button>
        <button className="flex-[1.5] bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200">
          <CheckCircle2 size={18} /> Trip Khatam
        </button>
      </div>
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900' : 'hover:bg-white/5'}`}>
    {icon} <span className="font-medium">{label}</span>
  </div>
);

const HisaabRow = ({ label, amount, isNegative }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-gray-800'}`}>
      {isNegative ? '-' : ''}₹{Math.abs(amount).toLocaleString('en-IN')}
    </span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="font-bold text-gray-700">{value}</span>
  </div>
);

export default TripDetails;