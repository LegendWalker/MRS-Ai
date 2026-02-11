
import React, { useState, useEffect } from 'react';
import { View } from './types';
import Navigation from './components/Navigation';
import ChatSection from './components/ChatSection';
import LiveTutor from './components/LiveTutor';
import ImageGenSection from './components/ImageGenSection';
import StudyPlanner from './components/StudyPlanner';
import Login from './components/Login';

// Hyper-Complex Fractal Kite Logo SVG (Data URI)
// Design: A crystalline diamond-kite structure with recursive internal facets, 
// glowing neural traces, and peripheral data shards.
export const LOGO_SVG = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTI4IiBmaWxsPSIjMDUwQjE4Ii8+CjwhLS0gR3JhdmZpdHkgRmx1eCAtLT4KPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxODAiIGZpbGw9InVybCgjY29yZS1nbG93KSIgb3BhY2l0eT0iMC4xNSIvPgoKPCEtLSBPdXRlciBLaXRlIEZyYW1lIC0tPgo8cGF0aCBkPSJNMjU2IDQwTDM4NCAyNTZMMjU2IDQ3MkwxMjggMjU2TDI1NiA0MFoiIHN0cm9rZT0iIzYzNjZGMSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIwLjkiLz4KPHBhdGggZD0iTTI1NiA2MEwzNjAgMjU2TDI1NiA0NTJMMTUyIDI1NkwyNTYgNjBaIiBzdHJva2U9IiMxMEI5ODEiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iOCAzIi8+Cgo8IS0tIEZyYWN0YWwgRmFjZXRzIC0tPgo8ZyBvcGFjaXR5PSIwLjQiPgoJPHBhdGggZD0iTTI1NiA4MEwyNTYgNDMyIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cgk8cGF0aCBkPSJNMTI4IDI1NkgzODQiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KCTxwYXRoIGQ9Ik0xOTIgMTkyTDMyMCAzMjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KCTxwYXRoIGQ9Ik0zMjAgMTkyTDE5MiAzMjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9nPgoKPCEtLSBDcnlzdGFsbGluZSBJbm5lciBDb3JlIC0tPgo8cGF0aCBkPSJNMjU2IDEyMEwzNDAgMjU2TDI1NiAzOTJMMTcyIDI1NkwyNTYgMTIwWiIgZmlsbD0idXJsKCNraXRlLWdyYWQpIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8cGF0aCBkPSJNMjU2IDE2MEwzMDYgMjU2TDI1NiAzNTJMMjA2IDI1NkwyNTYgMTYwWiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHBhdGggZD0iTTI1NiAyMDBMMjg2IDI1NkwyNTYgMzEyTDIyNiAyNTZMMjU2IDIwMFoiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC44Ii8+Cgo8IS0tIE5ldXJhbCBUcmFjZXMgLS0+CjxwYXRoIGQ9Ik0yNTYgNDBWMTEwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0yNTYgNDAyVjQ3MiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDAgMjU2SDExMCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDAyIDI1Nkg0NzIiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KCjwhLS0gT3JiaXRhbCBOb2RlcyAtLT4KPGNpcmNsZSBjeD0iMjU2IiBjeT0iNDAiIHI9IjgiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMjU2IiBjeT0iNDcyIiByPSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMjU2IiByPSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjQ3MiIgY3k9IjI1NiIgcj0iOCIgZmlsbD0iI0ZGRkZGRiIvPgoKPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIzMCIgc3Ryb2tlPSIjRkJCRjI0IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuNSIvPgoKPGRlZnM+Cgk8cmFkaWFsR3JhZGllbnQgaWQ9ImNvcmUtZ2xvdyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyNTYgMjU2KSBzY2FsZSgyMDApIj4KCQk8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2MzY2RjEiLz4KCQk8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2MzY2RjEiIHN0b3Atb3BhY2l0eT0iMCIvPgoJPC9yYWRpYWxHcmFkaWVudD4KCTxsaW5lYXJHcmFkaWVudCBpZD0ia2l0ZS1ncmFkIiB4MT0iMjU2IiB5MT0iODAiIHgyPSIyNTYiIHkyPSI0MzIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KCQk8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxMEI5ODEiLz4KCQk8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzYzNjZGMSIvPgoJCTxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzFBRTFGRSIvPgoJPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=`;

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Chat);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-hidden transition-colors duration-300`}>
      {/* Sidebar / Topbar Navigation */}
      <Navigation activeView={activeView} onViewChange={setActiveView} isDarkMode={isDarkMode} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="p-4 md:p-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-[#050B18] transition-all hover:rotate-6 hover:scale-110 duration-300">
              <img 
                src={LOGO_SVG} 
                alt="MRS Ai Logo" 
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">MRS <span className="text-indigo-600 dark:text-indigo-400">Ai</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold hidden sm:block">Welcome, {userName || 'Student'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591-1.591M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800/50">
              Elite Build
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-800/50 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Active
            </div>
          </div>
        </header>

        <section className="flex-1 flex flex-col">
          {activeView === View.Chat && <ChatSection />}
          {activeView === View.LiveTutor && <LiveTutor />}
          {activeView === View.ImageGen && <ImageGenSection />}
          {activeView === View.StudyPlan && <StudyPlanner />}
        </section>
      </main>
    </div>
  );
};

export default App;
