// Page 2 — From tree to paper: run a pen-drawn paper mill stage by stage, put the stages in order, recycle a sheet
// until its fibres are too short, match the key words, and two true/false on renewable + biodegradable.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const hsh = (a, b = 0) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };

  function text(x, s, px, py, o = {}) {
    x.save(); const f = o.font === 'hand' ? HANDF : LABF; x.font = f(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.8; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const close = (P) => P.concat([P[0]]);
  const circ = (x, cx, cy, r, o = {}) => pen(x, geo.ellipse(cx, cy, r, o.ry || r), Object.assign({ amp: 0.4 }, o));
  const drop = (x, px, py, o = {}) => pen(x, [[px, py - 5], [px - 2.5, py], [px, py + 2.5], [px + 2.5, py], [px, py - 5]], Object.assign({ w: 1.4, wob: false }, o));
  const star = (x, px, py, s, o = {}) => { pen(x, [[px - s, py], [px + s, py]], Object.assign({ w: 1.8, wob: false }, o)); pen(x, [[px, py - s], [px, py + s]], Object.assign({ w: 1.8, wob: false }, o)); };

  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ---------- the ten machines, each drawn in a 150 x 130 box; p = 0 (waiting) … 1 (done) ----------
  function tree(x, bx, by, s) {                    // a softwood: trunk and three tiers
    const P = (pts) => pts.map(([a, b]) => [bx + a * s, by + b * s]);
    pen(x, P([[-5, 0], [-5, -24], [5, -24], [5, 0]]), { w: 2 });
    [[-22, 30, -62], [-46, 24, -84], [-68, 17, -104]].forEach(([y0, hw, ap], i) => {
      const T = P([[-hw, y0], [0, ap], [hw, y0]]);
      Ink.hatchFill(x, T, 1, B, 1.1); pen(x, close(T), { w: 2, seed: 3 + i });
    });
  }
  const VAT = [[22, 42], [30, 116], [120, 116], [128, 42]];
  const vatX = (y) => { const u = (y - 42) / 74; return [22 + 8 * u, 128 - 8 * u]; };
  const surface = (x, y, t, o) => { const [a, b] = vatX(y), P = []; for (let px = a; px <= b; px += 6) P.push([px, y + 2.2 * Math.sin(px / 7 + t * 5)]); pen(x, P, Object.assign({ w: 1.8, wob: false }, o)); };
  const STAGES = [
    { n: 'fell', cap: '<b>Felling.</b> Fast-growing <b>softwood</b> trees, such as pine and spruce, are cut down.',
      draw(x, p) {
        pen(x, [[4, 122], [146, 122]], { w: 2, seed: 2 });
        tree(x, 20, 122, 0.55);
        pen(x, [[46, 122], [46, 112], [58, 112], [58, 122]], { w: 2 });
        x.save(); x.translate(52, 112); x.rotate(ease(p) * 1.5); tree(x, 0, 0, 0.86); x.restore();
      } },
    { n: 'debark', cap: '<b>Debarking.</b> The bark is stripped off the logs.',
      draw(x, p) {
        const body = [[14, 50], [128, 50], [128, 92], [14, 92]], cut = 14 + 114 * p;
        x.save(); x.beginPath(); x.rect(cut, 40, 130, 60); x.clip(); Ink.hatchFill(x, body, 1, B, 2.6);
        for (let k = 0; k < 9; k++) pen(x, [[20 + k * 12, 54 + hsh(k) * 8], [24 + k * 12, 86 - hsh(k, 2) * 8]], { w: 1.6, seed: k });
        x.restore();
        pen(x, close(body), { w: 2.2, seed: 5 }); circ(x, 128, 71, 9, { ry: 21, w: 2 }); circ(x, 128, 71, 4, { ry: 10, w: 1.2 });
        for (let k = 0; k < 3; k++) if (cut > 40 + k * 30) pen(x, [[20 + k * 30, 60 + k * 9], [Math.min(cut - 6, 46 + k * 30), 61 + k * 9]], { w: 1, a: 0.5, seed: k + 20 });
        if (p > 0 && p < 1) { const bl = [[cut - 9, 26], [cut + 9, 26], [cut, 50]]; Ink.hatchFill(x, bl, 1, RD, 2); pen(x, close(bl), { w: 1.8, color: RD, wob: false }); }
        for (let k = 0; k < 7; k++) { const u = clamp((p - k / 8) * 4); if (u > 0) pen(x, geo.curve([18 + k * 15, 96 + u * 16], [22 + k * 15, 92 + u * 18], [28 + k * 15, 98 + u * 20], [30 + k * 15, 102 + u * 18 + hsh(k) * 6], 6), { w: 1.6, wob: false }); }
      } },
    { n: 'chip', cap: '<b>Chipping.</b> The logs are cut into small wood chips.',
      draw(x, p) {
        pen(x, [[4, 122], [146, 122]], { w: 2, seed: 2 });
        if (p < 1) { const top = 2 + 26 * p; pen(x, close([[38, top], [58, top], [58, 30], [38, 30]]), { w: 2 }); pen(x, [[44, top + 3], [44, 28]], { w: 1, a: 0.5 }); }
        pen(x, close([[16, 28], [80, 28], [70, 56], [26, 56]]), { w: 2.2, seed: 4 });
        pen(x, close([[22, 56], [74, 56], [74, 122], [22, 122]]), { w: 2.2, seed: 6 });
        circ(x, 48, 86, 21, { w: 2 }); x.fillStyle = rgba(B, 0.9); x.beginPath(); x.arc(48, 86, 3, 0, 7); x.fill();
        for (let k = 0; k < 4; k++) { const a = p * 14 + (k * Math.PI) / 2; pen(x, [[48 + Math.cos(a) * 5, 86 + Math.sin(a) * 5], [48 + Math.cos(a + 0.5) * 20, 86 + Math.sin(a + 0.5) * 20]], { w: 2, wob: false }); }
        pen(x, [[74, 72], [94, 86]], { w: 2 }); pen(x, [[74, 84], [90, 96]], { w: 2 });
        const n = Math.round(p * 18);
        for (let k = 0; k < n; k++) {
          const px = 116 + (hsh(k, 1) - 0.5) * 52, top = 26 * (1 - Math.abs(px - 116) / 30), py = 118 - hsh(k, 2) * Math.max(2, top), a = hsh(k, 3) * 3;
          x.save(); x.translate(px, py); x.rotate(a); pen(x, close([[-4, -2.5], [4, -2.5], [4, 2.5], [-4, 2.5]]), { w: 1.4, wob: false }); x.restore();
        }
      } },
    { n: 'pulp', cap: '<b>Pulping.</b> The chips are broken down into <b>fibres</b> (by grinding, or by cooking with chemicals) and mixed with <b>lots of water</b>. This mush is called pulp.',
      draw(x, p, t) {
        const lev = 110 - 56 * p;
        pen(x, [[2, 18], [30, 18], [30, 30]], { w: 2.4 }); pen(x, [[2, 26], [22, 26], [22, 30]], { w: 1.6 });
        if (p > 0 && p < 1) [24, 27, 30].forEach((px, k) => pen(x, [[px, 32], [px + Math.sin(t * 9 + k) * 2, (32 + lev) / 2], [px, lev]], { w: 1.4, wob: false, a: 0.7 }));
        pen(x, VAT, { w: 2.6, seed: 8 });
        if (p > 0) {
          surface(x, lev, t);
          for (let k = 0; k < 46; k++) { const py = 60 + hsh(k, 1) * 52; if (py < lev + 4) continue; const [a, b] = vatX(py), px = a + 5 + hsh(k, 2) * (b - a - 10), an = hsh(k, 3) * 3 + (p < 1 ? t * 2 : 0); pen(x, [[px - Math.cos(an) * 4, py - Math.sin(an) * 3], [px + Math.cos(an) * 4, py + Math.sin(an) * 3]], { w: 1.3, wob: false, a: 0.75 }); }
        }
        pen(x, [[75, 8], [75, 102]], { w: 2.6, wob: false }); pen(x, close([[66, 2], [84, 2], [84, 10], [66, 10]]), { w: 1.8 });
        const hw = 24 * Math.cos(p * 18); pen(x, [[75 - hw, 100], [75 + hw, 100]], { w: 3, wob: false }); pen(x, [[75 + hw * 0.7, 82], [75 - hw * 0.7, 82]], { w: 2.4, wob: false });
      } },
    { n: 'bleach', cap: '<b>Bleaching.</b> The pulp is bleached to make it <b>white</b>. Additives and dyes can be added too.',
      draw(x, p, t) {
        const lev = 56, [a, b] = vatX(lev), body = [[a, lev], [b, lev], [120, 116], [30, 116]];
        x.save(); x.globalAlpha *= 1 - 0.94 * p; Ink.hatchFill(x, body, 1, B, 2.6); x.restore();
        pen(x, VAT, { w: 2.6, seed: 8 }); surface(x, lev, p < 1 && p > 0 ? t : 0);
        x.save(); x.translate(112, 20); x.rotate(-0.9 - 0.5 * Math.sin(Math.min(1, p * 4) * Math.PI / 2));
        pen(x, close([[-8, -20], [8, -20], [8, 6], [3, 12], [3, 18], [-3, 18], [-3, 12], [-8, 6]]), { w: 2, color: RD, seed: 9 }); pen(x, [[-8, -8], [8, -8]], { w: 1.2, color: RD }); x.restore();
        if (p > 0 && p < 1) for (let k = 0; k < 3; k++) drop(x, 93 - k * 3, 30 + (((p * 4 + k / 3) % 1) * (lev - 34)), { color: RD });
        if (p >= 1) { star(x, 52, 80, 6); star(x, 92, 94, 5); star(x, 76, 72, 4); }
      } },
    { n: 'wire mesh', cap: '<b>The wire mesh.</b> The pulp is sprayed onto a moving wire mesh. The water drains away and the fibres <b>mat together</b>.',
      draw(x, p, t) {
        circ(x, 26, 96, 11, { w: 2.2 }); circ(x, 126, 96, 11, { w: 2.2 });
        pen(x, [[26, 85], [126, 85]], { w: 2 }); pen(x, [[26, 107], [126, 107]], { w: 2 });
        const off = p < 1 ? (p * 60) % 8 : 0, Z = []; for (let px = 28 + off; px <= 124; px += 4) Z.push([px, Z.length % 2 ? 91 : 86]); pen(x, Z, { w: 1.1, wob: false, a: 0.8 });
        pen(x, close([[6, 20], [48, 20], [48, 50], [36, 58], [6, 50]]), { w: 2.2, seed: 12 }); Ink.hatchFill(x, [[6, 20], [48, 20], [48, 50], [36, 58], [6, 50]], 1, B, 0.8);
        if (p > 0 && p < 1) for (let k = 0; k < 4; k++) pen(x, [[40, 58], [46 + k * 8, 70 + ((t * 40 + k * 5) % 10)]], { w: 1.2, wob: false, a: 0.7 });
        if (p > 0) { const M = []; for (let px = 42; px <= 42 + 80 * p; px += 5) M.push([px, 80.5 + 1.6 * Math.sin(px / 5)]); if (M.length > 1) pen(x, M, { w: 4.5, wob: false }); }
        for (let k = 0; k < 5; k++) if (p > k / 6) drop(x, 42 + k * 17, p < 1 ? 111 + (((p * 5 + k * 0.37) % 1) * 12) : 117 + (k % 2) * 3);
        pen(x, [[14, 127], [20, 128], [132, 128], [138, 127]], { w: 2 });
      } },
    { n: 'press', cap: '<b>Pressing.</b> The mat of fibres is pressed between rollers to squeeze out more water.',
      draw(x, p) {
        [[44, 1], [92, -1]].forEach(([cy, dir]) => { circ(x, 75, cy, 22, { w: 2.4 }); const a = dir * p * 9; pen(x, [[75 - Math.cos(a) * 20, cy - Math.sin(a) * 20], [75 + Math.cos(a) * 20, cy + Math.sin(a) * 20]], { w: 1.4, wob: false, a: 0.7 }); x.fillStyle = rgba(B, 0.9); x.beginPath(); x.arc(75, cy, 3.5, 0, 7); x.fill(); });
        const Wt = []; for (let px = 4; px <= 58; px += 5) Wt.push([px, 68 + 2 * Math.sin(px / 4)]); pen(x, Wt, { w: 5, wob: false });
        pen(x, [[92, 68], [146, 68]], { w: 2, wob: false });
        pen(x, [[75, 2], [75, 16]], { w: 2.2, color: RD, wob: false }); pen(x, [[70, 10], [75, 17], [80, 10]], { w: 2.2, color: RD, wob: false });
        pen(x, [[75, 128], [75, 120]], { w: 2.2, color: RD, wob: false }); pen(x, [[70, 123], [75, 116], [80, 123]], { w: 2.2, color: RD, wob: false });
        if (p > 0) for (let k = 0; k < 4; k++) { const u = p < 1 ? (p * 3 + k / 4) % 1 : 1; drop(x, 52 - 9 * k * u - 4, 76 + u * (38 + (k % 2) * 4)); }
      } },
    { n: 'dry', cap: '<b>Drying.</b> The paper passes over <b>heated</b> rollers to dry it.',
      draw(x, p, t) {
        [32, 75, 118].forEach((cx, k) => { circ(x, cx, 84, 17, { w: 2.4, seed: 14 + k }); pen(x, [[cx - 9, 86], [cx - 4, 80], [cx + 1, 88], [cx + 6, 80], [cx + 10, 86]], { w: 1.8, color: RD, wob: false }); });
        const Wb = [[2, 65]]; for (let px = 32; px <= 118; px += 4) Wb.push([px, 84 - 19 * Math.cos(((px - 32) / 43) * Math.PI)]); Wb.push([146, 65]); pen(x, Wb, { w: 2.6, wob: false });
        if (p > 0) [22, 46, 75, 104, 128].forEach((cx, k) => { const top = 52 - 44 * p, P = []; for (let y = 52; y >= top; y -= 4) P.push([cx + 4 * Math.sin(y / 6 + k + (p < 1 ? t * 6 : 0)), y]); if (P.length > 1) pen(x, P, { w: 1.4, wob: false, a: 0.6 }); });
      } },
    { n: 'calender', cap: '<b>Calendering.</b> The paper is polished between smooth rollers to give it a <b>smooth finish</b>.',
      draw(x, p) {
        pen(x, [[38, 6], [38, 120]], { w: 2 }); pen(x, [[86, 6], [86, 120]], { w: 2 }); pen(x, [[26, 120], [98, 120]], { w: 2.4 });
        [26, 58, 90].forEach((cy, k) => { circ(x, 62, cy, 15, { w: 2.4, seed: 20 + k }); pen(x, geo.ellipse(62, cy, 10, 10, -2.6, -1.5), { w: 1.3, wob: false, a: 0.7 }); const a = (k % 2 ? -1 : 1) * p * 9; x.fillStyle = rgba(B, 0.9); x.beginPath(); x.arc(62 + Math.cos(a) * 6, cy + Math.sin(a) * 6, 2, 0, 7); x.fill(); });
        const Wt = []; for (let px = 2; px <= 50; px += 4) Wt.push([px, 42 + 1.8 * Math.sin(px / 2.6)]); pen(x, Wt, { w: 2.4, wob: false });
        pen(x, [[74, 42], [146, 42]], { w: 2.4, wob: false });
        if (p > 0.4) { star(x, 104, 30, 7 * clamp((p - 0.4) * 3)); star(x, 128, 56, 5 * clamp((p - 0.6) * 3)); }
        if (p > 0.8) star(x, 136, 26, 4);
      } },
    { n: 'reel', cap: '<b>Reeling.</b> The finished paper is wound onto huge reels, then cut to size.',
      draw(x, p) {
        const r = 12 + 30 * p;
        pen(x, [[75, 62], [50, 122]], { w: 2.6 }); pen(x, [[75, 62], [100, 122]], { w: 2.6 }); pen(x, [[38, 122], [112, 122]], { w: 2.4 });
        pen(x, [[2, 22], [75, 62 - r]], { w: 2.2, wob: false });
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.beginPath(); x.arc(75, 62, r, 0, 7); x.fill(); x.restore();
        circ(x, 75, 62, r, { w: 2.6 }); for (let q = 12; q < r - 3; q += 6) circ(x, 75, 62, q, { w: 1, a: 0.55, seed: q });
        circ(x, 75, 62, 6, { w: 2 }); const a = p * 16; pen(x, [[75, 62], [75 + Math.cos(a) * 6, 62 + Math.sin(a) * 6]], { w: 2, wob: false });
        if (p >= 1) { [0, 1, 2, 3].forEach((k) => pen(x, [[120, 121 - k * 4], [148, 121 - k * 4]], { w: 1.6, seed: k })); pen(x, [[120, 105], [120, 122]], { w: 1.4 }); pen(x, [[148, 105], [148, 122]], { w: 1.4 }); }
      } },
  ];

  Book.page({
    id: 'p02',
    title: 'From tree to paper',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      // blur manager: several activities can each hold a lock on the same notes
      const held = new Map();
      const lock = (els, key, on) => els.forEach((e) => { const s = held.get(e) || held.set(e, new Set()).get(e); on ? s.add(key) : s.delete(key); e.classList.toggle('peek-lock', s.size > 0); });
      const guard = (actEl, key, els, done) => {
        if (done()) return;
        actEl.addEventListener('pointerdown', () => { if (!done()) lock(els, key, true); }, { passive: true });
        actEl.addEventListener('click', () => setTimeout(() => { if (done()) lock(els, key, false); }, 60));
      };
      const tried = (id, n = 3) => () => { const it = got(id); return !!it && (it.correct === true || it.attempts >= n); };

      ui.h('From tree to paper');
      ui.p('Every sheet of paper starts life as a tree. <b>Run the paper mill</b>: tap each machine in turn and watch what it does.');

      // ------------------------------------------------------------------ the mill
      const W = 860, HH = 446, CW = 164, X0 = 20, RY = [6, 238];
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 6px';
      const S = Stage(lab, W, HH);
      const capEl = ui.p('', ''); capEl.style.minHeight = 'calc(var(--R) * 2)';
      const rMill = ui.record('p02.mill', { label: 'Paper mill: stages run (10)', type: 'experiment', max: 1 });
      let done = Math.min(10, (rMill.get() || {}).done || 0), run = null, nag = 0, shown = done - 1;
      const cell = (i) => [X0 + (i % 5) * CW, RY[i < 5 ? 0 : 1]];
      const station = (x, i, p, t, alpha) => {
        const [cx, cy] = cell(i);
        x.save(); x.globalAlpha = alpha; x.translate(cx + 7, cy + 8); STAGES[i].draw(x, p, t); x.restore();
        if (alpha === 1) text(x, i + 1 + '  ' + (p >= 1 ? STAGES[i].n : '?'), cx + CW / 2, cy + 172, { size: 23, align: 'center', color: p >= 1 ? B : RD });
        if (i % 5 < 4) pen(x, [[cx + CW - 8, cy + 164], [cx + CW + 8, cy + 164]], { w: 1.6, a: alpha * 0.7, wob: false }), pen(x, [[cx + CW + 2, cy + 159], [cx + CW + 8, cy + 164], [cx + CW + 2, cy + 169]], { w: 1.6, a: alpha * 0.7, wob: false });
      };
      let stat;
      const buildStat = () => { stat = S.layer(W, HH, (x) => { for (let i = 0; i < 10; i++) if (i < done) station(x, i, 1, 0, 1); else if (i > done) station(x, i, 0, 0, 0.28); }); };
      buildStat(); S.onFonts = buildStat;
      const caption = () => {
        capEl.innerHTML = shown >= 0 ? `<b style="font-family:Fredoka">${shown + 1}.</b> ${STAGES[shown].cap}` : '<span class="red">Tap machine 1 (the trees) to start the mill.</span>';
        if (done >= 10 && shown === 9) capEl.innerHTML += ' <b class="green">The mill is running!</b> <span class="small">(Tap any machine to read about it again.)</span>';
      };
      S.render = (dt, t) => {
        const x = S.ctx; S.blit(stat, 0, 0);
        if (done >= 10) return false;
        let p = 0;
        if (run) { run.u = Math.min(1, run.u + dt / 1.15); p = run.u; }
        station(x, done, p, t, 1);
        if (!run) { const [cx, cy] = cell(done), bob = Math.sin(t * 5) * 4; pen(x, [[cx + CW / 2 - 14, cy + 184 + bob + 16], [cx + CW / 2 - 14, cy + 184 + bob]], { w: 3, color: RD, wob: false }); pen(x, [[cx + CW / 2 - 22, cy + 193 + bob], [cx + CW / 2 - 14, cy + 183 + bob], [cx + CW / 2 - 6, cy + 193 + bob]], { w: 3, color: RD, wob: false }); text(x, 'tap!', cx + CW / 2, cy + 202 + bob, { font: 'hand', size: 22, color: RD }); }
        if (run && run.u >= 1) {
          run = null; done++; shown = done - 1; buildStat(); caption(); Book.sfx(done === 10 ? 'success' : 'pop', { gain: 0.35 });
          rMill.set({ answer: `ran ${done} of 10 stages`, correct: done === 10 ? true : null, score: done === 10 ? 1 : 0, max: 1, done });
          gate();
        }
        return true;
      };
      S.c.addEventListener('click', (e) => {
        const [px, py] = S.pos(e), i = clamp(Math.floor((px - X0) / CW), 0, 4) + (py > RY[1] - 4 ? 5 : 0);
        if (i < done) { shown = i; caption(); Book.sfx('tick', { gain: 0.4 }); return; }
        if (run) return;
        if (i === done) { run = { u: 0 }; Book.sfx('stroke', { material: 'pen', dur: 1, gain: 0.5 }); S.go(); }
        else { capEl.innerHTML = `<span class="red">Not yet! Machine <b>${done + 1}</b> comes next: look for the red arrow.</span>`; Book.sfx('error', { gain: 0.25 }); }
      });
      caption();

      // ------------------------------------------------------------------ after the mill
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e.closest('.ink-anim-wrap') || e); return e; };
      const gateMsg = ui.p('<span class="small">Run all ten machines to carry on.</span>');
      const topNotes = add(ui.box('Paper and board are made from <span class="key">cellulose fibres</span>, mostly from <b>wood pulp</b>. The wood comes mainly from fast-growing <b>softwood</b> trees such as pine and spruce.<br>The <b>FSC</b> logo on a product shows that its wood came from <b>responsibly managed forests</b>, where felled trees are replanted.', { tag: 'Notes' }));
      const millBits = [lab, capEl, topNotes];

      // --- put the stages in order (custom sequence)
      add(ui.el('h2', '', 'Can you run it from memory?'));
      add(ui.p('<span class="small">The mill and the notes blur while you answer.</span>'));
      const STEPS = ['Trees are felled and debarked', 'Logs are cut into small chips', 'Chips are pulped with water', 'Pulp is bleached white', 'Pulp is sprayed onto a wire mesh', 'Pressed and dried on rollers', 'Calendered, then wound onto reels'];
      const seq = add(sequence(ui, { id: 'p02.sequence', label: 'Order 7 stages of paper making', q: 'Put the seven stages of paper making <b>in order</b>. <span class="small">Tap a card to add it to the next empty line. Tap a placed card to take it back.</span>', steps: STEPS, mis: 'paper-source',
        explain: 'Fell and debark → chip → pulp → bleach → wire mesh → press and dry → calender and reel.' }));
      guard(seq, 'seq', millBits, tried('p02.sequence'));

      // --- the recycling loop
      add(ui.el('h2', '', 'Round and round: recycling'));
      add(ui.p('Waste paper can be collected and made into new paper. But is there a limit?'));
      const rp = add(ui.predict({ id: 'p02.recycle-predict', label: 'Prediction: how many times can paper fibres be recycled?', q: '<b>Predict:</b> how many times can the <b>same fibres</b> be recycled into new paper?',
        options: ['Once or twice', 'About 5 to 7 times', 'About 50 times', 'For ever: no limit'], onPick: () => recGate() }));
      const rl = add(ui.el('div', '')); rl.style.cssText = 'position:relative;margin:0 0 8px;transition:opacity .3s';
      const R = Stage(rl, 860, 350);
      const rRec = ui.record('p02.recycle-lab', { label: 'Recycling loop: times recycled until the sheet failed', type: 'experiment', max: 1 });
      const pr = rRec.get() || {};
      const rc = { n: pr.n || 0, failed: !!pr.failed, mixed: !!pr.mixed, anim: 0, going: false };
      const FAIL = 7, LEN = [86, 72, 60, 50, 41, 33, 26, 16];
      const row = add(ui.el('div', '')); row.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:0 0 var(--R)';
      const rbtn = ui.el('button', 'btn', '', row); rbtn.type = 'button'; rbtn.style.cssText = 'margin-top:0;min-height:60px;min-width:230px;font-size:21px';
      const rstat = ui.el('span', 'small', '', row); rstat.style.flex = '1 1 240px';
      let rStat;
      const buildR = () => { rStat = R.layer(860, 350, (x) => {
        // the loop: three chasing arrows
        [0, 1, 2].forEach((k) => { const a0 = -Math.PI / 2 + 0.28 + (k * 2 * Math.PI) / 3, a1 = a0 + (2 * Math.PI) / 3 - 0.56, A = geo.ellipse(360, 196, 86, 86, a0, a1); Ink.stroke(x, A, { w: 3, seed: 30 + k }); Ink.stroke(x, geo.head(A, 20, 0.5), { w: 3, seed: 40 + k, retrace: false }); });
        text(x, 'pulp with water', 360, 88, { size: 22, align: 'center' });
        text(x, 'de-ink', 452, 292, { size: 22 });
        text(x, 'new paper', 262, 326, { size: 22, align: 'center' });
        // the magnifier
        Ink.stroke(x, geo.ellipse(676, 160, 108, 108), { w: 3.4, seed: 50 }); pen(x, geo.ellipse(676, 160, 101, 101), { w: 1.2, a: 0.6 });
        const hd = [[748, 246], [762, 232], [832, 302], [818, 316]]; Ink.hatchFill(x, hd, 1, B, 2); Ink.stroke(x, close(hd), { w: 2.6, seed: 51 });
        text(x, 'the fibres, magnified', 640, 318, { font: 'hand', size: 22, align: 'center' });
      }); };
      buildR(); R.onFonts = buildR;
      R.render = (dt, t) => {
        const x = R.ctx; R.blit(rStat, 0, 0); let busy = false;
        if (rc.going) { rc.anim = Math.min(1, rc.anim + dt / 1.2); busy = true; if (rc.anim >= 1) { rc.going = false; rc.anim = 0; landed(); } }
        const n = rc.n, broke = rc.failed && !rc.mixed;
        // the sheet
        text(x, 'times recycled: ' + n, 20, 36, { size: 26, color: broke ? RD : B });
        if (!rc.going) {
          if (!broke) {
            const P = [[48, 70], [178, 70], [178, 248], [48, 248]];
            x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fff'; x.fillRect(48, 70, 130, 178); x.restore();
            Ink.hatchShadow(x, P, 1, 7, 7); pen(x, close(P), { w: 2.4, amp: rc.mixed ? 0.7 : 0.7 + n * 0.55, seed: 3 });
            const fl = rc.mixed ? 60 : n * 34; for (let k = 0; k < fl; k++) { x.fillStyle = rgba(B, 0.22); x.fillRect(52 + hsh(k, 1) * 122, 74 + hsh(k, 2) * 170, 2, 2); }
            if (!rc.mixed) for (let k = 0; k < Math.max(0, n - 3); k++) pen(x, [[48 + hsh(k, 7) * 20 + (k % 2) * 100, 90 + k * 45], [70 + hsh(k, 8) * 30 + (k % 2) * 80, 100 + k * 45]], { w: 1.3, a: 0.7, seed: k });   // weak spots
            if (rc.mixed) Ink.tick(x, 96, 170, 1.5);
          } else for (let k = 0; k < 7; k++) { const px = 56 + hsh(k, 1) * 110, py = 110 + hsh(k, 2) * 130, a = hsh(k, 3) * 3; x.save(); x.translate(px, py); x.rotate(a); pen(x, close([[-18, -14], [14, -18], [20, 8], [-6, 16], [-20, 4]]), { w: 1.8, seed: k }); x.restore(); }
          const cap = rc.mixed ? 'strong again!' : broke ? 'it falls apart!' : n === 0 ? 'a brand new sheet' : n <= 3 ? 'still fine' : n <= 5 ? 'getting weaker…' : 'very weak!';
          text(x, cap, 113, 286, { font: 'hand', size: 22, align: 'center', color: rc.mixed ? GR : broke || n > 5 ? RD : B });
        } else { const a = Math.PI - rc.anim * Math.PI * 2, px = 360 + Math.cos(a) * 86, py = 196 - Math.sin(a) * 86; x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fff'; x.fillRect(px - 15, py - 20, 30, 40); x.restore(); pen(x, close([[px - 15, py - 20], [px + 15, py - 20], [px + 15, py + 20], [px - 15, py + 20]]), { w: 2.2, seed: 4 }); }
        // fibres under the lens
        x.save(); x.beginPath(); x.arc(676, 160, 100, 0, 7); x.clip();
        const L = LEN[Math.min(n, 7)];
        for (let k = 0; k < 34; k++) {
          const fresh = rc.mixed && k % 3 === 0, l = fresh ? LEN[0] : L, cx = 590 + hsh(k, 11) * 172, cy = 76 + hsh(k, 12) * 168, a = hsh(k, 13) * Math.PI, dx = (Math.cos(a) * l) / 2, dy = (Math.sin(a) * l) / 2;
          pen(x, geo.curve([cx - dx, cy - dy], [cx - dx / 3 + 6, cy - dy / 3 - 6], [cx + dx / 3 - 6, cy + dy / 3 + 6], [cx + dx, cy + dy], 8), { w: fresh ? 2.6 : 2, color: fresh ? GR : B, wob: false, a: 0.85 });
        }
        x.restore();
        return busy;
      };
      const saveRec = () => rRec.set({ answer: `recycled ${rc.n} time${rc.n === 1 ? '' : 's'}` + (rc.failed ? ': the sheet fell apart on recycle number ' + FAIL : '') + (rc.mixed ? '; then mixed in new (virgin) fibres' : ''), correct: rc.failed ? true : null, score: rc.failed ? 1 : 0, max: 1, n: rc.n, failed: rc.failed, mixed: rc.mixed });
      function landed() { rc.n++; if (rc.n >= FAIL) { rc.failed = true; Book.sfx('error', { gain: 0.35 }); } else Book.sfx('pop', { gain: 0.35 }); saveRec(); rp.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); recGate(); }
      rbtn.onclick = () => {
        if (rc.going) return;
        if (rc.failed && !rc.mixed) { rc.mixed = true; Book.sfx('success', { gain: 0.35 }); saveRec(); recGate(); R.go(); return; }
        if (rc.failed) return;
        rc.going = true; rc.anim = 0; Book.sfx('paper', { gain: 0.5, dur: 0.8 }); rbtn.disabled = true; R.go();
      };

      const recRest = add(ui.el('div', ''));
      const addR = (e) => { recRest.appendChild(e); return e; };
      const recFound = addR(ui.box('', { tag: 'Result' }));
      const recQ = addR(ui.mcq({ id: 'p02.recycle', label: 'Why can paper not be recycled for ever?', q: 'Why can the same paper <b>not</b> be recycled again and again for ever?',
        options: [
          { t: 'Each time it is pulped, the fibres get shorter and weaker', ok: true, why: 'Yes: short fibres cannot mat together well, so the paper gets weaker each time.' },
          { t: 'Each time it is pulped, the fibres get longer and tangle up', mis: 'recycle-forever', why: 'Look at the magnifier again in a moment: the fibres went the other way. Pulping breaks them.' },
          { t: 'It can be: the fibres stay the same however often they are used', mis: 'recycle-forever', why: 'Your sheet fell apart! Something happens to the fibres on every trip round the loop.' },
          { t: 'The old ink can never be taken out, so it ends up black', why: 'Recycled paper is de-inked, so the ink does come out. The limit comes from what pulping does to the fibres.' },
        ] }));
      const recNotes = addR(ui.box('<b>Recycled paper:</b> waste paper is collected, sorted, <b>pulped with water</b>, <b>de-inked</b> and made into paper again.<br>Each time, the fibres get <span class="key">shorter and weaker</span>, so paper can only be recycled about <b>5 to 7 times</b>. Recycled pulp is often mixed with new (<b>“virgin”</b>) fibres.<br>Recycling saves <b>trees</b>, <b>energy</b> and <b>landfill space</b>.', { tag: 'Notes' }));
      const recRight = () => { const it = got('p02.recycle'); return !!it && it.correct === true; };
      if (!recRight()) { lock([recNotes], 'pre', true); recQ.addEventListener('click', () => setTimeout(() => { if (recRight()) lock([recNotes], 'pre', false); }, 60)); }
      guard(recQ, 'recq', [rl, recFound, rstat], tried('p02.recycle'));

      function recGate() {
        const on = !!got('p02.recycle-predict');
        rl.style.opacity = on ? 1 : 0.35; row.style.opacity = on ? 1 : 0.35;
        rbtn.disabled = !on || rc.going || rc.mixed;
        rbtn.textContent = rc.mixed ? 'Paper saved ✓' : rc.failed ? '🌲 Mix in new fibres' : '♻ Recycle it' + (rc.n ? ' again' : '');
        rstat.innerHTML = !on ? '<span class="red">Make your prediction first.</span>' : rc.mixed ? 'Mills often mix recycled pulp with <b>new long fibres</b> to keep the paper strong.' : rc.failed ? 'The fibres are now too short to hold together. Can the mill rescue this pulp?' : rc.n ? 'Watch the fibres under the magnifier each time. Keep going until something changes!' : 'Send the sheet round the loop.';
        if (rc.n) rp.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        recRest.style.display = rc.failed ? '' : 'none';
        if (rc.failed) {
          const p = (got('p02.recycle-predict') || {}).answer, ok = p === 'About 5 to 7 times';
          recFound.innerHTML = `<span class="tag">Result</span>Your sheet survived <b>${FAIL - 1}</b> trips round the loop, getting weaker each time. On trip ${FAIL} it fell apart.` + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ not this time'}</b>.` : '');
          requestAnimationFrame(() => Ink.frame(recFound));
        }
        R.go();
      }

      // --- key words
      add(ui.el('h2', '', 'Key words'));
      const allNotes = millBits.concat([recNotes, recFound]);
      const match = add(ui.match({ id: 'p02.words', label: 'Match 7 paper-making words to meanings', q: 'Tap a word, then tap its meaning. <span class="small">(The notes blur until every pair is matched.)</span>',
        pairs: [
          ['cellulose', 'the natural fibres that paper is made from'],
          ['pulp', 'wood fibres mixed with lots of water'],
          ['softwood', 'fast-growing trees such as pine and spruce', 'paper-source'],
          ['bleaching', 'using chemicals to turn the pulp white'],
          ['calendering', 'polishing paper between smooth rollers'],
          ['FSC', 'a logo: wood from responsibly managed forests'],
          ['virgin fibres', 'new fibres that have never been recycled'],
        ] }));
      guard(match, 'match', allNotes, () => { const it = got('p02.words'); return !!it && it.correct != null; });

      // --- good or bad for the planet?
      add(ui.el('h2', '', 'Good for the planet?'));
      const tf1 = add(ui.tf({ id: 'p02.renewable', label: 'T/F: wood pulp is a non-renewable resource', statement: 'Wood pulp is a <b>non-renewable</b> resource: once the trees have been cut down, the supply is gone for good.', answer: false, mis: 'renewable-mix',
        explain: 'False. Wood is a <b>renewable</b> resource as long as the forests are replanted. New trees grow to replace the ones that were felled.' }));
      const tf2 = add(ui.tf({ id: 'p02.biodegradable', label: 'T/F: paper and board are biodegradable', statement: 'Paper and board are <b>biodegradable</b>: left outdoors, they will rot away naturally.', answer: true, mis: 'renewable-mix',
        explain: 'True. Paper and board are made of natural fibres, so they are <b>biodegradable</b>. They are also <b>recyclable</b>.' }));
      const endNotes = add(ui.box('<b>Good:</b> wood pulp is <span class="key">renewable</span> if forests are replanted (look for the FSC logo). Paper and board are <span class="key">biodegradable</span> and <span class="key">recyclable</span>.<br><b>Not so good:</b> making paper uses a lot of <b>water</b> and <b>energy</b>, and bleaching uses <b>chemicals</b>.', { tag: 'Notes' }));
      {
        const both = () => !!got('p02.renewable') && !!got('p02.biodegradable');
        const upd = () => { endNotes.style.display = both() ? '' : 'none'; if (both()) lock(allNotes, 'tf', false); };
        const start = () => { if (!both()) lock(allNotes, 'tf', true); };
        [tf1, tf2].forEach((e) => { e.addEventListener('pointerdown', start, { passive: true }); e.addEventListener('click', () => setTimeout(upd, 60)); });
        if ('IntersectionObserver' in window) new IntersectionObserver((en) => { if (en.some((q) => q.isIntersecting) && !root.closest('.page').classList.contains('hidden')) start(); }, { threshold: 0.4 }).observe(tf1);
        upd();
      }

      function gate() { const ok = done >= 10; rest.style.display = ok ? '' : 'none'; gateMsg.style.display = ok ? 'none' : ''; if (ok) { recGate(); R.go(); } }
      gate(); S.go();
    },
  });

  // ---------- a "put these in order" activity: tap a card to drop it on the next empty line ----------
  function sequence(ui, o) {
    const n = o.steps.length, r = ui.record(o.id, { label: o.label, type: 'sequence', max: n });
    const d = ui.el('div', 'act'); d.dataset.id = o.id; ui.el('div', 'q', o.q, d);
    requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
    const tray = ui.el('div', 'tray', '', d), list = ui.el('div', '', '', d);
    list.style.cssText = 'display:grid;gap:6px;margin:0 0 4px';
    const btn = ui.el('button', 'btn', 'Check', d), f = ui.el('div', 'fb', '', d);
    const prev = r.get() || {}, order = (prev.order || []).concat(Array(n).fill(null)).slice(0, n);
    let seed = 5, sh; do { sh = Book.shuffle(o.steps.map((_, k) => k), seed++); } while (sh.some((k, i) => k === i && i < 2));
    const cards = {}; let solved = prev.correct === true;
    sh.forEach((k) => { const c = ui.el('span', 'card', Book.esc(o.steps[k]), tray); c._k = k; cards[k] = c; c.onclick = (e) => { e.stopPropagation(); if (solved) return; const at = order.indexOf(k); if (at >= 0) order[at] = null; else { const free = order.indexOf(null); if (free < 0) return; order[free] = k; } c.classList.remove('right', 'wrong'); Book.sfx('tick', { gain: 0.5 }); lay(); }; });
    const slots = order.map((_, i) => { const s = ui.el('div', '', `<b style="font:700 20px Fredoka;flex:0 0 30px;text-align:center">${i + 1}</b>`, list); s.style.cssText = 'display:flex;align-items:center;gap:8px;min-height:52px;padding:3px 8px;border:2px dashed rgba(30,46,150,.3);border-radius:12px;background:rgba(255,255,255,.5)'; return s; });
    function lay() { Object.values(cards).forEach((c) => { const at = order.indexOf(c._k); (at >= 0 ? slots[at] : tray).appendChild(c); }); btn.disabled = solved || order.includes(null); }
    const mark = () => order.forEach((k, i) => { if (k != null) { cards[k].classList.toggle('right', k === i); cards[k].classList.toggle('wrong', k !== i); } });
    const say = (ok, score, att) => { f.className = 'fb on ' + (ok ? 'good' : 'bad'); f.innerHTML = ok ? '✓ ' + o.explain : `✗ ${score}/${n} in the right place. Tap the red ones to take them back, then try again.` + (att >= 3 ? `<br>The order is: <b>${o.explain}</b>` : ''); };
    btn.onclick = () => {
      const score = order.filter((k, i) => k === i).length, ok = score === n; solved = ok;
      Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
      r.set({ answer: order.map((k, i) => `${i + 1}. ${o.steps[k]}`).join(' → '), correct: ok, score, max: n, mis: ok ? '' : o.mis || '', order: order.slice() });
      mark(); say(ok, score, r.get().attempts); lay();
    };
    lay();
    if (prev.order && !prev.order.includes(null) && prev.attempts) { mark(); say(solved, prev.score, prev.attempts); }
    return d;
  }
})();
