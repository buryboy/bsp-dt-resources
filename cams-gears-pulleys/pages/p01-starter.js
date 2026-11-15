// Page 1 — Starter: the hill climb. Predict which rear sprocket makes a steep hill easiest, then pedal a pen-drawn
// bike up the hill (and along the flat) with each sprocket: effort meter, wheel speed, made it or stalled.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const frac = (v) => v - Math.floor(v);
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const close = (P) => P.concat([P[0]]);

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  // a light pen line (cheap, no retrace)
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round';
    if (o.dash) x.setLineDash(o.dash);
    x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  function dot(x, px, py, r, color = B, a = 0.9) { x.fillStyle = rgba(color, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); c.className = 'cg-stage'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
    S.rot = (L, cx, cy, ang, ox = L.w / 2, oy = L.h / 2) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.drawImage(L, -ox, -oy, L.w, L.h); ctx.restore(); };
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
    // drag inside a hit zone: that touch no longer scrolls the page; everywhere else a vertical swipe still scrolls
    S.drag = (hit, on) => {
      let id = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); if (id !== null || !hit(p)) return; id = e.pointerId; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; on.move && on.move(S.pos(e)); S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; on.end && on.end(); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false;
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }
  if (!document.getElementById('cg-css')) {
    const s = document.createElement('style'); s.id = 'cg-css';
    s.textContent = `
      .cg-lab { position: relative; margin: 0 0 calc(var(--R) * 1.2); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .cg-lab > * { position: relative; }
      .cg-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 24px; margin-top: 4px; }
      .cg-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .cg-task b { font-family: Fredoka, system-ui; font-weight: 600; }
      .cg-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 6px 0 8px; }
      .cg-row .opt { flex: 1 1 120px; text-align: center; min-height: 52px; }
      .cg-row .btn { margin-top: 0; min-height: 52px; }
      .cg-row .opt.tiny { flex: 0 0 auto; min-width: 84px; font: 600 17px Fredoka, system-ui; }
      .cg-locked { opacity: .35; pointer-events: none; }
      .cg-msg { font-size: 17px; line-height: 1.45; margin: 4px 0; }
      .cg-hide { display: none !important; }
    `;
    document.head.appendChild(s);
  }


  // ---------- the bike (drawn in its own coordinates: rear wheel touches the ground at (0,0), y up is negative) ----------
  const WR = 100, AX = [0, -WR], FAX = [285, -WR], BB = [128, -92], RC = 54, CRANK = 58, PPT = 1.5; // px per tooth
  const HIP = [98, -262], THIGH = 122, SHIN = 120;
  const GEARS = [{ name: 'small', teeth: 12 }, { name: 'middle', teeth: 20 }, { name: 'big', teeth: 32 }];
  const FRONT = 36;
  const NEED = { hill: [180, 108, 68], flat: [36, 22, 14] };   // % of the rider's strongest push needed at the pedals
  const KMH = [24, 14, 9];                                      // wheel speed at the same pedalling rate (60 turns a minute)

  function sprocket(S, teeth, r, o = {}) {
    const half = r + 12;
    return S.layer(half * 2, half * 2, (x) => {
      x.translate(half, half);
      const P = []; for (let i = 0; i < teeth; i++) { const a0 = (TAU * i) / teeth, d = TAU / teeth; [[0.12, r - 4], [0.38, r + 4], [0.62, r + 4], [0.88, r - 4]].forEach(([f, rr]) => P.push([rr * Math.cos(a0 + f * d), rr * Math.sin(a0 + f * d)])); }
      if (o.hatch) Ink.hatchFill(x, P, 1, B, o.hatch);
      Ink.stroke(x, close(P), { w: 2, seed: 5 + teeth, amp: 0.25, retrace: false });
      if (o.arms) { for (let i = 0; i < 5; i++) { const an = (TAU * i) / 5 + 0.3; pen(x, [[9 * Math.cos(an - 0.5), 9 * Math.sin(an - 0.5)], [(r - 9) * Math.cos(an), (r - 9) * Math.sin(an)], [9 * Math.cos(an + 0.5), 9 * Math.sin(an + 0.5)]], { w: 1.8, wob: false }); }
        x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(0, 0, r - 12, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(0, 0, r - 11, r - 11), { w: 1.8, seed: 8, amp: 0.25, retrace: false });
        for (let i = 0; i < 5; i++) { const an = (TAU * i) / 5 + 0.3; pen(x, [[8 * Math.cos(an), 8 * Math.sin(an)], [(r - 12) * Math.cos(an), (r - 12) * Math.sin(an)]], { w: 3, wob: false }); } }
      Ink.stroke(x, geo.ellipse(0, 0, o.hub || 7, o.hub || 7), { w: 2, seed: 9, amp: 0.2, retrace: false });
    });
  }
  function wheelSprite(S) {
    const half = WR + 10;
    return S.layer(half * 2, half * 2, (x) => {
      x.translate(half, half);
      Ink.stroke(x, geo.ellipse(0, 0, WR, WR), { w: 3.2, seed: 3, amp: 0.5 });
      Ink.stroke(x, geo.ellipse(0, 0, WR - 9, WR - 9), { w: 1.6, seed: 4, amp: 0.4, retrace: false });
      for (let i = 0; i < 14; i++) { const an = (TAU * i) / 14; pen(x, [[8 * Math.cos(an + 0.5), 8 * Math.sin(an + 0.5)], [(WR - 9) * Math.cos(an), (WR - 9) * Math.sin(an)]], { w: 1, wob: false, a: 0.55 }); }
      // tyre valve + a reflector so the turning is easy to see
      const rf = [[-6, -70], [6, -70], [6, -52], [-6, -52]]; Ink.hatchFill(x, rf, 1, RD, 2.4); pen(x, close(rf), { w: 1.6, color: RD, wob: false });
      for (let i = 0; i < 22; i++) { const an = (TAU * i) / 22; pen(x, [[(WR - 2) * Math.cos(an), (WR - 2) * Math.sin(an)], [(WR + 4) * Math.cos(an + 0.05), (WR + 4) * Math.sin(an + 0.05)]], { w: 1.6, wob: false, a: 0.6 }); }
    });
  }
  // frame + rider's body (no legs, no wheels): painted with origin at (ox, oy)
  function paintBike(x) {
    const seat = [100, -226], head = [240, -236], headLo = [247, -204];
    const tube = (p, q, sd) => Ink.stroke(x, [p, q], { w: 3.2, seed: sd, amp: 0.4 });
    tube(BB, seat, 11); tube(seat, head, 12); tube(BB, headLo, 13); tube(AX, BB, 14); tube(AX, seat, 15); tube(head, headLo, 16);
    Ink.stroke(x, [headLo, [262, -160], FAX], { w: 3, seed: 17, amp: 0.4 });
    Ink.stroke(x, [seat, [96, -246]], { w: 2.6, seed: 18, amp: 0.2 });
    const sad = [[72, -250], [122, -252], [128, -246], [100, -241], [74, -243]]; Ink.hatchFill(x, sad, 1, B, 2.4); Ink.stroke(x, close(sad), { w: 2.2, seed: 19, amp: 0.3 });
    Ink.stroke(x, [head, [236, -262], [256, -268]], { w: 2.8, seed: 20, amp: 0.3 });
    Ink.stroke(x, geo.curve([256, -268], [272, -270], [274, -252], [260, -250], 10), { w: 2.6, seed: 21, amp: 0.3 });
    // rider: torso, arm, head with helmet
    const sh = [186, -352], torso = [[84, -268], [112, -250], [198, -338], [176, -366]];
    Ink.hatchFill(x, torso, 1, B, 0.9); Ink.stroke(x, close(torso), { w: 2.4, seed: 22, amp: 0.5 });
    Ink.stroke(x, [sh, [222, -300], [254, -270]], { w: 2.6, seed: 23, amp: 0.4 }); Ink.stroke(x, [[178, -340], [212, -292], [252, -262]], { w: 2, seed: 24, amp: 0.4, retrace: false });
    Ink.stroke(x, geo.ellipse(256, -266, 7, 6), { w: 1.8, seed: 25, amp: 0.2, retrace: false });
    Ink.stroke(x, geo.ellipse(212, -386, 21, 23), { w: 2.4, seed: 26, amp: 0.4 });
    const hel = geo.ellipse(210, -392, 25, 20, Math.PI * 0.98, Math.PI * 2.05).concat([[190, -388]]); Ink.hatchFill(x, hel, 1, RD, 1.8); Ink.stroke(x, close(hel), { w: 2.2, color: RD, seed: 27, amp: 0.3 });
    dot(x, 222, -386, 2.4); pen(x, geo.curve([218, -374], [222, -371], [226, -372], [229, -376], 8), { w: 1.8 });
    pen(x, [[196, -366], [206, -362]], { w: 1.6 });
  }
  function leg(x, ang, far) { // crank angle (clockwise on screen); far = the leg behind the frame
    const px = BB[0] + CRANK * Math.cos(ang), py = BB[1] + CRANK * Math.sin(ang);
    const dx = px - HIP[0], dy = py - 8 - HIP[1], d = Math.min(THIGH + SHIN - 1, Math.hypot(dx, dy)), base = Math.atan2(dy, dx), k = Math.acos(clamp((THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d), -1, 1));
    const kn = [HIP[0] + THIGH * Math.cos(base - k), HIP[1] + THIGH * Math.sin(base - k)], al = far ? 0.45 : 1;
    x.save(); x.globalAlpha = al;
    Ink.stroke(x, [BB, [px, py]], { w: 3.4, seed: 41, amp: 0.2 });
    Ink.stroke(x, [[px - 16, py], [px + 16, py]], { w: 3.6, seed: 42, amp: 0.2, retrace: false });
    Ink.stroke(x, [HIP, kn, [px - 4, py - 10]], { w: far ? 2.2 : 3, seed: 43, amp: 0.4 });
    if (!far) Ink.stroke(x, [[HIP[0] + 14, HIP[1] + 14], [kn[0] + 4, kn[1] + 14], [px + 6, py - 8]], { w: 2, seed: 44, amp: 0.4, retrace: false });
    Ink.stroke(x, [[px - 12, py - 10], [px + 20, py - 9], [px + 22, py - 3], [px - 12, py - 3]], { w: 2.2, seed: 45, amp: 0.2, retrace: false });
    x.restore();
  }

  Book.page({
    id: 'p01',
    title: 'Starter: the hill climb',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      ui.h('The hill climb');
      ui.p('You are at the bottom of a <b>very steep hill</b>. Your legs turn the big toothed wheel at the front (the <b>chainring</b>). The <b>chain</b> pulls round a smaller toothed wheel on the back wheel: a <span class="key">sprocket</span>. Your bike has <b>three</b> rear sprockets to choose from.');
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: which rear sprocket makes the hill easiest', q: '<b>Predict:</b> which rear sprocket will make the hill <b>easiest</b> to climb?',
        options: ['The smallest sprocket', 'The middle sprocket', 'The biggest sprocket', 'It makes no difference'], onPick: () => unlock() });

      ui.el('h2', '', 'Now test it');
      const how = ui.p('Pick a rear sprocket, then <b>press and hold PEDAL</b>. You pedal at the same rate every time, and your legs have a <b>maximum push</b>. Can you reach the top?');
      const tabs = ui.el('div', 'cg-row');
      const tabB = [['hill', '⛰ Steep hill'], ['flat', '➡ Flat road']].map(([m, t]) => { const b = ui.el('button', 'opt', t, tabs); b.type = 'button'; b.style.font = '600 19px Fredoka, system-ui'; b.onclick = () => setMode(m); return b; });
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 6px;transition:opacity .3s';
      const W = 860, HH = 600, GX = 138, GY = 545, TILT = 0.21, SCW = 610;
      const S = Stage(lab, W, HH);
      const r = ui.record('p01.try', { label: 'Hill climb experiment: sprockets tried on the hill and on the flat', type: 'experiment', max: 1 });
      const prev = r.get() || {};
      const tried = prev.tried || { hill: {}, flat: {} };
      let mode = 'hill', g = 1, crank = 0.9, wheel = 0, scroll = 0, tiltNow = TILT, prog = 0, back = 0, msg = null;
      const run = { down: false, active: false, force: 0, cad: 0, res: null, tRes: 0, t0: 0, stallT: 0 };

      const gearRow = ui.el('div', 'cg-row');
      const gearB = GEARS.map((G, k) => { const b = ui.el('button', 'opt', `<b style="font-family:Fredoka">${G.name[0].toUpperCase() + G.name.slice(1)}</b><br><span class="small">${G.teeth} teeth</span>`, gearRow); b.type = 'button'; b.onclick = () => { if (run.active) return; g = k; msg = null; prog = 0; Book.sfx('tick', { gain: 0.5 }); sync(); S.go(); }; return b; });
      const btn = ui.el('button', 'btn', '🚲 PEDAL (hold)', gearRow);
      btn.style.cssText = 'min-width:190px;min-height:60px;font-size:22px;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none';
      const stat = ui.el('div', 'cg-msg', ''); stat.style.marginBottom = 'var(--R)';
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the bike unlocks.'); lockMsg.style.marginTop = '-6px';

      let wheelL, frameL, ringL, sprL, statL = {};
      function art() {
        wheelL = wheelSprite(S); ringL = sprocket(S, FRONT, RC, { arms: true, hub: 9 }); sprL = GEARS.map((G) => sprocket(S, G.teeth, G.teeth * PPT, { hatch: 1.6, hub: 6 }));
        frameL = S.layer(330, 430, (x) => { x.translate(20, 420); paintBike(x); });
        ['hill', 'flat'].forEach((m) => { statL[m] = S.layer(W, HH, (x) => {
          // right-hand panel: the route, the effort meter, the speedo
          const mp = geo.rect(SCW + 14, 14, 222, 128, 10); Ink.hatchShadow(x, mp, 1, 6, 6); Ink.stroke(x, mp, { w: 2.2, seed: 51 });
          if (m === 'hill') { const hl = [[SCW + 30, 122], [SCW + 62, 122], [SCW + 186, 52], [SCW + 222, 52]]; Ink.stroke(x, hl, { w: 2.4, seed: 52, amp: 0.6 }); Ink.hatchFill(x, [[SCW + 62, 122], [SCW + 186, 52], [SCW + 222, 52], [SCW + 222, 122]], 1, B, 0.8); }
          else Ink.stroke(x, [[SCW + 30, 110], [SCW + 222, 110]], { w: 2.4, seed: 53, amp: 0.6 });
          const fx = SCW + 206, fy = m === 'hill' ? 52 : 110; pen(x, [[fx, fy], [fx, fy - 30]], { w: 2, color: RD }); const fl = [[fx, fy - 30], [fx + 18, fy - 24], [fx, fy - 17]]; Ink.hatchFill(x, fl, 1, RD, 2.6); pen(x, close(fl), { w: 1.6, color: RD, wob: false });
          // effort meter (0 to 200% of your strongest push)
          text(x, 'effort', SCW + 60, 176, { size: 22, align: 'center' });
          const bar = geo.rect(MX, MY0, 44, MY1 - MY0, 6); Ink.hatchShadow(x, bar, 1, 5, 5); Ink.stroke(x, bar, { w: 2.4, seed: 54 });
          for (let n = 25; n < 200; n += 25) { const yy = MY1 - (n / 200) * (MY1 - MY0); pen(x, [[MX, yy], [MX + (n % 50 ? 8 : 14), yy]], { w: 1.3, wob: false }); }
          const ym = MY1 - 0.5 * (MY1 - MY0); Ink.stroke(x, [[MX - 8, ym], [MX + 54, ym]], { w: 2.4, color: GR, seed: 55, retrace: false });
          text(x, 'your', MX + 58, ym - 3, { size: 22, color: GR }); text(x, 'max', MX + 58, ym + 21, { size: 22, color: GR });
          // speedo
          text(x, 'wheel speed', SCW + 176, 176, { size: 22, align: 'center' });
          const sb = geo.rect(SCW + 122, 196, 112, 90, 10); Ink.stroke(x, sb, { w: 2.2, seed: 56 });
          text(x, 'km/h', SCW + 178, 276, { size: 22, align: 'center', a: 0.8 });
          text(x, 'rear', SCW + 178, 468, { size: 22, align: 'center', a: 0.8 }); text(x, 'sprocket:', SCW + 178, 494, { size: 22, align: 'center', a: 0.8 });
        }); });
      }
      const MX = SCW + 38, MY0 = 196, MY1 = 580;
      art(); S.onFonts = art;

      S.render = (dt, t) => {
        const x = S.ctx; let busy = false;
        const need = NEED[mode][g], can = need <= 100, rs = GEARS[g].teeth * PPT, ratio = FRONT / GEARS[g].teeth;
        const tgt = mode === 'hill' ? TILT : 0; if (Math.abs(tgt - tiltNow) > 0.002) { tiltNow += (tgt - tiltNow) * Math.min(1, dt * 7); busy = true; } else tiltNow = tgt;
        if (run.active) {
          busy = true;
          if (!run.res) {
            run.force = Math.min(Math.min(need, 100), run.force + dt * 150);
            if (can) { if (run.force >= need) run.cad = Math.min(1, run.cad + dt / 0.6); prog += (run.cad * dt) / (mode === 'hill' ? 3.6 : 3.0); if (prog >= 1) finish(true, t); }
            else if (run.force >= 100) { run.stallT += dt; run.cad = Math.max(0, 0.16 - run.stallT * 0.2); if (run.stallT > 1.1) finish(false, t); }
          } else {
            const hold = t - run.tRes < (run.res === 'ok' ? 1.4 : 1.0);
            if (run.res === 'ok') { if (!hold) run.cad = Math.max(0, run.cad - dt / 0.8); } else { run.cad = 0; back = Math.min(1, back + dt / 0.9); }
            if (!hold) run.force = Math.max(0, run.force - dt * 220);
            if (!hold && run.force <= 0 && run.cad <= 0) { run.active = false; }
          }
        } else if (back > 0) { back = Math.max(0, back - dt / 0.5); busy = true; }
        const dCr = run.cad * TAU * dt; crank += dCr; wheel += dCr * ratio; scroll += dCr * ratio * WR;
        const roll = -Math.sin(back * Math.PI) * 46; // rolling back after a stall
        const jig = run.active && !run.res && !can && run.force >= 100 ? Math.sin(t * 40) * 1.5 : 0;

        S.blit(statL[mode], 0, 0);
        // ---- the scene (clipped to the left part)
        x.save(); x.beginPath(); x.rect(0, 0, SCW, HH); x.clip();
        x.translate(GX + 140, GY); x.rotate(-tiltNow); x.translate(-140, 0);
        // ground + things rolling past
        Ink.stroke(x, [[-320, 0], [620, 0]], { w: 2.8, seed: 61, amp: 0.8 });
        const off = (scroll + roll + 9000) % 130;
        for (let gx = -390 - off + 130; gx < 640; gx += 130) { pen(x, [[gx, 6], [gx - 10, 18]], { w: 1.4, wob: false, a: 0.55 }); pen(x, [[gx + 40, 6], [gx + 30, 18]], { w: 1.4, wob: false, a: 0.55 }); pen(x, [[gx + 70, 0], [gx + 74, -10], [gx + 78, 0], [gx + 83, -13], [gx + 87, 0]], { w: 1.5, wob: false, a: 0.7 }); }
        x.translate(roll + jig, 0);
        const wa = wheel + roll / WR;
        S.rot(wheelL, AX[0], AX[1], wa); S.rot(wheelL, FAX[0], FAX[1], wa + 0.7);
        leg(x, crank + Math.PI, true);
        S.blit(frameL, -20, -420);
        S.rot(sprL[g], AX[0], AX[1], wa); S.rot(ringL, BB[0], BB[1], crank);
        // the chain: two straight runs, with link pins that travel as it moves
        const Dc = Math.hypot(BB[0] - AX[0], BB[1] - AX[1]), ph = Math.atan2(BB[1] - AX[1], BB[0] - AX[0]), be = Math.asin((RC - rs) / Dc), trav = crank * RC;
        [-1, 1].forEach((sg) => { const an = ph + sg * (Math.PI / 2 + be), n = [Math.cos(an), Math.sin(an)], p = [AX[0] + (rs + 5) * n[0], AX[1] + (rs + 5) * n[1]], q = [BB[0] + (RC + 5) * n[0], BB[1] + (RC + 5) * n[1]], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
          pen(x, [p, q], { w: 4.6, wob: false, a: 0.5 }); pen(x, [p, q], { w: 1.4, wob: false, a: 0.9 });
          const o2 = ((sg < 0 ? trav : -trav) % 13 + 13) % 13; for (let s = o2; s < L; s += 13) dot(x, p[0] + ((q[0] - p[0]) * s) / L, p[1] + ((q[1] - p[1]) * s) / L, 2.6, B, 0.95); });
        leg(x, crank, false);
        x.restore();
        // labels for the drive (shown while the bike is still)
        if (!run.active && !msg) { text(x, tried.hill[g] || tried.flat[g] ? 'try another…' : 'ready?', 40, 56, { font: 'hand', size: 26, a: 0.6 }); }
        // ---- route map: where you are
        const mx = SCW + 46 + clamp(prog) * 150 + (mode === 'hill' ? 0 : 0), my = mode === 'hill' ? 122 - clamp((clamp(prog) * 150 - 16) / 124) * 70 : 110;
        dot(x, mx, my - 9, 8, RD, 0.9); pen(x, [[mx, my - 9], [mx, my]], { w: 2, color: RD, wob: false });
        // ---- effort meter
        const col = run.force >= 100 && !can ? RD : GR, fh = (run.force / 200) * (MY1 - MY0);
        if (run.force > 1) Ink.hatchFill(x, [[MX + 4, MY1 - fh], [MX + 40, MY1 - fh], [MX + 40, MY1 - 3], [MX + 4, MY1 - 3]], 1, col, 2.4);
        const shown = msg && msg.g === g && msg.mode === mode ? msg : null;
        if (shown) { const yn = MY1 - (shown.need / 200) * (MY1 - MY0), c2 = shown.ok ? GR : RD; const tri = [[MX - 20, yn - 9], [MX - 2, yn], [MX - 20, yn + 9]]; Ink.hatchFill(x, tri, 1, c2, 2.6); pen(x, close(tri), { w: 1.8, color: c2, wob: false });
          text(x, 'needs', SCW + 178, 314, { size: 22, align: 'center', color: c2 }); text(x, shown.need + '%', SCW + 178, 348, { size: 32, align: 'center', color: c2 }); }
        // ---- speedo + sprocket name
        const v = Math.round(KMH[g] * run.cad);
        text(x, String(shown && shown.ok && !run.active ? shown.v : v), SCW + 178, 248, { size: 44, align: 'center' });
        text(x, GEARS[g].name, SCW + 178, 530, { size: 26, align: 'center' }); text(x, GEARS[g].teeth + ' teeth', SCW + 178, 558, { size: 22, align: 'center' });
        // ---- what happened
        if (shown) {
          if (shown.ok) { Ink.drawBubble(x, mode === 'hill' ? 'MADE IT!' : shown.v + ' km/h!', 300, 52, 44, GR, 1, -0.03, 'center'); text(x, mode === 'hill' ? 'slow and steady: ' + shown.v + ' km/h' : 'easy pedalling: only ' + shown.need + '% effort', 300, 90, { font: 'hand', size: 22, align: 'center', color: GR }); }
          else { Ink.drawBubble(x, 'STALLED!', 300, 52, 44, RD, 1, -0.03, 'center'); text(x, 'you cannot push hard enough', 300, 90, { font: 'hand', size: 22, align: 'center', color: RD }); }
        }
        return busy;
      };

      function finish(ok, t) {
        run.res = ok ? 'ok' : 'stall'; run.tRes = t; back = 0;
        msg = { ok, g, mode, need: NEED[mode][g], v: ok ? KMH[g] : 0 };
        tried[mode][g] = { ok, need: msg.need, v: msg.v };
        Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
        const say = (m) => GEARS.map((G, k) => (tried[m][k] ? `${G.name} (${G.teeth}T): ${tried[m][k].ok ? (m === 'hill' ? 'made it, ' : '') + tried[m][k].v + ' km/h at ' + tried[m][k].need + '% effort' : 'stalled (needs ' + tried[m][k].need + '%)'}` : null)).filter(Boolean).join('; ') || 'not tried';
        const made = Object.values(tried.hill).some((q) => q.ok);
        r.set({ answer: `Hill: ${say('hill')}. Flat: ${say('flat')}.`, correct: made ? true : null, score: made ? 1 : 0, max: 1, tried });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        sync();
      }
      function startRun(e) {
        if (e) e.preventDefault();
        run.down = true; if (run.active || btn.disabled) return;
        Object.assign(run, { active: true, force: 0, cad: 0, res: null, stallT: 0 }); msg = null; prog = 0; back = 0;
        Book.sfx('swish', { gain: 0.2 }); S.go();
      }
      btn.addEventListener('pointerdown', (e) => { try { btn.setPointerCapture(e.pointerId); } catch (er) {} startRun(e); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btn.addEventListener(ev, () => { run.down = false; }));
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
      btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) startRun(e); });
      function setMode(m) { if (run.active || (m === 'flat' && !flatOpen())) return; mode = m; msg = null; prog = 0; Book.sfx('paper', { gain: 0.3 }); sync(); S.go(); }
      const flatOpen = () => Object.values(tried.hill).some((q) => q.ok);

      // ------------------------------------------------------------------ after the experiment
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      add(ui.el('h2', '', 'What did you find?'));
      const found = add(ui.box('', { tag: 'Result' }));
      const check = add(ui.mcq({ id: 'p01.check', label: 'Why the big sprocket makes the hill possible', q: 'Why does the <b>biggest</b> rear sprocket get you up the hill when the others cannot?',
        options: [
          { t: 'The back wheel turns more slowly, but every push on the pedals gives it more turning force', ok: true },
          { t: 'The back wheel turns faster, so the bike builds up enough speed to carry it over the top', mis: 'big-is-fast', why: 'Check the wheel speed you saw: the biggest sprocket gave the SLOWEST wheel. So what did it give you instead?' },
          { t: 'The back wheel turns faster and with more turning force, so the big sprocket wins both ways', mis: 'speed-torque', why: 'If one sprocket won both ways, nobody would ever change gear. Compare its wheel speed with the others.' },
          { t: 'The biggest sprocket is the heaviest one, and that extra weight helps to push the bike uphill', why: 'Extra weight would make a hill harder, not easier. Think about how fast the wheel turned and how hard you had to push.' },
        ],
        explain: 'The big sprocket trades speed for turning force: a slow wheel that is very hard to stop.' }));
      const notes = add(ui.box('Turning force has a name: <span class="key">torque</span>.<br><b>Big rear sprocket</b>: the wheel turns <b>slower</b>, but with <b>more torque</b>. That is how you beat a hill.<br><b>Small rear sprocket</b>: the wheel turns <b>faster</b>, but with <b>less torque</b>. Great on the flat.<br><span class="small">You never get both at once. More speed always means less torque: there is no something for nothing!</span>', { tag: 'Notes' }));
      add(ui.rate({ id: 'p01.conf', label: 'Confidence: speed against turning force on a bike', q: 'How confident are you that you could explain this to a friend?' }));
      const answered = () => { const it = got('p01.check'); return !!(it && it.correct === true); };
      if (!answered()) { notes.classList.add('peek-lock'); check.addEventListener('click', () => setTimeout(() => { if (answered()) notes.classList.remove('peek-lock'); }, 50)); }

      function sync() {
        tabB.forEach((b, k) => { const m = k ? 'flat' : 'hill'; b.classList.toggle('sel', m === mode); if (k) { b.disabled = !flatOpen(); b.textContent = flatOpen() ? '➡ Flat road' : '🔒 Flat road (climb the hill first)'; } });
        gearB.forEach((b, k) => { b.classList.toggle('sel', k === g); b.classList.toggle('right', !!(tried[mode][k] && tried[mode][k].ok)); b.classList.toggle('wrong', !!(tried[mode][k] && !tried[mode][k].ok)); b.style.textDecoration = 'none'; });
        const nH = Object.keys(tried.hill).length, nF = Object.keys(tried.flat).length, made = flatOpen(), done = made && nH >= 2 && nF >= 2;
        const chip = (m) => GEARS.map((G, k) => (tried[m][k] ? `${G.name}: <b class="${tried[m][k].ok ? 'green' : 'red'}">${tried[m][k].ok ? tried[m][k].v + ' km/h' : 'stalled'}</b>` : `${G.name}: <span style="opacity:.5">?</span>`)).join(' · ');
        stat.innerHTML = `<b style="font-family:Fredoka">Hill</b> → ${chip('hill')}<br><b style="font-family:Fredoka">Flat</b> → ${chip('flat')}` + (done ? '' : `<br><span class="small red">${!made ? 'Find a sprocket that gets you to the top of the hill.' : nH < 2 ? 'Try at least one more sprocket on the hill.' : 'Now tap <b>Flat road</b> and test at least two sprockets for top speed.'}</span>`);
        rest.style.display = done ? '' : 'none';
        if (!done) return;
        const p = (got('p01.predict') || {}).answer, okP = p === 'The biggest sprocket';
        const stalls = GEARS.filter((G, k) => tried.hill[k] && !tried.hill[k].ok).map((G, k2) => G.name), fl = Object.keys(tried.flat).map(Number).sort((a2, b2) => tried.flat[b2].v - tried.flat[a2].v);
        found.innerHTML = '<span class="tag">Result</span>On the <b>hill</b>, the <b>biggest</b> sprocket got you to the top at ' + KMH[2] + ' km/h' + (stalls.length ? `; the ${stalls.join(' and the ')} sprocket${stalls.length > 1 ? 's' : ''} stalled` : '') + '.'
          + ` On the <b>flat</b>, your fastest was the <b>${GEARS[fl[0]].name}</b> sprocket at ${tried.flat[fl[0]].v} km/h` + (fl.length > 1 ? `; your slowest was the ${GEARS[fl[fl.length - 1]].name} at ${tried.flat[fl[fl.length - 1]].v} km/h` : '') + '.'
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}” for the hill: <b class="${okP ? 'green' : 'red'}">${okP ? '✓ spot on' : '✗ not this time'}</b>.` : '');
        requestAnimationFrame(() => Ink.frame(found));
      }
      function unlock() {
        const on = !!got('p01.predict');
        [lab, tabs, gearRow].forEach((e) => { e.style.opacity = on ? 1 : 0.4; e.style.pointerEvents = on ? '' : 'none'; }); btn.disabled = !on;
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (Object.keys(tried.hill).length) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      }
      unlock(); sync(); S.go();
    },
  });
})();
