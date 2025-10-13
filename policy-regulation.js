(()=>{"use strict";
/* obfuscated shared ticker utils for Policy page */
const S="1WN8151jGQjqbfO0Aj2tK-79yJ9gCD_z0DLCdxs_higg",
T=["Sensex ▲","NIFTY50 ▲","Brent Crude ▼","USD/INR ↔","Gold (MCX) ▲","India VIX ▼"],
U=["Mutual fund SIP inflows hit record","RBI policy unchanged","GST collection beats estimates"],
q=(e,t,r)=>`https://docs.google.com/spreadsheets/d/${e}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(t)}&range=${encodeURIComponent(r)}&t=${Date.now()}`,
c=e=>{if(((e||"").trim().startsWith("<")))return{rows:[],isHtml:!0};const t=[];let r=[],n="",o=!1;for(let i=0;i<e.length;i++){const a=e[i];if(o){if('"'===a){if('"'===e[i+1])n+='"',i++;else o=!1}else n+=a}else'"'===a?o=!0:","===a?(r.push(n),n=""):"\n"===a?(r.push(n),t.push(r),r=[],n=""):"\r"!==a&&(n+=a)}return(n.length>0||r.length>0)&&(r.push(n),t.push(r)),{rows:t,isHtml:!1}},
a=async(e,t)=>{const r=await fetch(q(S,e,t),{cache:"no-store"});if(!r.ok)throw new Error("Sheet fetch failed: "+e);const n=await r.text(),{rows:o,isHtml:i}=c(n);if(i)throw new Error("Not CSV (publish-to-web missing?)");if(!o.length)return[];const s=o[0].map(e=>e.replace(/^\uFEFF/,"").replace(/\u00A0/g," ").trim());return o.slice(1).filter(e=>e.some(e=>(e??"").toString().trim()!=="")).map(e=>Object.fromEntries(s.map((t,r)=>[t,(e[r]??"").toString().trim()])))},
d=e=>{const t=e?.parentElement?.clientWidth||0;if(!t||!e)return;for(;e.scrollWidth<t*2;)[...e.children].forEach(t=>e.appendChild(t.cloneNode(!0)))},
l=(e,t,r="right")=>{const n=document.getElementById(e);if(!n)return;n.classList.remove("ticker-left","ticker-right"),n.innerHTML="";const o=t&&t.length?t:"topTicker"===e?T:U;[...o,...o].forEach(e=>{const t=document.createElement("span");t.textContent=String(e||"").trim(),n.appendChild(t)}),d(n),void n.offsetWidth,n.classList.add("right"===r?"ticker-right":"ticker-left","ticker")},
h=async()=>{try{const e=await a("Headlines","A:B"),t=e.filter(e=>/^top$/i.test(e.Section||"")).map(e=>e.Text).filter(Boolean),r=e.filter(e=>/^bottom$/i.test(e.Section||"")).map(e=>e.Text).filter(Boolean);t.length&&l("topTicker",t,"right"),r.length&&l("bottomTicker",r,"left")}catch(e){console.warn("Headlines error",e?.message||e),l("topTicker",T,"right"),l("bottomTicker",U,"left")}},
y=()=>{const e=document.getElementById("year");e&&(e.textContent=(new Date).getFullYear().toString())},
g=()=>{let e;window.addEventListener("resize",()=>{cancelAnimationFrame(e),e=requestAnimationFrame(()=>{d(document.getElementById("topTicker")),d(document.getElementById("bottomTicker"))})})},
m=()=>{y(),l("topTicker",T,"right"),l("bottomTicker",U,"left"),h();const e=setInterval(h,3e5);window.addEventListener("pagehide",()=>clearInterval(e)),g()};
document.addEventListener("DOMContentLoaded",m);
})();
