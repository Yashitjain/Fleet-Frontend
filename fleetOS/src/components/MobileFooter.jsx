import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Truck, Users, UserSquare2, Plus, CheckCircle2 } from 'lucide-react';

const tabs = [
  { label: 'Home', path: '/dashboard', icon: <Home size={20} /> },
  { label: 'Trips', path: '/allTrips', icon: <Truck size={20} /> },
  { label: 'Owners', path: '/owners', icon: <Users size={20} /> },
  { label: 'Profile', path: '/profile', icon: <UserSquare2 size={20} /> },
];

const MobileFooter = ({ activeTab = 'Home', tripId }) => {
  const navigate = useNavigate();

  const actionButtons = tripId
    ? [
        {
          label: 'Kharcha',
          icon: <Plus size={18} />,
          onClick: () => navigate(`/trip/${tripId}/add-expense`),
          primary: false,
        },
        {
          label: 'Trip Khatam',
          icon: <CheckCircle2 size={18} />,
          onClick: () => navigate(`/trip/${tripId}/complete`),
          primary: true,
        },
      ]
    : [];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {actionButtons.length > 0 && (
        <div className="px-4 py-3 flex gap-3">
          {actionButtons.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform ${
                action.primary
                  ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}

      <div className="px-2 py-3 flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === tab.label ? 'text-[#0f172a]' : 'text-gray-400'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileFooter;
