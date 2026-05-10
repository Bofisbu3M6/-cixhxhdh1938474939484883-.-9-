/* ============================================================
   keys.js — Hệ thống Key (Normal / VIP / Admin)
   ============================================================ */
const ADMIN_KEY = 'ADMINNGUYENLONGIOS2001';
const STORE_KEY = 'spernew_keys_v2';
const DAY = 86400000;

function getKeys() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return initDefaultKeys();
}

function initDefaultKeys() {
  const now = Date.now();
  const keys = [
    { key: ADMIN_KEY,          type: 'admin',  created: now, expires: null,             note: 'Master Admin Key' },
    { key: 'NORMAL-DEMO-2024', type: 'normal', created: now, expires: now + 7  * DAY,  note: 'Demo Normal 7 ngày' },
    { key: 'VIP-DEMO-2024',    type: 'vip',    created: now, expires: now + 30 * DAY,  note: 'Demo VIP 30 ngày' },
  ];
  saveKeys(keys);
  return keys;
}

function saveKeys(keys) {
  localStorage.setItem(STORE_KEY, JSON.stringify(keys));
}

function findKey(code) {
  const keys = getKeys();
  const k = keys.find(k => k.key === code.trim().toUpperCase().replace(/\s/g,''));
  if (!k) return null;
  if (k.type === 'admin') return k;
  if (k.expires && Date.now() > k.expires) return { ...k, expired: true };
  return k;
}

function formatDate(ts) {
  if (!ts) return 'Lifetime';
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function daysLeft(ts) {
  if (!ts) return '∞ ngày';
  const diff = ts - Date.now();
  if (diff <= 0) return 'Đã hết hạn';
  const d = Math.ceil(diff / DAY);
  return d + (d === 1 ? ' ngày' : ' ngày');
}

/* ---- Key CRUD cho Admin ---- */
function addKey(code, type, customDays) {
  const keys = getKeys();
  const upper = code.trim().toUpperCase();
  if (keys.find(k => k.key === upper)) return { ok: false, msg: 'Key đã tồn tại!' };
  const defDays = type === 'vip' ? 30 : type === 'normal' ? 7 : null;
  const days = customDays || defDays;
  const expires = (type === 'admin' || !days) ? null : Date.now() + days * DAY;
  keys.push({ key: upper, type, created: Date.now(), expires, note: '' });
  saveKeys(keys);
  return { ok: true, key: upper };
}

function removeKey(idx) {
  const keys = getKeys();
  if (!keys[idx] || keys[idx].key === ADMIN_KEY) return false;
  keys.splice(idx, 1);
  saveKeys(keys);
  return true;
}

function genRandomKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = n => Array.from({length:n}, ()=>chars[Math.floor(Math.random()*chars.length)]).join('');
  return `${seg(4)}-${seg(4)}-${seg(4)}-${seg(4)}`;
}
