import React, { useState } from 'react';
import { ArrowRight, Truck, Star, AlignHorizontalJustifyEndIcon } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const [forsmata, setForsmata] = useState({
    username: 'Shri Ram Movers',
    password: 'password123',
  });

  async function handleLogin(e) {
    e.preventDefault();
    const loginData = {
      username: forsmata.username,
      password: forsmata.password,
    };
    
    const response = await axios.post('/api/v1/auth/login', loginData);
    if(response.status = 200){
      document.cookie = `token=Bearer ${response.data.jwt}; path=/;`;
    }
    console.log(response);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-[#1e293b] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row min-h-[600px]">
        
        {/* Left Side: Branding & Info */}
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
            <p className="text-gray-500 mt-2 italic sm:hidden">
              Truck management aasaan ho gaya.
            </p>
          </div>

          {/* Social Proof Stats (Desktop Only) */}
          <div className="hidden sm:block bg-[#1e293b]/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
              <span className="text-gray-300 font-medium">500+ Fleet Operators trust us</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="text-gray-400 w-5 h-5" />
              <span className="text-gray-300 font-medium">10,000+ Trips managed monthly</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full sm:w-1/2 bg-white sm:bg-[#f8fafc] p-8 sm:p-16 flex flex-col justify-center rounded-t-[40px] sm:rounded-none -mt-10 sm:mt-0 z-10">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-8">
              Apna account login karein
            </h2>

            <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
              {/* Username Field */}
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  COMPANY / USERNAME
                </label>
                <input
                  type="text"
                  value={forsmata.username}
                  onChange={(e) => setForsmata({...forsmata, username: e.target.value})}
                  className="w-full px-4 py-4 bg-white sm:bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter username"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={forsmata.password}
                  onChange={(e) => setForsmata({...forsmata, password: e.target.value})}
                  className="w-full px-4 py-4 bg-white sm:bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
                Login Karein <ArrowRight size={20} />
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <a href="#" className="text-blue-600 font-semibold hover:underline text-sm sm:text-base">
                Naya account banayein
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;