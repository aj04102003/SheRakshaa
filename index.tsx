/**
 * She Raksha - Stealth Edition
 */

declare global {
  interface Window {
    initMap: () => void;
  }
}

// Leaflet types
declare global {
  namespace L {
    class Map {
      constructor(element: string, options: any);
      setView(latlng: [number, number], zoom: number): Map;
      addLayer(layer: any): Map;
      removeLayer(layer: any): Map;
      invalidateSize(): Map;
    }
    class Marker {
      constructor(latlng: [number, number], options?: any);
      bindPopup(content: string): Marker;
      addTo(map: Map): Marker;
    }
    class TileLayer {
      constructor(urlTemplate: string, options?: any);
      addTo(map: Map): TileLayer;
    }
    class DivIcon {
      constructor(options: any);
    }
    function map(element: string, options?: any): Map;
    function tileLayer(urlTemplate: string, options?: any): TileLayer;
    function marker(latlng: [number, number], options?: any): Marker;
    function divIcon(options: any): DivIcon;
  }
}

interface Contact {
  name: string;
  phone: string;
  avatarColor: string;
}

interface NotificationEntry {
  id: string;
  timestamp: number;
  channel: "cloud" | "sms-fallback" | "error";
  summary: string;
}

interface AppState {
  view:
  | "onboarding"
  | "dashboard"
  | "circle"
  | "people"
  | "fakecall"
  | "profile"
  | "notifications"
  | "transparency";
  onboardingStep: 1 | 2;
  settings: {
    userName: string;
    userEmail: string;
    contacts: Contact[];
  } | null;
  notifications: NotificationEntry[];
  sosActive: boolean;
  sosCountdown: number;
  currentLocation: { lat: number; lng: number } | null;
  tapCount: number;
  lastTapTime: number;
  longPressTimer: number | null;
}

const state: AppState = {
  view: "onboarding",
  onboardingStep: 1,
  settings: null,
  notifications: [],
  sosActive: false,
  sosCountdown: 0,
  currentLocation: null,
  tapCount: 0,
  lastTapTime: 0,
  longPressTimer: null,
};

const HELPLINE_NUMBER = "112";
const RING_URL =
  "https://actions.google.com/sounds/v1/alarms/phone_ringing_loop.ogg";
const BACKEND_URL =
  window.location.hostname === "localhost" ? "http://localhost:3000" : "";
const ringtone = new Audio("original_iphone.mp3");
ringtone.loop = true;
ringtone.volume = 1.0; // Full volume

// Leaflet map variables
let map: L.Map | null = null;
let userMarker: L.Marker | null = null;
let safeZoneMarkers: L.Marker[] = [];

const avatarColors = ["#f43f5e", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
const appContainer = document.getElementById("app");

// Initialize Leaflet map
function initializeLeafletMap() {
  if (!map) {
    map = L.map('people-map', {}).setView([28.6139, 77.2090], 15);
    
    // Add dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: 'OpenStreetMap contributors CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
  }
}

// Update map with current location
function updateMapWithLocation() {
  if (!map) {
    initializeLeafletMap();
  }
  
  if (map && state.currentLocation) {
    const { lat, lng } = state.currentLocation;
    
    // Remove existing user marker
    if (userMarker) {
      map.removeLayer(userMarker);
    }
    
    // Add user marker
    userMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'user-location-marker',
        html: `<div style="background: #f43f5e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }).bindPopup("Your Location").addTo(map);
    
    // Add safe zones
    addSafeZones();
    
    // Center map on user location
    map.setView([lat, lng], 15);
    
    // Refresh map
    setTimeout(() => {
      map?.invalidateSize();
    }, 100);
  }
}

// Add safe zone markers
function addSafeZones() {
  // Remove existing safe zone markers
  safeZoneMarkers.forEach(marker => {
    map?.removeLayer(marker);
  });
  safeZoneMarkers = [];
  
  if (!map || !state.currentLocation) return;
  
  const { lat, lng } = state.currentLocation;
  
  // Sample safe zones around user location
  const safeZones = [
    { name: "University Campus", lat: lat + 0.01, lng: lng - 0.01 },
    { name: "Police Station", lat: lat - 0.008, lng: lng + 0.012 },
    { name: "Hospital", lat: lat + 0.005, lng: lng + 0.008 }
  ];
  
  safeZones.forEach(zone => {
    const marker = L.marker([zone.lat, zone.lng], {
      icon: L.divIcon({
        className: 'safe-zone-marker',
        html: `<div style="background: #6366f1; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    }).bindPopup(zone.name).addTo(map);
    
    safeZoneMarkers.push(marker);
  });
}

function updateCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        updateMapWithLocation();
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Location access denied.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        // Show user-friendly error
        const locationDiv = document.getElementById("map");
        if (locationDiv) {
          locationDiv.innerHTML = `
            <div class="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <p class="text-sm text-rose-400">${errorMessage}</p>
              <button onclick="updateCurrentLocation()" class="mt-2 px-3 py-1 bg-rose-600 text-white rounded-lg text-xs">
                Retry
              </button>
            </div>
          `;
        }
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function loadSettings() {
  const saved = localStorage.getItem("she_raksha_stealth_v1");
  if (saved) {
    state.settings = JSON.parse(saved);
    state.view = "dashboard";
  } else {
    state.view = "onboarding";
    state.onboardingStep = 1;
  }
}

function saveSettings(settings: any) {
  localStorage.setItem("she_raksha_stealth_v1", JSON.stringify(settings));
  state.settings = settings;
  state.view = "dashboard";
  render();
}

function addNotification(entry: NotificationEntry) {
  state.notifications.unshift(entry);
}

function render() {
  if (!appContainer) return;
  appContainer.innerHTML = "";

  if (state.view === "onboarding") renderOnboarding();
  else if (state.view === "fakecall") renderFakeCall();
  else if (state.view === "profile") renderProfile();
  else if (state.view === "notifications") renderNotifications();
  else if (state.view === "transparency") renderTransparency();
  else {
    // These views share the bottom navigation
    if (state.view === "dashboard") renderDashboard();
    else if (state.view === "circle") renderCircle();
    else if (state.view === "people") renderPeople();
    renderBottomNav();
  }
}

