
import React from 'react';
import { View } from '../types';
import { LOGO_SVG } from '../App';

interface NavigationProps {
  activeView: View;
  onViewChange: (view: View) => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange, isDarkMode }) => {
  const navItems = [
    { id: View.Chat, label: 'Academic Chat', icon: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785 0.5.5 0 0 0 .316.79 3.333 3.333 0 0 0 2.053-.556c.45-.3.94-.56 1.447-.76.517-.203 1.05-.333 1.62-.333H12Z' },
    { id: View.LiveTutor, label: 'Live Tutoring', icon: 'M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z' },
    { id: View.StudyPlan, label: 'Study Planner', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z' },
    { id: View.ImageGen, label: 'Visual Aids', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 00 1.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z' }
  ];

  return (
    <nav className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto transition-colors duration-300">
      <div className="hidden md:flex p-6 border-b border-slate-100 dark:border-slate-800 flex-col items-center">
        <div className="w-28 h-28 rounded-3xl bg-[#050B18] flex items-center justify-center p-3 shadow-[0_20px_60px_rgba(99,102,241,0.3)] border border-slate-800 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src={LOGO_SVG} 
            alt="MRS Ai" 
            className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-125 duration-700"
          />
        </div>
        <div className="mt-5 text-center">
          <h2 className="font-black text-slate-800 dark:text-white tracking-tighter text-xl">MRS <span className="text-indigo-600 dark:text-indigo-400">Ai</span></h2>
          <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase opacity-70">Neural Kite Node</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-row md:flex-col p-2 md:p-4 gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal group ${
              activeView === item.id 
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-100 dark:shadow-indigo-900/40 scale-[1.02]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeView === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="hidden md:block p-4 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl p-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-black text-indigo-700 dark:text-indigo-400 mb-1 tracking-widest">ELITE SYSTEM</p>
          <p className="font-medium opacity-80 mb-1">Build v1.2.5-ALPHA</p>
          <p className="text-[10px] font-bold text-indigo-500/70 dark:text-indigo-400/70 italic">Built by Students of MRCS!</p>
          <div className="mt-3 h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 w-[96%] animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
