// ===== Simple ticker hydration for Ethics & Independence page =====

// ---- CONFIG (Sheets-only for tickers)
const SHEET_ID = '1WN8151jGQjqbfO0Aj2tK-79yJ9gCD_z0DLCdxs_higg';
const SHEET_TAB = 'Headlines';
const SHEET_RANGE = 'A:C'; // Section, Text, (optional Weight)
const CSV_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
  `?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}&range=${encodeURIComponent(SHEET_RANGE)}`;

// Prefetch CSV (best-effort)
(function prefetchCSV() {
  try {
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.as = 'fetch'; l.crossOrigin = 'anonymous'; l.href = CSV_URL;
    document.head.appendChild(l);
  } catch {}
})();

// ---- Utils
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else { inQuotes = false; }
      } else cell += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (ch !== '\r') cell += ch;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function fetchWithTimeout(url, ms = 900) {
  return new Promise((resolve, reject) => {
    const ctrl = ('AbortController' in window) ? new AbortController() : null;
    const t = setTimeout(() => { try { ctrl?.abort(); } catch {} reject(new Error('timeout')); }, ms);
    fetch(url, { signal: ctrl?.signal, cache: 'force-cache', credentials: 'omit' })
      .then(r => { clearTimeout(t); resolve(r); })
      .catch(e => { clearTimeout(t); reject(e); });
  });
}

function setTickerDuration(el, items) {
  const len = (items || []).join(' • ').length || 120;
  const secs = Math.min(140, Math.max(60, Math.round(len / 1.8)));
  el.style.setProperty('--dur', `${secs}s`);
}

function renderTicker(el, items, dir) {
  if (!el || !Array.isArray(items) || items.length === 0) return; // keep fallback
  el.className = `ticker ${dir === 'right' ? 'ticker-right' : 'ticker-left'} ${
    el.id === 'botTicker' ? 'text-sm text-slate-700' : 'text-sm font-medium'
  }`;
  el.innerHTML = '';
  const loop = items.concat(items); // seamless scroll
  loop.forEach(txt => {
    const span = document.createElement('span');
    span.textContent = txt;
    el.appendChild(span);
  });
  setTickerDuration(el, items);
}

function paintFromData(data) {
  if (!data) return;
  const top = data.filter(d => d.section === 'top').map(d => d.text);
  const bottom = data.filter(d => d.section === 'bottom').map(d => d.text);
  renderTicker(document.getElementById('topTicker'), top, 'right');
  renderTicker(document.getElementById('botTicker'), bottom, 'left');
}

// ---- Cache (15 min)
const HL_CACHE_KEY = 'bs_headlines_ethics_v1';
const HL_TTL_MS = 15 * 60 * 1000;

function getCache() {
  try {
    const raw = localStorage.getItem(HL_CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > HL_TTL_MS) return null;
    return data;
  } catch { return null; }
}

function setCache(data) {
  try { localStorage.setItem(HL_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

// ---- Fetch & transform
async function loadHeadlines() {
  try {
    const res = await fetchWithTimeout(CSV_URL, 900);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const txt = await res.text();

    // If the sheet isn't public, Google returns an HTML page
    if (txt.trim().startsWith('<')) return [];

    const rows = parseCsv(txt);
    if (!rows.length) return [];

    const headers = rows[0].map(h => h.replace(/^\uFEFF/, '').trim().toLowerCase());
    const iSection = headers.indexOf('section');
    const iText = headers.indexOf('text');
    if (iSection < 0 || iText < 0) return [];

    return rows.slice(1).map(r => ({
      section: (r[iSection] || '').toLowerCase().trim(),
      text: (r[iText] || '').trim()
    })).filter(r => r.text);
  } catch (e) {
    console.warn('Headlines fetch failed:', e.message || e);
    return null; // keep current UI
  }
}

// ---- Boot helpers
function respectReducedMotion() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.ticker-left, .ticker-right').forEach(el => { el.style.animation = 'none'; });
    }
  } catch {}
}

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}

// ---- Boot
async function boot() {
  setYear();
  respectReducedMotion();

  const cached = getCache();
  if (cached) paintFromData(cached);

  const data = await loadHeadlines();
  if (data) { setCache(data); paintFromData(data); }
}

document.addEventListener('DOMContentLoaded', boot, { once: true });
