(()=>{"use strict";
/* ===== Contact page: obfuscated script ===== */
const e="1WN8151jGQjqbfO0Aj2tK-79yJ9gCD_z0DLCdxs_higg",t="Headlines",n="A:C",o=`https://docs.google.com/spreadsheets/d/${e}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(t)}&range=${encodeURIComponent(n)}`;(function(){try{const e=document.createElement("link");e.rel="prefetch",e.href=o,e.as="fetch",e.crossOrigin="anonymous",document.head.appendChild(e)}catch{}})();
function r(e){const t=[];let n=[],o="",r=!1;for(let i=0;i<e.length;i++){const l=e[i];if(r){if('"'===l){if('"'===e[i+1])o+='"',i++;else r=!1}else o+=l}else'"'===l?r=!0:","===l?(n.push(o),o=""):"\n"===l?(n.push(o),t.push(n),n=[],o=""):"\r"!==l&&(o+=l)}return(o.length>0||n.length>0)&&(n.push(o),t.push(n)),t}
const i="bs_headlines_v2",l=9e5;function s(){try{const e=localStorage.getItem(i);if(!e)return null;const{ts:t,data:n}=JSON.parse(e);return Date.now()-t>l?null:n}catch{return null}}function a(e){try{localStorage.setItem(i,JSON.stringify({ts:Date.now(),data:e}))}catch{}}
function c(e,t={},n=700){return new Promise((o,r)=>{const i=new AbortController,l=setTimeout(()=>{i.abort(),r(new Error("timeout"))},n);fetch(e,{...t,signal:i.signal,cache:"force-cache",credentials:"omit"}).then(e=>{clearTimeout(l),o(e)}).catch(e=>{clearTimeout(l),r(e)})})}
async function d(){try{const e=await c(o);if(!e.ok)throw new Error("HTTP "+e.status);const t=await e.text();if(t.trim().startsWith("<"))return[];const n=r(t);if(!n.length)return[];const o=n[0].map(e=>e.replace(/^\uFEFF/,"").trim().toLowerCase()),i=o.indexOf("section"),l=o.indexOf("text");return i<0||l<0?[]:n.slice(1).map(e=>({section:(e[i]||"").toLowerCase().trim(),text:(e[l]||"").trim()})).filter(e=>e.text)}catch{return null}}
function u(e,t){const n=(t||[]).join(" • ").length||120,o=Math.min(140,Math.max(60,Math.round(n/1.8)));e.style.setProperty("--dur",o+"s")}
function f(e,t,n){if(!e||!(null==t?void 0:t.length))return;e.className=`ticker ${"right"===n?"ticker-right":"ticker-left"} ${"botTicker"===e.id?"text-sm text-slate-700":"text-sm font-medium"}`,e.innerHTML="";const o=t.concat(t);o.forEach(t=>{const n=document.createElement("span");n.textContent=t,e.appendChild(n)}),u(e,t)}
function p(e){const t=document.getElementById("topTicker"),n=document.getElementById("botTicker");if(!e)return;const o=e.filter(e=>"top"===e.section).map(e=>e.text),r=e.filter(e=>"bottom"===e.section).map(e=>e.text);o.length&&f(t,o,"right"),r.length&&f(n,r,"left")}
async function h(){if(!("serviceWorker"in navigator))return;const e=`const CACHE='bs-tickers-v1';const HL_URL=${JSON.stringify(o)};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(e=>e.add(HL_URL)).catch(()=>{}));self.skipWaiting()});self.addEventListener('activate',e=>{self.clients.claim()});self.addEventListener('fetch',e=>{const t=new URL(e.request.url);if(t.href===HL_URL){e.respondWith((async()=>{const t=await caches.open(CACHE),n=await t.match(HL_URL),o=fetch(HL_URL,{cache:'no-store'}).then(async e=>{return e.ok&&(await t.put(HL_URL,e.clone()),A()),e}).catch(()=>null);return n||o||fetch(HL_URL,{cache:'force-cache'})})())}});async function A(){const e=await self.clients.matchAll({includeUncontrolled:!0,type:'window'});for(const t of e)t.postMessage({type:'bs:hl-updated'})}}`;try{const t=new Blob([e],{type:"text/javascript"}),n=URL.createObjectURL(t);await navigator.serviceWorker.register(n,{scope:"./"})}catch{}}
null==navigator||null==navigator.serviceWorker||null==navigator.serviceWorker.addEventListener||navigator.serviceWorker.addEventListener("message",async e=>{var t;if((null==(t=e)||null==t.data?void 0:t.data).type==="bs:hl-updated"){const e=await fetch(o,{cache:"force-cache"});if(e.ok){const t=await e.text();if(!t.trim().startsWith("<")){const e=r(t);if(e.length){const t=e[0].map(e=>e.replace(/^\uFEFF/,"").trim().toLowerCase()),n=t.indexOf("section"),o=t.indexOf("text");if(n>=0&&o>=0){const t=e.slice(1).map(e=>({section:(e[n]||"").toLowerCase().trim(),text:(e[o]||"").trim()})).filter(e=>e.text);a(t),p(t)}}}}});
function m(){const e=encodeURIComponent("[bataSutra] Support request"),t=encodeURIComponent(`Issue:
Steps to reproduce:
1)
2)
3)

Page/URL:
Screenshot link (optional):

Browser/Device:
Account email (if any):`);return`mailto:support@batasutra.in?subject=${e}&body=${t}`}
async function v(){var e;document.getElementById("year").textContent=(new Date).getFullYear().toString(),document.getElementById("mailtoSupport").href=m(),(null===(e=window.matchMedia)||void 0===e?void 0:e.call(window.matchMedia,"(prefers-reduced-motion: reduce)")).matches&&document.querySelectorAll(".ticker-left, .ticker-right").forEach(e=>{e.style.animation="none"});const t=s();t&&p(t),await h();const n=await d();n&&(a(n),p(n))}
window.addEventListener("DOMContentLoaded",v);
})();
