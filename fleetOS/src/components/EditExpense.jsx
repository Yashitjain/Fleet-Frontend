import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  IndianRupee, 
  Calendar, 
  Notebook, 
  Fuel, 
  User, 
  Wrench, 
  Receipt,
  Check,
  Trash2
} from 'lucide-react';
import api from '../service/api';
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter';

const EditExpense = () => {
  const { tripId, expenseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    expenseType: 'OTHER',
    note: '',
    expenseId: '',
  });

  // 1. Fetch existing expense data on load
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await api.get(`/expense/${expenseId}`);
        const data = response.data;
        setFormData({
          amount: data.amount,
          date: data.date,
          expenseType: data.expenseType,
          note: data.note,
          expenseId: data.expenseId,
        });
      } catch (err) {
        console.error("Failed to load expense:", err);
        alert("Expense data load nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [tripId, expenseId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/expense/trip/${expenseId}`, formData);
      navigate(`/trip/${tripId}`);
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Kya aap ye kharcha delete karna chahte hain?")) {
      try {
        await api.delete(`/expense/${expenseId}`);
        navigate(`/trip/${tripId}`);
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Loading Expense Details...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col pb-24 md:pb-0">
        {/* Header */}
        <header className="bg-[#0f172a] text-white p-6 md:p-10 pb-24">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 text-xs hover:text-white transition-colors">
                <ArrowLeft size={14} className="mr-1" /> Wapas Jayein
              </button>
              <button 
                onClick={() => handleDelete(expenseId)}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
            <h1 className="text-3xl font-black">Kharcha Edit Karein</h1>
            <p className="text-gray-400 mt-2 italic text-sm">Trip ID: #{tripId}</p>
          </div>
        </header>

        {/* Form Container */}
        <main className="max-w-2xl w-full mx-auto px-4 -mt-16 z-10">
          <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 md:p-10 space-y-8">
            
            {/* Amount Field */}
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
              <label className="text-[10px] font-black text-blue-600 uppercase mb-2 block tracking-widest">Kharche ki Amount</label>
              <div className="flex items-center justify-center text-4xl font-black text-blue-700">
                <span className="mr-1">₹</span>
                <input 
                  type="number" required
                  className="bg-transparent border-none focus:ring-0 w-40 text-center"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            {/* Type Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kharche ka Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <TypeBtn 
                  active={formData.expenseType === 'DIESEL'} 
                  onClick={() => setFormData({...formData, expenseType: 'DIESEL'})}
                  icon={<Fuel size={16}/>} label="Diesel" 
                />
                <TypeBtn 
                  active={formData.expenseType === 'DRIVER'} 
                  onClick={() => setFormData({...formData, expenseType: 'DRIVER'})}
                  icon={<User size={16}/>} label="Driver" 
                />
                <TypeBtn 
                  active={formData.expenseType === 'REPAIR'} 
                  onClick={() => setFormData({...formData, expenseType: 'REPAIR'})}
                  icon={<Wrench size={16}/>} label="Repair" 
                />
                <TypeBtn 
                  active={formData.expenseType === 'OTHER'} 
                  onClick={() => setFormData({...formData, expenseType: 'OTHER'})}
                  icon={<Receipt size={16}/>} label="Other" 
                />
              </div>
            </div>

            {/* Date and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Note / Remark</label>
                <div className="relative">
                  <Notebook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" placeholder="e.g. Tank full karwaya"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full py-5 bg-[#0f172a] text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {saving ? "Updating..." : <><Check size={20}/> Save Changes</>}
            </button>
          </form>
        </main>

        <MobileFooter />
      </div>
    </div>
  );
};

// Helper Component for the Type Buttons
const TypeBtn = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all ${
      active 
      ? 'bg-[#0f172a] border-[#0f172a] text-white' 
      : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
    }`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default EditExpense;