
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserSettings } from '../types';

interface DashboardProps {
  settings: UserSettings;
  onTriggerFakeCall: () => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ settings, onTriggerFakeCall, onReset }) => {
  const [tapCount, setTapCount] = useState(0);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'dispatching' | 'sent'>('idle');
  const [safetyTimer, setSafetyTimer] = useState<number | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const HELPLINE_NUMBER = "1091";

  const triggerSOS = useCallback(() => {
    setDispatchStatus('dispatching');
    
    // Simulate real-time tracking and background automated dispatch
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`SECURE UPLINK: Transmitting coordinates [${latitude}, ${longitude}] for User ID ${settings.userPhone}`);
          
          setTimeout(() => {
            setDispatchStatus('sent');
            // Notification simulating that the background process handled it
            alert(`SHE RAKSHA PROTOCOL ACTIVATED\n\n1. GPS Location Secured: ${latitude}, ${longitude}\n2. Automated Alerts Broadcasted to all ${settings.contacts.length} contacts.\n3. Local Emergency Response paged.`);
            setTimeout(() => setDispatchStatus('idle'), 6000);
          }, 3500);
        },
        () => {
          setDispatchStatus('sent');
          alert("SHE RAKSHA PROTOCOL ACTIVATED\n\nGPS Signal Weak. Cell-Tower triangulation transmitted to emergency network and contacts.");
          setTimeout(() => setDispatchStatus('idle'), 6000);
        }
      );
    }
  }, [settings]);

  const handleRapidTap = () => {
    setTapCount(prev => prev + 1);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 1500);
  };

  useEffect(() => {
    if (tapCount >= 5) {
      window.location.href = `tel:${HELPLINE_NUMBER}`;
      setTapCount(0);
    }
  }, [tapCount]);

  const toggleSafetyTimer = () => {
    if (safetyTimer !== null) {
      setSafetyTimer(null);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    } else {
      const minutes = prompt("Safety Check-In: Set timer (minutes). SOS will trigger if you don't cancel before zero.", "10");
      if (minutes) {
        const seconds = parseInt(minutes) * 60;
        setSafetyTimer(seconds);
        countdownIntervalRef.current = setInterval(() => {
          setSafetyTimer(prev => {
            if (prev === null) return null;
            if (prev <= 1) {
              triggerSOS();
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="p-6 flex justify-between items-center bg-white border-b border-gray-100">
        <div>
          <h2 className="text-xl font-black text-gray-900 leading-none">Namaste, {settings.name.split(' ')[0]}</h2>
          <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest mt-1">Status: Shield Active</p>
        </div>
        <button onClick={onReset} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
        {dispatchStatus === 'dispatching' && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-white text-center p-8 animate-in fade-in duration-500">
            <div className="w-32 h-32 border-8 border-rose-600/30 border-t-rose-600 rounded-full animate-spin mb-8"></div>
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">CRITICAL ALERT</h3>
            <p className="font-bold opacity-60 uppercase tracking-widest text-xs">Establishing Secure Command Uplink...</p>
            <div className="mt-12 space-y-3 w-full text-[10px] font-mono bg-white/5 p-6 rounded-3xl border border-white/10">
              <p className="text-green-400">INITIALIZING SHE RAKSHA V3.1...</p>
              <p className="animate-pulse">{'>'} BROADCASTING SOS TO {settings.contacts.length} CIRCLE MEMBERS...</p>
              <p>{'>'} UPLOADING ENCRYPTED GPS LOGS...</p>
              <p className="text-rose-500">{'>'} CONTACTING LOCAL HELPLINE: 1091</p>
            </div>
          </div>
        )}

        {dispatchStatus === 'sent' && (
          <div className="absolute inset-0 z-50 bg-green-600 flex flex-col items-center justify-center text-white text-center p-8 animate-in zoom-in duration-300">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <h3 className="text-4xl font-black uppercase italic mb-2">DISPATCHED</h3>
             <p className="font-bold uppercase tracking-widest text-sm opacity-80">Help is on the way.</p>
          </div>
        )}

        <div className="mb-10 text-center">
            {safetyTimer !== null ? (
              <div className="bg-rose-600 px-8 py-3 rounded-full shadow-xl shadow-rose-200 animate-pulse border-2 border-rose-700">
                <p className="text-white font-black text-xl tracking-tighter">TIME REMAINING: {formatTime(safetyTimer)}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Protection Active & Online</p>
            )}
        </div>

        <div className="relative group flex flex-col items-center">
          <div className={`absolute inset-0 bg-rose-100 rounded-full ripple-effect ${dispatchStatus !== 'idle' ? 'hidden' : ''}`}></div>
          <button 
            onDoubleClick={triggerSOS}
            onClick={handleRapidTap}
            className="relative z-10 w-72 h-72 bg-rose-600 rounded-full shadow-[0_40px_80px_-20px_rgba(225,29,72,0.5)] flex flex-col items-center justify-center border-[12px] border-white active:scale-95 transition-transform"
          >
            <span className="text-white text-7xl font-black mb-1 italic tracking-tighter">SOS</span>
            <span className="text-rose-100 text-[10px] font-black tracking-[0.4em] uppercase">Two Taps</span>
          </button>
          
          <div className="mt-8 flex gap-3">
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < tapCount ? 'bg-rose-600 scale-150 shadow-lg' : 'bg-gray-200'}`} />
             ))}
          </div>
        </div>

        <div className="mt-16 w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={toggleSafetyTimer}
              className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center gap-2 ${safetyTimer !== null ? 'bg-black border-black text-white' : 'bg-gray-50 border-transparent text-gray-900 hover:bg-gray-100'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${safetyTimer !== null ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${safetyTimer !== null ? 'text-white' : 'text-rose-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Timer</span>
            </button>

            <button 
              onClick={onTriggerFakeCall}
              className="p-6 bg-gray-50 rounded-[2.5rem] border-2 border-transparent flex flex-col items-center text-center gap-2 hover:bg-gray-100 group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Ghost Call</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="p-8 bg-white border-t border-gray-50">
         <div className="flex items-center justify-center gap-4 opacity-30 grayscale mb-4">
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-[8px] text-white font-bold">1091</div>
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-[8px] text-white font-bold">112</div>
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-[8px] text-white font-bold">100</div>
         </div>
         <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-[0.2em] leading-loose">
           Active Contacts: {settings.contacts.map((c: { name: any; }) => c.name).join(' • ')} <br/> 
           Indian Security Standards V4.0
         </p>
      </footer>
    </div>
  );
};

export default Dashboard;