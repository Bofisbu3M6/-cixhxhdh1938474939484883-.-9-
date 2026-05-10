/* ============================================================
   app.js — Khởi động, Navigation, Admin Panel
   ============================================================ */

let currentUser = null;

/* ---- KEY SCREEN ---- */
function toggleKeyVis() {
  const inp = document.getElementById('keyInput');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}
function fillKey(k) {
  document.getElementById('keyInput').value = k;
  document.getElementById('keyInput').focus();
}
function activateKey() {
  const code = document.getElementById('keyInput').value.trim();
  const errEl = document.getElementById('keyError');
  if (!code) { errEl.textContent = '⚠️ Vui lòng nhập key!'; return; }
  const k = findKey(code);
  if (!k) { errEl.textContent = '❌ Key không hợp lệ!'; shakeInput(); return; }
  if (k.expired) { errEl.textContent = '⏰ Key đã hết hạn!'; shakeInput(); return; }
  errEl.textContent = '';
  currentUser = k;
  enterApp();
}
function shakeInput() {
  const inp = document.getElementById('keyInput');
  inp.style.borderColor = 'var(--red)';
  inp.style.animation = 'none';
  setTimeout(() => {
    inp.style.animation = '';
    inp.style.borderColor = '';
  }, 600);
}
function enterApp() {
  document.getElementById('key-screen').style.display = 'none';
  setupDeviceInfo();
  setupUserUI();
  buildFeaturesList();
  initSliders();
  startStats();
  showToast('🚀 SPERNEW đã khởi động', `Xin chào! Đang tối ưu thiết bị ${Device.platform}...`, 'success', 3500);
}
function logout() {
  stopStats();
  currentUser = null;
  document.getElementById('keyInput').value = '';
  document.getElementById('key-screen').style.display = 'flex';
  goPage('home', document.querySelector('.nav-item'));
}

/* ---- DEVICE INFO SETUP ---- */
function setupDeviceInfo() {
  const { platform, cores, ramGB, connType, maxFPS, tier } = Device;
  const tierLabel = { low:'Low-end', mid:'Mid-range', high:'High-end' }[tier];
  setEl('deviceLabel', `${platform} · ${cores} cores · ${ramGB}GB RAM · ${tierLabel}`);
  setEl('deviceInfoStats', `${platform} · ${cores} CPU cores · RAM ${ramGB}GB · Kết nối ${connType.toUpperCase()}`);
  setEl('s-totram', ramGB + ' GB');
  setEl('s-cores',  cores + ' cores');
  setEl('stDevice', platform);
  setEl('stCores',  cores + ' cores');
  setEl('stRam',    ramGB + ' GB');
  setEl('stNet',    connType.toUpperCase());
}

/* ---- USER UI ---- */
function setupUserUI() {
  const u = currentUser;
  const badge = document.getElementById('keyTypeBadge');
  const vipBar = document.getElementById('vip-bar');
  const vipText = document.getElementById('vip-bar-text');

  if (u.type === 'admin') {
    badge.textContent = 'ADMIN';
    badge.style.cssText = 'border-color:var(--red);color:var(--red)';
    vipBar.style.background = 'linear-gradient(90deg,#3d0000,#7c0000,#3d0000)';
    vipText.textContent = '🔑 ADMIN ACCESS — Full quyền hạn';
    vipText.style.color = 'var(--red)';
    document.getElementById('admin-locked').style.display = 'none';
    document.getElementById('admin-panel').style.display  = 'block';
    document.getElementById('adminNavBtn').style.color = 'var(--orange)';
    document.getElementById('adminInfo').textContent = 'Key: ' + u.key.substring(0,22) + '…';
    renderAdminStats();
    renderKeyTable();
  } else if (u.type === 'vip') {
    badge.textContent = 'VIP';
    badge.style.cssText = 'border-color:var(--gold);color:var(--gold)';
    vipBar.style.background = 'linear-gradient(90deg,#7c3f00,#c67c00,#7c3f00)';
    vipText.textContent = '👑 VIP ACTIVE | Hết hạn: ' + formatDate(u.expires);
    vipText.style.color = 'var(--gold)';
  } else {
    badge.textContent = 'FREE';
    vipBar.style.background = 'linear-gradient(90deg,#1a2235,#243047,#1a2235)';
    vipText.textContent = '🔓 NORMAL | Hết hạn: ' + formatDate(u.expires) + ' (' + daysLeft(u.expires) + ')';
    vipText.style.color = 'var(--text2)';
  }

  // Home chip
  const chip = document.getElementById('user-key-info');
  if (chip) chip.style.display = 'flex';
  setEl('keyInfoText', `Loại: ${u.type.toUpperCase()} · Hết hạn: ${formatDate(u.expires)} · Còn: ${daysLeft(u.expires)}`);

  // VIP page
  setEl('vipExpiry', 'Hết hạn: ' + formatDate(u.expires));

  // Settings
  setEl('stKeyType', u.type.toUpperCase());
  setEl('stExpiry',  formatDate(u.expires) + ' (' + daysLeft(u.expires) + ')');
  setEl('stKey',     u.key);
  const stKT = document.getElementById('stKeyType');
  if (stKT) stKT.className = 'sv2 ' + (u.type==='admin'?'red':u.type==='vip'?'gold':'cyan');
}

