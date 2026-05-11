import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Truck, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Plus, 
  ArrowUpRight, 
//   Sidebar
} from 'lucide-react';
import api from '../service/api';
import Sidebar from './Sidebar';

const AllTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const response = await api.get('/trip/'); // Assuming your list endpoint
        setTrips(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Trips load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTrips();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-600';
      case 'COMPLETED': return 'bg-green-100 text-green-600';
      case 'CANCELLED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      {/* Sidebar would go here */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER SECTION */}
        <header className="p-4 md:p-8 bg-white border-b border-gray-100 md:bg-transparent md:border-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#0f172a]">Saare Trips</h1>
              <p className="text-gray-500 text-sm">Apne poore fleet ki history dekhein</p>
            </div>
            <button 
              onClick={() => navigate('/add-trip')}
              className="bg-[#0f172a] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Plus size={20} /> Naya Trip Shuru Karo
            </button>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Gadi number ya destination se search karein..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50">
              <Filter size={18} /> Filter
            </button>
          </div>
        </header>

        <div className="px-4 md:px-8 pb-10">
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Gadi / Driver</th>
                  <th className="px-6 py-4">Tarik</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Freight</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        {trip.source} <ArrowUpRight size={14} className="text-gray-400" /> {trip.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-700">{trip.vehicleNumber}</div>
                      <div className="text-xs text-gray-400">{trip.driverName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar size={14} /> {trip.date || '12 May 2026'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{trip.freightPrice?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/trip/${trip.id}`)}
                        className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-[#0f172a] group-hover:text-white transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                  <p className="font-black text-gray-900">₹{trip.freightPrice?.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-1 bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-bold text-gray-800">{trip.source}</div>
                    <div className="text-sm font-bold text-gray-800">{trip.destination}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-lg"><Truck size={14} className="text-gray-500"/></div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-800 uppercase">{trip.vehicleNumber}</p>
                      <p className="text-gray-400">{trip.driverName}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && trips.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 mt-6">
              <Truck size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">Abhi koi trips nahi hain.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTrips;