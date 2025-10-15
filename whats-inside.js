// ========= CONFIG =========
const SHEET_ID    = '1WN8151jGQjqbfO0Aj2tK-79yJ9gCD_z0DLCdxs_higg';
const SHEET_TAB   = 'Headlines';
const SHEET_RANGE = 'A:C';
const CSV_URL     =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
  `?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}&range=${encodeURIComponent(SHEET_RANGE)}`;

// SAME Apps Script subscribe backend (collects only `email`)
const SUBSCRIBE_SCRIPT = 'https://script.google.com/macros/s/AKfycbwT4FQr2Qb91fiqEgeUQMdnD5dDACtWyFnktA5MUp8sHHVebvFIOq4k3yMGKqJmlPJ_MA/exec';

// ========= Utils =========
function parseCsv(text){
  const rows=[]; let row=[], cur='', q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(q){
      if(ch === '"'){ if(text[i+1] === '"'){ cur+='"'; i++; } else { q=false; } }
      else cur+=ch;
    } else {
      if(ch === '"') q=true;
      else if(ch === ','){ row.push(cur); cur=''; }
      else if(ch === '\n'){ row.push(cur); rows.push(row); row=[]; cur=''; }
      else if(ch !== '\r'){ cur+=ch; }
    }
  }
  if(cur.length || row.length){ row.push(cur); rows.push(row); }
  return rows;
}

function setAutoDuration(el, items){
  const len = (items||[]).join(' • ').length || 120;
  const secs = Math.min(140, Math.max(60, Math.round(len/1.8)));
  el && el.style.setProperty('--dur', secs+'s');
}

function renderTicker(el, items, dir){
  if(!el || !items?.length) return;
  el.className = `ticker ${dir==='right'?'ticker-right':'ticker-left'} ${el.id==='botTicker'?'text-sm text-slate-700':'text-sm font-medium'}`;
  el.innerHTML = '';
  const loop = items.concat(items);
  const frag = document.createDocumentFragment();
  loop.forEach(t => { const s=document.createElement('span'); s.textContent=t; frag.appendChild(s); });
  el.appendChild(frag);
  setAutoDuration(el, items);
}

function paintFromData(data){
  if(!data) return;
  const top = data.filter(d=> (d[0] || d.section || '').toString().toLowerCase()==='top').map(d=> d[1] || d.text).filter(Boolean);
  const bottom = data.filter(d=> (d[0] || d.section || '').toString().toLowerCase()==='bottom').map(d=> d[1] || d.text).filter(Boolean);
  renderTicker(document.getElementById('topTicker'), top, 'right');
  renderTicker(document.getElementById('botTicker'), bottom, 'left');
}

// ========= Headlines loader =========
(function prefetchCSV(){
  try{
    const l=document.createElement('link');
    l.rel='prefetch'; l.as='fetch'; l.crossOrigin='anonymous'; l.href=CSV_URL; document.head.appendChild(l);
  }catch{}
})();

function fetchCsv(url, ms=1200){
  return new Promise(resolve=>{
    const t=setTimeout(()=>resolve(null), ms);
    fetch(url, {cache:'force-cache', credentials:'omit'})
      .then(r=>{ clearTimeout(t); resolve(r.ok ? r : null); })
      .catch(()=>{ clearTimeout(t); resolve(null); });
  });
}

async function loadHeadlines(){
  const res = await fetchCsv(CSV_URL, 1400);
  if(!res) return null;
  const txt = await res.text();
  if((txt||'').trim().startsWith('<')) return [];  // not public
  const rows = parseCsv(txt);
  if(!rows.length) return [];
  const hdr = rows[0].map(h => h.replace(/^\uFEFF/,'').trim().toLowerCase());
  const iS = hdr.indexOf('section'), iT = hdr.indexOf('text');
  if(iS<0 || iT<0){
    return rows.slice(1).map(r=>({section:(r[0]||'').trim(), text:(r[1]||'').trim()})).filter(r=>r.text);
  }
  return rows.slice(1).map(r=>({section:(r[iS]||'').trim(), text:(r[iT]||'').trim()})).filter(r=>r.text);
}

// ========= Reserve => SAME subscribe backend (email only) =========
async function reserveSubmit(email){
  const fd = new FormData();
  fd.append('email', email);              // <— same field as existing subscribe arch
  try{
    const res = await fetch(SUBSCRIBE_SCRIPT, { method:'POST', body: fd });
    const txt = (await res.text()||'').toLowerCase();
    if (txt.includes('success') || txt.includes('ok')) return 'ok';
    if (txt.includes('already')) return 'already';
    return 'unknown';
  }catch{
    return 'error';
  }
}

// ========= Boot =========
(function boot(){
  // Year
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // Reduced motion
  try{
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.ticker-left, .ticker-right').forEach(el => { el.style.animation='none'; });
    }
  }catch{}

  // Headlines
  loadHeadlines().then(data => { if(data) paintFromData(data); });

  // Reserve form
  const form = document.getElementById('reserveForm');
  const emailEl = document.getElementById('reserveEmail');
  const msg = document.getElementById('reserveMsg');
  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = (emailEl?.value||'').trim();
    if(!email){ emailEl?.focus(); return; }
    emailEl.disabled = true;
    const btn = form.querySelector('button[type="submit"]'); if(btn) btn.disabled = true;

    const status = await reserveSubmit(email);
    if(status==='ok'){
      msg.textContent = 'Thanks! You’re on the waitlist. We’ll email when alerts go live.';
      form.reset();
    }else if(status==='already'){
      msg.textContent = '⚠️ You’re already on the list.';
    }else if(status==='unknown'){
      msg.textContent = 'Submitted. If you don’t see a confirmation, we’ll still try to add you.';
    }else{
      msg.textContent = 'Something went wrong. Please try again or email alerts@batasutra.in.';
    }

    emailEl.disabled = false;
    if(btn) btn.disabled = false;
  });
})();