// --- ONBOARDING (Two Dedicated Steps) ---

function renderOnboarding() {
  if (state.onboardingStep === 1) {
    appContainer!.innerHTML = `
      <div class="flex flex-col h-full p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div class="mt-20 flex-1">
          // <h1 class="text-5xl font-bold text-white tracking-tighter mb-4">She Raksha</h1>
          <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Stealth Protocol v1.0</p>
          
          <div class="mt-16 space-y-8">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity</label>
              <input id="on-name" type="text" placeholder="Full Name" class="w-full bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white font-bold outline-none focus:border-rose-500 transition-all">
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <input id="on-email" type="email" placeholder="your@email.com" class="w-full bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white font-bold outline-none focus:border-rose-500 transition-all">
            </div>
          </div>
        </div>
        
        <div class="pb-10">
          <div id="on-error" class="text-rose-500 text-center text-[10px] font-bold mb-4 hidden uppercase tracking-widest"></div>
          <button id="btn-to-step2" class="w-full bg-white text-black font-black py-6 rounded-[2rem] active:scale-95 transition-all">
            SETUP CONTACTS
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-to-step2")?.addEventListener("click", () => {
      const name = (
        document.getElementById("on-name") as HTMLInputElement
      ).value.trim();
      const email = (
        document.getElementById("on-email") as HTMLInputElement
      ).value.trim();
      if (!name || !email.includes("@")) {
        const err = document.getElementById("on-error");
        err!.innerText = "Invalid Details Provided";
        err!.classList.remove("hidden");
        return;
      }
      state.settings = { userName: name, userEmail: email, contacts: [] };
      state.onboardingStep = 2;
      render();
    });
  } else {
    appContainer!.innerHTML = `
      <div class="flex flex-col h-full p-10 animate-in fade-in slide-in-from-right-8 duration-500">
        <div class="mt-12 flex-1">
          <div class="flex items-center gap-4 mb-10">
            <button id="btn-back-step1" class="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h2 class="text-2xl font-black text-white">Safety Circle</h2>
          </div>

          <div class="space-y-4 overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
            ${[1, 2, 3, 4, 5]
        .map(
          (i) => `
              <div class="glass-dark p-6 rounded-[2rem] space-y-3">
                <input class="c-name w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" placeholder="Guardian Name ${i}">
                <input class="c-phone w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" type="tel" placeholder="Mobile Number">
              </div>
            `
        )
        .join("")}
          </div>
        </div>
        
        <div class="pb-10 pt-4">
          <div id="on-error-2" class="text-rose-500 text-center text-[10px] font-bold mb-4 hidden uppercase tracking-widest"></div>
          <button id="btn-activate" class="w-full bg-rose-600 text-white font-black py-6 rounded-[2rem] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(225,29,72,0.4)]">
            ACTIVATE SHE RAKSHA
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-back-step1")?.addEventListener("click", () => {
      state.onboardingStep = 1;
      render();
    });

    document.getElementById("btn-activate")?.addEventListener("click", () => {
      const cNames = document.querySelectorAll(".c-name");
      const cPhones = document.querySelectorAll(".c-phone");
      const contacts: Contact[] = [];

      for (let i = 0; i < cNames.length; i++) {
        const n = (cNames[i] as HTMLInputElement).value.trim();
        const p = (cPhones[i] as HTMLInputElement).value.trim();
        if (n && p)
          contacts.push({
            name: n,
            phone: p,
            avatarColor: avatarColors[i % avatarColors.length],
          });
      }

      if (contacts.length < 2) {
        const err = document.getElementById("on-error-2");
        err!.innerText = "Add at least 2 guardians";
        err!.classList.remove("hidden");
        return;
      }

      saveSettings({ ...state.settings, contacts });
    });
  }
}

// --- MAIN DASHBOARD ---

