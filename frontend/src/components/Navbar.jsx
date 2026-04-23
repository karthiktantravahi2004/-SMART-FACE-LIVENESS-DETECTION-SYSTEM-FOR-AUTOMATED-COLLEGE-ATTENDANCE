import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop Link Styling
  const getNavClass = (target) => {
    const base = "font-headline font-bold text-lg tracking-tight transition-colors ";
    if (path === target || (path === '/' && target === '/')) {
      return base + "text-orange-600 border-b-2 border-orange-500 pb-1";
    }
    return base + "text-slate-500 hover:text-orange-400";
  };

  // Mobile Link Styling (Bigger hit targets for touch)
  const getMobileNavClass = (target) => {
    const base = "block w-full text-left px-5 py-4 font-headline font-bold text-lg transition-colors rounded-xl ";
    if (path === target || (path === '/' && target === '/')) {
      return base + "bg-orange-50 text-orange-600";
    }
    return base + "text-slate-600 hover:bg-slate-50 hover:text-orange-500";
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-orange-500/10 shadow-[0_20px_40px_-10px_rgba(19,27,46,0.08)]">
      <div className="flex justify-between items-center px-6 md:px-8 h-20 w-full max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 z-50">
          <span className="material-symbols-outlined text-primary text-3xl">security</span>
          <span className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight font-headline">Smart Attendance</span>
        </div>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link className={getNavClass('/')} to="/">Home</Link>
          <Link className={getNavClass('/demo')} to="/demo">Demo</Link>
          <Link className={getNavClass('/register')} to="/register">Register</Link>
          <Link className={getNavClass('/attendance')} to="/attendance">Attendance</Link>
          <Link className={getNavClass('/records')} to="/records">Records</Link>
        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2 z-50">
         
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 hover:bg-orange-50 text-slate-800 rounded-lg transition-colors active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Overlay */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-orange-500/10 shadow-2xl transition-all duration-300 origin-top ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="px-4 py-6 flex flex-col gap-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          <Link onClick={closeMenu} className={getMobileNavClass('/')} to="/">Home</Link>
          <Link onClick={closeMenu} className={getMobileNavClass('/demo')} to="/demo">Demo</Link>
          <Link onClick={closeMenu} className={getMobileNavClass('/register')} to="/register">Register</Link>
          <Link onClick={closeMenu} className={getMobileNavClass('/attendance')} to="/attendance">Attendance</Link>
          <Link onClick={closeMenu} className={getMobileNavClass('/records')} to="/records">Records</Link>
          
          <div className="border-t border-slate-100 mt-4 pt-6 px-5 pb-4">
            <button className="flex items-center gap-4 text-slate-600 font-bold font-headline hover:text-orange-600 transition-colors w-full text-left">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
              User Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}