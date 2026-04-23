import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <section className="flex flex-col items-center text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-primary font-label text-xs font-semibold mb-8 uppercase tracking-widest border border-primary-container/10">
          <span className="material-symbols-outlined text-sm">lens_blur</span>
          Next-Gen Biometric Core
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight mb-6 max-w-4xl leading-tight">
          Smart Face <span className="text-primary-container">Attendance</span> System
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl font-body leading-relaxed mb-10">
          Experience seamless identification with our Real-time Face Recognition featuring advanced Liveness Detection to prevent spoofing.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/attendance" className="aura-gradient text-on-primary px-8 py-4 rounded-xl font-headline font-bold flex items-center gap-2 shadow-xl hover:shadow-primary-container/20 transition-all active:scale-95">
            Launch Scanner
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link to="/demo" className="bg-surface-container-low text-on-surface px-8 py-4 rounded-xl font-headline font-bold hover:bg-surface-container-high transition-all active:scale-95">
            Watch Demo
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/register" className="group bg-surface-container-lowest border border-primary-container/20 rounded-xl p-10 shadow-[0_4px_20px_-4px_rgba(19,27,46,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(19,27,46,0.08)] transition-all duration-300 block">
          <div className="w-16 h-16 rounded-lg bg-surface-container-low flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>person_add</span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Register Student</h3>
          <p className="text-on-surface-variant font-body leading-relaxed mb-8">Easily enroll new students into the system by capturing high-fidelity facial biometrics and student metadata.</p>
          <div className="flex items-center text-primary font-bold font-headline group-hover:gap-2 transition-all">
            Get Started <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </Link>

        <Link to="/attendance" className="group bg-surface-container-lowest border border-primary-container/20 rounded-xl p-10 shadow-[0_4px_20px_-4px_rgba(19,27,46,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(19,27,46,0.08)] transition-all duration-300 relative overflow-hidden block">
          <div className="absolute top-0 right-0 w-32 h-32 aura-gradient opacity-5 rounded-bl-full"></div>
          <div className="w-16 h-16 rounded-lg bg-primary-container/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>face_retouching_natural</span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Start Attendance</h3>
          <p className="text-on-surface-variant font-body leading-relaxed mb-8">Initiate real-time scanning sessions with instantaneous identity verification and automatic liveness checks.</p>
          <div className="flex items-center text-primary font-bold font-headline group-hover:gap-2 transition-all">
            Open Camera <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </Link>

        <Link to="/records" className="group bg-surface-container-lowest border border-primary-container/20 rounded-xl p-10 shadow-[0_4px_20px_-4px_rgba(19,27,46,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(19,27,46,0.08)] transition-all duration-300 block">
          <div className="w-16 h-16 rounded-lg bg-surface-container-low flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">View Records</h3>
          <p className="text-on-surface-variant font-body leading-relaxed mb-8">Access comprehensive logs and analytics of attendance history, exported directly to CSV or PDF formats.</p>
          <div className="flex items-center text-primary font-bold font-headline group-hover:gap-2 transition-all">
            Browse History <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