function renderDashboard() {
  const isOnline = navigator.onLine;
  const isSilentMode = false; // We'll check this with a more reliable method

  appContainer!.innerHTML = `
    <div class="flex flex-col h-full animate-in fade-in duration-500">
      <header class="flex justify-between items-center p-6 pb-2">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tighter mt-1">Hi, ${state.settings?.userName.split(" ")[0]
    }!</h2>
          <p class="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mt-1">Protection Enabled</p>
        </div>
        <div class="flex gap-3">
          <button id="btn-notifications" class="w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white/60 relative hover:bg-white/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            ${state.notifications.length > 0
      ? `
              <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-400 border border-white"></span>
            `
      : ""
    }
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto no-scrollbar px-6 pb-24 mb-10">
        ${!isOnline ? `
          <div class="mb-4 p-3 glass-dark rounded-2xl flex items-center gap-3 border border-amber-400/30">
            <svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
            <div>
              <p class="text-xs font-bold text-amber-400">Internet Required</p>
              <p class="text-[9px] text-amber-300">Cloud SMS features may not work</p>
            </div>
          </div>
        ` : ''}

        <div class="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          ${state.settings?.contacts
      .map(
        (c) => `
          <div class="flex flex-col items-center gap-2 flex-shrink-0">
             <div class="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center font-black text-white text-lg" style="background-color: ${c.avatarColor
          }">
               ${c.name[0]}
             </div>
             <span class="text-[9px] font-bold text-white/60 uppercase tracking-widest">${c.name.split(" ")[0]
          }</span>
          </div>
        `
      )
      .join("")}
        </div>

        <div class="flex-1 flex flex-col items-center justify-center py-10">
          <div class="relative">
            <div id="sos-trigger" class="w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer border-2 border-white/30 sos-pulse-shadow sos-blink-glow">
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path></svg>
              <div id="sos-spinner" class="absolute inset-0 w-32 h-32 rounded-full border-4 border-white/30 hidden"></div>
            </div>
            ${state.sosActive ? `
              <div class="absolute -inset-4 bg-rose-400/20 rounded-full animate-ping"></div>
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-black text-2xl">
                ${state.sosCountdown}
              </div>
            ` : ''}
          </div>
          
          <div class="mt-6 flex gap-2">
            ${[...Array(5)].map((_, i) => `
              <div id="tap-indicator-${i}" class="w-2 h-2 rounded-full bg-gray-600 transition-all duration-300"></div>
            `).join('')}
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-[10px] text-white/60 font-medium">2 taps: Emergency • 5+ taps: Call 112 • Long press: Emergency</p>
          </div>
          <p class="text-white font-black text-lg mt-8 mb-2">SOS EMERGENCY</p>
          <p class="text-white/80 text-[10px] font-medium uppercase tracking-widest">Press & Hold 3 Seconds</p>
          
          <div class="mt-8 flex flex-col items-center gap-3">
             <div class="flex -space-x-2">
               ${state.settings?.contacts
      .slice(0, 3)
      .map(
        (c) =>
          `<div class="w-8 h-8 rounded-full border-2 border-white/30 glass-dark flex items-center justify-center text-[8px] font-black text-white" style="background-color: ${c.avatarColor}">${c.name[0]}</div>`
      )
      .join("")}
           </div>
           <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest">Broadcasting to ${state.settings?.contacts.length
    } Guardians</p>
         </div>
       </div>

       <div class="mt-8 space-y-3">
         <button id="ghost-trigger" class="w-full py-4 rounded-2xl glass-dark text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:bg-white/20 border border-white/20">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
           Fake Call
         </button>
         <button id="manual-sms" class="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-sm text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:bg-white/20 border border-white/20">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
           Manual SMS
         </button>
       </div>
     </div>
   </div>
 `;

  const sosBtn = document.getElementById("sos-trigger");
  
  // Enhanced SOS interaction handlers
  const handleSOSTap = () => {
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - state.lastTapTime;
    
    // Reset tap count if too much time has passed
    if (timeSinceLastTap > 1500) {
      state.tapCount = 0;
    }
    
    state.tapCount++;
    state.lastTapTime = currentTime;
    
    // Update tap indicators
    for (let i = 0; i < 5; i++) {
      const indicator = document.getElementById(`tap-indicator-${i}`);
      if (indicator) {
        if (i < state.tapCount) {
          indicator.className = "w-2 h-2 rounded-full bg-rose-500 scale-150 shadow-lg shadow-rose-500/50 transition-all duration-300";
        } else {
          indicator.className = "w-2 h-2 rounded-full bg-gray-600 transition-all duration-300";
        }
      }
    }
    
    // Check for 2 taps (Emergency messages)
    if (state.tapCount === 2) {
      setTimeout(() => {
        if (state.tapCount === 2) {
          sendEmergencyMessages();
          resetTapCounters();
        }
      }, 300);
    }
    
    // Check for 5+ taps (emergency call)
    if (state.tapCount >= 5) {
      makeEmergencyCall();
      resetTapCounters();
    }
    
    // Reset tap count after delay
    setTimeout(() => {
      if (state.tapCount < 5) {
        resetTapCounters();
      }
    }, 1500);
  };
  
  const startSOSLongPress = () => {
    if (state.sosActive) return;
    
    state.longPressTimer = window.setTimeout(() => {
      // Long press detected - send emergency messages
      sendEmergencyMessages();
      resetTapCounters();
    }, 2000); // 2 second long press
    
    // Add urgent animation
    sosBtn?.classList.add("sos-urgent-pulse");
  };
  
  const cancelSOSLongPress = () => {
    if (state.longPressTimer) {
      window.clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }
    
    // Remove urgent animation
    sosBtn?.classList.remove("sos-urgent-pulse");
  };
  
  const resetTapCounters = () => {
    state.tapCount = 0;
    state.lastTapTime = 0;
    
    // Reset tap indicators
    for (let i = 0; i < 5; i++) {
      const indicator = document.getElementById(`tap-indicator-${i}`);
      if (indicator) {
        indicator.className = "w-2 h-2 rounded-full bg-gray-600 transition-all duration-300";
      }
    }
  };
  
  const sendEmergencySMS = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts: state.settings?.contacts || [],
          message: `🆘 EMERGENCY ALERT! ${state.settings?.userName || 'Someone'} needs immediate help. Please contact emergency services. This is an automated SOS alert.`,
          location: state.currentLocation
        }),
      });
      
      if (response.ok) {
        addNotification({
          id: String(Date.now()),
          timestamp: Date.now(),
          channel: "cloud",
          summary: "Emergency SMS sent to all contacts!"
        });
      }
    } catch (error) {
      console.error("SMS error:", error);
      addNotification({
        id: String(Date.now()),
        timestamp: Date.now(),
        channel: "error",
        summary: "SMS failed - trying emergency call"
      });
      makeEmergencyCall();
    }
  };
  
  const sendEmergencyMessages = async () => {
    // Send SMS first
    await sendEmergencySMS();
    
    // Then trigger full SOS protocol
    triggerSOS();
  };
  
  const makeEmergencyCall = () => {
    window.location.href = `tel:${HELPLINE_NUMBER}`;
    addNotification({
      id: String(Date.now()),
      timestamp: Date.now(),
      channel: "cloud",
      summary: `Calling emergency: ${HELPLINE_NUMBER}`
    });
  };

  // Add event listeners
  sosBtn?.addEventListener("click", handleSOSTap);
  sosBtn?.addEventListener("mousedown", startSOSLongPress);
  sosBtn?.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startSOSLongPress();
  });

  sosBtn?.addEventListener("mouseup", cancelSOSLongPress);
  sosBtn?.addEventListener("mouseleave", cancelSOSLongPress);
  sosBtn?.addEventListener("touchend", (e) => {
    e.preventDefault();
    cancelSOSLongPress();
  });
  sosBtn?.addEventListener("touchcancel", cancelSOSLongPress);

  document.getElementById("refresh-location")?.addEventListener("click", () => {
    updateCurrentLocation();
  });

  // Initialize location and map when dashboard loads
  updateCurrentLocation();

  document.getElementById("ghost-trigger")?.addEventListener("click", () => {
    state.view = "fakecall";
    render();
  });

  document.getElementById("manual-sms")?.addEventListener("click", () => {
    sendManualSMS();
  });

  document
    .getElementById("btn-notifications")
    ?.addEventListener("click", () => {
      state.view = "notifications";
      render();
    });
}

