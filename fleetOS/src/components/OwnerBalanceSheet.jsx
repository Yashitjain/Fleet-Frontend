import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Truck, Phone, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';
import api from '../service/api';
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter';

const OwnerBalanceSheet = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized fetch to allow calling it from various places
  const fetchOwnerBalanceSheet = useCallback(async () => {
    try {
      const response = await api.get(`/owner/${ownerId}/balance`);
      setOwner(response.data);
      setTrips(response.data.trips || []);
    } catch (err) {
      console.error("Failed to load balance sheet:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchOwnerBalanceSheet();
  }, [fetchOwnerBalanceSheet]);

  const sendWhatsApp = () => {
    const message = `Namaste ${owner.ownerName} ji 🙏\n\nAapka truck bhada ₹${owner.totalPay?.toLocaleString('en-IN')} hai.\nAdvance ₹${owner.totalAdvance?.toLocaleString('en-IN')} mil chuka hai.\nBaaki ₹${owner.amountToPay?.toLocaleString('en-IN')} baaki hai.\n\n— Shri Ram Movers`;
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${owner.ownerPhone}?text=${encodedMsg}`, '_blank');
  };

  const handleSettleTrip = async (tripId) => {
    try {
      await api.patch(`/trip/${tripId}/settle`);
      // Instant UI update: local state change before the refetch completes
      setTrips(prev => prev.map(t => t.tripId === tripId ? { ...t, settled: true } : t));
      fetchOwnerBalanceSheet(); 
    } catch (error) {
      alert("Settlement failed. Please try again.");
    }
  };

  if (loading || !owner) return <div className="p-10 text-center font-bold text-gray-500">Loading Hisaab Kitaab...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-12">
      {/* Header Section */}
      <header className="bg-[#0f172a] text-white p-6 md:p-10 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 text-xs mb-4 hover:text-white transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Back to Owners
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{owner.ownerName}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400 text-sm font-bold">
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg"><Phone size={14} className="text-emerald-500"/> {owner.ownerPhone}</span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg"><Truck size={14} className="text-blue-500"/> {owner.trips?.length} Active Trips</span>
              </div>
            </div>
            <button 
              onClick={sendWhatsApp} 
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1eb954] text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-green-900/20 transition-all active:scale-95"
            >
              <MessageCircle size={20} /> WhatsApp Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 space-y-6">
        
        {/* TOP BLOCK: Financial Summary Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Freight</p>
            <h3 className="text-2xl font-black text-gray-900">₹{owner.totalPay?.toLocaleString('en-IN')}</h3>
            <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">Gross Earnings</div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Advance Given</p>
            <h3 className="text-2xl font-black text-red-500">₹{owner.totalAdvance?.toLocaleString('en-IN')}</h3>
            <div className="mt-2 text-[10px] font-bold text-red-600 bg-red-50 w-fit px-2 py-0.5 rounded">Paid to Owner</div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-200">
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-4 text-white/80">Net Payable</p>
            <h3 className="text-3xl font-black text-white">₹{owner.amountToPay?.toLocaleString('en-IN')}</h3>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-white bg-white/20 w-fit px-2 py-0.5 rounded uppercase">
              <CheckCircle2 size={10}/> Final Settlement
            </div>
          </div>
        </div>

        {/* BOTTOM BLOCK: Full Width Trip Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-xl text-white">
                <Calculator size={18} />
              </div>
              <h3 className="font-black text-gray-800 text-lg">Trip-wise Breakdown</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5">Route Details</th>
                  <th className="px-6 py-5">Vehicle</th>
                  <th className="px-6 py-5">Freight (Bhada)</th>
                  <th className="px-6 py-5 text-red-400">Advance</th>
                  <th className="px-6 py-5 text-emerald-600">Balance</th>
                  <th className="px-6 py-5 text-center">Settlement</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trips.map((trip) => (
                  <tr key={trip.tripId} className="group hover:bg-gray-50/80 transition-all">
                    <td className="px-8 py-5">
                      <div className="font-black text-gray-800 flex items-center gap-2">
                        {trip.source} 
                        <ChevronRight size={12} className="text-gray-300" /> 
                        {trip.destination}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">TRIP ID: #{trip.tripId}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-black text-gray-600">
                        {trip.vehicleNumber}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-900 text-sm">
                      ₹{trip.rate?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-5 font-bold text-red-500 text-sm">
                      ₹{trip.advance?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-5 font-black text-emerald-600 text-sm">
                      ₹{(trip.rate - trip.advance)?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {trip.settled ? (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase">
                          <CheckCircle2 size={12} /> Settled
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleSettleTrip(trip.tripId)}
                          className="px-4 py-2 bg-gray-900 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-tighter rounded-xl transition-all shadow-md active:scale-95"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => navigate(`/trip/${trip.tripId}`)}
                        className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <MobileFooter />
    </div>
  );
};

export default OwnerBalanceSheet;