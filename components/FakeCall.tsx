
import React, { useState, useEffect, useRef } from 'react';

interface FakeCallProps {
  onEnd: () => void;
}

const FakeCall: React.FC<FakeCallProps> = ({ onEnd }) => {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [callDuration, setCallDuration] = useState(0);
  const [status, setStatus] = useState<'incoming' | 'active'>('incoming');
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setActive(true);
      // Play a Loud Ringtone
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/phone_ringing_loop.ogg");
      audio.loop = true;
      audio.play().catch(e => console.log("Audio play blocked by browser. Interaction required."));
      ringtoneRef.current = audio;
    }
  }, [countdown]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (status === 'active') {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
      }
      timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  const handleEndCall = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
    }
    onEnd();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!active) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-8">
        <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold italic tracking-widest uppercase">Initializing Ghost Protocol</p>
        <p className="text-gray-500 text-xs mt-4">Incoming call in {countdown}s</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center justify-between py-24 px-8 text-white animate-in fade-in duration-700">
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 bg-gradient-to-tr from-gray-700 to-gray-500 rounded-full flex items-center justify-center text-4xl font-bold mb-6 border-4 border-white/10 shadow-2xl">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
           </svg>
        </div>
        <h2 className="text-4xl font-black tracking-tight">MOM</h2>
        <p className="text-green-400 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">
          {status === 'incoming' ? 'Calling India Mobile...' : `Connected • ${formatTime(callDuration)}`}
        </p>
      </div>

      <div className="w-full flex justify-around items-center mb-12">
        {status === 'incoming' ? (
          <>
            <button 
              onClick={handleEndCall}
              className="group flex flex-col items-center space-y-3"
            >
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-active:scale-90 transition-transform border-4 border-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Decline</span>
            </button>
            <button 
              onClick={() => setStatus('active')}
              className="group flex flex-col items-center space-y-3"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl group-active:scale-90 transition-transform animate-bounce border-4 border-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-green-500">Accept</span>
            </button>
          </>
        ) : (
          <button 
            onClick={handleEndCall}
            className="group flex flex-col items-center space-y-4"
          >
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-active:scale-95 transition-transform border-[6px] border-red-700">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                </svg>
            </div>
            <span className="text-sm font-black text-red-500 uppercase tracking-[0.3em]">Disconnect Call</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-12 text-gray-500">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 bg-white/5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-black">Mute</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
           <div className="p-4 bg-white/5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-black">Speaker</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
           <div className="p-4 bg-white/5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-black">Hold</span>
        </div>
      </div>
    </div>
  );
};

export default FakeCall;