// --- CIRCLE VIEW ---

function renderCircle() {
  appContainer!.innerHTML = `
    <div class="flex flex-col h-full p-8 animate-in slide-in-from-right-8 duration-500">
      <header class="mb-8">
        <h2 class="text-4xl font-black text-white tracking-tighter">Guardians</h2>
        <p class="text-white/80 font-bold uppercase tracking-widest text-[9px] mt-1">Manage Safety Circle</p>
      </header>
      
      <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        ${state.settings?.contacts
      .map(
        (c, idx) => `
          <div class="glass-dark p-5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/20 transition-all duration-200 border border-white/20">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-lg border-2 border-white/30" style="background-color: ${c.avatarColor}">
                ${c.name[0]}
              </div>
              <div>
                <h4 class="font-bold text-white">${c.name}</h4>
                <p class="text-[10px] text-white/60 font-medium">${c.phone}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors message-btn" data-phone="${c.phone}" data-name="${c.name}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </button>
              <button class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors call-btn" data-phone="${c.phone}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </button>
            </div>
          </div>
        `
      )
      .join("")}
        
        <button id="btn-add-guardian" class="w-full p-6 border-2 border-dashed border-white/30 rounded-[2.5rem] flex items-center justify-center gap-3 text-white/60 hover:bg-white/20 hover:border-white/50 transition-all duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="font-bold text-xs uppercase tracking-widest">Expand Network</span>
        </button>
      </div>
    </div>
  `;

  // Add event listener for expand network button
  document.getElementById("btn-add-guardian")?.addEventListener("click", () => {
    // Show add guardian dialog inline
    showAddGuardianDialog();
  });
  
  // Add event listeners for call buttons
  document.querySelectorAll(".call-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const phone = (e.currentTarget as HTMLElement).dataset.phone;
      if (phone) {
        window.location.href = `tel:${phone}`;
        addNotification({
          id: String(Date.now()),
          timestamp: Date.now(),
          channel: "cloud",
          summary: `Calling ${phone}`
        });
      }
    });
  });
  
  // Add event listeners for message buttons
  document.querySelectorAll(".message-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const phone = (e.currentTarget as HTMLElement).dataset.phone;
      const name = (e.currentTarget as HTMLElement).dataset.name;
      if (phone && name) {
        const locationText = state.currentLocation 
          ? ` Location: https://maps.google.com/?q=${state.currentLocation.lat},${state.currentLocation.lng}`
          : " Location unavailable";
        
        const emergencyMessage = `🆘 EMERGENCY ALERT! ${state.settings?.userName || 'Someone'} needs immediate help!${locationText} Please contact emergency services immediately. This is an automated SOS alert from SheRaksha app.`;
        
        window.location.href = `sms:${phone}?body=${encodeURIComponent(emergencyMessage)}`;
        addNotification({
          id: String(Date.now()),
          timestamp: Date.now(),
          channel: "cloud",
          summary: `Opening emergency message for ${name}`
        });
      }
    });
  });
}

