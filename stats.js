/* ============================================================
   stats.js — Live stats dựa trên thiết bị thực tế
   ============================================================ */

let statsInterval = null;
let boostCount    = 0;
let ramCleared    = 0;
let fpsGain       = 0;
let boosted       = false;   // boost đang có hiệu lực?
let boostTick     = 0;

// Mô phỏng trạng thái hiện tại
let current = { fps:0, cpu:0, ram:0, temp:0, score:0, ping:0 };

function getRealStats() {
  const b = Device.baseline;
  // Sau khi boost: cải thiện đáng kể trong 5 tick
  const boostMod = boosted ? { fps:[12,20], cpu:[-18,-8], ram:[-12,-5], temp:[-6,-2] } : { fps:[0,0],cpu:[0,0],ram:[0,0],temp:[0,0] };

  const fps  = Math.min(deviceRand('fps',  boostMod.fps[0],  boostMod.fps[1] ), Device.maxFPS);
  const cpu  = Math.max(deviceRand('cpu',  boostMod.cpu[0],  boostMod.cpu[1] ), 5);
  const ram  = Math.max(deviceRand('ram',  boostMod.ram[0],  boostMod.ram[1] ), 5);
  const temp = Math.max(deviceRand('temp', boostMod.temp[0], boostMod.temp[1]), 28);

  // Ping: phụ thuộc vào loại mạng thực tế
  let pingBase;
  switch (Device.connType) {
    case '4g':  pingBase = [12, 35]; break;
    case '3g':  pingBase = [50,120]; break;
    case '2g':  pingBase = [150,400];break;
    case 'wifi':
    case 'ethernet': pingBase = [5, 25]; break;
    default:    pingBase = [20, 60];
  }
  const ping = randRange(pingBase[0], pingBase[1]) - (boosted ? randRange(5,12) : 0);

  // Score: tổng hợp FPS, CPU thấp, RAM thấp, temp thấp
  const s_fps  = Math.min(fps / Device.maxFPS, 1) * 40;
  const s_cpu  = (1 - cpu / 100) * 25;
  const s_ram  = (1 - ram / 100) * 20;
  const s_temp = Math.max(0, (70 - temp) / 70) * 15;
  const score  = Math.round(s_fps + s_cpu + s_ram + s_temp);

  return { fps, cpu, ram, temp, ping, score };
}

function applyStats(st) {
  current = st;
  const { fps, cpu, ram, temp, ping, score } = st;

  // Màu FPS
  let fpsColor = 'cyan';
  if (fps < 30) fpsColor = 'red';
  else if (fps < 45) fpsColor = 'orange';

  // Trạng thái label
  const fpsStatus  = fps >= Device.maxFPS*0.85 ? 'SMOOTH' : fps >= 50 ? 'NORMAL' : fps >= 30 ? 'LOW' : 'CRITICAL';
  const cpuStatus  = cpu < 45 ? 'NORMAL' : cpu < 70 ? 'HIGH' : 'CRITICAL';
  const ramStatus  = ram < 55 ? 'NORMAL' : ram < 75 ? 'HIGH' : 'CRITICAL';
  const tempStatus = temp < 42 ? 'COOL'   : temp < 52 ? 'WARM' : 'HOT';

  // Màu CPU/RAM
  const cpuColor  = cpu  < 50 ? 'green'  : cpu  < 75 ? 'orange' : 'red';
  const ramColor  = ram  < 55 ? 'green'  : ram  < 75 ? 'orange' : 'red';
  const tempColor = temp < 42 ? 'cyan'   : temp < 52 ? 'orange' : 'red';

  setText('fpsStat', fps, fpsColor);
  setText('cpuStat', cpu + '%', cpuColor);
  setText('ramStat', ram + '%', ramColor);
  setText('tempStat',temp + '°', tempColor);

  setBar('fpsBar',  fps,  100, 'var(--' + fpsColor  + ')');
  setBar('cpuBar',  cpu,  100, 'var(--' + cpuColor  + ')');
  setBar('ramBar',  ram,  100, 'var(--' + ramColor  + ')');
  setBar('tempBar', temp, 100, 'var(--' + tempColor + ')');

  setEl('fpsStatus',  fpsStatus);
  setEl('cpuStatus',  cpuStatus);
  setEl('ramStatus',  ramStatus);
  setEl('tempStatus', tempStatus);

  // Performance ring
  const sc = Math.min(score, 99);
  setEl('perfScore', sc);
  const perf = sc >= 80 ? 'EXCELLENT — Tuyệt vời' : sc >= 65 ? 'GOOD — Tốt' : sc >= 45 ? 'NORMAL — Bình thường' : 'LOW — Hiệu suất thấp';
  setEl('perfStatus', perf);
  const circ = 226.2;
  const ring = document.getElementById('perfRingEl');
  if (ring) ring.setAttribute('stroke-dashoffset', circ - (sc / 100 * circ));

  // Stats page
  setEl('s-fps',   fps);
  setEl('s-cpu',   cpu + '%');
  setEl('s-ram',   ram + '%');
  setEl('s-temp',  temp + '°C');
  setEl('s-score', sc);
  setEl('s-ping',  Math.max(ping, 1) + 'ms');

  // Download/Upload estimate từ connType
  const dlMap = { '4g':'25-50 Mbps','3g':'5-15 Mbps','2g':'0.1-1 Mbps','wifi':'50-200 Mbps','ethernet':'100-500 Mbps' };
  const ulMap = { '4g':'8-20 Mbps','3g':'2-5 Mbps','2g':'0.05-0.5 Mbps','wifi':'20-80 Mbps','ethernet':'50-200 Mbps' };
  setEl('s-dl',   dlMap[Device.connType] || `${randRange(10,60)} Mbps`);
  setEl('s-ul',   ulMap[Device.connType] || `${randRange(5,30)} Mbps`);
  setEl('s-conn', Device.connType.toUpperCase() || 'Unknown');

  setEl('netBarText', `Ping ${Math.max(ping,1)}ms — Network optimized`);
}

