import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, UserPlus } from 'lucide-react';
import api from '../service/api';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    ownerId: ''
  });

  async function loadOwners() {
    const response = await api.get('/owner/');
    setOwners(response.data);
    console.log("Owners loaded for AddVehicle:", response.data);
  }

  useEffect(() => {
    loadOwners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("Submitting vehicle with data:", formData);
      await api.post('/vehicle/', formData);
      navigate('/allVehicles');
    } catch (err) { alert("Vehicle save nahi hua!"); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] md:bg-[#f1f5f9] flex flex-col">
      <header className="p-6 text-white md:text-gray-900">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 text-sm mb-2"><ArrowLeft size={16}/> Wapas</button>
        <h1 className="text-3xl font-black">Nayi Gaadi</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-t-[40px] p-8 space-y-6 max-w-2xl mx-auto w-full">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Truck Number</label>
          <input 
            required 
            placeholder="Ex: DL8CAB7806"
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl font-bold uppercase"
            onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Truck Maalik (Owner)</label>
          <select 
            required
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none appearance-none font-medium"
            value={formData.ownerId}
            onChange={(e) => setFormData({...formData, ownerId: Number(e.target.value)})}
          >
            <option value="">Maalik Select Karein</option>
            {owners.map(o => <option key={o.ownerId} value={o.ownerId}>{o.name}</option>)}
          </select>
        </div>

        <button type="submit" className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-bold text-lg shadow-xl">Gaadi Add Karo</button>
      </form>
    </div>
  );
};

export default AddVehicle;