function showAddGuardianDialog() {
  const dialog = document.createElement("div");
  dialog.className = "fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-6";
  dialog.innerHTML = `
    <div class="glass-dark rounded-[2.5rem] p-8 w-full max-w-md border border-white/20">
      <h3 class="text-2xl font-black text-white mb-6">Add Guardian</h3>
      <div class="space-y-4">
        <div>
          <label class="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">Name</label>
          <input id="new-guardian-name" type="text" placeholder="Guardian Name" class="w-full glass-dark border border-white/20 p-4 rounded-xl text-sm font-bold text-white focus:border-white/40 outline-none bg-white/10">
        </div>
        <div>
          <label class="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">Phone</label>
          <input id="new-guardian-phone" type="tel" placeholder="+91 00000 00000" class="w-full glass-dark border border-white/20 p-4 rounded-xl text-sm font-bold text-white focus:border-white/40 outline-none bg-white/10">
        </div>
      </div>
      <div class="flex gap-3 mt-6">
        <button id="cancel-add-guardian" class="flex-1 py-3 glass-dark text-white font-bold rounded-xl active:scale-95 transition-all duration-200 hover:bg-white/20 border border-white/20">
          Cancel
        </button>
        <button id="confirm-add-guardian" class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl active:scale-95 transition-all duration-200 hover:from-rose-600 hover:to-pink-700">
          Add Guardian
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Add event listeners
  document.getElementById("cancel-add-guardian")?.addEventListener("click", () => {
    document.body.removeChild(dialog);
  });
  
  document.getElementById("confirm-add-guardian")?.addEventListener("click", () => {
    const nameInput = document.getElementById("new-guardian-name") as HTMLInputElement;
    const phoneInput = document.getElementById("new-guardian-phone") as HTMLInputElement;
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    
    if (!name || phone.length < 10) {
      alert("Please enter valid name and phone number");
      return;
    }
    
    // Add new guardian
    const newGuardian: Contact = {
      name,
      phone,
      avatarColor: avatarColors[state.settings?.contacts.length || 0 % avatarColors.length]
    };
    
    if (state.settings) {
      state.settings.contacts.push(newGuardian);
      saveSettings(state.settings);
    }
    
    document.body.removeChild(dialog);
    render(); // Re-render circle view
  });
}

// --- PEOPLE / LOCATION VIEW ---

function renderPeople() {
  appContainer!.innerHTML = `
    <div class="flex flex-col h-full p-8 animate-in slide-in-from-right-8 duration-500">
      <header class="mb-6">
        <h2 class="text-4xl font-black text-white tracking-tighter">Safe Zones</h2>
        <p class="text-white/80 font-bold uppercase tracking-widest text-[9px] mt-1">Nearby Support Points</p>
      </header>

      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-black text-white">Your Location</h3>
          <button id="refresh-location-people" class="text-xs text-white/80 font-bold uppercase tracking-widest hover:text-white transition-colors">
            Refresh
          </button>
        </div>
        <div id="people-map" class="glass-dark border border-white/20 h-64 rounded-xl flex items-center justify-center relative overflow-hidden">
          ${state.currentLocation ? `
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"></div>
          ` : `
            <div class="text-center z-10">
              <svg class="w-16 h-16 text-white/60 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <p class="text-sm text-white/80 font-medium">Getting location...</p>
              <button onclick="updateCurrentLocation()" class="mt-3 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                Retry
              </button>
            </div>
          `}
        </div>
        ${state.currentLocation ? `
          <div class="mt-3 p-3 glass-dark rounded-xl border border-white/20">
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-white/80 font-medium">
                📍 ${state.currentLocation.lat.toFixed(6)}, ${state.currentLocation.lng.toFixed(6)}
              </p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span class="text-[9px] text-emerald-400 font-bold">LIVE</span>
              </div>
            </div>
          </div>
        ` : `
          <div class="mt-3 p-3 glass-dark rounded-xl border border-amber-400/30">
            <p class="text-[10px] text-amber-400 font-medium">Location access required for safety features</p>
          </div>
        `}
      </div>

      <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        <div class="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2">Verified Communities</div>
        ${["University Campus", "Railway Police Post", "24/7 MedCare Hub"]
      .map(
        (place, i) => `
          <div class="glass-dark p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer safe-place hover:bg-white/20 transition-all duration-200 border border-white/20" data-place="${place}">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <h4 class="font-bold text-white text-sm">${place}</h4>
                <p class="text-[9px] text-white/60 font-medium">${(i + 1) * 0.4
          } KM Away • High Activity</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        `
      )
      .join("")}
      </div>
      <div class="mt-4 space-y-3">
        <button id="people-helpline" class="w-full py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:bg-white/30 border border-white/20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          Call ${HELPLINE_NUMBER}
        </button>
        <button id="people-sos" class="w-full py-4 rounded-2xl glass-dark text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:bg-white/20 border border-white/20">
          <svg class="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path></svg>
          Quick SOS Broadcast
        </button>
      </div>
    </div>
  `;

  // Initialize map after rendering
  setTimeout(() => {
    if (state.currentLocation) {
      updateMapWithLocation();
    } else {
      updateCurrentLocation();
    }
  }, 100);

  // Add event listeners for People section
  document.getElementById("refresh-location-people")?.addEventListener("click", () => {
    updateCurrentLocation();
  });

  document.querySelectorAll(".safe-place").forEach((el) => {
    el.addEventListener("click", () => {
      const place = (el as HTMLElement).dataset.place || "Safe zone";
      const query = encodeURIComponent(place + " near me");
      window.open(`https://www.google.com/maps/search/${query}`, "_blank");
    });
  });

  document.getElementById("people-helpline")?.addEventListener("click", () => {
    window.location.href = `tel:${HELPLINE_NUMBER}`;
  });

  document.getElementById("people-sos")?.addEventListener("click", () => {
    triggerSOS();
  });
}

// --- FAKE CALL ---

function renderFakeCall() {
  appContainer!.innerHTML = `
    <div class="h-full bg-slate-950 flex flex-col items-center justify-between py-24 px-10 text-white animate-in zoom-in duration-500 relative">
      <!-- Simulation Label -->
      <div class="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div class="px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center gap-2">
          <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span class="text-xs font-black text-amber-400 uppercase tracking-widest">Simulation Mode</span>
        </div>
      </div>

      <div class="text-center">
        <div class="w-32 h-32 bg-slate-900 rounded-full mx-auto mb-10 flex items-center justify-center border-4 border-slate-800 shadow-2xl relative">
          <div class="absolute inset-0 bg-blue-500/5 rounded-full animate-ping"></div>
          <svg class="w-16 h-16 text-slate-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>
        </div>
        <h2 class="text-4xl font-extrabold mb-1 tracking-tight uppercase">MOM</h2>
        <p class="text-emerald-500 font-bold text-[9px] uppercase tracking-[0.4em] animate-pulse">Inbound Frequency Connected</p>
      </div>

      <div class="w-full flex justify-around items-center">
        <div id="end-call" class="flex flex-col items-center gap-4 cursor-pointer">
          <div class="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
             <svg class="w-10 h-10 text-white rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"></path></svg>
          </div>
          <span class="text-[9px] font-black uppercase text-slate-600 tracking-widest">Decline</span>
        </div>
        
        <div id="accept-call" class="flex flex-col items-center gap-4 cursor-pointer">
          <div class="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform animate-bounce">
             <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"></path></svg>
          </div>
          <span class="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Accept</span>
        </div>
      </div>
    </div>
  `;
  ringtone.play().catch(() => { });

  const stopCall = () => {
    ringtone.pause();
    ringtone.currentTime = 0;
    state.view = "dashboard";
    render();
  };
  document.getElementById("end-call")?.addEventListener("click", stopCall);
  document.getElementById("accept-call")?.addEventListener("click", stopCall);
}

// --- TRANSPARENCY SCREEN ---