function setText(id, val, colorClass) {
  const el = document.getElementById(id);
  if (!el) return;
  // giữ class màu
  el.className = 'stat-value ' + (colorClass||'');
  el.textContent = val;
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setBar(id, val, max, color) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.width  = (Math.min(val, max) / max * 100) + '%';
  el.style.background = color;
}

function tick() {
  const st = getRealStats();
  applyStats(st);
  if (boosted) {
    boostTick++;
    if (boostTick >= 6) { boosted = false; boostTick = 0; }
  }
}

function startStats() {
  tick();
  statsInterval = setInterval(tick, 2500);
}

function stopStats() {
  if (statsInterval) clearInterval(statsInterval);
  statsInterval = null;
}

// Quick Actions
function doBoost() {
  boosted    = true;
  boostTick  = 0;
  boostCount++;
  const freed   = randRange(150, 600);
  const gained  = randRange(5, 18);
  ramCleared   += freed;
  fpsGain      += gained;

  tick(); // immediate update

  setEl('s-boosts',    boostCount);
  setEl('s-ramcleared', ramCleared + ' MB');
  setEl('s-fpsgain',    '+' + fpsGain);

  showToast(
    '⚡ Boost hoàn tất!',
    `Giải phóng ${freed} MB RAM · +${gained} FPS · Ping giảm ${randRange(5,20)}ms`,
    'success', 4000
  );

  // Hiệu ứng nút
  const btn = document.getElementById('boostBtn');
  if (btn) {
    btn.style.background = '#00ff88';
    setTimeout(() => btn.style.background = '', 1200);
  }
}

function qaAction(type) {
  const freed  = randRange(80, 350);
  const gained = randRange(3, 10);
  boostCount++;
  setEl('s-boosts', boostCount);

  switch (type) {
    case 'ram':
      ramCleared += freed;
      setEl('s-ramcleared', ramCleared + ' MB');
      showToast('🗑️ Clear RAM', `Đã giải phóng ${freed} MB RAM! Thiết bị nhẹ hơn.`, 'success', 3000);
      boosted = true; boostTick = 0;
      break;
    case 'cool':
      showToast('❄️ Cool Down', `Nhiệt độ CPU đang giảm... Từ ~${current.temp}°C về ${Math.max(current.temp-8,30)}°C`, 'info', 3500);
      boosted = true; boostTick = 0;
      break;
    case 'fps':
      fpsGain += gained;
      setEl('s-fpsgain', '+' + fpsGain);
      showToast('⚡ FPS Boost', `+${gained} FPS! Hiện tại ~${Math.min(current.fps+gained, Device.maxFPS)} FPS. Game mượt hơn!`, 'success', 3500);
      boosted = true; boostTick = 0;
      break;
    case 'net':
      const newPing = Math.max(current.ping - randRange(8,20), 5);
      showToast('🌐 Net Fix', `Ping tối ưu ${current.ping}ms → ${newPing}ms! Mạng ổn định hơn.`, 'success', 3500);
      boosted = true; boostTick = 0;
      break;
  }
  tick();
}
