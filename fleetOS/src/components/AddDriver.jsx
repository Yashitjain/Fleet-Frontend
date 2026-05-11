import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../service/api';

const AddDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/driver/', formData);
      navigate('/allDrivers');
    } catch (err) { alert("Driver add nahi ho paya!"); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] md:bg-[#f1f5f9] flex flex-col">
      <header className="p-6 text-white md:text-gray-900">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-sm mb-2 flex items-center"><ArrowLeft size={16}/> Wapas</button>
        <h1 className="text-3xl font-black">Naya Driver</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-t-[40px] p-8 space-y-6 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Driver ka Naam</label>
          <input required className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl" placeholder="Ramu Singh" 
            onChange={e => setFormData({...formData, name: e.target.value})} />
          
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
          <input required type="tel" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl" placeholder="98765 43210" 
            onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <button className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-bold text-lg">Driver Save Karo</button>
      </form>
    </div>
  );
};

export default AddDriver;