function renderTransparency() {
  appContainer!.innerHTML = `
    <div class="flex flex-col h-full p-8 animate-in slide-in-from-right-8 duration-500">
      <header class="flex items-center justify-between mb-8">
        <button id="transparency-back" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-slate-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h2 class="text-xl font-black text-white tracking-tight">Transparency</h2>
        <div class="w-10 h-10"></div>
      </header>

      <div class="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-1">
        <section class="glass-dark p-6 rounded-[2rem] space-y-4">
          <h3 class="text-lg font-black text-white">Data Access</h3>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-white">Location</p>
                <p class="text-[10px] text-slate-400">Only during SOS activation for accurate emergency response</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-white">Contacts</p>
                <p class="text-[10px] text-slate-400">Stored locally on device, never uploaded to servers</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-white">SMS Service</p>
                <p class="text-[10px] text-slate-400">Uses Twilio for message delivery when cloud is available</p>
              </div>
            </div>
          </div>
        </section>

        <section class="glass-dark p-6 rounded-[2rem] space-y-4">
          <h3 class="text-lg font-black text-white">When We Access Data</h3>
          <div class="space-y-2">
            <div class="p-3 bg-slate-800/50 rounded-xl">
              <p class="text-xs font-bold text-rose-400 mb-1">SOS Activation</p>
              <p class="text-[10px] text-slate-300">Location + Contacts → Emergency alerts to guardians</p>
            </div>
            <div class="p-3 bg-slate-800/50 rounded-xl">
              <p class="text-xs font-bold text-amber-400 mb-1">Test SMS</p>
              <p class="text-[10px] text-slate-300">Phone number → Single verification message</p>
            </div>
            <div class="p-3 bg-slate-800/50 rounded-xl">
              <p class="text-xs font-bold text-emerald-400 mb-1">App Usage</p>
              <p class="text-[10px] text-slate-300">No data collection or tracking</p>
            </div>
          </div>
        </section>

        <section class="glass-dark p-6 rounded-[2rem] space-y-4">
          <h3 class="text-lg font-black text-white">Privacy Commitment</h3>
          <div class="space-y-3">
            <p class="text-[10px] text-slate-300 leading-relaxed">
              She Raksha operates on a privacy-first principle. Your personal information and safety circle contacts remain stored locally on your device. We only access location data during emergency situations when you explicitly trigger SOS.
            </p>
            <p class="text-[10px] text-slate-300 leading-relaxed">
              No analytics, no tracking, no data selling. Ever.
            </p>
          </div>
        </section>
      </div>
    </div>
  `;

  document.getElementById("transparency-back")?.addEventListener("click", () => {
    state.view = "profile";
    render();
  });
}

// --- PROFILE VIEW ---

function renderProfile() {
  if (!state.settings) {
    state.view = "onboarding";
    render();
    return;
  }

  const s = state.settings;
  appContainer!.innerHTML = `
    <div class="flex flex-col h-full p-8 animate-in slide-in-from-right-8 duration-500">
      <header class="flex items-center justify-between mb-8">
        <button id="profile-back" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-slate-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h2 class="text-xl font-black text-white tracking-tight">Profile & Circle</h2>
        <div class="w-10 h-10"></div>
      </header>

      <div class="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-1">
        <section class="glass-dark p-5 rounded-[2rem] space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center font-black text-lg">
              ${s.userName[0]}
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-widest text-slate-500 font-black">Primary Identity</p>
              <h3 class="text-lg font-black text-white">${s.userName}</h3>
            </div>
          </div>
          <div class="space-y-3 mt-4">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input id="profile-name" value="${s.userName
    }" class="w-full mt-1 bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <input id="profile-email" value="${s.userEmail
    }" class="w-full mt-1 bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" />
            </div>
          </div>
        </section>

        <section class="space-y-3">
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Safety Circle</p>
          <div class="space-y-3">
            ${s.contacts
      .map(
        (c, idx) => `
              <div class="glass-dark p-4 rounded-[1.75rem] flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm" style="background-color: ${c.avatarColor}">
                  ${c.name[0]}
                </div>
                <div class="flex-1 space-y-2">
                  <input class="profile-contact-name w-full bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-xs font-bold text-white focus:border-rose-500 outline-none" value="${c.name}" data-index="${idx}" />
                  <input class="profile-contact-phone w-full bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-xs font-bold text-white focus:border-rose-500 outline-none" value="${c.phone}" data-index="${idx}" />
                </div>
              </div>
            `
      )
      .join("")}
          </div>
        </section>

        <section class="space-y-3">
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Diagnostics</p>
          <button id="profile-test-sms" class="w-full py-3 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-transform">
            Send Test SMS via Cloud
          </button>
          <button id="profile-transparency" class="w-full py-3 rounded-2xl bg-slate-800 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-slate-700 active:scale-95 transition-transform">
            View Transparency Report
          </button>
          <button id="profile-reset" class="w-full py-3 rounded-2xl bg-slate-900 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] border border-slate-800 active:scale-95 transition-transform">
            Reset All Data
          </button>
          <div id="profile-error" class="text-[10px] text-rose-500 font-bold mt-1 hidden"></div>
        </section>
      </div>

      <div class="pt-4 pb-6">
        <button id="profile-save" class="w-full py-4 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-transform">
          Save Changes
        </button>
      </div>
    </div>
  `;

  const showError = (msg: string) => {
    const el = document.getElementById("profile-error");
    if (el) {
      el.textContent = msg;
      el.classList.remove("hidden");
    }
  };

  document.getElementById("profile-back")?.addEventListener("click", () => {
    state.view = "dashboard";
    render();
  });

  document.getElementById("profile-transparency")?.addEventListener("click", () => {
    state.view = "transparency";
    render();
  });

  document.getElementById("profile-reset")?.addEventListener("click", () => {
    if (confirm("Reset all She Raksha data and onboarding?")) {
      localStorage.removeItem("she_raksha_stealth_v1");
      location.reload();
    }
  });

  document.getElementById("profile-save")?.addEventListener("click", () => {
    const nameInput = document.getElementById(
      "profile-name"
    ) as HTMLInputElement | null;
    const emailInput = document.getElementById(
      "profile-email"
    ) as HTMLInputElement | null;
    if (!nameInput || !emailInput) return;

    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();
    if (!newName || !newEmail.includes("@")) {
      showError("Enter a valid name and email address.");
      return;
    }

    const nameEls = document.querySelectorAll(
      ".profile-contact-name"
    ) as NodeListOf<HTMLInputElement>;
    const phoneEls = document.querySelectorAll(
      ".profile-contact-phone"
    ) as NodeListOf<HTMLInputElement>;
    const updatedContacts: Contact[] = [];

    for (let i = 0; i < nameEls.length; i++) {
      const cn = nameEls[i].value.trim();
      const cp = phoneEls[i].value.trim();
      if (cn && cp) {
        const base = state.settings!.contacts[i];
        updatedContacts.push({
          name: cn,
          phone: cp,
          avatarColor:
            base?.avatarColor || avatarColors[i % avatarColors.length],
        });
      }
    }

    if (updatedContacts.length < 2) {
      showError("Keep at least 2 guardians in your circle.");
      return;
    }

    const updatedSettings = {
      userName: newName,
      userEmail: newEmail,
      contacts: updatedContacts,
    };
    saveSettings(updatedSettings);
  });

  document
    .getElementById("profile-test-sms")
    ?.addEventListener("click", async () => {
      // Use Twilio number for testing (trial accounts can only send to verified numbers)
      const testPhone = "+13369103955"; // This is the Twilio number itself
      if (!state.settings?.contacts?.length) {
        showError("Add at least one contact before testing SMS.");
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/test-sms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: testPhone, name: state.settings?.userName }),
        });
        if (res.ok) {
          alert("✅ Test SMS sent to Twilio number! Check your phone.");
        } else {
          const data = await res.json().catch(() => ({} as any));
          showError(
            (data as any).error ||
            "Test SMS failed. Check Twilio account verification."
          );
        }
      } catch {
        showError(
          "Unable to reach cloud SMS service. Check your network/server."
        );
      }
    });
}

