// Page 1 — Starter: the light that thinks. Predict how a night light knows when to switch on, then play with a
// pen-drawn bedroom (drag time from midday to midnight, cover the little dot), open the case and tap three mystery boxes.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
  const close = (P) => P.concat([P[0]]);
  const arc = (cx, cy, rx, ry, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };

  function text(x, s, px, py, o = {}) {
    x.save(); const f = o.font === 'hand' ? HANDF : LABF; x.font = f(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  // plain 45° hatching over a rectangle (for the "it is dark" layers)
  function diag(x, x0, y0, x1, y1, sp, a, seed = 3) {
    const rr = H.rng(seed), h = y1 - y0; x.save(); x.beginPath(); x.rect(x0, y0, x1 - x0, y1 - y0); x.clip();
    x.strokeStyle = rgba(B, a); x.lineWidth = 1.1; x.beginPath();
    for (let o = x0 - h; o < x1; o += sp * (0.8 + rr() * 0.4)) { let s = 0; while (s < h) { const e = Math.min(h, s + rr.range(40, 120)), j = rr.range(-1, 1); x.moveTo(o + h - s + j, y0 + s); x.lineTo(o + h - e + j, y0 + e); s = e + rr.range(-4, 3); } }
    x.stroke(); x.restore();
  }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, dpr, render: () => false };
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
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  Book.page({
    id: 'p01',
    title: 'Starter: the light that thinks',
    build(ui, root) {
      ui.h('The light that thinks');
      ui.p('This little <b>night light</b> is plugged in beside the bed. Nobody ever touches it, yet it switches itself <b>on</b> and <b>off</b> at just the right moments.');

      const got = (id) => Book.state.items[id];
      const RIGHT = 'It senses how dark the room is';
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: how the night light knows when to switch on', q: '<b>Predict:</b> how does the night light know when to switch on?',
        options: ['It has a clock inside', RIGHT, 'It senses when you get into bed', 'Someone switches it on remotely'], onPick: () => unlockLab() });

      // ------------------------------------------------------------------ the bedroom
      ui.el('h2', '', 'Now investigate');
      const how = ui.p('<b>Drag the slider</b> under the window to run time on from midday to midnight. Then <b>press and hold the little dot</b> on the front of the night light. Watch the lamp, and keep an eye on the clock.');
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 14px;transition:opacity .3s';
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the bedroom unlocks.'); lockMsg.style.marginTop = '-6px';

      const W = 860, HH = 520, FLOOR = 452;
      const WX = 50, WY = 40, WW = 250, WH = 200;       // window
      const SX0 = 76, SX1 = 274, SY = 300;              // slider track
      const NL = { x: 444, top: 96, by: 172, bw: 104, bh: 116, sx: 444, sy: 254 }; // night light (sx, sy = the dot)
      const S = Stage(lab, W, HH, 'pan-y');
      const r = ui.record('p01.try', { label: 'Night light experiment: tried day/night, covered the sensor', type: 'experiment', max: 2 });
      const prev = r.get() || {};
      const done = { night: !!prev.night, cover: !!prev.cover, coverNight: !!prev.coverNight, boxes: (prev.boxes || []).slice() };
      let u = 0, drag = false, moved = done.night, cover = false, coverBtn = false, glow = 0, lampOn = false, fing = 0, pressed = done.cover;

      const row = ui.el('div', ''); row.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:0 0 var(--R)';
      const btn = ui.el('button', 'btn', '☝ Cover the dot (hold)', row);
      btn.style.cssText = 'margin-top:0;min-width:230px;min-height:60px;font-size:20px;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none';
      const stat = ui.el('span', 'small', '', row); stat.style.flex = '1 1 260px';

      let sprStat, sprDark, sprDarkLit, sprSky, sprSun, sprMoon;
      function buildArt() {
        sprStat = S.layer(W, HH, (x) => {
          // floor + skirting board
          Ink.stroke(x, [[10, FLOOR], [W - 8, FLOOR]], { w: 2.6, seed: 51 }); pen(x, [[10, FLOOR - 14], [356, FLOOR - 14]], { w: 1.3, seed: 4 });
          const rr = H.rng(9); for (let i = 0; i < 26; i++) { const gx = rr.range(20, W - 30), gy = rr.range(FLOOR + 12, HH - 12); pen(x, [[gx, gy], [gx + rr.range(30, 70), gy + 1]], { w: 1, a: 0.3, wob: false }); }
          // rug
          const rug = geo.ellipse(182, 486, 136, 20); Ink.hatchFill(x, rug, 1, B, 0.7); Ink.stroke(x, rug, { w: 2, seed: 7 });
          // window frame, sill, hills (the sky is drawn live)
          Ink.stroke(x, close([[WX, WY], [WX + WW, WY], [WX + WW, WY + WH], [WX, WY + WH]]), { w: 3, seed: 12 });
          Ink.stroke(x, close([[WX + 9, WY + 9], [WX + WW - 9, WY + 9], [WX + WW - 9, WY + WH - 9], [WX + 9, WY + WH - 9]]), { w: 1.8, seed: 13, retrace: false });
          Ink.stroke(x, [[WX - 14, WY + WH + 5], [WX + WW + 14, WY + WH + 5], [WX + WW + 8, WY + WH + 17], [WX - 8, WY + WH + 17], [WX - 14, WY + WH + 5]], { w: 2.3, seed: 14 });
          x.save(); x.beginPath(); x.rect(WX + 9, WY + 9, WW - 18, WH - 18); x.clip();
          const h1 = geo.curve([WX, WY + WH - 30], [WX + 70, WY + WH - 72], [WX + 130, WY + WH - 60], [WX + WW, WY + WH - 20], 30).concat([[WX + WW, WY + WH], [WX, WY + WH]]);
          x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.beginPath(); h1.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill();
          Ink.hatchFill(x, h1, 1, B, 0.6); Ink.stroke(x, h1.slice(0, 31), { w: 2, seed: 15 });
          Ink.stroke(x, [[WX + 196, WY + WH - 40], [WX + 196, WY + WH - 70]], { w: 2, seed: 16, retrace: false });
          const tree = geo.ellipse(WX + 196, WY + WH - 84, 18, 22); Ink.hatchFill(x, tree, 1, B, 1.6); Ink.stroke(x, tree, { w: 1.8, seed: 17, retrace: false });
          x.restore();
          // the glazing bars go over everything in the window
          // slider track with a sun at one end and a moon at the other
          Ink.stroke(x, [[SX0, SY], [SX1, SY]], { w: 3, seed: 21 });
          for (let i = 0; i <= 6; i++) { const tx = SX0 + ((SX1 - SX0) * i) / 6; pen(x, [[tx, SY - 7], [tx, SY + 7]], { w: 1.5, wob: false, a: 0.7 }); }
          Ink.stroke(x, geo.ellipse(SX0 - 34, SY, 10, 10), { w: 1.8, seed: 22, retrace: false });
          for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; pen(x, [[SX0 - 34 + Math.cos(a) * 14, SY + Math.sin(a) * 14], [SX0 - 34 + Math.cos(a) * 20, SY + Math.sin(a) * 20]], { w: 1.6, wob: false }); }
          const mc = arc(SX1 + 34, SY, 13, 13, -1.9, 1.9, 16).concat(arc(SX1 + 27, SY, 10, 12.4, 1.45, -1.45, 14));
          Ink.hatchFill(x, mc, 1, B, 2); Ink.stroke(x, close(mc), { w: 1.6, seed: 23, retrace: false });
          text(x, 'midday', SX0 - 40, SY + 44, { size: 22, align: 'left' }); text(x, 'midnight', SX1 + 50, SY + 44, { size: 22, align: 'right' });
          // bedside table
          const tt = [[372, 352], [520, 352], [520, 366], [372, 366]];
          Ink.hatchShadow(x, tt, 1, 5, 5); Ink.stroke(x, close(tt), { w: 2.4, seed: 31 });
          Ink.stroke(x, [[384, 366], [384, FLOOR]], { w: 2.2, seed: 32 }); Ink.stroke(x, [[508, 366], [508, FLOOR]], { w: 2.2, seed: 33 });
          const dr = [[384, 366], [508, 366], [508, 408], [384, 408]]; Ink.hatchFill(x, dr, 1, B, 0.5); Ink.stroke(x, close(dr), { w: 2, seed: 34 });
          Ink.stroke(x, geo.ellipse(446, 388, 6, 6), { w: 1.8, seed: 35, retrace: false });
          // the alarm clock (digits drawn live)
          const ck = geo.rect(388, 304, 108, 46, 8); Ink.stroke(x, ck, { w: 2.3, seed: 36 });
          pen(x, [[400, 350], [396, 353]], { w: 2 }); pen(x, [[484, 350], [488, 353]], { w: 2 });
          // wall socket + the night light plugged into it
          Ink.stroke(x, geo.rect(NL.x - 64, NL.by + 6, 128, 100, 6), { w: 1.6, seed: 37, retrace: false });
          const body = geo.rect(NL.x - NL.bw / 2, NL.by, NL.bw, NL.bh, 14);
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.beginPath(); body.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore();
          Ink.hatchShadow(x, body, 1, 6, 6); Ink.stroke(x, body, { w: 2.6, seed: 38 });
          const shade = arc(NL.x, NL.by, 44, 78, Math.PI, Math.PI * 2, 30);
          Ink.stroke(x, shade.concat([shade[0]]), { w: 2.6, seed: 39 });
          pen(x, arc(NL.x, NL.by, 30, 62, Math.PI * 1.08, Math.PI * 1.45, 12), { w: 1.3, a: 0.6 });
          [0, 1, 2].forEach((i) => pen(x, [[NL.x - 26, NL.by + 22 + i * 10], [NL.x + 26, NL.by + 22 + i * 10]], { w: 1.4, a: 0.7, seed: 3 + i }));
          Ink.stroke(x, geo.ellipse(NL.sx, NL.sy, 13, 13), { w: 2.2, seed: 40 });
          dot(x, NL.sx, NL.sy, 6.5, 0.85); dot(x, NL.sx - 2, NL.sy - 2, 1.8, 1, [251, 250, 245]);
          // bed: headboard, mattress, legs, pillow, duvet, teddy
          const hb = geo.rect(820, 286, 24, FLOOR - 286, 8); Ink.hatchFill(x, hb, 1, B, 1.5); Ink.stroke(x, hb, { w: 2.5, seed: 41 });
          const fb = geo.rect(556, 356, 18, FLOOR - 356, 6); Ink.hatchFill(x, fb, 1, B, 1.5); Ink.stroke(x, fb, { w: 2.4, seed: 42 });
          Ink.stroke(x, close([[574, 398], [820, 398], [820, 430], [574, 430]]), { w: 2.4, seed: 43 });
          const duvet = geo.curve([574, 398], [576, 362], [600, 356], [640, 360], 14).concat(geo.curve([640, 360], [680, 352], [714, 366], [742, 372], 14), [[744, 398]]);
          Ink.hatchFill(x, duvet, 1, B, 0.7); Ink.stroke(x, duvet, { w: 2.3, seed: 44 });
          pen(x, geo.curve([600, 372], [640, 366], [680, 376], [730, 382], 16), { w: 1.2, a: 0.5 });
          const pil = geo.rect(748, 366, 70, 30, 13); Ink.stroke(x, pil, { w: 2.2, seed: 45 });
          // teddy sitting against the headboard
          Ink.stroke(x, geo.ellipse(786, 348, 17, 19), { w: 2, seed: 46 }); Ink.stroke(x, geo.ellipse(786, 318, 14, 13), { w: 2, seed: 47 });
          Ink.stroke(x, geo.ellipse(774, 306, 5.5, 5.5), { w: 1.7, seed: 48, retrace: false }); Ink.stroke(x, geo.ellipse(798, 306, 5.5, 5.5), { w: 1.7, seed: 49, retrace: false });
          dot(x, 781, 316, 1.7); dot(x, 791, 316, 1.7); pen(x, geo.ellipse(786, 322, 4, 3), { w: 1.3, wob: false });
          pen(x, [[771, 344], [762, 356]], { w: 2 }); pen(x, [[801, 344], [810, 356]], { w: 2 });
        });
        // "it is dark" hatching for the room (not the window), plain and with a pool of lamplight rubbed out
        const dark = (lit) => S.layer(W, HH, (x) => {
          x.save(); x.beginPath(); x.rect(0, 0, W, HH); x.rect(WX, WY, WW, WH); x.clip('evenodd');
          diag(x, 6, 6, W - 6, HH - 6, 7, 0.5, 5); diag(x, 6, 6, W - 6, HH - 6, 11, 0.4, 8); x.restore();
          if (lit) { x.globalCompositeOperation = 'destination-out'; const g = x.createRadialGradient(NL.x, NL.by - 30, 30, NL.x, NL.by - 10, 250); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.55, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, HH); }
        });
        sprDark = dark(false); sprDarkLit = dark(true);
        sprSky = S.layer(WW, WH, (x) => { diag(x, 0, 0, WW, WH, 5.5, 0.6, 12); diag(x, 0, 0, WW, WH, 9, 0.45, 14); });
        sprSun = S.layer(90, 90, (x) => {
          Ink.stroke(x, geo.ellipse(45, 45, 20, 20), { w: 2.4, seed: 3 });
          for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283 + 0.2; pen(x, [[45 + Math.cos(a) * 27, 45 + Math.sin(a) * 27], [45 + Math.cos(a) * (i % 2 ? 36 : 41), 45 + Math.sin(a) * (i % 2 ? 36 : 41)]], { w: 2, wob: false }); }
        });
        sprMoon = S.layer(70, 70, (x) => {
          const m = arc(35, 35, 24, 24, -1.9, 1.9, 22).concat(arc(22, 35, 19, 22.8, 1.42, -1.42, 20));
          x.fillStyle = '#fbfaf5'; x.beginPath(); m.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill();
          Ink.stroke(x, close(m), { w: 2.3, seed: 5 });
        });
      }
      buildArt(); S.onFonts = buildArt;

      const STARS = [[84, 78], [142, 62], [250, 70], [222, 120], [100, 140], [270, 150], [176, 96]];
      const hhmm = () => { const m = Math.round((12 * 60 + u * 12 * 60) / 15) * 15, h = Math.floor(m / 60) % 24; return String(h).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

      S.render = (dt, t) => {
        const x = S.ctx; let busy = false;
        const dark = sstep(0.38, 0.62, u), covered = cover || coverBtn;
        const on = covered || dark > 0.62;
        if (on !== lampOn) { lampOn = on; Book.sfx('click', { gain: 0.5 }); note(); }
        const gT = on ? 1 : 0; if (Math.abs(gT - glow) > 0.01) { glow += (gT - glow) * Math.min(1, dt * 9); busy = true; } else glow = gT;
        const fT = covered ? 1 : 0; if (Math.abs(fT - fing) > 0.01) { fing += (fT - fing) * Math.min(1, dt * 16); busy = true; } else fing = fT;

        // lamplight (yellow highlighter) first, so the ink sits on top of it
        if (glow > 0.02) {
          const g = x.createRadialGradient(NL.x, NL.by - 34, 8, NL.x, NL.by - 24, 190);
          g.addColorStop(0, `rgba(255,222,40,${0.95 * glow})`); g.addColorStop(0.3, `rgba(255,232,90,${0.6 * glow})`); g.addColorStop(1, 'rgba(255,238,120,0)');
          x.fillStyle = g; x.fillRect(NL.x - 200, NL.by - 230, 400, 420);
        }
        // the sky in the window
        x.save(); x.beginPath(); x.rect(WX + 9, WY + 9, WW - 18, WH - 18); x.clip();
        const su = u / 0.56, sunX = WX + 62 + su * 150, sunY = WY + 52 + su * su * 176;
        if (su < 1.25) { x.fillStyle = `rgba(255,214,40,${0.85 * (1 - dark * 0.5)})`; x.beginPath(); x.arc(sunX, sunY, 20, 0, 7); x.fill(); S.blit(sprSun, sunX - 45, sunY - 45); }
        if (dark > 0.02) { x.globalAlpha = dark; S.blit(sprSky, WX, WY); x.globalAlpha = 1; }
        const mu = sstep(0.5, 1, u);
        if (u > 0.5) { const mx = WX + 60 + mu * 96, my = WY + WH - 30 - mu * 128; x.globalCompositeOperation = 'source-over'; S.blit(sprMoon, mx - 35, my - 35); x.globalCompositeOperation = 'multiply'; }
        if (dark > 0.7) STARS.forEach(([a, b], i) => { const tw = 0.6 + 0.4 * Math.sin(t * 3 + i * 1.7); x.save(); x.globalCompositeOperation = 'source-over'; x.strokeStyle = `rgba(251,250,245,${(dark - 0.7) / 0.3})`; x.lineWidth = 3.4; x.beginPath(); x.moveTo(a - 6 * tw, b); x.lineTo(a + 6 * tw, b); x.moveTo(a, b - 6 * tw); x.lineTo(a, b + 6 * tw); x.stroke(); x.restore(); });
        x.restore();
        if (dark > 0.7) busy = true; // stars twinkle
        S.blit(sprStat, 0, 0);
        // glazing bars
        pen(x, [[WX + WW / 2, WY + 9], [WX + WW / 2, WY + WH - 9]], { w: 3, seed: 5, a: 0.95 }); pen(x, [[WX + 9, WY + WH / 2], [WX + WW - 9, WY + WH / 2]], { w: 3, seed: 6, a: 0.95 });
        // the room goes dark
        if (dark > 0.02) { x.globalAlpha = dark * (1 - glow); S.blit(sprDark, 0, 0); x.globalAlpha = dark * glow; S.blit(sprDarkLit, 0, 0); x.globalAlpha = 1; }
        // lamp rays
        if (glow > 0.3) for (let i = 0; i < 9; i++) { const a = Math.PI * (1.04 + (0.92 * i) / 8), r0 = 1.16 + 0.03 * Math.sin(t * 5 + i), r1 = 1.42 + 0.06 * Math.sin(t * 4 + i * 2); pen(x, [[NL.x + Math.cos(a) * 44 * r0, NL.by + Math.sin(a) * 78 * r0], [NL.x + Math.cos(a) * 44 * r1 * 1.25, NL.by + Math.sin(a) * 78 * r1]], { w: 2.6, color: RD, wob: false, a: glow }); }
        if (glow > 0.3) busy = true;
        // slider knob
        const kx = SX0 + (SX1 - SX0) * u;
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.beginPath(); x.arc(kx, SY, 19, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(kx, SY, 19, 19), { w: 3, color: RD, seed: 9 }); dot(x, kx, SY, 6, 0.9, RD);
        if (!moved) { text(x, 'drag me!', kx + 34, SY - 22, { font: 'hand', size: 24, color: RD }); }
        // the clock
        text(x, hhmm(), 442, 338, { size: 30, align: 'center' });
        // the finger over the dot
        if (!pressed && !covered) { text(x, 'press & hold', NL.sx + 78, NL.sy + 2, { font: 'hand', size: 22, color: RD }); pen(x, [[NL.sx + 72, NL.sy - 6], [NL.sx + 22, NL.sy - 2]], { w: 2.2, color: RD }); pen(x, [[NL.sx + 34, NL.sy - 10], [NL.sx + 21, NL.sy - 2], [NL.sx + 34, NL.sy + 6]], { w: 2.2, color: RD, wob: false }); }
        if (fing > 0.02) {
          const off = (1 - fing) * 70, tx = NL.sx + 4 + off * 0.8, ty = NL.sy + 2 + off * 0.5, an = 0.55;
          x.save(); x.translate(tx, ty); x.rotate(an);
          const F = [[150, -19], [10, -19]].concat(arc(8, 0, 19, 19, -Math.PI / 2, -Math.PI * 1.5, 12).reverse().reverse(), [[10, 19], [150, 19]]);
          const tip = arc(8, 0, 19, 19, Math.PI * 1.5, Math.PI * 0.5, 12), FP = [[150, -19]].concat(tip, [[150, 19]]);
          x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.beginPath(); FP.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.globalCompositeOperation = 'multiply';
          Ink.stroke(x, FP, { w: 2.6, seed: 61 });
          pen(x, arc(10, 0, 12, 12, Math.PI * 1.35, Math.PI * 0.65, 8).concat([[26, 9], [26, -9], [3, -9]]), { w: 1.5, seed: 4, amp: 0.3 });
          pen(x, [[66, -12], [70, 0], [66, 12]], { w: 1.3, a: 0.6 }); pen(x, [[110, -12], [114, 0], [110, 12]], { w: 1.3, a: 0.6 });
          x.restore(); void F;
        }
        return busy || drag;
      };

      // what the student has discovered so far
      function note() {
        const dark = sstep(0.38, 0.62, u), covered = cover || coverBtn; let ch = false;
        if (dark > 0.62 && !done.night) { done.night = true; ch = true; }
        if (covered && dark < 0.3 && !done.cover) { done.cover = true; ch = true; }
        if (covered && dark > 0.62 && !done.coverNight) { done.coverNight = true; ch = true; }
        if (ch) commit();
      }
      function commit() {
        const sc = (done.night ? 1 : 0) + (done.cover ? 1 : 0);
        r.set({ answer: `made it night (lamp came on): ${done.night ? 'yes' : 'no'}; covered the sensor in daylight (lamp came on): ${done.cover ? 'yes' : 'no'}${done.coverNight ? '; also covered it at night' : ''}; opened ${done.boxes.length}/3 mystery boxes`,
          correct: sc === 2 ? true : null, score: sc, max: 2, night: done.night, cover: done.cover, coverNight: done.coverNight, boxes: done.boxes.slice() });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); // no changing the prediction after testing
        status();
      }

      // pointer: the slider (and the whole window) sets the time; the dot is press-and-hold
      const setU = (px) => { const nu = clamp((px - SX0) / (SX1 - SX0)); if (Math.abs(nu - u) > 0.001) { if (Math.floor(nu * 12) !== Math.floor(u * 12)) Book.sfx('tick', { gain: 0.3 }); u = nu; } };
      S.c.addEventListener('pointerdown', (e) => {
        const [px, py] = S.pos(e);
        if (Math.hypot(px - NL.sx, py - NL.sy) < 48) { cover = true; pressed = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); S.go(); return; }
        if (px < 350 && py < 372) { drag = true; moved = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} setU(px); S.go(); }
      });
      S.c.addEventListener('pointermove', (e) => { if (drag) { setU(S.pos(e)[0]); S.go(); } });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { drag = false; cover = false; S.go(); }));
      const bDown = (e) => { if (e) e.preventDefault(); coverBtn = true; pressed = true; S.go(); }, bUp = () => { coverBtn = false; S.go(); };
      btn.addEventListener('pointerdown', (e) => { try { btn.setPointerCapture(e.pointerId); } catch (er) {} bDown(e); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btn.addEventListener(ev, bUp));
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
      btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) bDown(e); });
      btn.addEventListener('keyup', bUp);

      // ------------------------------------------------------------------ open it up
      const open = ui.el('div', '');
      ui.el('h2', '', 'Open it up', open);
      const found = ui.box('', { tag: 'What you found' }); open.appendChild(found);
      const openP = ui.el('p', '', 'So what is going on inside? <b>Tap the back</b> to unscrew it, then <b>tap each mystery box</b> to find out what it does.', open);
      const lab2 = ui.el('div', '', '', open); lab2.style.cssText = 'position:relative;margin:0 0 var(--R)';
      const W2 = 860, H2 = 340, BX = [104, 338, 572], BW = 186, BY = 104, BH = 156, MY = BY + BH / 2;
      const S2 = Stage(lab2, W2, H2, 'manipulation');
      const BOXES = [
        { k: 'A', say: ['I notice how', 'light it is'], rec: 'senses light' },
        { k: 'B', say: ['I decide what', 'should happen'], rec: 'decides' },
        { k: 'C', say: ['I give out', 'the light'], rec: 'gives light' },
      ];
      let opened = done.boxes.length > 0, openT = opened ? 1 : 0, runT = 0; const flash = [0, 0, 0];
      const named = () => { const it = got('p01.check'); return !!(it && it.correct === true); };
      let sprCase;
      function buildArt2() {
        sprCase = S2.layer(W2, H2, (x) => {
          const cs = geo.rect(18, 22, W2 - 36, H2 - 44, 26); Ink.hatchShadow(x, cs, 1, 7, 7); Ink.stroke(x, cs, { w: 3, seed: 3 });
          [[46, 50], [W2 - 46, 50], [46, H2 - 50], [W2 - 46, H2 - 50]].forEach(([a, b], i) => { Ink.stroke(x, geo.ellipse(a, b, 10, 10), { w: 1.8, seed: 5 + i, retrace: false }); pen(x, [[a - 6, b - 5], [a + 6, b + 5]], { w: 2, wob: false }); });
        });
      }
      buildArt2(); S2.onFonts = buildArt2;
      const icon = (x, i, cx, cy) => {
        if (i === 0) { // an eye
          Ink.stroke(x, geo.curve([cx - 34, cy], [cx - 14, cy - 24], [cx + 14, cy - 24], [cx + 34, cy], 16), { w: 2.2, seed: 3, retrace: false });
          Ink.stroke(x, geo.curve([cx - 34, cy], [cx - 14, cy + 22], [cx + 14, cy + 22], [cx + 34, cy], 16), { w: 2.2, seed: 4, retrace: false });
          Ink.stroke(x, geo.ellipse(cx, cy, 10, 10), { w: 2, seed: 5, retrace: false }); dot(x, cx, cy, 4.5);
        } else if (i === 1) { // a chip with legs
          const c = geo.rect(cx - 26, cy - 17, 52, 34, 4); Ink.hatchFill(x, c, 1, B, 1.6); Ink.stroke(x, c, { w: 2.2, seed: 6, retrace: false });
          for (let j = 0; j < 4; j++) { pen(x, [[cx - 19 + j * 13, cy - 17], [cx - 19 + j * 13, cy - 27]], { w: 2.2, wob: false }); pen(x, [[cx - 19 + j * 13, cy + 17], [cx - 19 + j * 13, cy + 27]], { w: 2.2, wob: false }); }
        } else { // a glowing bulb
          x.save(); x.fillStyle = 'rgba(255,222,40,.8)'; x.beginPath(); x.arc(cx, cy - 4, 17, 0, 7); x.fill(); x.restore();
          Ink.stroke(x, arc(cx, cy - 4, 17, 17, Math.PI * 0.7, Math.PI * 2.3, 20).concat([[cx + 8, cy + 20], [cx - 8, cy + 20], [cx - 11, cy + 9]]), { w: 2.2, seed: 7, retrace: false });
          for (let j = 0; j < 5; j++) { const a = Math.PI * (1.1 + 0.2 * j); pen(x, [[cx + Math.cos(a) * 24, cy - 4 + Math.sin(a) * 24], [cx + Math.cos(a) * 33, cy - 4 + Math.sin(a) * 33]], { w: 2, color: RD, wob: false }); }
        }
      };
      S2.render = (dt, t) => {
        const x = S2.ctx; let busy = false;
        S2.blit(sprCase, 0, 0);
        if (!opened) {
          diag(x, 30, 34, W2 - 30, H2 - 34, 13, 0.22, 7);
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(251,250,245,.92)'; x.fillRect(240, 128, 380, 86); x.restore();
          Ink.drawBubble(x, 'tap to open', W2 / 2, 186, 44, RD, 1, -0.02, 'center');
          return false;
        }
        if (openT < 1) { openT = Math.min(1, openT + dt / 0.9); busy = true; }
        const p = openT;
        // the dot on the front (left) and the lamp (right), wired to the boxes
        Ink.stroke(x, geo.ellipse(58, MY, 13, 13), { w: 2.2, seed: 40, p }); if (p > 0.3) dot(x, 58, MY, 6.5, 0.85);
        const WIRES = [[[72, MY], [BX[0], MY]], [[BX[0] + BW, MY], [BX[1], MY]], [[BX[1] + BW, MY], [BX[2], MY]], [[BX[2] + BW, MY], [788, MY]]];
        WIRES.forEach((wr, i) => { Ink.stroke(x, wr, { w: 2.6, seed: 11 + i, p }); if (p >= 1) Ink.stroke(x, geo.head(geo.seg(wr, 4), 13, 0.5), { w: 2.6, seed: 21 + i, retrace: false }); });
        if (p > 0.6) { const lit = runT > 0 && done.boxes.length === 3; if (lit) { x.fillStyle = 'rgba(255,222,40,.85)'; x.beginPath(); x.arc(812, MY - 4, 16, 0, 7); x.fill(); }
          Ink.stroke(x, arc(812, MY - 4, 16, 16, Math.PI * 0.7, Math.PI * 2.3, 18).concat([[819, MY + 20], [805, MY + 20], [802, MY + 9]]), { w: 2.2, seed: 31, retrace: false }); }
        BOXES.forEach((b, i) => {
          const R = geo.rect(BX[i], BY, BW, BH, 12), seen = done.boxes.includes(b.k);
          if (p >= 1) Ink.hatchShadow(x, R, 1, 6, 6);
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.beginPath(); R.forEach(([a, c], j) => (j ? x.lineTo(a, c) : x.moveTo(a, c))); x.fill(); x.restore();
          Ink.stroke(x, R, { w: 2.8, seed: 51 + i, p, color: flash[i] > 0 ? RD : B });
          if (flash[i] > 0) { flash[i] = Math.max(0, flash[i] - dt); busy = true; }
          if (p < 1) return;
          if (!seen) { const wob = Math.sin(t * 3 + i * 2) * 0.06; Ink.drawBubble(x, '?', BX[i] + BW / 2, MY + 26, 76, B, 1, wob, 'center'); text(x, 'tap', BX[i] + BW / 2, BY + BH - 12, { font: 'hand', size: 22, align: 'center', color: RD }); busy = true; }
          else { icon(x, i, BX[i] + BW / 2, BY + 44); b.say.forEach((s, j) => text(x, s, BX[i] + BW / 2, BY + 106 + j * 30, { font: 'hand', size: 22, align: 'center' })); }
          if (named()) Ink.drawBubble(x, ['INPUT', 'PROCESS', 'OUTPUT'][i], BX[i] + BW / 2, BY - 16, 30, RD, 1, -0.02, 'center');
        });
        // a signal runs along the wires once a box has been opened
        if (runT > 0 && p >= 1) {
          runT = Math.max(0, runT - dt); busy = true;
          const last = Math.max(...BOXES.map((b, i) => (done.boxes.includes(b.k) ? i : -1)));
          for (let i = 0; i <= Math.min(3, last + 1); i++) { if (i > 0 && !done.boxes.includes(BOXES[i - 1].k)) break; const wr = WIRES[i], q = (t * 1.3 + i * 0.25) % 1; dot(x, wr[0][0] + (wr[1][0] - wr[0][0]) * q, MY, 7, 0.95, RD); }
        }
        return busy;
      };
      S2.c.addEventListener('click', (e) => {
        const [px, py] = S2.pos(e);
        if (!opened) { opened = true; Book.sfx('paper', { gain: 0.5 }); Book.scribble(0.6); S2.go(); return; }
        if (openT < 1) return;
        const i = BX.findIndex((bx) => px > bx - 12 && px < bx + BW + 12 && py > BY - 20 && py < BY + BH + 20);
        if (i < 0) return;
        flash[i] = 0.5; runT = 14; Book.sfx('pop', { gain: 0.5 });
        if (!done.boxes.includes(BOXES[i].k)) { done.boxes.push(BOXES[i].k); commit(); }
        S2.go();
      });

      // ------------------------------------------------------------------ after the experiment
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      add(ui.el('h2', '', 'Three boxes, three jobs'));
      add(ui.box('Every electronic product can be split into three boxes like these. Designers give them names, in this order:<br><span class="key" style="font-size:24px">INPUT → PROCESS → OUTPUT</span><br><span class="small">You will use these three words all lesson.</span>', { tag: 'The big idea' }));
      const check = add(ui.mcq({ id: 'p01.check', label: 'Which block is the "brain" of the night light?', q: 'Look at what each box told you. Which one is the night light\'s <b>"brain"</b>?',
        options: [
          { t: 'The INPUT: it notices the change in the room', mis: 'process-role', why: 'Noticing is not deciding. The first box only reports how light it is: another box works out what to do about it.' },
          { t: 'The PROCESS: it decides what should happen', ok: true },
          { t: 'The OUTPUT: it does the job that you can see', mis: 'process-role', why: 'The last box only does what it is told: it gives out light when a signal arrives. Which box sends that signal?' },
          { t: 'The OUTPUT: it senses when the room is dark', mis: 'input-vs-output', why: 'Sensing happens at the start, not the end. The last box gives out light. Which box makes the decision in between?' },
        ],
        explain: 'The process block is the brain: it takes the signal from the input, decides what to do, and tells the output.' }));
      check.addEventListener('click', () => setTimeout(() => S2.go(), 60));
      add(ui.rate({ id: 'p01.conf', label: 'Confidence: input, process, output', q: 'How confident are you that you could spot the input, process and output in another product?' }));

      function status() {
        const both = done.night && done.cover, all = done.boxes.length === 3;
        stat.innerHTML = `<b>${done.night ? '☑' : '☐'}</b> turn day into night &nbsp; <b>${done.cover ? '☑' : '☐'}</b> cover the dot in the <b>daytime</b>` + (both ? '' : '<br>Do both to carry on.');
        open.style.display = both ? '' : 'none'; rest.style.display = both && all ? '' : 'none';
        if (!both) return;
        const p = (got('p01.predict') || {}).answer, ok = p === RIGHT;
        found.innerHTML = '<span class="tag">What you found</span>At midday the lamp stayed <b>off</b>; when night fell it came <b>on</b>. But when you covered the dot <b>in the daytime</b> it came on too, even though the clock showed daytime, nobody got into bed and nobody else touched it. The night light reacts to <b>how much light reaches the dot</b>.'
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ not this time'}</b>.` : '');
        requestAnimationFrame(() => Ink.frame(found));
        openP.style.display = all ? 'none' : '';
        S2.go();
      }
      function unlockLab() {
        const on = !!got('p01.predict');
        lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none'; btn.disabled = !on;
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (r.get()) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      }
      unlockLab(); status(); S.go(); S2.go();
    },
  });
})();
