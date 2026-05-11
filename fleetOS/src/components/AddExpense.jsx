import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Fuel, Landmark, User, Wrench, Save, 
  TrendingUpIcon
} from 'lucide-react';
import api from '../service/api'; // Your Axios instance
import Sidebar from './Sidebar';

const AddExpense = () => {
  const navigate = useNavigate();
  const {tripId} = useParams();

  const [formData, setFormData] = useState({
    tripId: tripId,
    expenseType: 'DIESEL', // Matches your backend enum
    amount: '',
    note: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });

  const categories = [
    { id: 'DIESEL', label: 'Diesel', icon: <Fuel size={24} /> },
    { id: 'TOLL', label: 'Toll', icon: <Landmark size={24} /> },
    { id: 'DRIVER', label: 'Driver', icon: <User size={24} /> },
    { id: 'OTHER', label: 'Other', icon: <Wrench size={24} /> },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Assuming your backend endpoint is POST /api/v1/trip/{id}/expense
      await api.post(`/expense/`, formData);
      navigate(`/trip/${tripId}`); // Go back to trip details
    } catch (err) {
      console.error("Save failed:", err);
      alert("Kharcha save nahi ho paya!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] md:bg-[#f1f5f9] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header - Dark on Mobile, Light on Desktop */}
        <header className="p-6 text-white md:text-gray-800 bg-[#0f172a] md:bg-transparent">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 text-sm mb-2 hover:text-white md:hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-1" /> Trip Detail
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Kharcha Add Karo</h1>
          <p className="text-gray-400 text-xs mt-1 md:text-gray-500 uppercase tracking-wider">
            Trip #{tripId} | Route ki Jankari
          </p>
        </header>

        {/* Form Container */}
        <div className="flex-1 bg-white rounded-t-[40px] md:rounded-3xl md:m-8 md:shadow-xl p-8 max-w-2xl mx-auto w-full">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* KHARCHE KI KISM (Category Selection) */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Kharche ki Kism
              </label>
              <div className="grid grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, expenseType: cat.id })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      formData.expenseType === cat.id
                        ? 'bg-[#1e293b] border-[#1e293b] text-white'
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {cat.icon}
                    <span className="text-[10px] font-bold mt-2 uppercase">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* RAQAM (Amount) */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Raqam (Amount)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* NOTE */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Note (Kahan kharcha hua)
              </label>
              <input
                type="text"
                placeholder="Ex: NH-176 Indian Oil"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* TARIKH (Date) */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Tarikh
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 font-medium outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#1e293b] hover:bg-black text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
            >
              <Save size={20} /> Kharcha Save Karo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;