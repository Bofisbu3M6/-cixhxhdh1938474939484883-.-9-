/* ============================================================
   features.js — Định nghĩa tính năng + Toast thông báo riêng
   ============================================================ */

// Trạng thái tính năng
const FeatureState = {};

// Cấu hình từng tính năng: id, tên, toast khi BẬT, toast khi TẮT
const FEATURE_DEFS = {
  aimassist: {
    name: 'Aim Assist',
    onTitle:  '🎯 Aim Assist đã BẬT',
    onMsg:    'Hệ thống tự động kéo tầm về phía địch. Độ chính xác tăng đáng kể!',
    offTitle: '🎯 Aim Assist đã TẮT',
    offMsg:   'Aim Assist đã bị vô hiệu hoá. Tự ngắm thủ công.',
    type:     'success',
    offType:  'warn',
  },
  aimhold: {
    name: 'Aim Hold',
    onTitle:  '🔒 Aim Hold đã BẬT',
    onMsg:    'Tầm ngắm sẽ được giữ ổn định khi bắn liên tục. Giảm độ lắc tối đa!',
    offTitle: '🔒 Aim Hold đã TẮT',
    offMsg:   'Chế độ giữ tầm đã tắt.',
    type:     'success',
    offType:  'warn',
  },
  antirecoil: {
    name: 'Anti Recoil',
    onTitle:  '💥 Anti Recoil đã BẬT',
    onMsg:    'Hệ thống bù độ giật đang hoạt động! Súng ổn định hơn khi bắn liên tục.',
    offTitle: '💥 Anti Recoil đã TẮT',
    offMsg:   'Chống giật đã tắt. Kiểm soát độ giật thủ công.',
    type:     'success',
    offType:  'warn',
  },
  sensitivity: {
    name: 'Sensitivity Tuning',
    onTitle:  '📐 Sensitivity Tuning BẬT',
    onMsg:    'Độ nhạy đang được tối ưu theo preset. Cảm giác ngắm mượt hơn!',
    offTitle: '📐 Sensitivity Tuning TẮT',
    offMsg:   'Độ nhạy trở về mặc định của game.',
    type:     'success',
    offType:  'warn',
  },
  headtracking: {
    name: 'Head Tracking',
    onTitle:  '🎯 Head Tracking BẬT',
    onMsg:    'Khóa tầm vào đầu đối thủ! Tỉ lệ headshot tăng mạnh.',
    offTitle: '🎯 Head Tracking TẮT',
    offMsg:   'Head Tracking đã tắt.',
    type:     'success',
    offType:  'warn',
  },
  scope: {
    name: 'Scope Optimizer',
    onTitle:  '🔭 Scope Optimizer BẬT',
    onMsg:    'Tự động tối ưu độ nhạy scope 2x/4x/8x khi zoom vào!',
    offTitle: '🔭 Scope Optimizer TẮT',
    offMsg:   'Scope Optimizer đã tắt.',
    type:     'success',
    offType:  'warn',
  },
  // Quick features trong danh sách Features page
  fpsbooster: {
    name: 'FPS Booster',
    onTitle:  '⚡ FPS Booster BẬT',
    onMsg:    () => `FPS đang được tăng cường! Từ ~${deviceRand('fps')} → ${Math.min(deviceRand('fps',8,15), Device.maxFPS)} FPS. Giảm frame drop tối đa.`,
    offTitle: '⚡ FPS Booster TẮT',
    offMsg:   'FPS Booster đã dừng hoạt động.',
    type:     'success',
    offType:  'warn',
  },
  networkbooster: {
    name: 'Network Booster',
    onTitle:  '🌐 Network Booster BẬT',
    onMsg:    () => {
      const ping = randRange(8,22);
      const oldPing = randRange(30,80);
      return `Mạng đã được tối ưu! Ping ${oldPing}ms → ${ping}ms. Giảm lag & packet loss!`;
    },
    offTitle: '🌐 Network Booster TẮT',
    offMsg:   'Network Booster đã dừng.',
    type:     'success',
    offType:  'warn',
  },
  batterysaver: {
    name: 'Battery Saver',
    onTitle:  '🔋 Battery Saver BẬT',
    onMsg:    'Đang tiết kiệm pin! Giảm ~30% mức tiêu thụ điện khi chơi game.',
    offTitle: '🔋 Battery Saver TẮT',
    offMsg:   'Battery Saver đã tắt. Hiệu suất tối đa.',
    type:     'success',
    offType:  'info',
  },
  teleportfix: {
    name: 'Teleport Fix',
    onTitle:  '🛡️ Teleport Fix BẬT',
    onMsg:    'Đang khắc phục teleport! Vị trí nhân vật ổn định hơn trong lag cao.',
    offTitle: '🛡️ Teleport Fix TẮT',
    offMsg:   'Teleport Fix đã tắt.',
    type:     'success',
    offType:  'warn',
  },
};

// Toast hiển thị
let toastTimers = {};

