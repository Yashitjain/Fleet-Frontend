import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  UserSquare2,
  FileText,
  Settings,
} from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Trips', to: '/allTrips', icon: <Truck size={20} /> },
  { label: 'Vehicles', icon: <Truck size={20} className="rotate-180" /> },
  { label: 'Drivers', icon: <Users size={20} /> },
  { label: 'Owners', icon: <UserSquare2 size={20} /> },
  { label: 'Reports', icon: <FileText size={20} /> },
  { label: 'Settings', icon: <Settings size={20} /> },
];

const activeClass = 'bg-white/10 text-white border-l-4 border-orange-500 rounded-l-none';
const inactiveClass = 'hover:bg-white/5 text-gray-400';

const Sidebar = () => (
  <aside className="hidden md:flex w-64 bg-[#0f172a] flex-col text-gray-400">
    <div className="p-6">
      <h1 className="text-2xl font-black text-white tracking-tight">
        FLEET<span className="text-orange-500">OS</span>
      </h1>
    </div>

    <nav className="flex-1 px-4 space-y-2 mt-4">
      {sidebarItems.map((item) => (
        item.to ? (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${isActive ? activeClass : inactiveClass}`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ) : (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${inactiveClass}`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </div>
        )
      ))}
    </nav>
  </aside>
);

export default Sidebar;
