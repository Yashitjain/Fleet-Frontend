import React, { useState, useEffect } from 'react';
import { Search, Plus, Truck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';
import Sidebar from './Sidebar';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vehicle/') // Update with your actual endpoint
      .then(res => setVehicles(res.data))
      .catch(err => console.error("Trucks load failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] md:bg-[#f1f5f9] pb-20 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1">
        <header className="p-6 flex justify-between items-center text-white md:text-gray-900">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 text-sm mb-1 hover:text-gray-800 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Wapas
        </button>
        <h1 className="text-2xl font-black flex items-center gap-2">Trucks 🚛</h1>
        <button className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg" onClick={() => navigate('/addVehicle')}>+ Add</button>
      </header>

      <div className="flex-1 bg-white rounded-t-[40px] p-6 min-h-[80vh]">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Truck number se dhundo..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
        </div>

        {loading ? <div className="text-center py-10 text-gray-400">Loading Trucks...</div> : 
          <div className="space-y-4">
            {vehicles.map(v => (
              <div key={v.id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="bg-blue-50 p-3 rounded-xl"><Truck size={20} className="text-blue-500" /></div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm uppercase">{v.vehicleNumber}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Owner ID: {v.ownerId}</p>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
    </div>
  );
};

export default VehicleList;