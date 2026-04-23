import React, { useRef } from 'react';
import WebcamFeed from '../components/WebcamFeed';
import { useAttendanceEngine } from '../core/attendanceEngine';

export default function Attendance() {
  const webcamRef = useRef(null);
  const { engineState, startEngine, stopEngine, nextIdentity, isRunning, logs, currentIdentity } = useAttendanceEngine(webcamRef);

  const isMarkedState = engineState.startsWith('✔');
  const latestLog = logs[0];

  const getUIStateContext = () => {
    switch(engineState) {
      case "Idle": return { color: "text-slate-500", message: "System Idle. Ready to begin." };
      case "Starting...": return { color: "text-primary", message: "Starting camera analysis..." };
      case "Detecting...": return { color: "text-primary", message: "Scanning for profile..." };
      case "Stabilizing Face...": return { color: "text-orange-500", message: "Hold steady for a second to build stable embeddings." };
      case "Scanning...": return { color: "text-tertiary", message: "Face found. Matching against enrolled records..." };
      case "No Face": return { color: "text-slate-400", message: "Face not detected. Move closer and improve lighting." };
      case "Spoof Detected": return { color: "text-error", message: "SECURITY ALERT: Spoof attempt detected." };
      case "Stopped": return { color: "text-slate-500", message: "System stopped." };
      default: 
        if(engineState.startsWith("Analyzing")) return { color: "text-primary", message: "Validating identity consistency..." };
        if(engineState.startsWith("✔")) return { color: "text-green-600", message: currentIdentity ? `Person identified: ${currentIdentity.name}` : "Person identified." };
        return { color: "text-primary", message: engineState };
    }
  };

  const uiCtx = getUIStateContext();

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
        
        <div className="w-full lg:w-1/3 space-y-8">
          <div>
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Real-time Biometrics</span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface leading-tight">Secure <br className="hidden md:block"/>Verification</h1>
          </div>

          {isMarkedState && currentIdentity && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 shadow-sm space-y-3">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-green-600 font-bold">Person Identified</p>
              <h3 className="text-2xl font-extrabold text-on-surface">{currentIdentity.name}</h3>
              <p className="text-sm text-on-surface-variant">Attendance has been marked and saved. Click Next to scan the next person.</p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-green-600 text-white">Marked</span>
                {latestLog && <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface">{latestLog.time}</span>}
              </div>
            </div>
          )}

          <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-lg text-on-surface">Recent Sessions</h3>
            <div className="space-y-3">
              {logs.length === 0 && <p className="text-xs text-on-surface-variant italic">No sessions logged yet today.</p>}
              {logs.map((log, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-lg border-l-4 border-green-500 shadow-sm">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">{log.name}</p>
                    <p className="text-[0.7rem] text-on-surface-variant">{log.time} • {log.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Camera & Controls */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          
          {/* Camera Feed Container */}
          <div className="relative w-full aspect-video md:aspect-[4/3] max-w-3xl bg-surface-container-highest rounded-xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(19,27,46,0.12)]">
            <WebcamFeed
              ref={webcamRef}
              videoConstraints={{ facingMode: "user" }}
              className={`w-full h-full object-cover mix-blend-multiply transition-opacity duration-300 ${isMarkedState ? 'opacity-80' : (!isRunning ? 'opacity-30 grayscale' : 'opacity-80')}`}
            />
            {isRunning && !isMarkedState && <div className="absolute inset-0 thinking-pulse bg-primary-container z-10 pointer-events-none"></div>}
            {isMarkedState && (
              <div className="absolute inset-0 z-20 flex items-end justify-start p-6 md:p-8 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <div className="max-w-md rounded-2xl bg-white/90 backdrop-blur-md p-5 shadow-2xl">
                  <p className="text-[0.7rem] uppercase tracking-[0.28em] text-green-600 font-bold mb-2">Attendance Marked</p>
                  <h3 className="text-2xl font-extrabold text-on-surface">{currentIdentity?.name || 'Student recorded'}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Attendance has been saved. Click Next to scan the next person.</p>
                </div>
              </div>
            )}
          </div>

          {/* Status & Controls Container */}
          <div className="mt-8 text-center w-full max-w-2xl px-4 md:px-0">
            
            {/* Dynamic Status Text (Replaced fixed height with min-height for text wrapping) */}
            <div className="space-y-2 min-h-[6rem] flex flex-col justify-center items-center mb-6">
              <p className={`font-bold text-sm tracking-widest uppercase font-label transition-colors ${uiCtx.color}`}>
                Status: {engineState}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface tracking-tight">
                {uiCtx.message}
              </h2>
            </div>

            {/* Action Buttons (Flex-col on mobile, Flex-row on desktop) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              {!isMarkedState ? (
                <>
                  <button 
                    onClick={startEngine} 
                    disabled={isRunning}
                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                      isRunning 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'aura-gradient text-white shadow-lg hover:shadow-xl active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined">play_arrow</span>
                    Take Attendance
                  </button>
                  
                  <button 
                    onClick={stopEngine} 
                    disabled={!isRunning}
                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 border-2 ${
                      !isRunning 
                        ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed' 
                        : 'border-outline/30 text-on-surface hover:bg-surface-container-low active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined">stop</span>
                    Stop Taking Attendance
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={nextIdentity}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 aura-gradient text-white shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <span className="material-symbols-outlined">skip_next</span>
                    Next
                  </button>

                  <button 
                    onClick={stopEngine} 
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 border-2 border-outline/30 text-on-surface hover:bg-surface-container-low active:scale-95"
                  >
                    <span className="material-symbols-outlined">stop</span>
                    End Session
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}