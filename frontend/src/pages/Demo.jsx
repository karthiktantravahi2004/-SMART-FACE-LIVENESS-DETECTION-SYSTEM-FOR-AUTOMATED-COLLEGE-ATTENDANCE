import React from 'react';
import { Link } from 'react-router-dom';

export default function Demo() {
  return (
    <main className="pt-20">
      <section className="relative min-h-[819px] flex items-center px-8 md:px-24 py-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
          <div className="space-y-8 z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container/10 text-primary font-label text-xs font-bold tracking-widest uppercase">The Vigilant Curator</span>
            <h1 className="text-6xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tight">
              How the <span className="text-transparent bg-clip-text aura-gradient">Future</span> of Attendance Works
            </h1>
            <p className="text-xl text-on-surface/70 max-w-lg leading-relaxed">Experience a seamless, editorial-grade biometric interface designed for security that feels like a concierge service.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/attendance" className="aura-gradient text-white px-8 py-4 rounded-xl font-headline font-bold shadow-lg transition-all hover:scale-105 active:scale-95">Explore Dashboard</Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-surface-container-highest rounded-xl p-1 relative overflow-hidden group">
              <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary-container rounded-tl-lg"></div>
              <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary-container rounded-tr-lg"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary-container rounded-bl-lg"></div>
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary-container rounded-br-lg"></div>
              <div className="absolute inset-0 bg-primary-container/5 animate-pulse pointer-events-none"></div>
              <div className="absolute top-12 left-12 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold font-label text-slate-900 uppercase tracking-tighter">Live Scan Active</span>
                </div>
              </div>
              <div className="absolute bottom-12 right-12 bg-on-surface text-white p-6 rounded-xl shadow-2xl max-w-[200px]">
                <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Identity Confirmed</p>
                <h3 className="font-headline font-bold text-lg">Marcus Thorne</h3>
                <p className="text-xs text-primary-container">Student ID: 8824-X</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
