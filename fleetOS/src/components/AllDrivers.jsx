import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';
import Sidebar from './Sidebar';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/driver/')
      .then(res => setDrivers(res.data))
      .catch(err => console.error("Drivers load failed"))
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
        <h1 className="text-2xl font-black flex items-center gap-2">Drivers 👤</h1>
        <button className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold" onClick = {() => navigate('/addDriver')}>+ Add</button>
      </header>

      <div className="flex-1 bg-white rounded-t-[40px] p-6 min-h-[80vh]">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Driver ka naam dhundo..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
        </div>

        {loading ? <div className="text-center py-10 text-gray-400">Loading Drivers...</div> :
          <div className="space-y-4">
            {drivers.map(d => (
              <div key={d.driverId} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="bg-purple-50 p-3 rounded-xl"><User size={20} className="text-purple-500" /></div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-sm">{d.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                    <Phone size={10} /> {d.phone}
                  </p>
                </div>
                {/* <span className="text-[9px] bg-gray-100 px-2 py-1 rounded font-black text-gray-500 uppercase">
                   {d.ownerName || 'Freelance'}
                </span> */}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
    </div>
  );
};

export default DriverList;