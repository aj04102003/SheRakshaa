(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const t={view:"onboarding",onboardingStep:1,settings:null,notifications:[],sosActive:!1,sosCountdown:0,currentLocation:null,tapCount:0,lastTapTime:0,longPressTimer:null},M="112",B=window.location.hostname==="localhost"?"http://localhost:3000/api":"/api",C=new Audio("original_iphone.mp3");C.loop=!0;C.volume=1;let p=null,$=null,I=[];const E=["#f43f5e","#3b82f6","#10b981","#f59e0b","#8b5cf6"],m=document.getElementById("app");function P(){p||(p=L.map("people-map",{}).setView([28.6139,77.209],15),L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:"OpenStreetMap contributors CARTO",subdomains:"abcd",maxZoom:19}).addTo(p))}function N(){if(p||P(),p&&t.currentLocation){const{lat:e,lng:a}=t.currentLocation;$&&p.removeLayer($),$=L.marker([e,a],{icon:L.divIcon({className:"user-location-marker",html:'<div style="background: #f43f5e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',iconSize:[20,20],iconAnchor:[10,10]})}).bindPopup("Your Location").addTo(p),O(),p.setView([e,a],15),setTimeout(()=>{p==null||p.invalidateSize()},100)}}function O(){if(I.forEach(s=>{p==null||p.removeLayer(s)}),I=[],!p||!t.currentLocation)return;const{lat:e,lng:a}=t.currentLocation;[{name:"University Campus",lat:e+.01,lng:a-.01},{name:"Police Station",lat:e-.008,lng:a+.012},{name:"Hospital",lat:e+.005,lng:a+.008}].forEach(s=>{const n=L.marker([s.lat,s.lng],{icon:L.divIcon({className:"safe-zone-marker",html:'<div style="background: #6366f1; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',iconSize:[16,16],iconAnchor:[8,8]})}).bindPopup(s.name).addTo(p);I.push(n)})}function T(){navigator.geolocation?navigator.geolocation.getCurrentPosition(e=>{t.currentLocation={lat:e.coords.latitude,lng:e.coords.longitude},N()},e=>{console.error("Error getting location:",e);let a="Location access denied.";switch(e.code){case e.PERMISSION_DENIED:a="Location permission denied. Please enable location access.";break;case e.POSITION_UNAVAILABLE:a="Location information unavailable.";break;case e.TIMEOUT:a="Location request timed out.";break}const o=document.getElementById("map");o&&(o.innerHTML=`
            <div class="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <p class="text-sm text-rose-400">${a}</p>
              <button onclick="updateCurrentLocation()" class="mt-2 px-3 py-1 bg-rose-600 text-white rounded-lg text-xs">
                Retry
              </button>
            </div>
          `)}):console.error("Geolocation is not supported by this browser.")}function z(){const e=localStorage.getItem("she_raksha_stealth_v1");e?(t.settings=JSON.parse(e),t.view="dashboard"):(t.view="onboarding",t.onboardingStep=1)}function A(e){localStorage.setItem("she_raksha_stealth_v1",JSON.stringify(e)),t.settings=e,t.view="dashboard",u()}function w(e){t.notifications.unshift(e)}function u(){m&&(m.innerHTML="",t.view==="onboarding"?D():t.view==="fakecall"?G():t.view==="profile"?U():t.view==="notifications"?F():t.view==="transparency"?q():(t.view==="dashboard"?R():t.view==="circle"?H():t.view==="people"&&V(),Y()))}function D(){var e,a,o;t.onboardingStep===1?(m.innerHTML=`
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
    `,(e=document.getElementById("btn-to-step2"))==null||e.addEventListener("click",()=>{const s=document.getElementById("on-name").value.trim(),n=document.getElementById("on-email").value.trim();if(!s||!n.includes("@")){const i=document.getElementById("on-error");i.innerText="Invalid Details Provided",i.classList.remove("hidden");return}t.settings={userName:s,userEmail:n,contacts:[]},t.onboardingStep=2,u()})):(m.innerHTML=`
      <div class="flex flex-col h-full p-10 animate-in fade-in slide-in-from-right-8 duration-500">
        <div class="mt-12 flex-1">
          <div class="flex items-center gap-4 mb-10">
            <button id="btn-back-step1" class="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h2 class="text-2xl font-black text-white">Safety Circle</h2>
          </div>

          <div class="space-y-4 overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
            ${[1,2,3,4,5].map(s=>`
              <div class="glass-dark p-6 rounded-[2rem] space-y-3">
                <input class="c-name w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" placeholder="Guardian Name ${s}">
                <input class="c-phone w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" type="tel" placeholder="Mobile Number">
              </div>
            `).join("")}
          </div>
        </div>
        
        <div class="pb-10 pt-4">
          <div id="on-error-2" class="text-rose-500 text-center text-[10px] font-bold mb-4 hidden uppercase tracking-widest"></div>
          <button id="btn-activate" class="w-full bg-rose-600 text-white font-black py-6 rounded-[2rem] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(225,29,72,0.4)]">
            ACTIVATE SHE RAKSHA
          </button>
        </div>
      </div>
    `,(a=document.getElementById("btn-back-step1"))==null||a.addEventListener("click",()=>{t.onboardingStep=1,u()}),(o=document.getElementById("btn-activate"))==null||o.addEventListener("click",()=>{const s=document.querySelectorAll(".c-name"),n=document.querySelectorAll(".c-phone"),i=[];for(let l=0;l<s.length;l++){const d=s[l].value.trim(),c=n[l].value.trim();d&&c&&i.push({name:d,phone:c,avatarColor:E[l%E.length]})}if(i.length<2){const l=document.getElementById("on-error-2");l.innerText="Add at least 2 guardians",l.classList.remove("hidden");return}A({...t.settings,contacts:i})}))}function R(){var d,c,f,h,v,b,x,g;const e=navigator.onLine;m.innerHTML=`
    <div class="flex flex-col h-full animate-in fade-in duration-500">
      <header class="flex justify-between items-center p-6 pb-2">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tighter mt-1">Hi, ${(d=t.settings)==null?void 0:d.userName.split(" ")[0]}!</h2>
          <p class="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mt-1">Protection Enabled</p>
        </div>
        <div class="flex gap-3">
          <button id="btn-notifications" class="w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white/60 relative hover:bg-white/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            ${t.notifications.length>0?`
              <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-400 border border-white"></span>
            `:""}
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto no-scrollbar px-6 pb-24 mb-10">
        ${e?"":`
          <div class="mb-4 p-3 glass-dark rounded-2xl flex items-center gap-3 border border-amber-400/30">
            <svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
            <div>
              <p class="text-xs font-bold text-amber-400">Internet Required</p>
              <p class="text-[9px] text-amber-300">Cloud SMS features may not work</p>
            </div>
          </div>
        `}

        <div class="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          ${(c=t.settings)==null?void 0:c.contacts.map(r=>`
          <div class="flex flex-col items-center gap-2 flex-shrink-0">
             <div class="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center font-black text-white text-lg" style="background-color: ${r.avatarColor}">
               ${r.name[0]}
             </div>
             <span class="text-[9px] font-bold text-white/60 uppercase tracking-widest">${r.name.split(" ")[0]}</span>
          </div>
        `).join("")}
        </div>

        <div class="flex-1 flex flex-col items-center justify-center py-10">
          <div class="relative">
            <div id="sos-trigger" class="w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer border-2 border-white/30 sos-pulse-shadow sos-blink-glow">
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path></svg>
              <div id="sos-spinner" class="absolute inset-0 w-32 h-32 rounded-full border-4 border-white/30 hidden"></div>
            </div>
            
          </div>
          
          <div class="mt-6 flex gap-2">
            ${[...Array(5)].map((r,k)=>`
              <div id="tap-indicator-${k}" class="w-2 h-2 rounded-full bg-gray-600 transition-all duration-300"></div>
            `).join("")}
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-[10px] text-white/60 font-medium">2 taps: Emergency • 5+ taps: Call 112 • Long press: Emergency</p>
          </div>
          <p class="text-white font-black text-lg mt-8 mb-2">SOS EMERGENCY</p>
          <p class="text-white/80 text-[10px] font-medium uppercase tracking-widest">Press & Hold 3 Seconds</p>
          
          <div class="mt-8 flex flex-col items-center gap-3">
             <div class="flex -space-x-2">
               ${(f=t.settings)==null?void 0:f.contacts.slice(0,3).map(r=>`<div class="w-8 h-8 rounded-full border-2 border-white/30 glass-dark flex items-center justify-center text-[8px] font-black text-white" style="background-color: ${r.avatarColor}">${r.name[0]}</div>`).join("")}
           </div>
           <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest">Broadcasting to ${(h=t.settings)==null?void 0:h.contacts.length} Guardians</p>
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
 `;const a=document.getElementById("sos-trigger"),o=()=>{const r=Date.now();r-t.lastTapTime>1500&&(t.tapCount=0),t.tapCount++,t.lastTapTime=r;for(let y=0;y<5;y++){const S=document.getElementById(`tap-indicator-${y}`);S&&(y<t.tapCount?S.className="w-2 h-2 rounded-full bg-rose-500 scale-150 shadow-lg shadow-rose-500/50 transition-all duration-300":S.className="w-2 h-2 rounded-full bg-gray-600 transition-all duration-300")}t.tapCount===2&&setTimeout(()=>{t.tapCount===2&&(j(),i())},300),t.tapCount>=5&&(l(),i()),setTimeout(()=>{t.tapCount<5&&i()},1500)},s=()=>{t.longPressTimer=window.setTimeout(()=>{j(),i()},2e3),a==null||a.classList.add("sos-urgent-pulse")},n=()=>{t.longPressTimer&&(window.clearTimeout(t.longPressTimer),t.longPressTimer=null),a==null||a.classList.remove("sos-urgent-pulse")},i=()=>{t.tapCount=0,t.lastTapTime=0;for(let r=0;r<5;r++){const k=document.getElementById(`tap-indicator-${r}`);k&&(k.className="w-2 h-2 rounded-full bg-gray-600 transition-all duration-300")}},l=()=>{window.location.href=`tel:${M}`,w({id:String(Date.now()),timestamp:Date.now(),channel:"cloud",summary:`Calling emergency: ${M}`})};a==null||a.addEventListener("click",o),a==null||a.addEventListener("mousedown",s),a==null||a.addEventListener("touchstart",r=>{r.preventDefault(),s()}),a==null||a.addEventListener("mouseup",n),a==null||a.addEventListener("mouseleave",n),a==null||a.addEventListener("touchend",r=>{r.preventDefault(),n()}),a==null||a.addEventListener("touchcancel",n),(v=document.getElementById("refresh-location"))==null||v.addEventListener("click",()=>{T()}),T(),(b=document.getElementById("ghost-trigger"))==null||b.addEventListener("click",()=>{t.view="fakecall",u()}),(x=document.getElementById("manual-sms"))==null||x.addEventListener("click",()=>{W()}),(g=document.getElementById("btn-notifications"))==null||g.addEventListener("click",()=>{t.view="notifications",u()})}function H(){var e,a;m.innerHTML=`
    <div class="flex flex-col h-full p-8 animate-in slide-in-from-right-8 duration-500">
      <header class="mb-8">
        <h2 class="text-4xl font-black text-white tracking-tighter">Guardians</h2>
        <p class="text-white/80 font-bold uppercase tracking-widest text-[9px] mt-1">Manage Safety Circle</p>
      </header>
      
      <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        ${(e=t.settings)==null?void 0:e.contacts.map((o,s)=>`
          <div class="glass-dark p-5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/20 transition-all duration-200 border border-white/20">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-lg border-2 border-white/30" style="background-color: ${o.avatarColor}">
                ${o.name[0]}
              </div>
              <div>
                <h4 class="font-bold text-white">${o.name}</h4>
                <p class="text-[10px] text-white/60 font-medium">${o.phone}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors message-btn" data-phone="${o.phone}" data-name="${o.name}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </button>
              <button class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors call-btn" data-phone="${o.phone}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </button>
            </div>
          </div>
        `).join("")}
        
        <button id="btn-add-guardian" class="w-full p-6 border-2 border-dashed border-white/30 rounded-[2.5rem] flex items-center justify-center gap-3 text-white/60 hover:bg-white/20 hover:border-white/50 transition-all duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="font-bold text-xs uppercase tracking-widest">Expand Network</span>
        </button>
      </div>
    </div>
  `,(a=document.getElementById("btn-add-guardian"))==null||a.addEventListener("click",()=>{_()}),document.querySelectorAll(".call-btn").forEach(o=>{o.addEventListener("click",s=>{const n=s.currentTarget.dataset.phone;n&&(window.location.href=`tel:${n}`,w({id:String(Date.now()),timestamp:Date.now(),channel:"cloud",summary:`Calling ${n}`}))})}),document.querySelectorAll(".message-btn").forEach(o=>{o.addEventListener("click",s=>{var l;const n=s.currentTarget.dataset.phone,i=s.currentTarget.dataset.name;if(n&&i){const d=t.currentLocation?` Location: https://maps.google.com/?q=${t.currentLocation.lat},${t.currentLocation.lng}`:" Location unavailable",c=`🆘 EMERGENCY ALERT! ${((l=t.settings)==null?void 0:l.userName)||"Someone"} needs immediate help!${d} Please contact emergency services immediately. This is an automated SOS alert from SheRaksha app.`;window.location.href=`sms:${n}?body=${encodeURIComponent(c)}`,w({id:String(Date.now()),timestamp:Date.now(),channel:"cloud",summary:`Opening emergency message for ${i}`})}})})}function _(){var a,o;const e=document.createElement("div");e.className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-6",e.innerHTML=`
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
  `,document.body.appendChild(e),(a=document.getElementById("cancel-add-guardian"))==null||a.addEventListener("click",()=>{document.body.removeChild(e)}),(o=document.getElementById("confirm-add-guardian"))==null||o.addEventListener("click",()=>{var c;const s=document.getElementById("new-guardian-name"),n=document.getElementById("new-guardian-phone"),i=s.value.trim(),l=n.value.trim();if(!i||l.length<10){alert("Please enter valid name and phone number");return}const d={name:i,phone:l,avatarColor:E[((c=t.settings)==null?void 0:c.contacts.length)||0%E.length]};t.settings&&(t.settings.contacts.push(d),A(t.settings)),document.body.removeChild(e),u()})}function V(){var e,a,o;m.innerHTML=`
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
          ${t.currentLocation?`
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"></div>
          `:`
            <div class="text-center z-10">
              <svg class="w-16 h-16 text-white/60 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <p class="text-sm text-white/80 font-medium">Getting location...</p>
              <button onclick="updateCurrentLocation()" class="mt-3 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                Retry
              </button>
            </div>
          `}
        </div>
        ${t.currentLocation?`
          <div class="mt-3 p-3 glass-dark rounded-xl border border-white/20">
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-white/80 font-medium">
                📍 ${t.currentLocation.lat.toFixed(6)}, ${t.currentLocation.lng.toFixed(6)}
              </p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span class="text-[9px] text-emerald-400 font-bold">LIVE</span>
              </div>
            </div>
          </div>
        `:`
          <div class="mt-3 p-3 glass-dark rounded-xl border border-amber-400/30">
            <p class="text-[10px] text-amber-400 font-medium">Location access required for safety features</p>
          </div>
        `}
      </div>

      <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        <div class="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2">Verified Communities</div>
        ${["University Campus","Railway Police Post","24/7 MedCare Hub"].map((s,n)=>`
          <div class="glass-dark p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer safe-place hover:bg-white/20 transition-all duration-200 border border-white/20" data-place="${s}">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <h4 class="font-bold text-white text-sm">${s}</h4>
                <p class="text-[9px] text-white/60 font-medium">${(n+1)*.4} KM Away • High Activity</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        `).join("")}
      </div>
      <div class="mt-4 space-y-3">
        <button id="people-helpline" class="w-full py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:bg-white/30 border border-white/20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          Call ${M}
        </button>
        <button id="people-sos" class="w-full py-4 rounded-2xl glass-dark text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:bg-white/20 border border-white/20">
          <svg class="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path></svg>
          Quick SOS Broadcast
        </button>
      </div>
    </div>
  `,setTimeout(()=>{t.currentLocation?N():T()},100),(e=document.getElementById("refresh-location-people"))==null||e.addEventListener("click",()=>{T()}),document.querySelectorAll(".safe-place").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.place||"Safe zone",i=encodeURIComponent(n+" near me");window.open(`https://www.google.com/maps/search/${i}`,"_blank")})}),(a=document.getElementById("people-helpline"))==null||a.addEventListener("click",()=>{window.location.href=`tel:${M}`}),(o=document.getElementById("people-sos"))==null||o.addEventListener("click",()=>{j()})}function G(){var a,o;m.innerHTML=`
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
  `,C.play().catch(()=>{});const e=()=>{C.pause(),C.currentTime=0,t.view="dashboard",u()};(a=document.getElementById("end-call"))==null||a.addEventListener("click",e),(o=document.getElementById("accept-call"))==null||o.addEventListener("click",e)}function q(){var e;m.innerHTML=`
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
  `,(e=document.getElementById("transparency-back"))==null||e.addEventListener("click",()=>{t.view="profile",u()})}function U(){var o,s,n,i,l;if(!t.settings){t.view="onboarding",u();return}const e=t.settings;m.innerHTML=`
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
              ${e.userName[0]}
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-widest text-slate-500 font-black">Primary Identity</p>
              <h3 class="text-lg font-black text-white">${e.userName}</h3>
            </div>
          </div>
          <div class="space-y-3 mt-4">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input id="profile-name" value="${e.userName}" class="w-full mt-1 bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <input id="profile-email" value="${e.userEmail}" class="w-full mt-1 bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white focus:border-rose-500 outline-none" />
            </div>
          </div>
        </section>

        <section class="space-y-3">
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Safety Circle</p>
          <div class="space-y-3">
            ${e.contacts.map((d,c)=>`
              <div class="glass-dark p-4 rounded-[1.75rem] flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm" style="background-color: ${d.avatarColor}">
                  ${d.name[0]}
                </div>
                <div class="flex-1 space-y-2">
                  <input class="profile-contact-name w-full bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-xs font-bold text-white focus:border-rose-500 outline-none" value="${d.name}" data-index="${c}" />
                  <input class="profile-contact-phone w-full bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-xs font-bold text-white focus:border-rose-500 outline-none" value="${d.phone}" data-index="${c}" />
                </div>
              </div>
            `).join("")}
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
  `;const a=d=>{const c=document.getElementById("profile-error");c&&(c.textContent=d,c.classList.remove("hidden"))};(o=document.getElementById("profile-back"))==null||o.addEventListener("click",()=>{t.view="dashboard",u()}),(s=document.getElementById("profile-transparency"))==null||s.addEventListener("click",()=>{t.view="transparency",u()}),(n=document.getElementById("profile-reset"))==null||n.addEventListener("click",()=>{confirm("Reset all She Raksha data and onboarding?")&&(localStorage.removeItem("she_raksha_stealth_v1"),location.reload())}),(i=document.getElementById("profile-save"))==null||i.addEventListener("click",()=>{const d=document.getElementById("profile-name"),c=document.getElementById("profile-email");if(!d||!c)return;const f=d.value.trim(),h=c.value.trim();if(!f||!h.includes("@")){a("Enter a valid name and email address.");return}const v=document.querySelectorAll(".profile-contact-name"),b=document.querySelectorAll(".profile-contact-phone"),x=[];for(let r=0;r<v.length;r++){const k=v[r].value.trim(),y=b[r].value.trim();if(k&&y){const S=t.settings.contacts[r];x.push({name:k,phone:y,avatarColor:(S==null?void 0:S.avatarColor)||E[r%E.length]})}}if(x.length<2){a("Keep at least 2 guardians in your circle.");return}A({userName:f,userEmail:h,contacts:x})}),(l=document.getElementById("profile-test-sms"))==null||l.addEventListener("click",async()=>{var c,f,h;const d="+13369103955";if(!((f=(c=t.settings)==null?void 0:c.contacts)!=null&&f.length)){a("Add at least one contact before testing SMS.");return}try{const v=await fetch(`${B}/test-sms`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:d,name:(h=t.settings)==null?void 0:h.userName})});if(v.ok)alert("✅ Test SMS sent to Twilio number! Check your phone.");else{const b=await v.json().catch(()=>({}));a(b.error||"Test SMS failed. Check Twilio account verification.")}}catch{a("Unable to reach cloud SMS service. Check your network/server.")}})}function F(){var e;m.innerHTML=`
    <div class="flex flex-col h-full p-8 animate-in slide-in-from-right-8 duration-500">
      <header class="flex items-center justify-between mb-6">
        <button id="noti-back" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-slate-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h2 class="text-xl font-black text-white tracking-tight">Activity Log</h2>
        <div class="w-10 h-10"></div>
      </header>

      <div class="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
        ${t.notifications.length===0?'<p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] text-center mt-8">No SOS broadcasts yet.</p>':t.notifications.map(a=>`
                <div class="glass-dark p-4 rounded-[1.75rem] flex items-center justify-between">
                  <div>
                    <p class="text-xs font-bold text-white">${a.summary}</p>
                    <p class="text-[9px] text-slate-500 font-medium mt-1">
                      ${new Date(a.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span class="text-[8px] font-black uppercase tracking-widest ${a.channel==="cloud"?"text-emerald-400":a.channel==="sms-fallback"?"text-amber-400":"text-rose-400"}">
                    ${a.channel==="cloud"?"Cloud":a.channel==="sms-fallback"?"Device SMS":"Error"}
                  </span>
                </div>
              `).join("")}
      </div>
    </div>
  `,(e=document.getElementById("noti-back"))==null||e.addEventListener("click",()=>{t.view="dashboard",u()})}function Y(){var a,o,s,n;const e=document.createElement("nav");e.className="h-20 border-t border-white/5 flex items-center justify-around px-4 mb-10 bg-slate-950/80 backdrop-blur-xl absolute bottom-0 w-full z-30",e.innerHTML=`
    <button id="nav-home" class="flex flex-col items-center gap-1 ${t.view==="dashboard"?"nav-active":"text-slate-600"}">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">Home</span>
    </button>
    <button id="nav-circle" class="flex flex-col items-center gap-1 ${t.view==="circle"?"nav-active":"text-slate-600"}">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">Circle</span>
    </button>
    <button id="nav-people" class="flex flex-col items-center gap-1 ${t.view==="people"?"nav-active":"text-slate-600"}">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">People</span>
    </button>
    <button id="nav-profile" class="flex flex-col items-center gap-1 ${t.view==="profile"?"nav-active":"text-slate-600"}">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      <span class="text-[8px] font-black uppercase tracking-widest">Profile</span>
    </button>
  `,m.appendChild(e),(a=document.getElementById("nav-home"))==null||a.addEventListener("click",()=>{t.view="dashboard",u()}),(o=document.getElementById("nav-circle"))==null||o.addEventListener("click",()=>{t.view="circle",u()}),(s=document.getElementById("nav-people"))==null||s.addEventListener("click",()=>{t.view="people",u()}),(n=document.getElementById("nav-profile"))==null||n.addEventListener("click",()=>{t.view="profile",u()})}function Z(){const e=new Audio;return e.volume=1e-5,e.volume===0}function K(){const e=document.createElement("div");e.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300",e.innerHTML=`
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
  `,document.body.appendChild(e);let a=5;const o=e.querySelector(".text-amber-400"),s=window.setInterval(()=>{if(a--,o&&(o.textContent=a>0?`You can cancel within ${a} seconds`:"Cannot cancel - SOS confirmed"),a<=0){window.clearInterval(s);const n=document.getElementById("cancel-sos");n&&n.remove()}},1e3);return new Promise(n=>{const i=document.getElementById("cancel-sos"),l=document.getElementById("confirm-sos");i==null||i.addEventListener("click",()=>{window.clearInterval(s),document.body.removeChild(e),n(!1)}),l==null||l.addEventListener("click",()=>{window.clearInterval(s),document.body.removeChild(e),n(!0)}),setTimeout(()=>{document.body.contains(e)&&(window.clearInterval(s),document.body.removeChild(e),n(!0))},5e3)})}async function j(){const e=document.getElementById("sos-spinner");if(!await K()){w({id:String(Date.now()),timestamp:Date.now(),channel:"error",summary:"SOS cancelled by user."});return}e==null||e.classList.remove("hidden"),e==null||e.classList.add("flex"),Z()&&w({id:String(Date.now()),timestamp:Date.now(),channel:"error",summary:"Warning: Device is in silent mode."}),navigator.geolocation.getCurrentPosition(async s=>{var l,d,c,f,h,v,b;const i=`🚨 SHE RAKSHA SOS ALERT 🚨

I need immediate assistance!

📍 Location: ${`https://www.google.com/maps?q=${s.coords.latitude},${s.coords.longitude}`}
⏰ Time: ${new Date().toLocaleString()}

This is an emergency. Please contact me immediately.`;try{const x=await fetch(`${B}/send-sos`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({senderName:(l=t.settings)==null?void 0:l.userName,contacts:(d=t.settings)==null?void 0:d.contacts,message:i})});if(x.ok){const g=await x.json();w({id:String(Date.now()),timestamp:Date.now(),channel:"cloud",summary:`✅ SOS sent to ${((f=(c=g.details)==null?void 0:c.success)==null?void 0:f.length)||0} guardians via cloud.`}),((v=(h=g.details)==null?void 0:h.failed)==null?void 0:v.length)>0?alert(`⚠️ Partial Success: ${g.details.success.length} alerts sent. ${g.details.failed.length} failed.

Note: Twilio trial accounts can only send to verified numbers.`):alert("✅ EMERGENCY ALERT SENT: All guardians notified successfully!")}else throw new Error("Backend dispatch failed")}catch{console.warn("Cloud SOS unreachable, fallback to local device SMS."),w({id:String(Date.now()),timestamp:Date.now(),channel:"sms-fallback",summary:"📱 Cloud unavailable. Please manually message your guardians."});const g=(b=t.settings)==null?void 0:b.contacts.map(r=>`${r.name}: ${r.phone}`).join(`
`);alert(`⚠️ Cloud SMS Unavailable

Please message your guardians manually:

${g}

Message:
${i}`)}finally{e==null||e.classList.add("hidden"),e==null||e.classList.remove("flex")}},s=>{let n="SOS failed: ";switch(s.code){case s.PERMISSION_DENIED:n+="GPS permission denied.";break;case s.POSITION_UNAVAILABLE:n+="GPS information unavailable.";break;case s.TIMEOUT:n+="GPS request timed out.";break;default:n+="Unknown GPS error.";break}alert("🚫 "+n+" Enable location for accurate emergency response."),w({id:String(Date.now()),timestamp:Date.now(),channel:"error",summary:n}),e==null||e.classList.add("hidden"),e==null||e.classList.remove("flex")})}function W(){var a;if(!t.settings||!((a=t.settings.contacts)!=null&&a.length)){alert("Add guardians first in Profile.");return}const e=`🆘 EMERGENCY ALERT! ${t.settings.userName||"Someone"} needs immediate help. Please contact emergency services. This is an automated SOS alert.`;t.settings.contacts.forEach((o,s)=>{setTimeout(()=>{window.location.href=`sms:${o.phone}?body=${encodeURIComponent(e)}`},s*500)}),w({id:String(Date.now()),timestamp:Date.now(),channel:"cloud",summary:`Opening message drafts for ${t.settings.contacts.length} contacts`})}z();u();
