
import React, { useState } from 'react';
import { LOGO_SVG } from '../App';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsConnecting(true);
    // Simulate connection delay for dramatic effect
    setTimeout(() => {
      onLogin(name);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050b18] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#050b18_70%)] opacity-50"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 shadow-[0_0_120px_rgba(0,0,0,0.6)] flex flex-col items-center text-center">
          
          {/* Hyper-Complex Kite Logo Containment */}
          <div className="w-56 h-56 mb-12 relative group cursor-pointer">
            {/* Multi-layered Orbital Rings */}
            <div className="absolute inset-0 border-[3px] border-dashed border-indigo-500/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute inset-6 border-[1.5px] border-emerald-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
            <div className="absolute inset-12 border border-amber-500/5 rounded-full animate-[spin_15s_linear_infinite]"></div>
            
            {/* Glowing Core Effect */}
            <div className="absolute inset-0 bg-indigo-600/20 rounded-[3rem] blur-[50px] opacity-40 group-hover:opacity-80 transition-opacity duration-1000"></div>
            
            <div className="w-full h-full rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-[#050B18] flex items-center justify-center animate-kite-pulse">
               <img 
                src={LOGO_SVG} 
                alt="MRS Ai Kite Logo" 
                className="w-full h-full object-contain p-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000"
              />
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-3">
              MRS <span className="text-indigo-500">Ai</span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[2px] w-10 bg-gradient-to-r from-transparent to-slate-700"></div>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em] opacity-80">Educational Interface</p>
              <div className="h-[2px] w-10 bg-gradient-to-l from-transparent to-slate-700"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Secure Authentication</label>
              <div className="relative group/input">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Registry Name..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-600 font-bold text-lg"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isConnecting || !name.trim()}
              className={`w-full py-6 rounded-3xl font-black text-white transition-all shadow-3xl flex items-center justify-center gap-4 group ${
                isConnecting 
                ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40 hover:scale-[1.03] active:scale-[0.97]'
              }`}
            >
              {isConnecting ? (
                <>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                  <span className="uppercase tracking-[0.2em] text-xs font-black">Connecting to Core...</span>
                </>
              ) : (
                <>
                  <span className="uppercase tracking-[0.2em] text-xs font-black">Initialize MRS Ai</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-2 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-14 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
              <span className="text-[9px] font-black text-slate-500 tracking-[0.1em] uppercase">Neural Network Active</span>
            </div>
            <p className="text-slate-600 text-[9px] uppercase font-bold tracking-[0.3em] leading-loose opacity-60">
              MRS Ai Academic Core v1.2.5-ALPHA<br/>
              <span className="text-indigo-400/90 font-black">Built by Students of MRCS!</span>
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes kite-pulse {
          0%, 100% { transform: scale(1) translateY(0px) rotate(0deg); filter: drop-shadow(0 0 0px rgba(99,102,241,0)); }
          50% { transform: scale(1.08) translateY(-10px) rotate(4deg); filter: drop-shadow(0 30px 60px rgba(99,102,241,0.5)); }
        }
        .animate-kite-pulse {
          animation: kite-pulse 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
