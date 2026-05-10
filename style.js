<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>SPERNEW - Game Optimizer</title>
<style>
  :root {
    --bg: #07090f;
    --bg2: #0d1117;
    --card: #111827;
    --card2: #1a2235;
    --cyan: #00e5ff;
    --cyan2: #00b8d9;
    --green: #00e676;
    --gold: #ffd700;
    --purple: #bf5af2;
    --red: #ff453a;
    --orange: #ff9f0a;
    --text: #e8eaf6;
    --text2: #8899aa;
    --border: #1e2d40;
    --toggle-off: #2a3a4a;
  }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body {
    background:#000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--text);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  #app {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* ===== KEY SCREEN ===== */
  #key-screen {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 24px;
    max-width: 480px; margin: 0 auto;
  }
  .key-logo {
    font-size: 36px; font-weight: 900; letter-spacing: 4px;
    color: var(--cyan); text-shadow: 0 0 20px var(--cyan);
    margin-bottom: 8px;
  }
  .key-sub { color: var(--text2); font-size: 13px; margin-bottom: 40px; text-align:center; }
  .key-box {
    width: 100%; background: var(--card);
    border: 1px solid var(--border); border-radius: 16px;
    padding: 24px;
  }
  .key-box h3 { color: var(--text); font-size: 16px; margin-bottom: 16px; text-align:center; }
  .key-input-wrap { position: relative; margin-bottom: 16px; }
  .key-input {
    width: 100%; background: var(--bg2);
    border: 1px solid var(--border); border-radius: 10px;
    color: var(--text); font-size: 15px; padding: 14px 46px 14px 16px;
    outline: none; letter-spacing: 1px;
    transition: border-color .2s;
  }
  .key-input:focus { border-color: var(--cyan); box-shadow: 0 0 0 2px rgba(0,229,255,.1); }
  .key-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--text2); cursor: pointer; font-size: 18px;
  }
  .btn-activate {
    width: 100%; background: linear-gradient(135deg, var(--cyan), #0078ff);
    border: none; border-radius: 10px; color: #000;
    font-size: 15px; font-weight: 700; padding: 14px;
    cursor: pointer; letter-spacing: 1px;
    transition: opacity .2s, transform .1s;
  }
  .btn-activate:active { transform: scale(.98); }
  .key-error {
    color: var(--red); font-size: 13px; text-align:center;
    margin-top: 12px; display: none;
  }
  .key-demo {
    margin-top: 20px; color: var(--text2); font-size: 12px; text-align:center;
  }
  .key-demo span { color: var(--cyan); cursor: pointer; }

  /* ===== VIP BAR ===== */
  #vip-bar {
    background: linear-gradient(90deg, #7c3f00, #c67c00, #7c3f00);
    padding: 8px 16px; text-align: center;
    font-size: 12px; font-weight: 700; color: var(--gold);
    letter-spacing: 1px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .vip-crown { font-size: 14px; }

  /* ===== HEADER ===== */
  #header {
    background: var(--bg2); padding: 12px 16px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border); flex-shrink: 0;
    position: sticky; top: 0; z-index: 100;
  }
  .header-logo { font-size: 20px; font-weight: 900; letter-spacing: 3px; color: var(--cyan); }
  .header-right { display: flex; align-items: center; gap: 10px; }
  .btn-free {
    background: transparent; border: 1.5px solid var(--cyan2);
    color: var(--cyan2); font-size: 12px; font-weight: 700;
    padding: 5px 12px; border-radius: 6px; cursor: pointer;
    letter-spacing: 1px;
  }
  .status-dot {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 600;
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green);
    box-shadow: 0 0 6px var(--green); }

  /* ===== CONTENT ===== */
  #content {
    flex: 1; overflow-y: auto; padding-bottom: 80px;
  }
  #content::-webkit-scrollbar { width: 3px; }
  #content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .page { display: none; padding: 16px; }
  .page.active { display: block; }

  /* ===== BOTTOM NAV ===== */
  #bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px;
    background: var(--bg2); border-top: 1px solid var(--border);
    display: flex; z-index: 100;
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    padding: 10px 2px 8px; cursor: pointer; color: var(--text2);
    font-size: 10px; font-weight: 600; letter-spacing: .5px;
    transition: color .2s; gap: 4px; border: none; background: none;
  }
  .nav-item.active { color: var(--cyan); }
  .nav-item svg { width: 22px; height: 22px; }
  .nav-item.active svg { filter: drop-shadow(0 0 4px var(--cyan)); }

  /* ===== CARD ===== */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px; margin-bottom: 14px;
  }
  .card-title {
    font-size: 12px; font-weight: 700; color: var(--text2);
    text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .card-title svg { width: 16px; height: 16px; color: var(--cyan); }

  /* ===== HOME PAGE ===== */
  .optimizer-banner {
    background: linear-gradient(135deg, #0d1f3a, #0a2d3f);
    border: 1px solid rgba(0,229,255,.2);
    border-radius: 16px; padding: 20px; margin-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .optimizer-banner::before {
    content:''; position:absolute; top:-20px; right:-20px;
    width:120px; height:120px; border-radius:50%;
    background: radial-gradient(circle, rgba(0,229,255,.15), transparent 70%);
  }
  .opt-title { font-size: 22px; font-weight: 900; letter-spacing: 2px; line-height:1.2; }
  .opt-sub { font-size: 18px; font-weight: 900; color: var(--cyan);
    letter-spacing: 2px; text-shadow: 0 0 10px var(--cyan); }
  .opt-desc { font-size: 11px; color: var(--text2); margin-top: 6px; }
  .btn-boost {
    background: var(--cyan); border: none; border-radius: 12px;
    padding: 12px 16px; cursor: pointer; display: flex; flex-direction: column;
    align-items: center; gap: 4px; min-width: 80px;
    transition: transform .1s, box-shadow .2s; position: relative; z-index: 1;
  }
  .btn-boost:active { transform: scale(.95); }
  .btn-boost svg { width: 28px; height: 28px; color: #000; }
  .btn-boost span { font-size: 10px; font-weight: 800; color: #000; letter-spacing: 1px; }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 14px 16px; position: relative; overflow: hidden;
  }
  .stat-label { font-size: 11px; color: var(--text2); font-weight: 700; letter-spacing: 1.5px; margin-bottom: 6px; }
  .stat-value { font-size: 36px; font-weight: 900; line-height: 1; }
  .stat-value.cyan { color: var(--cyan); text-shadow: 0 0 15px rgba(0,229,255,.5); }
  .stat-value.green { color: var(--green); text-shadow: 0 0 15px rgba(0,230,118,.4); }
  .stat-value.orange { color: var(--orange); text-shadow: 0 0 15px rgba(255,159,10,.4); }
  .stat-value.red { color: var(--red); text-shadow: 0 0 15px rgba(255,69,58,.4); }
  .stat-unit { font-size: 14px; font-weight: 600; }
  .stat-status { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--text2); margin-top: 4px; }
  .stat-bar {
    height: 3px; border-radius: 2px; margin-top: 10px;
    background: var(--bg2); position: relative; overflow: hidden;
  }
  .stat-bar-fill { height: 100%; border-radius: 2px; transition: width .8s ease; }

  .perf-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 16px;
  }
  .perf-left { flex: 1; }
  .perf-label { font-size: 11px; color: var(--text2); font-weight: 700; letter-spacing: 1.5px; margin-bottom: 8px; }
  .perf-score { font-size: 52px; font-weight: 900; color: var(--cyan); text-shadow: 0 0 20px rgba(0,229,255,.5); line-height:1; }
  .perf-status { font-size: 11px; color: var(--text2); font-weight: 600; margin-top: 4px; }
  .perf-ring {
    width: 80px; height: 80px; position: relative; flex-shrink: 0;
  }
  .perf-ring svg { transform: rotate(-90deg); }

  .quick-actions { margin-bottom: 14px; }
  .qa-title { font-size: 12px; color: var(--text2); font-weight: 700; letter-spacing: 1.5px; margin-bottom: 12px; text-transform: uppercase; }
  .qa-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .qa-btn {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 8px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    color: var(--text2); font-size: 10px; font-weight: 600;
    transition: border-color .2s, color .2s; text-align: center;
  }
  .qa-btn:hover { border-color: var(--cyan); color: var(--cyan); }
  .qa-btn:active { transform: scale(.95); }
  .qa-btn svg { width: 22px; height: 22px; }

  .toast {
    background: var(--card2); border: 1px solid rgba(0,230,118,.3);
    border-radius: 12px; padding: 12px 16px; margin-top: 14px;
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: var(--green); font-weight: 500;
    animation: fadeIn .3s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:translateY(0); } }

  /* ===== FEATURES PAGE ===== */
  .feature-item {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px; margin-bottom: 12px;
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color .2s;
  }
  .feature-item:active { border-color: var(--cyan); }
  .feature-left { display: flex; align-items: center; gap: 14px; flex: 1; }
  .feature-icon {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .feature-icon svg { width: 24px; height: 24px; }
  .fi-cyan { background: rgba(0,229,255,.1); color: var(--cyan); }
  .fi-green { background: rgba(0,230,118,.1); color: var(--green); }
  .fi-orange { background: rgba(255,159,10,.1); color: var(--orange); }
  .fi-purple { background: rgba(191,90,242,.1); color: var(--purple); }
  .fi-red { background: rgba(255,69,58,.1); color: var(--red); }
  .feature-name { font-size: 14px; font-weight: 700; color: var(--text); }
  .feature-desc { font-size: 12px; color: var(--text2); margin-top: 2px; }
  .feature-badge {
    font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 5px;
    letter-spacing: .5px; flex-shrink: 0;
  }
  .badge-on { background: rgba(0,230,118,.15); color: var(--green); }
  .badge-vip { background: rgba(255,215,0,.15); color: var(--gold); }
  .badge-new { background: rgba(0,229,255,.15); color: var(--cyan); }

  /* ===== STATS PAGE ===== */
  .stats-header { text-align:center; margin-bottom: 20px; }
  .stats-header h2 { font-size: 20px; font-weight: 900; color: var(--text); }
  .stats-header p { font-size: 13px; color: var(--text2); margin-top: 4px; }

  .stat-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-row-label { font-size: 13px; color: var(--text2); }
  .stat-row-val { font-size: 14px; font-weight: 700; color: var(--text); }
  .stat-row-val.c { color: var(--cyan); }
  .stat-row-val.g { color: var(--green); }

  /* ===== VIP PAGE ===== */
  .vip-hero {
    background: linear-gradient(135deg, #1a0a2e, #0d1a3a);
    border: 1px solid rgba(191,90,242,.3);
    border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 16px;
    position: relative; overflow: hidden;
  }
  .vip-hero::before {
    content:''; position:absolute; top:-30px; left:50%; transform:translateX(-50%);
    width:200px; height:200px; border-radius:50%;
    background: radial-gradient(circle, rgba(191,90,242,.2), transparent 70%);
    pointer-events: none;
  }
  .vip-crown-big { font-size: 48px; margin-bottom: 12px; }
  .vip-title { font-size: 28px; font-weight: 900; color: var(--gold); text-shadow: 0 0 20px var(--gold); }
  .vip-sub { font-size: 14px; color: var(--text2); margin-top: 6px; }
  .vip-expiry {
    display: inline-block; margin-top: 12px;
    background: rgba(255,215,0,.1); border: 1px solid rgba(255,215,0,.3);
    border-radius: 8px; padding: 6px 16px;
    font-size: 13px; color: var(--gold); font-weight: 600;
  }

  .vip-plan {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px; margin-bottom: 12px;
    position: relative; overflow: hidden;
  }
  .vip-plan.featured { border-color: var(--gold); }
  .vip-plan.featured::before {
    content:'HOT'; position:absolute; top:0; right:0;
    background: var(--gold); color: #000; font-size: 10px; font-weight: 800;
    padding: 4px 10px; border-bottom-left-radius: 8px; letter-spacing: 1px;
  }
  .plan-name { font-size: 16px; font-weight: 800; color: var(--text); }
  .plan-price { font-size: 24px; font-weight: 900; color: var(--gold); margin: 4px 0; }
  .plan-price span { font-size: 12px; color: var(--text2); }
  .plan-features { list-style: none; margin: 10px 0; }
  .plan-features li { font-size: 12px; color: var(--text2); padding: 3px 0; }
  .plan-features li::before { content: '✓ '; color: var(--green); font-weight: 700; }
  .btn-buy {
    width: 100%; background: linear-gradient(135deg, #7c3f00, #c67c00);
    border: none; border-radius: 10px; color: var(--gold);
    font-size: 14px; font-weight: 800; padding: 12px;
    cursor: pointer; letter-spacing: 1px;
  }

  /* ===== AIM LAB PAGE ===== */
  .section-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px; padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }
  .section-header svg { width: 18px; height: 18px; color: var(--cyan); }
  .section-header h3 { font-size: 14px; font-weight: 800; color: var(--text); }
  .section-header span { font-size: 12px; color: var(--text2); }

  .setting-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .setting-label { font-size: 14px; font-weight: 700; color: var(--text); }
  .setting-desc { font-size: 11px; color: var(--text2); margin-top: 2px; }

  .toggle {
    width: 52px; height: 28px; border-radius: 14px; cursor: pointer;
    position: relative; transition: background .2s; flex-shrink: 0;
    background: var(--toggle-off); border: none;
  }
  .toggle.on { background: var(--cyan); }
  .toggle::after {
    content:''; position:absolute; top: 3px; left: 3px;
    width: 22px; height: 22px; border-radius: 50%;
    background: #fff; transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,.4);
  }
  .toggle.on::after { transform: translateX(24px); }

  .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn-opt {
    padding: 8px 14px; border-radius: 8px; cursor: pointer;
    font-size: 12px; font-weight: 700; letter-spacing: .5px;
    border: 1.5px solid var(--border); background: var(--bg2); color: var(--text2);
    transition: all .15s;
  }
  .btn-opt.active {
    border-color: var(--cyan); color: var(--cyan);
    background: rgba(0,229,255,.08);
  }

  .slider-row { margin-bottom: 16px; }
  .slider-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .slider-name { font-size: 13px; color: var(--text2); font-weight: 600; }
  .slider-val { font-size: 14px; font-weight: 700; color: var(--text); }
  .slider {
    -webkit-appearance: none; width: 100%; height: 4px;
    border-radius: 2px; background: var(--bg2); outline: none;
    position: relative;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
    background: var(--cyan); box-shadow: 0 0 8px rgba(0,229,255,.6); cursor: pointer;
  }
  .slider::-moz-range-thumb {
    width: 20px; height: 20px; border-radius: 50%; border: none;
    background: var(--cyan); box-shadow: 0 0 8px rgba(0,229,255,.6); cursor: pointer;
  }

  .preset-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
  .preset-btn {
    background: var(--card2); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 12px 6px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    transition: all .15s;
  }
  .preset-btn.active { border-color: var(--cyan); background: rgba(0,229,255,.08); }
  .preset-btn svg { width: 22px; height: 22px; color: var(--text2); }
  .preset-btn.active svg { color: var(--cyan); filter: drop-shadow(0 0 4px var(--cyan)); }
  .preset-name { font-size: 11px; font-weight: 800; color: var(--text2); }
  .preset-btn.active .preset-name { color: var(--cyan); }
  .preset-sub { font-size: 9px; color: var(--text2); text-align: center; }

  /* ===== ADMIN PAGE ===== */
  .admin-header {
    background: linear-gradient(135deg, #1a0d00, #2d1500);
    border: 1px solid rgba(255,159,10,.3);
    border-radius: 14px; padding: 16px; margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .admin-badge {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(255,159,10,.15); display: flex; align-items: center; justify-content: center;
    font-size: 24px;
  }
  .admin-title { font-size: 18px; font-weight: 900; color: var(--orange); }
  .admin-sub { font-size: 12px; color: var(--text2); }

  .key-table { width: 100%; border-collapse: collapse; }
  .key-table th {
    text-align: left; font-size: 11px; font-weight: 700;
    color: var(--text2); letter-spacing: 1px; text-transform: uppercase;
    padding: 0 0 10px 0; border-bottom: 1px solid var(--border);
  }
  .key-table td { padding: 12px 0; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .key-table tr:last-child td { border-bottom: none; }
  .key-code { font-family: monospace; font-size: 12px; color: var(--cyan); word-break: break-all; }
  .key-type-badge {
    font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 5px;
    display: inline-block;
  }
  .kt-normal { background: rgba(136,153,170,.15); color: var(--text2); }
  .kt-vip { background: rgba(255,215,0,.15); color: var(--gold); }
  .kt-admin { background: rgba(255,69,58,.15); color: var(--red); }
  .key-expiry { font-size: 11px; color: var(--text2); }
  .btn-del {
    background: rgba(255,69,58,.1); border: 1px solid rgba(255,69,58,.3);
    color: var(--red); border-radius: 6px; padding: 4px 10px;
    font-size: 11px; font-weight: 700; cursor: pointer;
  }
  .btn-del:hover { background: rgba(255,69,58,.2); }

  .create-key-form { margin-top: 16px; }
  .form-row { display: flex; gap: 8px; margin-bottom: 10px; }
  .form-input {
    flex: 1; background: var(--bg2); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-size: 13px;
    padding: 10px 12px; outline: none;
  }
  .form-input:focus { border-color: var(--cyan); }
  .form-select {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-size: 13px;
    padding: 10px 12px; outline: none; cursor: pointer;
  }
  .btn-create {
    background: linear-gradient(135deg, var(--cyan), #0078ff);
    border: none; border-radius: 8px; color: #000;
    font-size: 13px; font-weight: 800; padding: 10px 16px;
    cursor: pointer; white-space: nowrap;
  }
  .btn-gen {
    background: var(--card2); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text2); font-size: 12px;
    font-weight: 600; padding: 10px 12px; cursor: pointer; white-space: nowrap;
  }

  /* ===== SETTINGS PAGE ===== */
  .settings-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0; border-bottom: 1px solid var(--border);
  }
  .settings-item:last-child { border-bottom: none; }
  .settings-label { font-size: 14px; color: var(--text); font-weight: 600; }
  .settings-sub { font-size: 11px; color: var(--text2); margin-top: 2px; }
  .settings-val { font-size: 12px; color: var(--text2); }

  /* ===== NETWORK BAR ===== */
  .network-bar {
    background: rgba(0,229,255,.05); border: 1px solid rgba(0,229,255,.2);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; color: var(--cyan); font-weight: 600;
  }
  .network-bar svg { width: 16px; height: 16px; flex-shrink: 0; }

  /* ===== KEY TYPE CHIP ===== */
  .user-key-chip {
    background: var(--card2); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .user-key-chip svg { width: 16px; height: 16px; }

  /* glow pulse */
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,229,255,.4); }
    50% { box-shadow: 0 0 0 8px rgba(0,229,255,0); }
  }
  .btn-boost { animation: pulse 2s infinite; }
</script>
</body>
</html>
