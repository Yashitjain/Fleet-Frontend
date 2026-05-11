import React, { useState } from 'react';
import { ArrowRight, Truck, Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate(); // 1. Move navigate to the top level of the component
  
  const [forsmata, setForsmata] = useState({
    username: 'Shri Ram Movers',
    password: 'password123',
  });

  // 2. Single, clean handleLogin function
  async function handleLogin(e) {
    e.preventDefault();
    // e.stopPropagation(); // Add this just to be safe
    console.log("Login attempt started...");

    try {
      const loginData = {
        username: forsmata.username, // 3. Fixed: was formData, now forsmata
        password: forsmata.password, // 3. Fixed: was formData, now forsmata
      };

      const response = await axios.post('http://localhost:8080/api/v1/auth/login', loginData);

      console.log("Response received:", response.status);

      if (response.status === 200) {
        // Set the cookie
        document.cookie = `token=${encodeURIComponent('Bearer ' + response.data.jwt)}; path=/;`;
        console.log("Navigating to dashboard...");
        
        // 4. Trigger the navigation
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed! Check console for details.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full max-w-5xl bg-[#1e293b] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row min-h-[600px]">
        
        {/* Left Side: Branding */}
        <div className="w-full sm:w-1/2 bg-[#0f172a] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden mb-4">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white/10 p-2 rounded-lg">
                <Truck className="text-green-400 w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              FLEET<span className="text-orange-500">OS</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-sm">
              India ka pehla fleet management platform jo actually kaam karta hai.
            </p>
          </div>

          <div className="hidden sm:block bg-[#1e293b]/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
              <span className="text-gray-300 font-medium">500+ Fleet Operators trust us</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full sm:w-1/2 bg-white sm:bg-[#f8fafc] p-8 sm:p-16 flex flex-col justify-center rounded-t-[40px] sm:rounded-none -mt-10 sm:mt-0 z-10">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-8">
              Apna account login karein
            </h2>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  COMPANY / USERNAME
                </label>
                <input
                  type="text"
                  value={forsmata.username}
                  onChange={(e) => setForsmata({...forsmata, username: e.target.value})}
                  className="w-full px-4 py-4 bg-white sm:bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={forsmata.password}
                  onChange={(e) => setForsmata({...forsmata, password: e.target.value})}
                  className="w-full px-4 py-4 bg-white sm:bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
                Login Karein <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;