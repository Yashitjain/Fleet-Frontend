import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Calendar, Check, Notebook } from 'lucide-react';
import api from '../service/api';
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter';

const AddPayment = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'CASH', // Matches your Method Enum
    note: '',
    ownerId: ownerId
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/transactions/', formData);
      navigate(`/owner/balance-sheet/${ownerId}`);
    } catch (err) {
      alert("Payment save nahi hui. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        <header className="bg-[#0f172a] text-white p-6 md:p-10 pb-24">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 text-xs mb-6 hover:text-white transition-colors">
              <ArrowLeft size={14} className="mr-1" /> Wapas Jayein
            </button>
            <h1 className="text-3xl font-black">Nayi Payment Add Karein</h1>
            <p className="text-gray-400 mt-2">Owner ko di gayi payment yahan record karein.</p>
          </div>
        </header>

        <main className="max-w-3xl w-full mx-auto px-4 md:px-8 -mt-2.2 z-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 space-y-8">
            
            {/* Amount Field */}
            <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-center">
              <label className="text-[10px] font-black text-emerald-600 uppercase mb-4 block tracking-widest">Amount Diya (₹)</label>
              <div className="flex items-center justify-center text-5xl font-black text-emerald-700">
                <span className="mr-2">₹</span>
                <input 
                  type="number" required placeholder="0"
                  className="bg-transparent border-none focus:ring-0 w-full max-w-[200px] text-center"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'].map((m) => (
                <button
                  key={m} type="button"
                  onClick={() => setFormData({...formData, method: m})}
                  className={`py-4 rounded-2xl text-[10px] font-black tracking-tighter transition-all flex flex-col items-center gap-2 border-2 ${
                    formData.method === m ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-gray-50 text-gray-400 border-gray-100'
                  }`}
                >
                  {formData.method === m && <Check size={14} />}
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Date & Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Payment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" required className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Remark / Note</label>
                <div className="relative">
                  <Notebook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" placeholder="e.g. Fuel advance"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-[#0f172a] text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Confirm Payment Record"}
            </button>
          </form>
        </main>
        <MobileFooter />
      </div>
    </div>
  );
};

export default AddPayment;