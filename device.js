/* ============================================================
   device.js — Phát hiện thông tin thiết bị thực tế
   ============================================================ */
const Device = (() => {
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const isIOS    = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid= /Android/i.test(ua);

  // CPU cores (thực tế)
  const cores = navigator.hardwareConcurrency || 4;

  // RAM (GB) — chỉ Chrome/Android hỗ trợ deviceMemory
  const ramGB = navigator.deviceMemory || (isMobile ? 3 : 8);

  // Loại kết nối
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const connType  = conn ? (conn.effectiveType || conn.type || 'unknown') : 'unknown';
  const connSpeed = conn ? (conn.downlink || 0) : 0;

  // Hạng thiết bị (tính toán từ core + RAM)
  // tier: 'low' | 'mid' | 'high'
  let tier = 'mid';
  if (cores <= 2 || ramGB <= 2) tier = 'low';
  else if (cores >= 6 && ramGB >= 6) tier = 'high';

  // Tên thiết bị / platform
  let platform = 'Desktop';
  if (isIOS)     platform = 'iOS Device';
  else if (isAndroid) platform = 'Android Device';
  else if (isTablet)  platform = 'Tablet';

  // FPS giới hạn màn hình (thường 60 hoặc 90/120 trên high-end)
  const maxFPS = (tier === 'high' && isMobile) ? (ramGB >= 8 ? 120 : 90) : 60;

  // Baseline stats theo tier
  const baseline = {
    low:  { fps:[28,42], cpu:[55,75], ram:[60,80], temp:[48,58] },
    mid:  { fps:[45,62], cpu:[38,58], ram:[45,65], temp:[42,52] },
    high: { fps:[58,maxFPS], cpu:[22,42], ram:[30,52], temp:[36,46] },
  }[tier];

  return { isMobile, isTablet, isIOS, isAndroid, cores, ramGB, connType, connSpeed, tier, platform, maxFPS, baseline };
})();

// Hàm lấy số ngẫu nhiên theo range
function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hàm lấy số thực theo baseline thiết bị + nhiễu nhỏ
function deviceRand(key, bumpMin = 0, bumpMax = 0) {
  const [mn, mx] = Device.baseline[key];
  const base = randRange(mn, mx);
  const bump = randRange(bumpMin, bumpMax);
  return Math.min(Math.max(base + bump, mn - 5), mx + 10);
}