/* ---- NAVIGATION ---- */
function goPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  if (el) el.classList.add('active');
  document.getElementById('content').scrollTop = 0;
}

/* ---- ADMIN PANEL ---- */
function renderAdminStats() {
  const keys = getKeys();
  setEl('tkTotal', keys.length);
  setEl('tkVip',   keys.filter(k => k.type === 'vip').length);
  setEl('tkNorm',  keys.filter(k => k.type === 'normal').length);
  setEl('tkAdm',   keys.filter(k => k.type === 'admin').length);
  setEl('keyCount', keys.length + ' key');
}

function renderKeyTable() {
  const keys = getKeys();
  const tbody = document.getElementById('keyTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  keys.forEach((k, i) => {
    const expired = k.expires && Date.now() > k.expires;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="kcode" title="${k.key}">${k.key.length > 20 ? k.key.slice(0,20)+'…' : k.key}</div></td>
      <td><span class="ktbadge kt-${k.type}">${k.type.toUpperCase()}</span></td>
      <td style="color:${expired?'var(--red)':'var(--text2)'}">
        <div style="font-size:11px">${formatDate(k.expires)}</div>
        <div style="font-size:10px">${daysLeft(k.expires)}</div>
      </td>
      <td>${k.key === ADMIN_KEY
        ? '<span style="color:var(--text2);font-size:10px">Bảo vệ</span>'
        : `<button class="btn-del" onclick="deleteKey(${i})">Xóa</button>`}</td>
    `;
    tbody.appendChild(tr);
  });
}

function generateKey() {
  document.getElementById('newKeyInput').value = genRandomKey();
}

function createKey() {
  const code = document.getElementById('newKeyInput').value.trim();
  const type = document.getElementById('newKeyType').value;
  const days = parseInt(document.getElementById('newKeyDays').value) || null;
  const msgEl = document.getElementById('createMsg');

  if (!code) {
    msgEl.textContent = '⚠️ Nhập key hoặc nhấn Auto tạo ngẫu nhiên'; msgEl.style.color='var(--orange)'; msgEl.style.display='block';
    setTimeout(() => msgEl.style.display='none', 3000); return;
  }
  const result = addKey(code, type, days);
  if (!result.ok) {
    msgEl.textContent = '❌ ' + result.msg; msgEl.style.color='var(--red)'; msgEl.style.display='block';
    setTimeout(() => msgEl.style.display='none', 3000); return;
  }
  renderAdminStats();
  renderKeyTable();
  document.getElementById('newKeyInput').value = '';
  document.getElementById('newKeyDays').value  = '';
  msgEl.textContent = '✅ Tạo thành công: ' + result.key;
  msgEl.style.color = 'var(--green)'; msgEl.style.display = 'block';
  setTimeout(() => msgEl.style.display='none', 4000);
  showToast('🔑 Key mới', `Đã tạo key ${type.toUpperCase()}: ${result.key}`, 'success', 4000);
}

function deleteKey(idx) {
  const keys = getKeys();
  const k = keys[idx];
  if (!k || k.key === ADMIN_KEY) return;
  if (!confirm(`Xóa key "${k.key}"?\nHành động này không thể hoàn tác!`)) return;
  if (removeKey(idx)) {
    renderAdminStats();
    renderKeyTable();
    showToast('🗑️ Đã xóa key', `Key ${k.type.toUpperCase()} đã bị xóa.`, 'warn', 3000);
  }
}

/* ---- SLIDER INIT ---- */
function initSliders() {
  document.querySelectorAll('.slider').forEach(sl => {
    const pct = ((sl.value - sl.min) / (sl.max - sl.min)) * 100;
    sl.style.background = `linear-gradient(to right,var(--cyan) ${pct}%,var(--bg2) ${pct}%)`;
  });
}

/* ---- BOOT ---- */
window.addEventListener('DOMContentLoaded', () => {
  // Enter on key input
  document.getElementById('keyInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') activateKey();
  });
});
