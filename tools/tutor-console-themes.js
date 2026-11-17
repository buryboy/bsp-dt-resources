/* Tutor console: subtle animated backgrounds (themes), the calendar of special days, and which theme applies on a given day.
   Loaded by tools/tutor-console.html (the background behind the panels) and tools/tutor-admin.html (mini previews, calendar editor).
   Everything is drawn in code on one canvas: no pictures or sound files. Deliberately quiet: few, slow, low-opacity shapes, nothing flashes,
   about 30 frames a second at most, paused when the tab is hidden, and a still picture when the device asks for reduced motion.
   TCT.THEMES            [{ id, name }]
   TCT.mount(host, id, { intensity: 'subtle'|'normal', mini, still, paused(), dark(), band() }) -> { stop(), stats() }
   TCT.entries(theme, year) / TCT.resolve(theme, 'YYYY-MM-DD') / TCT.easter(year) / TCT.parisDay(ms) */
(function () {
  'use strict';
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (y, m, d) => y + '-' + pad(m) + '-' + pad(d);
  const addDays = (s, n) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s), d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + n)); return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()); };
  const span = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

  /* ---------- the themes ----------
     grad / gradD: a very light wash behind everything (light / dark mode).  parts: the moving shapes (n = how many at "Normal" on a 1366x768 board;
     speed = fraction of the screen per second).  deco: a still decoration in the header band. */
  const WARM = ['#d9a441', '#c96a3a', '#b5533c', '#8a9a3b'];
  const THEMES = [
    { id: 'plain', name: 'Plain' },
    { id: 'snow', name: 'Snow / Christmas', grad: ['#e6eef9', '#f3f1ea'], gradD: ['#14243f', '#0e1422'], deco: 'lights', parts: [{ shape: 'dot', n: 34, motion: 'fall', size: [2, 5], speed: 0.03, col: ['#8ea8cf', '#a8bddd', '#7f9cc6'], colD: ['#ffffff', '#dfe9ff', '#c9d8f5'], alpha: 0.75 }] },
    { id: 'frost', name: 'Winter frost', grad: ['#e3eef7', '#f1f1ee'], gradD: ['#12263a', '#0e1422'], parts: [{ shape: 'flake', n: 16, motion: 'twinkle', size: [10, 22], col: ['#86a9c9', '#9dbbd6'], colD: ['#bcd9f2', '#e2f0fb'], alpha: 0.55 }, { shape: 'flake', n: 6, motion: 'fall', size: [8, 14], speed: 0.018, col: ['#86a9c9'], colD: ['#d5e7f7'], alpha: 0.5 }] },
    { id: 'autumn', name: 'Autumn leaves', grad: ['#f6ead8', '#f3f1ea'], gradD: ['#2a1d14', '#0e1422'], parts: [{ shape: 'leaf', n: 16, motion: 'fall', size: [12, 22], speed: 0.03, col: ['#c9772b', '#b5533c', '#d9a441', '#8f5a2a'], alpha: 0.6 }] },
    { id: 'bonfire', name: 'Bonfire Night', grad: ['#ece7f2', '#f3f1ea'], gradD: ['#1a1530', '#0e1422'], custom: 'fireworks', parts: [{ shape: 'dot', n: 8, motion: 'rise', size: [1.5, 3], speed: 0.03, col: ['#d98a2b', '#c9552b'], colD: ['#ffb561', '#ff8a4a'], alpha: 0.6 }] },
    { id: 'remembrance', name: 'Remembrance', grad: ['#efece6', '#f3f1ea'], gradD: ['#17171c', '#0e1422'], deco: 'poppies', still: true },
    { id: 'halloween', name: 'Halloween', grad: ['#f3e6da', '#f1eef0'], gradD: ['#22152c', '#0e1422'], parts: [{ shape: 'bat', n: 6, motion: 'drift', size: [16, 26], speed: 0.022, col: ['#5b4a78', '#6d5a8a'], colD: ['#a892cf', '#8f7bb8'], alpha: 0.5 }, { shape: 'pumpkin', n: 4, motion: 'float', size: [18, 26], col: ['#d9822b'], alpha: 0.55, zone: 'band' }] },
    { id: 'galette', name: 'Galette des Rois / Épiphanie', grad: ['#f8f0d8', '#f3f1ea'], gradD: ['#2a2412', '#0e1422'], parts: [{ shape: 'crown', n: 4, motion: 'float', size: [22, 32], col: ['#c79a2b', '#d9b24a'], colD: ['#e8c765', '#f0d98a'], alpha: 0.6, zone: 'band' }, { shape: 'spark', n: 16, motion: 'twinkle', size: [5, 10], col: ['#c79a2b', '#d9b24a'], colD: ['#f0d98a'], alpha: 0.6 }] },
    { id: 'pancakes', name: 'La Chandeleur / Pancake Day', grad: ['#f8eeda', '#f3f1ea'], gradD: ['#2a2014', '#0e1422'], parts: [{ shape: 'pancake', n: 9, motion: 'fall', size: [16, 26], speed: 0.022, col: ['#d9a55a', '#c98f45'], alpha: 0.6 }, { shape: 'dot', n: 6, motion: 'fall', size: [3, 5], speed: 0.02, col: ['#e8cf4a'], alpha: 0.55 }] },
    { id: 'valentine', name: 'Valentine’s', grad: ['#f8e9ec', '#f3f1ea'], gradD: ['#2a141c', '#0e1422'], parts: [{ shape: 'heart', n: 9, motion: 'rise', size: [9, 16], speed: 0.02, col: ['#d9788c', '#c95a72', '#e39aa8'], alpha: 0.45 }] },
    { id: 'poisson', name: 'Poisson d’avril', grad: ['#e2f1f3', '#f3f1ea'], gradD: ['#102a30', '#0e1422'], parts: [{ shape: 'fish', n: 9, motion: 'drift', size: [18, 30], speed: 0.022, col: ['#4f9fb0', '#e08a4a', '#7fb86a', '#d9b24a'], alpha: 0.55 }] },
    { id: 'spring', name: 'Spring / Easter', grad: ['#f6eaf0', '#eef3e6'], gradD: ['#26182a', '#0e1422'], parts: [{ shape: 'petal', n: 22, motion: 'fall', size: [7, 12], speed: 0.028, col: ['#e7a3bd', '#f0bfd0', '#d98aa8'], alpha: 0.65 }] },
    { id: 'lunar', name: 'Lunar New Year', grad: ['#f8e6dc', '#f3f1ea'], gradD: ['#2c1414', '#0e1422'], parts: [{ shape: 'lantern', n: 6, motion: 'float', size: [20, 30], col: ['#c8372d', '#b52a22'], alpha: 0.6, zone: 'band' }, { shape: 'spark', n: 12, motion: 'twinkle', size: [4, 8], col: ['#c79a2b'], colD: ['#f0d98a'], alpha: 0.55 }] },
    { id: 'diwali', name: 'Diwali', grad: ['#f9ecd6', '#f4eef0'], gradD: ['#2a1a10', '#140e22'], parts: [{ shape: 'diya', n: 6, motion: 'float', size: [20, 28], col: ['#b5642a'], alpha: 0.65, zone: 'band' }, { shape: 'dot', n: 22, motion: 'twinkle', size: [2, 5], col: ['#e0a02b', '#d9702b', '#c9487a'], colD: ['#ffd16b', '#ff9a5a', '#f07aa8'], alpha: 0.6 }] },
    { id: 'eid', name: 'Eid', grad: ['#e2f0ea', '#f3f1ea'], gradD: ['#0f2a26', '#0e1422'], parts: [{ shape: 'crescent', n: 3, motion: 'float', size: [26, 38], col: ['#c79a2b'], colD: ['#f0d98a'], alpha: 0.6, zone: 'band' }, { shape: 'star', n: 18, motion: 'twinkle', size: [5, 10], col: ['#3f8f7a', '#c79a2b'], colD: ['#9fe0cb', '#f0d98a'], alpha: 0.55 }] },
    { id: 'hanukkah', name: 'Hanukkah', grad: ['#e4ecf8', '#f3f1ea'], gradD: ['#101e3a', '#0e1422'], parts: [{ shape: 'candle', n: 8, motion: 'float', size: [20, 28], col: ['#4a72c0', '#7f9cd6'], colD: ['#8fb0ee', '#c9d8f5'], alpha: 0.6, zone: 'band' }, { shape: 'star6', n: 10, motion: 'twinkle', size: [7, 12], col: ['#4a72c0', '#c79a2b'], colD: ['#8fb0ee', '#f0d98a'], alpha: 0.5 }] },
    { id: 'stgeorge', name: 'St George’s Day', grad: ['#f6e8e6', '#f3f1ea'], gradD: ['#2a1414', '#0e1422'], deco: 'bunting', decoCol: ['#c8372d', '#ffffff'], parts: [{ shape: 'ribbon', n: 5, motion: 'drift', size: [50, 80], speed: 0.015, col: ['#c8372d', '#d98a84'], alpha: 0.4 }] },
    { id: 'standrew', name: 'St Andrew’s Day', grad: ['#e2ebf8', '#f3f1ea'], gradD: ['#10203a', '#0e1422'], deco: 'bunting', decoCol: ['#2563c9', '#ffffff'], parts: [{ shape: 'ribbon', n: 5, motion: 'drift', size: [50, 80], speed: 0.015, col: ['#2563c9', '#8fb0e6'], alpha: 0.4 }] },
    { id: 'stdavid', name: 'St David’s Day', grad: ['#eaf3e2', '#f8f2d8'], gradD: ['#14281a', '#0e1422'], deco: 'bunting', decoCol: ['#2e9a4f', '#ffffff', '#c8372d'], parts: [{ shape: 'petal', n: 12, motion: 'fall', size: [8, 12], speed: 0.024, col: ['#e3c02b', '#f0d45a'], alpha: 0.6 }] },
    { id: 'stpatrick', name: 'St Patrick’s Day', grad: ['#e2f3e6', '#f3f1ea'], gradD: ['#102a18', '#0e1422'], deco: 'bunting', decoCol: ['#2e9a4f', '#ffffff', '#e08a2b'], parts: [{ shape: 'ribbon', n: 5, motion: 'drift', size: [50, 80], speed: 0.015, col: ['#2e9a4f', '#8fcc9f'], alpha: 0.4 }] },
    { id: 'musique', name: 'Fête de la Musique', grad: ['#ece6f6', '#f3f1ea'], gradD: ['#1c1436', '#0e1422'], parts: [{ shape: 'note', n: 12, motion: 'rise', size: [12, 20], speed: 0.022, col: ['#6a4fb0', '#24408e', '#b0527a'], colD: ['#b7a2ee', '#9db4ff', '#f0a0c0'], alpha: 0.5 }] },
    { id: 'bunting', name: 'King’s Birthday / UK bunting', grad: ['#e8ecf6', '#f3f1ea'], gradD: ['#141c36', '#0e1422'], deco: 'bunting', decoCol: ['#c8372d', '#ffffff', '#24408e'], parts: [{ shape: 'confetti', n: 12, motion: 'fall', size: [5, 9], speed: 0.022, col: ['#c8372d', '#24408e', '#9aa6c9'], alpha: 0.45 }] },
    { id: 'summer', name: 'Summer / end of term', grad: ['#fbf0cf', '#e6f1f6'], gradD: ['#2c2410', '#0e1a2a'], parts: [{ shape: 'glow', n: 12, motion: 'rise', size: [14, 34], speed: 0.012, col: ['#f0c24a', '#f0a04a', '#7fc4d9'], alpha: 0.28 }] },
    { id: 'exam', name: 'Exam season calm', grad: ['#dfeef0', '#ece8f4', '#e6f0e4'], gradD: ['#0f2428', '#1a1630', '#11241a'], slow: true },
    { id: 'sports', name: 'Sports day', grad: ['#e6f3e2', '#f3f1ea'], gradD: ['#12281a', '#0e1422'], deco: 'bunting', decoCol: ['#c8372d', '#2563c9', '#2e9a4f', '#d99a00'], parts: [{ shape: 'ball', n: 7, motion: 'drift', size: [12, 18], speed: 0.02, col: ['#c8372d', '#2563c9', '#2e9a4f', '#d99a00'], alpha: 0.45 }] },
    { id: 'confetti', name: 'Celebration confetti', grad: ['#f4ecf6', '#f3f1ea'], gradD: ['#1e1630', '#0e1422'], parts: [{ shape: 'confetti', n: 30, motion: 'fall', size: [5, 10], speed: 0.026, col: ['#c8372d', '#2563c9', '#2e9a4f', '#d99a00', '#7b3fa0'], alpha: 0.55 }] },
  ];
  const byId = {}; THEMES.forEach((t) => (byId[t.id] = t));

  /* ---------- shapes: drawn around (0, 0), about s pixels across ---------- */
  const TAU = Math.PI * 2;
  const SHAPES = {
    dot(c, s) { c.beginPath(); c.arc(0, 0, s, 0, TAU); c.fill(); },
    glow(c, s) { c.beginPath(); c.arc(0, 0, s, 0, TAU); c.fill(); c.globalAlpha *= 0.5; c.beginPath(); c.arc(0, 0, s * 1.6, 0, TAU); c.fill(); },
    flake(c, s) { c.lineWidth = Math.max(1, s * 0.09); c.lineCap = 'round'; c.beginPath(); for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3, x = Math.cos(a) * s * 0.5, y = Math.sin(a) * s * 0.5; c.moveTo(-x, -y); c.lineTo(x, y); c.moveTo(x * 0.6, y * 0.6); c.lineTo(x * 0.6 - y * 0.25 + x * 0.2, y * 0.6 + x * 0.25 + y * 0.2); c.moveTo(-x * 0.6, -y * 0.6); c.lineTo(-x * 0.6 + y * 0.25 - x * 0.2, -y * 0.6 - x * 0.25 - y * 0.2); } c.stroke(); },
    leaf(c, s) { c.beginPath(); c.moveTo(-s * 0.5, 0); c.quadraticCurveTo(0, -s * 0.45, s * 0.5, 0); c.quadraticCurveTo(0, s * 0.45, -s * 0.5, 0); c.fill(); c.globalAlpha *= 0.6; c.lineWidth = 1; c.beginPath(); c.moveTo(-s * 0.6, 0); c.lineTo(s * 0.4, 0); c.stroke(); },
    petal(c, s) { c.beginPath(); c.moveTo(-s * 0.5, 0); c.quadraticCurveTo(-s * 0.1, -s * 0.5, s * 0.5, 0); c.quadraticCurveTo(-s * 0.1, s * 0.35, -s * 0.5, 0); c.fill(); },
    heart(c, s) { const k = s * 0.5; c.beginPath(); c.moveTo(0, k * 0.9); c.bezierCurveTo(-k * 1.6, -k * 0.2, -k * 0.7, -k * 1.2, 0, -k * 0.4); c.bezierCurveTo(k * 0.7, -k * 1.2, k * 1.6, -k * 0.2, 0, k * 0.9); c.fill(); },
    note(c, s) { c.beginPath(); c.ellipse(-s * 0.15, s * 0.35, s * 0.22, s * 0.16, -0.4, 0, TAU); c.fill(); c.lineWidth = Math.max(1.2, s * 0.09); c.lineCap = 'round'; c.beginPath(); c.moveTo(s * 0.05, s * 0.32); c.lineTo(s * 0.05, -s * 0.45); c.quadraticCurveTo(s * 0.3, -s * 0.35, s * 0.32, -s * 0.1); c.stroke(); },
    fish(c, s) { c.beginPath(); c.ellipse(0, 0, s * 0.42, s * 0.2, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-s * 0.36, 0); c.lineTo(-s * 0.62, -s * 0.2); c.lineTo(-s * 0.62, s * 0.2); c.closePath(); c.fill(); c.globalAlpha *= 0.9; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(s * 0.24, -s * 0.04, Math.max(1, s * 0.045), 0, TAU); c.fill(); },
    lantern(c, s, p, t, dark) { c.beginPath(); c.ellipse(0, 0, s * 0.36, s * 0.42, 0, 0, TAU); c.fill(); c.fillStyle = dark ? '#f0d98a' : '#c79a2b'; c.fillRect(-s * 0.2, -s * 0.5, s * 0.4, s * 0.09); c.fillRect(-s * 0.2, s * 0.41, s * 0.4, s * 0.09); c.fillRect(-s * 0.02, s * 0.5, s * 0.04, s * 0.26); },
    diya(c, s, p, t, dark) { c.beginPath(); c.moveTo(-s * 0.5, 0); c.quadraticCurveTo(0, s * 0.55, s * 0.5, 0); c.closePath(); c.fill(); c.fillStyle = dark ? '#ffd16b' : '#e0a02b'; c.beginPath(); c.moveTo(0, -s * 0.5); c.quadraticCurveTo(s * 0.2, -s * 0.12, 0, -s * 0.02); c.quadraticCurveTo(-s * 0.2, -s * 0.12, 0, -s * 0.5); c.fill(); c.globalAlpha *= 0.3; c.beginPath(); c.arc(0, -s * 0.22, s * 0.42, 0, TAU); c.fill(); },
    crescent(c, s) { c.beginPath(); c.arc(0, 0, s * 0.5, 0.35 * Math.PI, 1.65 * Math.PI); c.arc(s * 0.22, 0, s * 0.42, 1.58 * Math.PI, 0.42 * Math.PI, true); c.closePath(); c.fill(); },
    star(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? s * 0.22 : s * 0.5, a = (i * Math.PI) / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); },
    star6(c, s) { c.lineWidth = Math.max(1, s * 0.1); c.lineJoin = 'round'; for (let k = 0; k < 2; k++) { c.beginPath(); for (let i = 0; i < 3; i++) { const a = (i * TAU) / 3 - Math.PI / 2 + k * Math.PI; c.lineTo(Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.5); } c.closePath(); c.stroke(); } },
    spark(c, s) { c.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.12 : s * 0.5, a = (i * Math.PI) / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); },
    candle(c, s, p, t, dark) { c.fillRect(-s * 0.09, -s * 0.1, s * 0.18, s * 0.6); c.fillStyle = dark ? '#ffd16b' : '#e0a02b'; c.beginPath(); c.moveTo(0, -s * 0.5); c.quadraticCurveTo(s * 0.14, -s * 0.24, 0, -s * 0.14); c.quadraticCurveTo(-s * 0.14, -s * 0.24, 0, -s * 0.5); c.fill(); c.globalAlpha *= 0.28; c.beginPath(); c.arc(0, -s * 0.3, s * 0.36, 0, TAU); c.fill(); },
    pancake(c, s) { for (let i = 2; i >= 0; i--) { c.beginPath(); c.ellipse(0, -i * s * 0.11 + s * 0.12, s * 0.5, s * 0.15, 0, 0, TAU); c.fill(); c.globalAlpha *= 0.999; c.strokeStyle = '#a8742f'; c.lineWidth = 1; c.stroke(); } },
    crown(c, s) { c.beginPath(); c.moveTo(-s * 0.5, s * 0.3); c.lineTo(-s * 0.5, -s * 0.2); c.lineTo(-s * 0.25, s * 0.05); c.lineTo(0, -s * 0.35); c.lineTo(s * 0.25, s * 0.05); c.lineTo(s * 0.5, -s * 0.2); c.lineTo(s * 0.5, s * 0.3); c.closePath(); c.fill(); [-0.5, 0, 0.5].forEach((x, i) => { c.beginPath(); c.arc(x * s, (i === 1 ? -0.38 : -0.23) * s, s * 0.055, 0, TAU); c.fill(); }); },
    bat(c, s, p, t) { const f = Math.sin(t * 2.2 + p.ph) * 0.14; c.beginPath(); c.moveTo(0, s * 0.08); c.quadraticCurveTo(-s * 0.2, -s * (0.22 + f), -s * 0.5, -s * (0.02 + f)); c.quadraticCurveTo(-s * 0.36, s * 0.04, -s * 0.3, s * 0.16); c.quadraticCurveTo(-s * 0.16, s * 0.04, 0, s * 0.2); c.quadraticCurveTo(s * 0.16, s * 0.04, s * 0.3, s * 0.16); c.quadraticCurveTo(s * 0.36, s * 0.04, s * 0.5, -s * (0.02 + f)); c.quadraticCurveTo(s * 0.2, -s * (0.22 + f), 0, s * 0.08); c.fill(); },
    pumpkin(c, s) { c.beginPath(); c.ellipse(-s * 0.16, 0, s * 0.26, s * 0.34, 0, 0, TAU); c.ellipse(s * 0.16, 0, s * 0.26, s * 0.34, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(0, 0, s * 0.2, s * 0.36, 0, 0, TAU); c.fill(); c.fillStyle = '#5f7a3a'; c.fillRect(-s * 0.04, -s * 0.48, s * 0.08, s * 0.16); },
    confetti(c, s) { c.fillRect(-s * 0.5, -s * 0.22, s, s * 0.44); },
    ribbon(c, s, p, t) { c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); for (let i = 0; i <= 8; i++) { const x = (i / 8 - 0.5) * s, y = Math.sin(i * 0.9 + t * 0.8 + p.ph) * s * 0.09; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); },
    ball(c, s) { c.beginPath(); c.arc(0, 0, s * 0.5, 0, TAU); c.fill(); c.globalAlpha *= 0.7; c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(1, s * 0.08); c.beginPath(); c.arc(-s * 0.5, 0, s * 0.5, -0.9, 0.9); c.stroke(); },
  };
  function poppy(c, x, y, s) { c.save(); c.translate(x, y); c.fillStyle = '#b3362c'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(Math.cos((i * TAU) / 4 + 0.6) * s * 0.26, Math.sin((i * TAU) / 4 + 0.6) * s * 0.26, s * 0.3, 0, TAU); c.fill(); } c.fillStyle = '#23201f'; c.beginPath(); c.arc(0, 0, s * 0.13, 0, TAU); c.fill(); c.restore(); }
  function rng(seed) { let a = seed >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* ---------- drawing one theme into a host element ---------- */
  function mount(host, id, opt) {
    opt = opt || {}; const th = byId[id] || byId.plain;
    host.textContent = '';
    if (th.id === 'plain') return { stop() {}, stats: () => ({ frames: 0, avgMs: 0, maxMs: 0, running: false }) };
    const mini = !!opt.mini, normal = opt.intensity === 'normal', reduce = !!opt.still || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    const wash = document.createElement('div'), cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    wash.style.cssText = 'position:absolute;inset:0'; cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    host.appendChild(wash); host.appendChild(cv);
    const isDark = opt.dark || (() => document.body.classList.contains('dark'));
    const R = rng(th.id.length * 977 + th.id.charCodeAt(0) * 131 + th.id.charCodeAt(th.id.length - 1));
    let W = 1, H = 1, dpr = 1, parts = [], darkNow = null, raf = 0, last = 0, t0 = 0, stopped = false, frames = 0, sum = 0, max = 0, bursts = [], nextBurst = 1.5;
    const aK = (normal ? 1 : 0.62) * (mini ? 1.15 : 1);
    function build() {
      parts = []; const area = mini ? 0.3 : Math.max(0.6, Math.min(1.7, (W * H) / (1366 * 768)));
      (th.parts || []).forEach((sp) => {
        const n = Math.max(2, Math.round(sp.n * (normal ? 1 : 0.6) * area));
        for (let i = 0; i < n; i++) parts.push({ sp, x: R(), y: R(), s: (sp.size[0] + R() * (sp.size[1] - sp.size[0])) * (mini ? 0.62 : 1), v: (sp.speed || 0) * (0.65 + R() * 0.7), ph: R() * TAU, rot: R() * TAU, vr: (R() - 0.5) * 0.9, c: Math.floor(R() * 99), dir: R() < 0.5 ? -1 : 1 });
      });
    }
    function size() { const r = host.getBoundingClientRect(); W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height)); dpr = mini ? 1 : Math.min(1.5, window.devicePixelRatio || 1); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); build(); paint(0); }
    function washNow() {
      const d = isDark(); if (d === darkNow) return; darkNow = d; const g = (d ? th.gradD : th.grad) || [];
      wash.style.background = g.length ? 'linear-gradient(' + (th.slow ? '120deg' : '180deg') + ',' + g.join(',') + (th.slow ? ',' + g[0] : '') + ')' : 'none';
      if (th.slow) { wash.style.backgroundSize = '300% 300%'; wash.style.animation = reduce ? 'none' : 'tct-slow 90s ease-in-out infinite'; }
    }
    const band = () => { if (mini) return { top: 0, bottom: H }; const b = opt.band ? opt.band() : null; return b && b.bottom > b.top ? b : { top: 0, bottom: H * 0.22 }; };
    function deco(t, dark) {
      const b = band();
      if (th.deco === 'bunting') {
        const col = th.decoCol, w = mini ? 15 : 34, hgt = mini ? 13 : 20, n = Math.ceil(W / w) + 1; ctx.globalAlpha = (mini ? 0.75 : 0.5) * (normal ? 1 : 0.8);
        ctx.strokeStyle = dark ? '#8f98b3' : '#8a8f9c'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, b.top + 2); ctx.lineTo(W, b.top + 2); ctx.stroke();
        for (let i = 0; i < n; i++) { const c = col[i % col.length]; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(i * w, b.top + 2); ctx.lineTo(i * w + w * 0.84, b.top + 2); ctx.lineTo(i * w + w * 0.42, b.top + 2 + hgt); ctx.closePath(); ctx.fill(); if (c === '#ffffff' && !dark) { ctx.strokeStyle = '#c9c5ba'; ctx.stroke(); } }
      } else if (th.deco === 'lights') {
        const gap = mini ? 20 : 46, n = Math.ceil(W / gap) + 1, col = ['#d9a441', '#c8553a', '#4f8fbf', '#5fa870']; ctx.strokeStyle = dark ? '#6f7a99' : '#9aa0ad'; ctx.lineWidth = 1; ctx.globalAlpha = 0.5; ctx.beginPath();
        for (let i = 0; i <= n; i++) { const x = i * gap, y = b.top + 3 + Math.sin((i % 2) * Math.PI) * 0; if (i) ctx.quadraticCurveTo(x - gap / 2, b.top + (mini ? 8 : 12), x, b.top + 3); else ctx.moveTo(x, y); } ctx.stroke();
        for (let i = 0; i < n; i++) { const x = i * gap + gap / 2, y = b.top + (mini ? 6.5 : 9.5); ctx.globalAlpha = (0.42 + 0.22 * Math.sin(t * 0.7 + i * 1.7)) * (normal ? 1 : 0.85); ctx.fillStyle = col[i % col.length]; ctx.beginPath(); ctx.arc(x, y, mini ? 2.2 : 3.4, 0, TAU); ctx.fill(); ctx.globalAlpha *= 0.3; ctx.beginPath(); ctx.arc(x, y, mini ? 4.5 : 7.5, 0, TAU); ctx.fill(); }
      } else if (th.deco === 'poppies') {
        const hh = b.bottom - b.top, s = mini ? 13 : Math.max(18, Math.min(30, hh * 0.3)); ctx.globalAlpha = dark ? 0.6 : 0.55;
        [[0.50, 0.42, 1], [0.535, 0.7, 0.8], [0.57, 0.36, 0.7], [0.62, 0.66, 0.9], [0.985, 0.92, 0.9], [0.008, 0.95, 0.8]].forEach((p) => poppy(ctx, p[0] * W, b.top + p[1] * hh, s * p[2]));
        if (!mini) { ctx.globalAlpha = dark ? 0.55 : 0.5; poppy(ctx, W - 10, H - 8, 16); poppy(ctx, 9, H - 9, 14); }
      }
    }
    function fireworks(t, dt, dark) { // soft, small and distant: a ring of dots that opens slowly and fades; never a flash
      const b = band();
      if (dt > 0 && t > nextBurst && bursts.length < (normal ? 3 : 2)) { bursts.push({ x: (0.12 + R() * 0.76) * W, y: b.top + (0.25 + R() * 0.55) * (b.bottom - b.top), t0: t, r: (mini ? 16 : 34) + R() * (mini ? 8 : 26), c: ['#c9552b', '#d9a441', '#4f8fbf', '#7b5fb0', '#5fa870'][Math.floor(R() * 5)], n: 12 + Math.floor(R() * 5) }); nextBurst = t + (normal ? 2.2 : 3.6) + R() * 3; }
      if (reduce && !bursts.length) for (let i = 0; i < 3; i++) bursts.push({ x: (0.2 + i * 0.3) * W, y: b.top + (0.35 + (i % 2) * 0.25) * (b.bottom - b.top), t0: t - 1.2, r: mini ? 18 : 40, c: ['#c9552b', '#4f8fbf', '#d9a441'][i], n: 14 });
      bursts = bursts.filter((u) => t - u.t0 < 3.2);
      bursts.forEach((u) => { const k = (t - u.t0) / 3.2, e = 1 - Math.pow(1 - k, 3), a = Math.sin(Math.min(1, k * 4) * Math.PI / 2) * (1 - k) * (dark ? 0.75 : 0.6) * aK; ctx.fillStyle = u.c; for (let i = 0; i < u.n; i++) { const an = (i / u.n) * TAU; for (let j = 0; j < 3; j++) { ctx.globalAlpha = a * (1 - j * 0.3); ctx.beginPath(); ctx.arc(u.x + Math.cos(an) * u.r * e * (1 - j * 0.16), u.y + Math.sin(an) * u.r * e * (1 - j * 0.16) + k * k * 10, (mini ? 1.2 : 2) - j * 0.4, 0, TAU); ctx.fill(); } } });
    }
    function paint(dt) {
      const t = reduce ? 3 : t0, dark = isDark(), b = band(); washNow();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i], sp = p.sp; let a = (sp.alpha || 0.5) * aK, yy;
        if (sp.motion === 'fall') { p.y += p.v * dt; p.x += Math.sin(t * 0.5 + p.ph) * 0.006 * dt; p.rot += p.vr * dt * 0.6; if (p.y > 1.06) { p.y = -0.06; p.x = R(); } }
        else if (sp.motion === 'rise') { p.y -= p.v * dt; p.x += Math.sin(t * 0.4 + p.ph) * 0.005 * dt; if (p.y < -0.06) { p.y = 1.06; p.x = R(); } }
        else if (sp.motion === 'drift') { p.x += p.v * dt * p.dir; p.y += Math.sin(t * 0.35 + p.ph) * 0.004 * dt; if (p.x > 1.08) p.x = -0.08; if (p.x < -0.08) p.x = 1.08; }
        else if (sp.motion === 'twinkle') a *= 0.55 + 0.45 * Math.sin(t * 0.55 + p.ph);
        if (sp.zone === 'band') yy = b.top + (0.25 + (p.y * 0.55)) * (b.bottom - b.top); else yy = p.y * H;
        if (sp.motion === 'float') yy += Math.sin(t * 0.45 + p.ph) * (mini ? 2 : 5);
        const cols = (dark && sp.colD) || sp.col, col = cols[p.c % cols.length];
        ctx.save(); ctx.translate((sp.zone === 'band' && !mini ? 0.42 + p.x * 0.4 : p.x) * W, yy);   // band shapes keep to the gap between the date and the clock
        if (sp.motion === 'fall' && (sp.shape === 'leaf' || sp.shape === 'petal' || sp.shape === 'confetti' || sp.shape === 'pancake')) ctx.rotate(sp.shape === 'pancake' ? Math.sin(p.rot) * 0.25 : p.rot);
        if (sp.motion === 'drift' && p.dir < 0 && sp.shape !== 'ribbon' && sp.shape !== 'ball') ctx.scale(-1, 1);
        ctx.globalAlpha = Math.min(0.8, a); ctx.fillStyle = col; ctx.strokeStyle = col; SHAPES[sp.shape](ctx, p.s, p, t, dark); ctx.restore();
      }
      if (th.custom === 'fireworks') fireworks(t, dt, dark);
      if (th.deco) deco(t, dark);
      ctx.globalAlpha = 1;
    }
    function loop(ts) {
      if (stopped) return; raf = requestAnimationFrame(loop);
      if (document.hidden || (opt.paused && opt.paused())) { last = 0; return; }
      if (last && ts - last < (mini ? 62 : 31)) return;                              // about 30 frames a second at most (mini previews: 16)
      const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0; last = ts; t0 += dt;
      const a = performance.now(); paint(dt); const d = performance.now() - a; frames++; sum += d; if (d > max) max = d;
    }
    const onResize = () => size(); let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(onResize); ro.observe(host); } else addEventListener('resize', onResize);
    size();
    const animated = !reduce && !th.still && !!(th.parts || th.custom || th.deco === 'lights');
    if (animated) raf = requestAnimationFrame(loop);
    return { stop() { stopped = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); else removeEventListener('resize', onResize); host.textContent = ''; }, repaint: () => { darkNow = null; paint(0); }, stats: () => ({ frames, avgMs: frames ? sum / frames : 0, maxMs: max, running: animated, particles: parts.length }) };
  }
  if (typeof document !== 'undefined') { const st = document.createElement('style'); st.textContent = '@keyframes tct-slow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}'; document.head.appendChild(st); }

  /* ---------- the calendar of special days (Automatic mode) ----------
     from / to are 'MM-DD' and repeat every year.  calc: worked out from Easter each year.  manual: the date moves every year, so the admin types it. */
  function easter(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), n = h + l - 7 * m + 114; return iso(y, Math.floor(n / 31), (n % 31) + 1); }
  const CALENDAR = [
    { id: 'halloween', label: 'Halloween', theme: 'halloween', from: '10-29', to: '10-31', on: true },
    { id: 'bonfire', label: 'Bonfire Night', theme: 'bonfire', from: '11-05', to: '11-05', on: true },
    { id: 'remembrance', label: 'Remembrance Day / Armistice', theme: 'remembrance', from: '11-11', to: '11-11', on: true },
    { id: 'standrew', label: 'St Andrew’s Day', theme: 'standrew', from: '11-30', to: '11-30', on: true },
    { id: 'christmas', label: 'Christmas (December to the end of term)', theme: 'snow', from: '12-01', to: '12-23', on: true },
    { id: 'epiphany', label: 'Galette des Rois / Épiphanie', theme: 'galette', from: '01-06', to: '01-06', on: true },
    { id: 'chandeleur', label: 'La Chandeleur', theme: 'pancakes', from: '02-02', to: '02-02', on: true },
    { id: 'shrove', label: 'Pancake Day (Shrove Tuesday)', theme: 'pancakes', calc: [-47, -47], on: true },
    { id: 'valentine', label: 'Valentine’s Day', theme: 'valentine', from: '02-14', to: '02-14', on: false },
    { id: 'stdavid', label: 'St David’s Day', theme: 'stdavid', from: '03-01', to: '03-01', on: true },
    { id: 'stpatrick', label: 'St Patrick’s Day', theme: 'stpatrick', from: '03-17', to: '03-17', on: true },
    { id: 'poisson', label: 'Poisson d’avril', theme: 'poisson', from: '04-01', to: '04-01', on: true },
    { id: 'easter', label: 'Easter (Maundy Thursday to Easter Monday)', theme: 'spring', calc: [-3, 1], on: true },
    { id: 'stgeorge', label: 'St George’s Day', theme: 'stgeorge', from: '04-23', to: '04-23', on: true },
    { id: 'musique', label: 'Fête de la Musique', theme: 'musique', from: '06-21', to: '06-21', on: true },
    { id: 'autumn', label: 'Autumn', theme: 'autumn', from: '09-22', to: '10-17', on: false },
    { id: 'frost', label: 'Winter', theme: 'frost', from: '01-07', to: '01-31', on: false },
    { id: 'blossom', label: 'Spring blossom', theme: 'spring', from: '03-20', to: '03-31', on: false },
    { id: 'exams', label: 'Exam season', theme: 'exam', from: '05-11', to: '06-19', on: false },
    { id: 'kings', label: 'King’s Birthday', theme: 'bunting', from: '11-14', to: '11-14', on: false, note: 'Set the date you mark it (the official birthday is in June).' },
    { id: 'sports', label: 'Sports day', theme: 'sports', from: '06-24', to: '06-24', on: false, note: 'Set the date each year.' },
    { id: 'summer', label: 'End of term', theme: 'summer', from: '06-29', to: '07-03', on: false, note: 'Set the dates each year.' },
    { id: 'lunar', label: 'Lunar New Year', theme: 'lunar', manual: true, on: false },
    { id: 'diwali', label: 'Diwali', theme: 'diwali', manual: true, on: false },
    { id: 'eid', label: 'Eid', theme: 'eid', manual: true, on: false },
    { id: 'hanukkah', label: 'Hanukkah', theme: 'hanukkah', manual: true, on: false },
  ];
  const MD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, YMD = /^\d{4}-\d{2}-\d{2}$/;
  // the built-in entries with the admin's changes applied, plus the admin's own entries; each gets .range = [from, to] for that year (or null)
  function entries(theme, year) {
    const cal = (theme && theme.calendar) || {}, set = cal.set || {}, out = [];
    CALENDAR.forEach((e) => {
      const o = set[e.id] || {}, x = Object.assign({}, e, { on: typeof o.on === 'boolean' ? o.on : e.on, builtin: true });
      if (e.calc) { const ea = easter(year); x.range = [addDays(ea, e.calc[0]), addDays(ea, e.calc[1])]; }
      else if (e.manual) { x.from = YMD.test(o.from || '') ? o.from : ''; x.to = YMD.test(o.to || '') ? o.to : x.from; x.range = x.from ? [x.from, x.to < x.from ? x.from : x.to] : null; }
      else { if (MD.test(o.from || '')) x.from = o.from; if (MD.test(o.to || '')) x.to = o.to; x.range = x.to >= x.from ? [year + '-' + x.from, year + '-' + x.to] : [year + '-' + x.from, year + 1 + '-' + x.to]; }
      out.push(x);
    });
    (Array.isArray(cal.custom) ? cal.custom : []).forEach((c, i) => { if (c && YMD.test(c.from || '') && byId[c.theme]) out.push({ id: 'own' + i, own: i, label: String(c.label || 'My own entry'), theme: c.theme, from: c.from, to: YMD.test(c.to || '') && c.to >= c.from ? c.to : c.from, on: c.on !== false, range: [c.from, YMD.test(c.to || '') && c.to >= c.from ? c.to : c.from] }); });
    return out;
  }
  // which calendar entry applies on a day: the admin's own entries win, then the shortest range (a single day beats a season)
  function autoEntry(theme, day) {
    const y = +day.slice(0, 4); let best = null;
    [y - 1, y].forEach((yr) => entries(theme, yr).forEach((e) => { if (!e.on || !e.range || day < e.range[0] || day > e.range[1] || !byId[e.theme]) return; const sc = (e.own != null ? 0 : 1000) + span(e.range[0], e.range[1]); if (!best || sc < best.sc) best = { sc, e }; }));
    return best ? best.e : null;
  }
  const okUrl = (u) => /^https:\/\/[^\s"'()<>\\]{4,600}$/.test(String(u || ''));
  // -> { kind: 'plain' | 'theme' | 'image', id, intensity, url, attribution, strength, blur, label }
  function resolve(theme, day) {
    const t = theme || {}, plain = { kind: 'plain', id: 'plain' }, intensity = t.intensity === 'normal' ? 'normal' : 'subtle';
    if (t.mode === 'theme') return byId[t.themeId] && t.themeId !== 'plain' && !(YMD.test(t.until || '') && day > t.until) ? { kind: 'theme', id: t.themeId, intensity, label: byId[t.themeId].name } : plain;
    if (t.mode === 'image') return okUrl(t.customUrl) && !(YMD.test(t.until || '') && day > t.until) ? { kind: 'image', id: 'image', url: t.customUrl, attribution: String(t.attribution || ''), strength: Math.max(5, Math.min(60, Number(t.strength) || 25)), blur: t.blur !== false } : plain;
    if (t.mode === 'auto') { const e = autoEntry(t, day); return e ? { kind: 'theme', id: e.theme, intensity, label: e.label } : plain; }
    return plain;
  }
  function parisDay(ms) { try { const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(ms)), g = (k) => p.find((x) => x.type === k).value; return g('year') + '-' + g('month') + '-' + g('day'); } catch (e) { const d = new Date(ms); return iso(d.getFullYear(), d.getMonth() + 1, d.getDate()); } }

  window.TCT = { THEMES, byId, CALENDAR, mount, easter, entries, autoEntry, resolve, parisDay, okUrl, addDays };
})();
