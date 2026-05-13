import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Truck, User, Fuel, Wrench, Plus, 
  CheckCircle2, Receipt, ChevronRight 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/api'; 
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId || tripId === 'undefined') return;
    try {
      setLoading(true);
      const response = await api.get(`/trip/${tripId}`);
      setTrip(response.data);
      setExpenses(response.data.expenseList || []);
    } catch (err) {
      console.error("Failed to fetch trip details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const handleAddExpense = (id) => navigate(`/trip/${id}/add-expense`);
  const handleEditExpense = (expenseId, tripId) => navigate(`/trip/${tripId}/expense/edit/${expenseId}`); 

  const handleCompleteTrip = async (id) => {
    try {
      await api.patch(`/trip/status/${id}/close`);
      fetchTripDetails(); // Refresh data to update UI status
    } catch (err) {
      alert("Status update failed");
    }
  };

  const kharche = expenses.map(exp => {
    let config = { label: 'Other', icon: <Receipt className="text-gray-400" /> };
    if (exp.expenseType === 'DIESEL') config = { label: 'Fuel', icon: <Fuel className="text-red-500" /> };
    else if (exp.expenseType === 'DRIVER') config = { label: 'Driver', icon: <User className="text-purple-500" /> };
    else if (exp.expenseType === 'OTHER' || exp.expenseType === 'REPAIR') config = { label: 'Repair', icon: <Wrench className="text-pink-400" /> };

    return {
      id: exp.id,
      type: config.label,
      note: exp.note,
      date: new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      amount: exp.amount,
      icon: config.icon
    };
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 italic">Loading Trip...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        {/* Responsive Header */}
        <header className="bg-white md:bg-transparent p-4 md:p-8">
          <div className="flex justify-between items-start md:items-center">
            <div>
              <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 text-sm mb-1 hover:text-gray-800 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Wapas / #{trip.id}
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">{trip.source} → {trip.destination}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${trip.status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {trip.status}
                </span>
              </div>
              {/* Mobile Info Badges */}
              <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm md:hidden">
                <span className="flex items-center gap-1 font-medium"><Truck size={14}/> {trip.vehicleNumber}</span>
                <span className="flex items-center gap-1 font-medium"><User size={14}/> {trip.driverName}</span>
              </div>
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex gap-3">
              {trip.status === 'ACTIVE' && (
                <>
                  <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm" onClick={() => handleAddExpense(tripId)}>
                    + Kharcha Add Karo
                  </button> 
                  <button className="w-1/2 bg-green-600 text-white px-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 " onClick={() => handleCompleteTrip(tripId)}>
                    <CheckCircle2 size={18} /> Trip Khatam Karo 
                  </button>
                </>
              )}
            </div>
          </div>

          {/* MOBILE ACTIONS - Logic applied here specifically */}
        </header>

        <div className="px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* HISAAB KITAAB CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#1e293b] text-white p-4 text-[10px] font-black uppercase tracking-[0.2em]">Hisaab Kitaab</div>
              <div className="p-6 space-y-4">
                <HisaabRow label="Maal ka Kiraya" amount={trip.freightPrice} />
                <HisaabRow label="Truck Bhada" amount={-trip.ownerRate} isNegative />
                <HisaabRow label="Kul Kharcha" amount={-trip.totalExpense} isNegative />
                <hr className="border-dashed border-gray-100" />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-800">Net Faida</span>
                  <span className="text-3xl font-black text-green-600">₹{trip.profit?.toLocaleString('en-IN') || 0}</span>
                </div>
              </div>
            </div>

            {/* TRIP INFO (Desktop Only) */}
            <div className="hidden md:block bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Trip Details</h3>
              <div className="space-y-3">
                <InfoRow label="Truck" value={trip.vehicleNumber} />
                <InfoRow label="Driver" value={trip.driverName} />
                <InfoRow label="Start Date" value={trip.startDate} />
                {trip.status === 'Closed' && <InfoRow label="End Date" value={trip.endDate} />}
              </div>
            </div>
          </div>

          {/* KHARCHE LIST CARD */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px] overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Kharche ki List</h3>
                {trip.status === 'ACTIVE' && (
                  <button className="bg-[#0f172a] text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg" onClick={() => handleAddExpense(tripId)}>
                    + Add
                  </button>
                )}
              </div>
              
              {/* Table wrapper - removed overflow-x-auto to prevent horizontal scrolling */}
              <div className="w-full">
                <table className="w-full text-left table-fixed"> {/* table-fixed helps control widths */}
                  <thead className="bg-gray-50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-4 md:px-6 py-4 w-[40%]">Type/Note</th>
                      <th className="px-4 md:px-6 py-4 text-right w-[40%]">Amount</th>
                      <th className="px-4 md:px-6 py-4 text-right w-[40%]">Date</th>
                      {/* Action column is narrow and fixed to the right */}
                      {trip.status === 'ACTIVE' && <th className="px-4 py-4 w-[20%]"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {kharche.map((item) => (  
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={() => trip.status === 'ACTIVE' && handleEditExpense(item.id, tripId)}
                      >
                        {/* Note & Type combined to save horizontal space */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-gray-50 min-w-[32px] h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                              {item.icon}
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-gray-800 text-sm  ">{item.note}</p>
                              <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase">{item.type}</p>
                            </div>
                          </div>
                        </td>

                        {/* Amount - moved closer to the left for visibility */}
                        <td className="px-4 md:px-6 py-4 text-right">
                          <p className="font-black text-gray-900 text-sm md:text-base">₹{item.amount.toLocaleString('en-IN')}</p>
                          {/* <p className="text-[9px] text-gray-400 md:hidden">{item.date}</p> */}
                        </td>
                        {/* Date of Expense */}
                        <td className="px-4 md:px-6 py-4 text-right">
                          <p className="font-black text-gray-900 text-sm md:text-base">₹{item.date}</p>
                        </td>

                        {/* ACTION: Edit Icon visible on right without scrolling */}
                        {trip.status === 'ACTIVE' && (
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end">
                              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ChevronRight size={14} />
                              </div>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    
                    {kharche.length === 0 && (
                      <tr><td colSpan="3" className="text-center py-20 text-gray-400 font-bold italic">No expenses added.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Kul Kharcha</span>
                <span className="text-2xl font-black text-red-500">₹{trip.totalExpense?.toLocaleString('en-IN') || 0}</span>
              </div>
            </div>
          </div>
          {trip.status === 'ACTIVE' ? (
            <div className="flex flex-row gap-2 w-full mt-6 md:hidden">
              <button className="w-1/2 bg-white border border-gray-200 py-4 rounded-2xl font-black text-gray-600 flex items-center justify-center gap-2 shadow-sm" onClick={() => handleAddExpense(tripId)}>
                + Kharcha Add Karo
              </button> 
              <button className="w-1/2 bg-green-600 text-white px-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 " onClick={() => handleCompleteTrip(tripId)}>
                <CheckCircle2 size={20} /> Trip Khatam Karo
              </button>
            </div>
          ) : null}
        </div>
      </main>

      <MobileFooter activeTab="Trips" tripId={tripId} status={trip.status} />
    </div>
  );
};

// Internal Helper Components
const HisaabRow = ({ label, amount, isNegative }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-gray-800'}`}>
      {isNegative ? '-' : ''}₹{Math.abs(amount || 0).toLocaleString('en-IN')}
    </span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1">
    <span className="text-gray-400 font-bold">{label}</span>
    <span className="font-bold text-gray-700">{value || 'N/A'}</span>
  </div>
);

export default TripDetails;