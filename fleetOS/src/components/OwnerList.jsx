import React, { useState, useEffect } from 'react';
import { Search, Plus, Crown, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';
import Sidebar from './Sidebar';

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/owner/')
      .then(res => setOwners(res.data))
      .catch(err => console.error("Owners load failed"))
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
        <h1 className="text-2xl font-black flex items-center gap-2">Truck Maalik 👥</h1>
        <button className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold">+ Add</button>
      </header>

      <div className="flex-1 bg-white rounded-t-[40px] p-6 min-h-[80vh]">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Maalik ka naam dhundo..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
        </div>

        {loading ? <div className="text-center py-10 text-gray-400">Loading Owners...</div> :
          <div className="space-y-4">
            {owners.map(o => (
              <div key={o.ownerId} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><Crown size={20} /></div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-sm">{o.name}</h3>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    {o.vehicleNumbers?.length || 0} Trucks | 
                    <span className={`ml-1 ${o.amountToReceive > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {o.amountToReceive > 0 ? `Baaki: ₹${o.amountToReceive.toLocaleString('en-IN')}` : 'Settled ✓'}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-2 rounded-xl active:scale-95 transition-all">
                  Balance <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        }
        </div>
    </div>
    </div>
  );
};

export default OwnerList;