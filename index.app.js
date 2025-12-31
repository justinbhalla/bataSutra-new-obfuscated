// ====== CONFIG ======
const SHEET_ID='1WN8151jGQjqbfO0Aj2tK-79yJ9gCD_z0DLCdxs_higg';

// Local articles (fallback)
const ARTICLES = [
{
    "href": "/articles/profit-is-back-in-fashion-why-markets-now-reward-boring-companies-dec-2025",
    "title": "Profit Is Back in Fashion: Why Markets Now Reward Boring Companies",
    "blurb": "The era of loud growth stories is fading. Markets are rewarding companies that look almost dull from the outside — careful, cash-generating, predictable, and disciplined. This feature explains how higher rates reset investor expectations, why narrative-driven firms lost their advantage, what today’s ‘boring winners’ do differently, and how founders, CEOs and boards must adapt to a market that now values endurance over spectacle."
  },
  {
    "href": "/articles/technologys-next-promise-isnt-power-its-peace-dec-2025",
    "title": "Technology’s Next Promise Isn’t Power — It’s Peace",
    "blurb": "Delivered power, speed, and reach — but not peace. People are exhausted, overstimulated, and quietly searching for tools that lower anxiety instead of raising it. This story explores why the nervous system has finally entered the product brief, what ‘calm technology’ really looks like, the business case for emotional safety, and why the next winning products will be judged by how light they make life feel."
  }

];