function showToast(title, msg, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  const id = 'toast-' + Date.now();
  const icons = { success: '✅', warn: '⚠️', error: '❌', info: 'ℹ️' };
  const div = document.createElement('div');
  div.className = `toast-item ${type}`;
  div.id = id;
  div.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>
  `;
  div.onclick = () => dismissToast(id);
  container.appendChild(div);

  toastTimers[id] = setTimeout(() => dismissToast(id), duration);
  // max 4 toasts
  const all = container.querySelectorAll('.toast-item');
  if (all.length > 4) dismissToast(all[0].id);
}

function dismissToast(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'toastOut .25s ease forwards';
  clearTimeout(toastTimers[id]);
  setTimeout(() => el && el.remove(), 250);
}

// Toggle từ AIM LAB page
function featureToggle(id, btn) {
  btn.classList.toggle('on');
  const isOn = btn.classList.contains('on');
  FeatureState[id] = isOn;
  const def = FEATURE_DEFS[id];
  if (!def) return;

  const msg = typeof (isOn ? def.onMsg : def.offMsg) === 'function'
    ? (isOn ? def.onMsg() : def.offMsg())
    : (isOn ? def.onMsg : def.offMsg);

  showToast(
    isOn ? def.onTitle : def.offTitle,
    msg,
    isOn ? def.type : (def.offType || 'warn')
  );
  updateFeatCount();
}

// Toggle từ Features page
function featureToggleById(id, btn) {
  btn.classList.toggle('on');
  const isOn = btn.classList.contains('on');
  FeatureState[id] = isOn;
  const def = FEATURE_DEFS[id];
  if (!def) return;

  const msg = typeof (isOn ? def.onMsg : def.offMsg) === 'function'
    ? (isOn ? def.onMsg() : def.offMsg())
    : (isOn ? def.onMsg : def.offMsg);

  showToast(
    isOn ? def.onTitle : def.offTitle,
    msg,
    isOn ? def.type : (def.offType || 'warn')
  );
  updateFeatCount();
}

function updateFeatCount() {
  const count = Object.values(FeatureState).filter(Boolean).length;
  const el = document.getElementById('s-feat');
  if (el) el.textContent = count;
}

// Tạo Features List HTML động
function buildFeaturesList() {
  const features = [
    {
      id: 'fpsbooster', label: 'FPS Booster', desc: 'Tăng FPS · Giảm giật lag',
      ico: 'fi-cyan', defaultOn: true, badge: null,
      svg: '<path d="M13 2L4.09 12.37A1 1 0 0 0 5 14h6l-2 8 8.91-10.37A1 1 0 0 0 17 10h-6l2-8z"/>',
    },
    {
      id: 'aimassist', label: 'Aim Assist', desc: 'Hỗ trợ kéo tầm tự nhiên khi ngắm',
      ico: 'fi-green', defaultOn: true, badge: null,
      svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>',
    },
    {
      id: 'antirecoil', label: 'Anti Recoil', desc: 'Giảm độ giật khi bắn liên tục',
      ico: 'fi-orange', defaultOn: false, badge: 'vip',
      svg: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    },
    {
      id: 'networkbooster', label: 'Network Booster', desc: 'Tối ưu mạng · Giảm ping',
      ico: 'fi-purple', defaultOn: true, badge: null,
      svg: '<path d="M1.42 9a16 16 0 0 1 21.16 0M5 12.55a11 11 0 0 1 14.08 0M10.73 15.5a6 6 0 0 1 2.54 0M12 19h.01"/>',
    },
    {
      id: 'batterysaver', label: 'Battery Saver', desc: 'Tiết kiệm pin khi chơi game',
      ico: 'fi-green', defaultOn: true, badge: null,
      svg: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    },
    {
      id: 'headtracking', label: 'Head Tracking', desc: 'Bám đầu đối thủ tự động',
      ico: 'fi-red', defaultOn: false, badge: 'vip',
      svg: '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>',
    },
    {
      id: 'teleportfix', label: 'Teleport Fix', desc: 'Giảm teleport · Ổn định vị trí',
      ico: 'fi-cyan', defaultOn: false, badge: 'new',
      svg: '<circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>',
    },
    {
      id: 'scope', label: 'Scope Optimizer', desc: 'Tối ưu độ nhạy scope mọi cấp',
      ico: 'fi-purple', defaultOn: false, badge: 'vip',
      svg: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    },
  ];

  const container = document.getElementById('features-list');
  if (!container) return;

  container.innerHTML = features.map(f => {
    const isOn = f.defaultOn;
    FeatureState[f.id] = isOn;
    const badgeHtml = f.badge === 'vip'
      ? '<span class="feat-badge bvip">VIP</span>'
      : f.badge === 'new'
      ? '<span class="feat-badge bnew">NEW</span>'
      : '';

    return `
      <div class="feat-item">
        <div class="feat-left">
          <div class="feat-ico ${f.ico}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${f.svg}</svg>
          </div>
          <div>
            <div class="feat-nm">${f.label}</div>
            <div class="feat-ds">${f.desc}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          ${badgeHtml}
          <button class="toggle ${isOn ? 'on' : ''}" id="feat-tgl-${f.id}" onclick="featureToggleById('${f.id}',this)"></button>
        </div>
      </div>
    `;
  }).join('');
}

// Select option buttons (range, priority, activate…)
function selOpt(btn, group) {
  btn.closest('.btn-grp').querySelectorAll('.bopt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// Sensitivity presets
const PRESETS = [
  { name:'Cân bằng', v:[100,80,70,55,40] },
  { name:'Sniper',   v:[60,50,40,30,20]  },
  { name:'Rush',     v:[155,120,100,80,55]},
  { name:'Pro',      v:[110,90,75,60,45] },
];

function selectPreset(btn, idx) {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const p = PRESETS[idx];
  [1,2,3,4,5].forEach((n,i) => {
    const sl = document.getElementById('sl'+n);
    if (sl) { sl.value = p.v[i]; updateSlider(sl,'sv'+n); }
  });
  showToast('📐 Preset đã áp dụng', `Sensitivity set: ${p.name} — Tổng ${p.v[0]} / ADS ${p.v[1]} / Scope 2x ${p.v[2]}`, 'success', 3500);
}

function updateSlider(el, valId) {
  const v = document.getElementById(valId);
  if (v) v.textContent = el.value;
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.background = `linear-gradient(to right,var(--cyan) ${pct}%,var(--bg2) ${pct}%)`;
}
