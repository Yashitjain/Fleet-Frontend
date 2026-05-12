import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MessageCircle, Truck, Phone, CheckCircle2, 
  ChevronRight, Calculator, Plus, History 
} from 'lucide-react';
import api from '../service/api';
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter';

const OwnerBalanceSheet = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [trips, setTrips] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBalanceSheet = useCallback(async () => {
    try {
      const response = await api.get(`/owner/${ownerId}/balance`);
      const transactions_response = await api.get(`/transactions/${ownerId}`); 
      setOwner(response.data);
      setTrips(response.data.trips || []);
      setTransactions(transactions_response.data || []);
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
    const message = `Namaste ${owner.ownerName} ji 🙏\n\nSummary:\nTotal Freight: ₹${owner.totalPay?.toLocaleString('en-IN')}\nTotal Paid: ₹${owner.totalAdvance?.toLocaleString('en-IN')}\nNet Balance: ₹${owner.amountToPay?.toLocaleString('en-IN')}\n\n— Shri Ram Movers`;
    window.open(`https://wa.me/${owner.ownerPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading || !owner) return <div className="p-10 text-center font-bold text-gray-500">Loading Hisaab Kitaab...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        <header className="bg-[#0f172a] text-white p-6 md:p-10 pb-20">
          <div className="max-w-7xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 text-xs mb-6 hover:text-white transition-colors">
              <ArrowLeft size={14} className="mr-1" /> Back to Owners
            </button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight">{owner.ownerName}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-400 text-sm font-bold my-3">
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/10"><Phone size={14} className="text-emerald-500"/> {owner.ownerPhone}</span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/10"><Truck size={14} className="text-blue-500"/> {trips.length} Trips</span>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#0f172a] px-6 py-3.5 rounded-2xl font-black shadow-xl hover:bg-gray-100 transition-all active:scale-95"
                  onClick={() => navigate(`/owner/${ownerId}/add-payment`)}
                >
                  <Plus size={20} /> Add Payment
                </button>
                <button onClick={sendWhatsApp} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl font-black shadow-xl transition-all active:scale-95">
                  <MessageCircle size={20} /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl w-full mx-auto px-4 md:px-8 -mt-12 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard title="Total Freight" amount={owner.totalPay} label="Gross Earnings" color="emerald" />
            <SummaryCard title="Advance Given" amount={owner.totalAdvance} label="Paid to Owner" color="red" />
            <SummaryCard title="Net Payable" amount={owner.amountToPay} label="Final Settlement" color="emerald-solid" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            {/* Left Column: Trips */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-300 overflow-hidden flex flex-col">
              <SectionHeader icon={<Calculator size={18}/>} title="Trip-wise Breakdown" />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Route</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4 text-right">Freight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {trips.map((trip) => (
                      <tr key={trip.tripId} className="hover:bg-gray-50/50 transition-all cursor-pointer" onClick={() => navigate(`/trip/${trip.tripId}`)}>
                        <td className="px-6 py-4">
                          <p className="font-black text-gray-800 text-sm">{trip.source} → {trip.destination}</p>
                          <p className="text-[10px] text-gray-400 font-bold">#{trip.tripId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black text-gray-600">{trip.vehicleNumber}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900 text-sm">₹{trip.rate?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Transactions */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-300 overflow-hidden flex flex-col">
              <SectionHeader icon={<History size={18}/>} title="Payment History" />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Date & Method</th>
                      <th className="px-6 py-4">Notes</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.length > 0 ? transactions.map((tx) => (
                      <tr key={tx.transactionId} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-6 py-4">
                          <p className="font-black text-gray-800 text-sm">{tx.date}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{tx.method}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-medium italic">{tx.note || 'Freight Advance'}</td>
                        <td className="px-6 py-4 text-right font-bold text-red-500 text-sm">- ₹{tx.amount?.toLocaleString('en-IN')}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400 text-sm font-bold italic">No payments recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        <MobileFooter />
      </div>
    </div>
  );
};

const SummaryCard = ({ title, amount, label, color }) => {
  const styles = {
    emerald: "bg-white text-gray-900 border-gray-100",
    red: "bg-white text-gray-900 border-gray-100",
    "emerald-solid": "bg-emerald-600 text-white border-transparent"
  };
  return (
    <div className={`p-6 rounded-3xl shadow-sm border ${styles[color]}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${color.includes('solid') ? 'text-white/70' : 'text-gray-400'}`}>{title}</p>
      <h3 className={`text-2xl font-black ${color === 'red' ? 'text-red-500' : ''}`}>₹{amount?.toLocaleString('en-IN')}</h3>
      <div className={`mt-2 text-[10px] font-black w-fit px-2 py-0.5 rounded uppercase flex items-center gap-1 ${color.includes('solid') ? 'bg-white/20 text-white' : color === 'red' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {color.includes('solid') && <CheckCircle2 size={10}/>} {label}
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="p-5 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
    <div className="p-2 bg-gray-900 rounded-xl text-white">{icon}</div>
    <h3 className="font-black text-gray-800 text-base">{title}</h3>
  </div>
);

export default OwnerBalanceSheet;