(()=>{"use strict";
const q=(e,t)=>`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(e)}&range=${encodeURIComponent(t)}&t=${Date.now()}`,
C=e=>{const t=[];let n=[],r="",o=!1;for(let a=0;a<e.length;a++){const l=e[a];if(o){if(l!=='"')r+=l;else e[a+1]==='"'?(r+='"',a++):o=!1}else if(l==='"')o=!0;else if(l===",")n.push(r),r="";else if(l==="\n")n.push(r),t.push(n),n=[],r="";else l!=="\r"&&(r+=l)}return r.length>0||n.length>0?(n.push(r),t.push(n),t):t},
N=e=>String(e||"").replace(/^\uFEFF/,"").replace(/\u00A0/g," ").trim().replace(/\s+/g," ").toLowerCase(),
F=(e,t)=>{const n=new Map;for(const t of Object.keys(e))n.set(N(t),e[t]);for(const e of t){const t=n.get(N(e));if(t!=null&&String(t).trim()!=="")return t}const r=N(t[0]||"");for(const[e,t]of n)if(e.includes(r)&&String(t).trim()!=="")return t},
S=async(e,t)=>{const n=await fetch(q(e,t));if(!n.ok)throw new Error("Sheet fetch failed: "+e);const r=await n.text();if(r.trim().startsWith("<")){console.warn("Sharing error: got HTML, not CSV.");return[]}const o=C(r);if(!o.length)return[];const a=o[0].map(e=>e.replace(/^\uFEFF/,"").replace(/\u00A0/g," ").trim());return o.slice(1).filter(e=>e.some(e=>(e??"").toString().trim()!=="")).map(e=>Object.fromEntries(a.map((t,n)=>[t,(e[n]??"").toString().trim()])))},
A=(e,t=2)=>e==null||e===""||!Number.isFinite(Number(e))?"—":Number(e).toLocaleString("en-IN",{maximumFractionDigits:t,minimumFractionDigits:t}),
P=e=>{const t=Number(e);if(!Number.isFinite(t))return"—";const n=t>=0?"+":"";return n+t.toFixed(2)+"%"},
U=e=>{if(e==null)return NaN;const t=String(e).trim();if(!t)return NaN;const n=t.replace(/[,%\s]/g,""),r=Number(n);return Number.isFinite(r)?r:NaN},
B=(e,t)=>{const n=Number(t);if(!Number.isFinite(n)){e.textContent="—";e.style.background="rgba(107,114,128,.12)";e.style.color="#374151";return}e.textContent=P(n);e.style.background=n>=0?"rgba(34,197,94,.12)":"rgba(239,68,68,.12)";e.style.color=n>=0?"#16a34a":"#dc2626"},
H=e=>{const t=Number(e);if(!Number.isFinite(t))return"#f4f4f5";const n=Math.max(-3,Math.min(3,t)),r=(n+3)/6,o=Math.round(251*(1-r)+230*r),a=Math.round(234*(1-r)+246*r),l=Math.round(234*(1-r)+230*r);return`rgb(${o},${a},${l})`},
R=e=>{if(!e||!e.length)return"";const t=e.map(U).filter(Number.isFinite);if(!t.length)return"";const n=100,r=30,o=2,a=Math.min(...t),l=Math.max(...t),i=(l-a)||1;return t.map((e,t)=>{const s=(t/(t=>Math.max(1,t-1))(t))*n,c=r-o-(e-a)/i*(r-2*o);return(t?" L":"M")+s.toFixed(2)+","+c.toFixed(2)}).join("")},
T=(e,t,n="right")=>{const r=document.getElementById(e);r.className=`ticker ${n==="right"?"ticker-right":"ticker-left"} text-sm font-medium`;r.innerHTML="";[...t,...t].forEach(e=>{const t=document.createElement("span");t.textContent=e;r.appendChild(t)})},
I=e=>{const t=document.getElementById("indicesGrid"),n=document.getElementById("indicesStatus");t.innerHTML="";if(!e||!e.length){n.textContent="No data";return}n.textContent="";e.forEach((e,n)=>{const r=F(e,["Name"]),oU=U(F(e,["Value"])),lU=U(F(e,["ChangePct"]));let i=[];const s=F(e,["Spark"]);if(s)i=String(s).split(",").map(e=>e.trim());else{const t=Object.keys(e).filter(e=>/^s\d+$/i.test(N(e))).sort((e,t)=>Number(N(e).slice(1))-Number(N(t).slice(1)));i=t.map(t=>e[t]).filter(Boolean)}const c=document.createElement("div");c.className="card card-pad";c.innerHTML=`<div class="flex items-center justify-between"><p class="text-sm text-slate-600">${r||"—"}</p><span id="chg-${n}" class="pill">—</span></div><p class="text-2xl font-bold mt-1">${A(oU,2)}</p><svg class="spark w-full h-12 mt-2" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path id="spark-${n}" d=""/></svg>`;t.appendChild(c);B(document.getElementById(`chg-${n}`),lU);const d=document.getElementById(`spark-${n}`);d.setAttribute("d",R(i));d.setAttribute("stroke",Number.isFinite(lU)&&lU>=0?"#16a34a":"#dc2626")})},
M=e=>{const t=document.getElementById("heatmapGrid");t.innerHTML="";if(!e||!e.length)return;e.forEach(e=>{const n=F(e,["Label"]),rU=U(F(e,["ChangePct"])),o=document.createElement("div");o.className="heat-tile";o.style.background=H(rU);const a=Number.isFinite(rU)&&rU>=0?"#16a34a":"#dc2626";o.title=`${n||""} ${Number.isFinite(rU)?"("+P(rU)+")":""}`;o.innerHTML=`${n||"—"}<br><span class="text-xs font-normal" style="color:${Number.isFinite(rU)?a:"#6b7280"}">${P(rU)}</span>`;t.appendChild(o)})},
L=e=>{const t=document.getElementById("commoditiesBody");t.innerHTML="";if(!Array.isArray(e)||!e.length)return;e.forEach((e,n)=>{const r=F(e,["Name","Instrument","Commodity","Label"])||`Item ${n+1}`,o=U(F(e,["Last","Price","Close","Value"])),a=U(F(e,["Change","Chg"])),l=U(F(e,["Pct","PctChg","%Chg","Percent","Change%"])),i=document.createElement("tr");i.innerHTML=`<td class="text-left">${r}</td><td class="text-right">${A(o,2)}</td><td class="text-right ${Number.isFinite(a)&&a>=0?"text-green-600":"text-red-600"}">${(Number.isFinite(a)&&a>=0?"+":"")+A(a,2)}</td><td class="text-right ${Number.isFinite(l)&&l>=0?"text-green-600":"text-red-600"}">${P(l)}</td>`;t.appendChild(i)})},
D=e=>{const t=document.getElementById("articlesList");t.innerHTML="";e.forEach(e=>{const n=e.href||e.Href,r=e.title||e.Title,o=e.blurb||e.Blurb,a=document.createElement("a");a.href=n;a.className="card p-5 hover:shadow-md transition space-y-1 group";a.innerHTML=`<h3 class="text-lg font-semibold">${r}</h3><p class="text-sm text-slate-600">${o}</p><div class="text-sm font-medium text-[var(--brand-ink)] opacity-0 group-hover:opacity-100">Read →</div>`;t.appendChild(a)})},
j="https://script.google.com/macros/s/AKfycbwT4FQr2Qb91fiqEgeUQMdnD5dDACtWyFnktA5MUp8sHHVebvFIOq4k3yMGKqJmlPJ_MA/exec",
Z=e=>{e.preventDefault();const t=document.getElementById("emailInput").value,n=document.getElementById("subscribeMessage"),r=document.getElementById("errorMessage"),o=new FormData;o.append("email",t);fetch(j,{method:"POST",body:o}).then(e=>e.text()).then(e=>{const t=(e||"").toLowerCase();if(t.includes("success")){n.textContent="✅ Subscribed successfully!";n.classList.remove("hidden");r.classList.add("hidden");e={target:{reset:()=>{}}}}else if(t.includes("already")){n.textContent="⚠️ You're already subscribed.";n.classList.remove("hidden");r.classList.add("hidden")}else throw new Error(e)}).catch(()=>{r.classList.remove("hidden");n.classList.add("hidden")})};
window.subscribeUser=Z;
const z=async()=>{try{const e=await S("Headlines","A:B"),t=e.filter(e=>/^top$/i.test((e.Section||"").toString())).map(e=>e.Text),n=e.filter(e=>/^bottom$/i.test((e.Section||"").toString())).map(e=>e.Text);T("topTicker",t,"right");T("bottomTicker",n,"left")}catch(e){console.warn("Headlines error",e)}try{I(await S("Indices","A:Z"))}catch(e){console.warn("Indices error",e)}try{M(await S("Heatmap","A:B"))}catch(e){console.warn("Heatmap error",e)}try{L(await S("Commodities","A1:D"))}catch(e){console.warn("Commodities error",e)}};
const O=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")})},{threshold:.08});
(()=>{const e=document.getElementById("year");if(e)e.textContent=(new Date).getFullYear();document.querySelectorAll(".reveal").forEach(e=>O.observe(e));document.querySelectorAll(".spark path").forEach(e=>e.setAttribute("stroke","#4b5563"));D(ARTICLES);z().catch(console.error);setInterval(()=>z().catch(console.error),300000)})();
})();