// --- NOTIFICATIONS VIEW ---

function renderNotifications() {
  appContainer!.innerHTML = `
    <div class="flex flex-col h-full p-8 animate-in slide-in-from-right-8 duration-500">
      <header class="flex items-center justify-between mb-6">
        <button id="noti-back" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-slate-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h2 class="text-xl font-black text-white tracking-tight">Activity Log</h2>
        <div class="w-10 h-10"></div>
      </header>

      <div class="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
        ${state.notifications.length === 0
      ? `<p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] text-center mt-8">No SOS broadcasts yet.</p>`
      : state.notifications
        .map(
          (n) => `
                <div class="glass-dark p-4 rounded-[1.75rem] flex items-center justify-between">
                  <div>
                    <p class="text-xs font-bold text-white">${n.summary}</p>
                    <p class="text-[9px] text-slate-500 font-medium mt-1">
                      ${new Date(n.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span class="text-[8px] font-black uppercase tracking-widest ${n.channel === "cloud"
              ? "text-emerald-400"
              : n.channel === "sms-fallback"
                ? "text-amber-400"
                : "text-rose-400"
            }">
                    ${n.channel === "cloud"
              ? "Cloud"
              : n.channel === "sms-fallback"
                ? "Device SMS"
                : "Error"
            }
                  </span>
                </div>
              `
        )
        .join("")
    }
      </div>
    </div>
  `;

  document.getElementById("noti-back")?.addEventListener("click", () => {
    state.view = "dashboard";
    render();
  });
}

// --- SHARED COMPONENTS ---

function renderBottomNav() {
  const nav = document.createElement("nav");
  nav.className =
    "h-20 border-t border-white/5 flex items-center justify-around px-4 mb-10 bg-slate-950/80 backdrop-blur-xl absolute bottom-0 w-full z-30";
  nav.innerHTML = `
    <button id="nav-home" class="flex flex-col items-center gap-1 ${state.view === "dashboard" ? "nav-active" : "text-slate-600"
    }">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">Home</span>
    </button>
    <button id="nav-circle" class="flex flex-col items-center gap-1 ${state.view === "circle" ? "nav-active" : "text-slate-600"
    }">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">Circle</span>
    </button>
    <button id="nav-people" class="flex flex-col items-center gap-1 ${state.view === "people" ? "nav-active" : "text-slate-600"
    }">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">People</span>
    </button>
    <button id="nav-profile" class="flex flex-col items-center gap-1 ${state.view === "profile" ? "nav-active" : "text-slate-600"
    }">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">Profile</span>
    </button>
  `;
  appContainer!.appendChild(nav);

  document.getElementById("nav-home")?.addEventListener("click", () => {
    state.view = "dashboard";
    render();
  });
  document.getElementById("nav-circle")?.addEventListener("click", () => {
    state.view = "circle";
    render();
  });
  document.getElementById("nav-people")?.addEventListener("click", () => {
    state.view = "people";
    render();
  });
  document.getElementById("nav-profile")?.addEventListener("click", () => {
    state.view = "profile";
    render();
  });
}

// --- UTILITY FUNCTIONS ---

function checkSilentMode(): boolean {
  // Create a test audio to check if silent mode is on
  const testAudio = new Audio();
  testAudio.volume = 0.00001; // Almost silent
  return testAudio.volume === 0; // If volume is forced to 0, likely in silent mode
}

function showCancelWindow() {
  const cancelDiv = document.createElement("div");
  cancelDiv.className = "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300";
  cancelDiv.innerHTML = `
    <div class="glass-dark p-8 rounded-[2rem] max-w-sm mx-4 text-center space-y-6">
      <div class="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path></svg>
      </div>
      <div>
        <h3 class="text-xl font-black text-white mb-2">SOS Activated!</h3>
        <p class="text-sm text-slate-300 mb-4">Emergency alerts are being sent to your guardians.</p>
        <div class="text-xs text-slate-500 mb-4">
          <div class="font-bold mb-2">This action:</div>
          <div class="space-y-1 text-left">
            <div>• Shares your location</div>
            <div>• Alerts all guardians</div>
            <div>• Creates incident log</div>
          </div>
        </div>
        <div class="text-xs font-bold text-amber-400 mb-4">
          You can cancel within 5 seconds
        </div>
      </div>
      <div class="flex gap-3">
        <button id="cancel-sos" class="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-sm uppercase tracking-widest">
          CANCEL
        </button>
        <button id="confirm-sos" class="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest">
          CONFIRM
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(cancelDiv);

  let countdown = 5;
  const countdownEl = cancelDiv.querySelector(".text-amber-400") as HTMLElement;

  const countdownTimer = window.setInterval(() => {
    countdown--;
    if (countdownEl) {
      countdownEl.textContent = countdown > 0 ? `You can cancel within ${countdown} seconds` : "Cannot cancel - SOS confirmed";
    }

    if (countdown <= 0) {
      window.clearInterval(countdownTimer);
      const cancelBtn = document.getElementById("cancel-sos");
      if (cancelBtn) cancelBtn.remove();
    }
  }, 1000);

  return new Promise<boolean>((resolve) => {
    const cancelBtn = document.getElementById("cancel-sos");
    const confirmBtn = document.getElementById("confirm-sos");

    cancelBtn?.addEventListener("click", () => {
      window.clearInterval(countdownTimer);
      document.body.removeChild(cancelDiv);
      resolve(false);
    });

    confirmBtn?.addEventListener("click", () => {
      window.clearInterval(countdownTimer);
      document.body.removeChild(cancelDiv);
      resolve(true);
    });

    // Auto-confirm after 5 seconds
    setTimeout(() => {
      if (document.body.contains(cancelDiv)) {
        window.clearInterval(countdownTimer);
        document.body.removeChild(cancelDiv);
        resolve(true);
      }
    }, 5000);
  });
}

