!function(){"use strict";
/* ===== cfg ===== */
var a="1WN8151jGQjqbfO0Aj2tK-79yJ9gCD_z0DLCdxs_higg",b="Headlines",c="A:C",d="https://docs.google.com/spreadsheets/d/"+a+"/gviz/tq?tqx=out:csv&sheet="+encodeURIComponent(b)+"&range="+encodeURIComponent(c);
/* prefetch (best-effort) */
try{var e=document.createElement("link");e.rel="prefetch",e.as="fetch",e.crossOrigin="anonymous",e.href=d,document.head.appendChild(e)}catch(_){}
/* tiny CSV */
function f(t){var r=[],n=[],o="",i=!1,l,s=0;for(s=0;s<t.length;s++)if(l=t[s],i)'"'!==l?o+=l:'"'===t[s+1]?(o+='"',s++):i=!1;else if('"'===l)i=!0;else if(","===l)n.push(o),o="";else if("\n"===l)n.push(o),r.push(n),n=[],o="";else"\r"!==l&&(o+=l);return(o.length||n.length)&&(n.push(o),r.push(n)),r}
/* fetch+timeout */
function g(t,r){return new Promise(function(n,o){var i="AbortController"in window?new AbortController:null,l=setTimeout(function(){try{i&&i.abort()}catch(_){ }o(new Error("timeout"))},r||800);fetch(t,{signal:i&&i.signal,cache:"force-cache",credentials:"omit"}).then(function(t){clearTimeout(l),n(t)}).catch(function(t){clearTimeout(l),o(t)})})}
/* cache (15m) */
var h="bs_headlines_corrections_v1",p=9e5;function m(){try{var t=localStorage.getItem(h);if(!t)return null;var r=JSON.parse(t),n=r.ts,e=r.data;return Date.now()-n>p?null:e}catch(t){return null}}function y(t){try{localStorage.setItem(h,JSON.stringify({ts:Date.now(),data:t}))}catch(t){}}
/* ticker duration by content length */
function v(t,r){var n=(r||[]).join(" • ").length||120,o=Math.min(140,Math.max(60,Math.round(n/1.8)));try{t.style.setProperty("--dur",o+"s")}catch(_){t.style&&(t.style.animationDuration=o+"s")}}
/* render ticker */
function S(t,r,n){if(!t||!r||!r.length)return;t.className="ticker "+("right"===n?"ticker-right":"ticker-left")+" "+("botTicker"===t.id?"text-sm text-slate-700":"text-sm font-medium"),t.innerHTML="";for(var o=r.concat(r),i=0;i<o.length;i++){var l=document.createElement("span");l.textContent=o[i],t.appendChild(l)}v(t,r)}
/* paint both rails */
function E(t){if(!t)return;var r=t.filter(function(t){return"top"===t.section}).map(function(t){return t.text}),n=t.filter(function(t){return"bottom"===t.section}).map(function(t){return t.text});S(document.getElementById("topTicker"),r,"right"),S(document.getElementById("botTicker"),n,"left")}
/* load headlines (csv→json) */
function T(){return g(d,900).then(function(t){if(!t.ok)throw new Error("HTTP "+t.status);return t.text()}).then(function(t){if((t||"").trim().startsWith("<"))return[];var r=f(t);if(!r.length)return[];var n=r[0].map(function(t){return t.replace(/^\uFEFF/,"").trim().toLowerCase()}),o=n.indexOf("section"),i=n.indexOf("text");return o<0||i<0?[]:r.slice(1).map(function(t){return{section:(t[o]||"").toLowerCase().trim(),text:(t[i]||"").trim()}}).filter(function(t){return!!t.text})}).catch(function(t){return console.warn("Headlines fetch failed:",t&&t.message||t),null})}
/* a11y + year */
function C(){try{if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){var t=document.querySelectorAll(".ticker-left, .ticker-right");for(var r=0;r<t.length;r++)t[r].style.animation="none"}}catch(_){}}function L(){var t=document.getElementById("year");t&&(t.textContent=(new Date).getFullYear().toString())}
/* boot */
function x(){L(),C();var t=m();t&&E(t),T().then(function(t){t&&(y(t),E(t))})}
document.addEventListener("DOMContentLoaded",x,{once:!0});
}();
