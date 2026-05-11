import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, User, Banknote, Calendar, Plus } from 'lucide-react';
import api from '../service/api';
import Sidebar from './Sidebar';

const AddTrip = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]); // To store driver list from backend
  const [vehicles, setVehicles] = useState([]); // To store truck list from backend

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicleNumber: '',
    driverId: '',
    driverName: '',
    freightPrice: '',
    ownerRate: '',
    startDate: '',
    endDate: '',
    ownerAdvance: 0 // Optional default
  });

  // Load drivers on mount so we can map names to IDs
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await api.get('/driver/drivers'); 
        setDrivers(res.data); // Expecting list of { id, name }
        console.log("Drivers loaded:", res.data);
      } catch (err) {
        console.error("Drivers load failed");
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicle/vehicles');
        setVehicles(res.data); // Expecting list of { id, vehicleNumber, name }
        console.log("Trucks loaded:", res.data);
      } catch (err) {
        console.error("Trucks load failed");
      }
    };

    fetchVehicles();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
        console.log("formdata:",formData)
      await api.post('/trip/', formData);
      navigate('/dashboard');
    } catch (err) {
      alert("Trip banane mein galti hui!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] md:bg-[#f1f5f9] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        
        {/* Header */}
        <header className="p-6 text-white md:text-gray-800">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 text-sm mb-2">
            <ArrowLeft size={16} className="mr-1" /> Wapas
          </button>
          <h1 className="text-3xl font-black">Nayi Trip</h1>
        </header>

        <form onSubmit={handleCreateTrip} className="flex-1 bg-white rounded-t-[40px] md:rounded-3xl p-6 md:p-8 space-y-6 md:mb-10 shadow-2xl">
          
          {/* SECTION: ROUTE */}
          <FormSection title="Route">
            <InputField label="Kahan Se" placeholder="Delhi" value={formData.source} 
              onChange={(v) => setFormData({...formData, source: v})} />
            <InputField label="Kahan Tak" placeholder="Mumbai" value={formData.destination} 
              onChange={(v) => setFormData({...formData, destination: v})} />
          </FormSection>

          {/* SECTION: TRUCK & DRIVER */}
          <FormSection title="Truck & Driver">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Truck Number</label>
              <select
                required
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              >
                <option value="">Truck Select Karein</option>
                {vehicles.map((v) => (
                  <option
                    key={v.vehicleId }
                    value={v.vehicleNumber }
                  >
                    {v.vehicleNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* DRIVER SELECTION (The ID Problem Fix) */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Driver</label>
              <select 
                required
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={formData.driverId}
                onChange={(e) =>{ 
                    const val = e.target.value;
                    console.log("Selected Driver ID:", val);
                    setFormData({...formData, driverId: e.target.value})
                }}
              >
                <option value="">Driver Select Karein</option>
                {drivers.map(d => (
                  <option key={d.driverId} value={d.driverId}>{d.driverName}</option>
                ))}
              </select>
            </div>
          </FormSection>

          {/* SECTION: PAISA */}
          <FormSection title="Paisa">
            <InputField label="Maal Ka Kiraya" placeholder="1,50,000" type="number" icon="₹"
              value={formData.freightPrice} onChange={(v) => setFormData({...formData, freightPrice: v})} />
            <InputField label="Truck Bhada (Owner Ko)" placeholder="75,000" type="number" icon="₹"
              value={formData.ownerRate} onChange={(v) => setFormData({...formData, ownerRate: v})} />
          </FormSection>

          {/* SECTION: DATES */}
          <FormSection title="Dates">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Shuru" type="date" value={formData.startDate} 
                onChange={(v) => setFormData({...formData, startDate: v})} />
              <InputField label="Khatam" type="date" value={formData.endDate} 
                onChange={(v) => setFormData({...formData, endDate: v})} />
            </div>
          </FormSection>

          <button type="submit" className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform">
            Trip Banao →
          </button>
        </form>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const FormSection = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-black text-blue-900/30 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField = ({ label, placeholder, value, onChange, type = "text", icon }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{icon}</span>}
      <input 
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-10' : 'px-4'} py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
  </div>
);

export default AddTrip;