// --- SOS LOGIC (TWILIO + FALLBACK) ---

async function triggerSOS() {
  const spinner = document.getElementById("sos-spinner");

  // Show cancel window first
  const confirmed = await showCancelWindow();
  if (!confirmed) {
    addNotification({
      id: String(Date.now()),
      timestamp: Date.now(),
      channel: "error",
      summary: "SOS cancelled by user.",
    });
    return;
  }

  spinner?.classList.remove("hidden");
  spinner?.classList.add("flex");

  // Check for silent mode
  const isSilent = checkSilentMode();
  if (isSilent) {
    addNotification({
      id: String(Date.now()),
      timestamp: Date.now(),
      channel: "error",
      summary: "Warning: Device is in silent mode.",
    });
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const mapsLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      const message = `🚨 SHE RAKSHA SOS ALERT 🚨\n\nI need immediate assistance!\n\n📍 Location: ${mapsLink}\n⏰ Time: ${new Date().toLocaleString()}\n\nThis is an emergency. Please contact me immediately.`;

      try {
        // 1. Backend dispatch via Twilio
        const res = await fetch(`${BACKEND_URL}/api/send-sos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderName: state.settings?.userName,
            contacts: state.settings?.contacts,
            message: message,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          addNotification({
            id: String(Date.now()),
            timestamp: Date.now(),
            channel: "cloud",
            summary: `✅ SOS sent to ${data.details?.success?.length || 0} guardians via cloud.`,
          });

          // Show success feedback
          if (data.details?.failed?.length > 0) {
            alert(`⚠️ Partial Success: ${data.details.success.length} alerts sent. ${data.details.failed.length} failed.\n\nNote: Twilio trial accounts can only send to verified numbers.`);
          } else {
            alert("✅ EMERGENCY ALERT SENT: All guardians notified successfully!");
          }
        } else {
          throw new Error("Backend dispatch failed");
        }
      } catch (err) {
        // 2. Fallback to Local Device SMS
        console.warn("Cloud SOS unreachable, fallback to local device SMS.");
        addNotification({
          id: String(Date.now()),
          timestamp: Date.now(),
          channel: "sms-fallback",
          summary: `📱 Cloud unavailable. Please manually message your guardians.`,
        });

        // Show message with phone numbers for manual copying
        const contactList = state.settings?.contacts.map(c => `${c.name}: ${c.phone}`).join('\n');
        alert(`⚠️ Cloud SMS Unavailable\n\nPlease message your guardians manually:\n\n${contactList}\n\nMessage:\n${message}`);
      } finally {
        spinner?.classList.add("hidden");
        spinner?.classList.remove("flex");
      }
    },
    (error) => {
      let errorMessage = "SOS failed: ";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "GPS permission denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "GPS information unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage += "GPS request timed out.";
          break;
        default:
          errorMessage += "Unknown GPS error.";
          break;
      }

      alert("🚫 " + errorMessage + " Enable location for accurate emergency response.");
      addNotification({
        id: String(Date.now()),
        timestamp: Date.now(),
        channel: "error",
        summary: errorMessage,
      });
      spinner?.classList.add("hidden");
      spinner?.classList.remove("flex");
    }
  );
}

// Manual SMS trigger - opens message drafts in phone app
function sendManualSMS() {
  if (!state.settings || !state.settings.contacts?.length) {
    alert("Add guardians first in Profile.");
    return;
  }

  const emergencyMessage = `🆘 EMERGENCY ALERT! ${state.settings.userName || 'Someone'} needs immediate help. Please contact emergency services. This is an automated SOS alert.`;
  
  // Open message drafts for each contact
  state.settings.contacts.forEach((contact, index) => {
    setTimeout(() => {
      // Open SMS app with pre-filled message
      window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(emergencyMessage)}`;
    }, index * 500); // Stagger openings to avoid overwhelming
  });
  
  addNotification({
    id: String(Date.now()),
    timestamp: Date.now(),
    channel: "cloud",
    summary: `Opening message drafts for ${state.settings.contacts.length} contacts`
  });
}

loadSettings();
render();
