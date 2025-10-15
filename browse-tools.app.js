/*! browse-tools.app.min.js */
!function(){"use strict";
const a="1WN8151jGQjqbfO0Aj2tK-79yJ9gCD_z0DLCdxs_higg",b="Headlines",c="A:C",d="https://docs.google.com/spreadsheets/d/"+a+"/gviz/tq?tqx=out:csv&sheet="+encodeURIComponent(b)+"&range="+encodeURIComponent(c);
(function(){try{const e=document.createElement("link");e.rel="prefetch",e.as="fetch",e.crossOrigin="anonymous",e.href=d,document.head.appendChild(e)}catch(e){}})();
function e(t){const n=[];let r=[],o="",i=!1;for(let s=0;s<t.length;s++){const l=t[s];if(i)if('"'===l)'"'===t[s+1]?(o+='"',s++):i=!1;else o+=l;else'"'===l?i=!0:","===l?(r.push(o),o=""):"\n"===l?(r.push(o),n.push(r),r=[],o=""):"\r"!==l&&(o+=l)}return(o.length||r.length)&&(r.push(o),n.push(r)),n}
function f(t,n){const r=(n||[]).join(" • ").length||120,o=Math.min(140,Math.max(60,Math.round(r/1.8)));try{t.style.setProperty("--dur",o+"s")}catch(e){t.style&&(t.style.animationDuration=o+"s")}}
function g(t,n,r){if(!t||!Array.isArray(n)||!n.length)return;t.className="ticker "+("right"===r?"ticker-right":"ticker-left")+" "+("botTicker"===t.id?"text-sm text-slate-700":"text-sm font-medium"),t.innerHTML="";const o=n.concat(n),i=document.createDocumentFragment();for(let s=0;s<o.length;s++){const l=document.createElement("span");l.textContent=o[s],i.appendChild(l)}t.appendChild(i),f(t,n)}
function h(t){if(!t)return;const n=t.filter(t=>((t.section||"")+"").toLowerCase()==="top").map(t=>t.text).filter(Boolean),r=t.filter(t=>((t.section||"")+"").toLowerCase()==="bottom").map(t=>t.text).filter(Boolean);g(document.getElementById("topTicker"),n,"right"),g(document.getElementById("botTicker"),r,"left")}
async function j(){try{const t=await fetch(d,{cache:"no-store",credentials:"omit"});if(!t.ok)return null;const n=(await t.text()||"").trim();if(n.startsWith("<"))return[];const r=e(n);if(!r.length)return[];const o=r[0].map(t=>t.replace(/^\uFEFF/,"").trim().toLowerCase()),i=o.indexOf("section"),s=o.indexOf("text");if(i<0||s<0)return[];return r.slice(1).map(t=>({section:(t[i]||"").trim(),text:(t[s]||"").trim()})).filter(t=>t.text)}catch(t){return null}}
function k(){const t=document.getElementById("toolSearch");if(!t)return;const n=[].slice.call(document.querySelectorAll(".tool-card"));function r(){const r=(t.value||"").toLowerCase().trim();n.forEach(t=>{const n=(t.textContent+" "+(t.getAttribute("data-keywords")||"")).toLowerCase();t.style.display=n.includes(r)?"":"none"})}t.addEventListener("input",r)}
function l(){const t=document.getElementById("year");t&&(t.textContent=String((new Date).getFullYear()))}
function m(){try{if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.querySelectorAll(".ticker-left, .ticker-right").forEach(t=>{t.style.animation="none"})}}catch(t){}}
async function n(){l(),m(),k();const t=await j();t&&h(t)}
document.addEventListener("DOMContentLoaded",n,{once:!0});
}();
