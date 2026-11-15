// Page 1 — Starter: lift the teacher. Predict where the fulcrum should go, then drag it along a see-saw and push.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

  function text(x, s, px, py, o = {}) {
    x.save(); const f = o.font === 'hand' ? HANDF : LABF; x.font = f(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  // a light pen line (cheap, no retrace)
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const close = (P) => P.concat([P[0]]);

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
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

  // ---------- doodles ----------
  // the teacher: 150 x 270, feet at (75, 262)
  function paintTeacher(x) {
    const legs = [[52, 170], [50, 250], [67, 250], [75, 190], [83, 250], [100, 250], [98, 170]];
    Ink.hatchFill(x, legs, 1, B, 0.8); Ink.stroke(x, legs, { w: 2.2, seed: 3 });
    Ink.stroke(x, [[44, 252], [48, 244], [68, 246], [70, 258], [42, 258], [44, 252]], { w: 2.2, seed: 5 });
    Ink.stroke(x, [[82, 246], [102, 244], [108, 252], [108, 258], [80, 258], [82, 246]], { w: 2.2, seed: 6 });
    const torso = [[46, 82], [104, 82], [106, 172], [44, 172]];
    Ink.hatchFill(x, torso, 1, B, 1.25);
    // shirt + tie (leave the V clear)
    x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(61, 81); x.lineTo(75, 128); x.lineTo(89, 81); x.closePath(); x.fill(); x.restore();
    Ink.stroke(x, close(torso), { w: 2.4, seed: 8 });
    Ink.stroke(x, [[61, 82], [75, 128], [89, 82]], { w: 1.8, seed: 9 });
    const tie = [[75, 88], [70, 96], [75, 126], [80, 96]];
    Ink.hatchFill(x, tie, 1, RD, 2.2); Ink.stroke(x, close(tie), { w: 1.6, color: RD, seed: 4 });
    // left arm with a mark book tucked under it
    Ink.stroke(x, [[46, 86], [30, 124], [40, 156]], { w: 2.4, seed: 12 });
    Ink.stroke(x, [[46, 104], [40, 126], [48, 150]], { w: 1.8, seed: 13 });
    const book = [[12, 128], [38, 122], [44, 164], [18, 170]];
    Ink.stroke(x, close(book), { w: 2, seed: 14 }); pen(x, [[20, 138], [34, 135]], { w: 1.4 }); pen(x, [[22, 146], [36, 143]], { w: 1.4 });
    // right arm holding a mug of tea
    Ink.stroke(x, [[104, 86], [124, 120], [116, 142]], { w: 2.4, seed: 15 });
    Ink.stroke(x, [[104, 106], [112, 124], [108, 138]], { w: 1.8, seed: 16 });
    Ink.stroke(x, close([[108, 140], [130, 140], [128, 164], [110, 164]]), { w: 2.2, seed: 17 });
    Ink.stroke(x, geo.curve([130, 145], [142, 145], [142, 160], [129, 159], 10), { w: 1.8, seed: 18 });
    pen(x, geo.curve([114, 134], [110, 126], [120, 122], [116, 112], 10), { w: 1.3, a: 0.6 });
    pen(x, geo.curve([124, 134], [120, 126], [130, 122], [126, 112], 10), { w: 1.3, a: 0.6 });
    // head, hair, glasses, smile
    Ink.stroke(x, geo.ellipse(75, 48, 24, 27), { w: 2.4, seed: 20 });
    pen(x, [[53, 40], [56, 24], [62, 32], [66, 18], [72, 30], [78, 16], [83, 30], [90, 20], [92, 34], [98, 28], [97, 42]], { w: 1.8, a: 0.9, amp: 0.4 });
    Ink.stroke(x, geo.ellipse(65, 48, 8, 7), { w: 1.6, seed: 21, retrace: false });
    Ink.stroke(x, geo.ellipse(86, 48, 8, 7), { w: 1.6, seed: 22, retrace: false });
    pen(x, [[73, 47], [78, 47]], { w: 1.6 }); pen(x, [[57, 47], [52, 44]], { w: 1.4 }); pen(x, [[94, 47], [99, 44]], { w: 1.4 });
    x.fillStyle = rgba(B, 0.9); [[65, 48], [86, 48]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 1.8, 0, 7); x.fill(); });
    pen(x, geo.curve([66, 62], [72, 68], [80, 68], [85, 61], 10), { w: 1.8 });
    pen(x, [[68, 75], [68, 82]], { w: 1.6 }); pen(x, [[83, 75], [83, 82]], { w: 1.6 });
  }
  // the student (faces left): 100 x 220, feet at (50, 214). The pushing arm is drawn live.
  function paintStudent(x) {
    const legs = [[34, 134], [32, 204], [46, 204], [50, 150], [56, 204], [70, 204], [68, 134]];
    Ink.stroke(x, legs, { w: 2.2, seed: 31 });
    Ink.stroke(x, [[46, 204], [44, 212], [22, 212], [26, 204], [32, 204]], { w: 2, seed: 32 });
    Ink.stroke(x, [[70, 204], [70, 212], [46, 212], [50, 205]], { w: 2, seed: 33 });
    const body = [[32, 62], [68, 62], [72, 136], [30, 136]];
    Ink.hatchFill(x, body, 1, B, 0.55); Ink.stroke(x, close(body), { w: 2.2, seed: 34 });
    pen(x, [[40, 62], [50, 74], [60, 62]], { w: 1.6 }); pen(x, [[50, 74], [50, 92]], { w: 1.3 });
    // rucksack on the back
    const bag = [[70, 66], [88, 70], [90, 118], [72, 122]];
    Ink.hatchFill(x, bag, 1, B, 1.5); Ink.stroke(x, close(bag), { w: 2, seed: 35 });
    Ink.stroke(x, geo.ellipse(50, 36, 20, 22), { w: 2.3, seed: 36 });
    pen(x, [[32, 30], [36, 14], [42, 22], [48, 8], [54, 20], [62, 10], [64, 22], [72, 18], [70, 32]], { w: 1.8, a: 0.9, amp: 0.4 });
    x.fillStyle = rgba(B, 0.9); [[40, 36], [52, 36]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 2, 0, 7); x.fill(); });
    pen(x, geo.curve([39, 47], [43, 51], [49, 51], [53, 46], 8), { w: 1.6 });
  }

  Book.page({
    id: 'p01',
    title: 'Starter: lift the teacher',
    build(ui, root) {
      ui.h('Could you lift your teacher?');
      ui.p('Your teacher weighs about <b>800 N</b> (that is 80 kg). You have <b>one hand</b>, a strong plank and a triangular block to rest it on. The block is called the <span class="key">fulcrum</span>.');

      const got = (id) => Book.state.items[id];
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: where to put the fulcrum', q: '<b>Predict:</b> you push down on one end and the teacher stands on the other. Where should the fulcrum go to make the lift <b>easiest</b>?',
        options: ['Near the teacher', 'In the middle', 'Near me', 'It makes no difference'], onPick: () => unlockLab() });

      // ------------------------------------------------------------------ the see-saw
      ui.el('h2', '', 'Now test it');
      const how = ui.p('<b>Drag the fulcrum</b> along the plank and watch the effort meter. Then <b>press and hold PUSH</b>. Your strongest one-hand push is about <b>300 N</b>.');
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 14px;transition:opacity .3s';
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the plank unlocks.'); lockMsg.style.marginTop = '-6px';
      const W = 860, HH = 566, M = 150, PX0 = 120, PX1 = 720, PY = 372, TH = 14, GY = 446, FH = GY - PY - TH;
      const LOAD = 800, MAXP = 300, MX0 = 330, MSC = 0.5, MX1 = MX0 + 1000 * MSC;
      const S = Stage(lab, W, HH, 'pan-y');
      const r = ui.record('p01.try', { label: 'See-saw experiment: fulcrum positions tried, lowest effort', type: 'experiment', max: 1 });
      const prev = r.get() || {};
      const tried = (prev.tried || []).slice(); // [{d, n, ok}] in the order they were pushed
      let d = 2, xf = PX0 + d * M, moved = tried.length > 0, dragging = false;
      const need = (dd) => Math.round((LOAD * dd) / (4 - dd));
      const push = { down: false, active: false, t0: 0, force: 0, tilt: 0, res: null, tRes: 0 };
      let msg = null; // result shown on the paper: { ok, d, n }

      const row = ui.el('div', ''); row.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:0 0 var(--R)';
      const btn = ui.el('button', 'btn', '⬇ PUSH (hold)', row);
      btn.style.cssText = 'margin-top:0;min-width:190px;min-height:60px;font-size:22px;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none';
      const stat = ui.el('span', 'small', '', row); stat.style.flex = '1 1 240px';

      let sprT, sprS, sprF, sprStat;
      function buildArt() {
        sprT = S.layer(150, 270, paintTeacher); sprS = S.layer(100, 220, paintStudent);
        sprF = S.layer(96, 84, (x) => {
          const P = [[12, 68], [48, 8], [84, 68]];
          Ink.hatchShadow(x, P, 1, 6, 6); Ink.hatchFill(x, P, 1, B, 1.1); Ink.stroke(x, close(P), { w: 2.6, seed: 41 });
        });
        sprStat = S.layer(W, HH, (x) => {
          // ground
          Ink.stroke(x, [[16, GY], [W - 14, GY]], { w: 2.6, seed: 51 });
          const rr = H.rng(9); for (let i = 0; i < 38; i++) { const gx = rr.range(20, W - 30); pen(x, [[gx, GY + 5], [gx - 9, GY + 14]], { w: 1.1, a: 0.45, wob: false }); }
          // a crate holds the teacher's end level
          const cr = [[PX0 - 38, PY + TH + 2], [PX0 + 30, PY + TH + 2], [PX0 + 30, GY], [PX0 - 38, GY]];
          Ink.stroke(x, close(cr), { w: 2.2, seed: 52 }); pen(x, [cr[0], cr[2]], { w: 1.4 }); pen(x, [cr[1], cr[3]], { w: 1.4 });
          pen(x, [[PX0 - 38, PY + TH + 12], [PX0 + 30, PY + TH + 12]], { w: 1.2 }); pen(x, [[PX0 - 38, GY - 10], [PX0 + 30, GY - 10]], { w: 1.2 });
          // metre marks along the ground
          for (let i = 0; i <= 8; i++) { const tx = PX0 + i * M * 0.5; pen(x, [[tx, GY - (i % 2 ? 5 : 9)], [tx, GY + (i % 2 ? 5 : 9)]], { w: 1.6, wob: false }); }
          // the effort meter
          text(x, 'effort needed:', MX0, 30, { font: 'hand', size: 24 });
          const bar = geo.rect(MX0, 72, 1000 * MSC, 28, 5); Ink.hatchShadow(x, bar, 1, 5, 5); Ink.stroke(x, bar, { w: 2.4, seed: 53 });
          for (let n = 100; n < 1000; n += 100) pen(x, [[MX0 + n * MSC, 100], [MX0 + n * MSC, n % 500 ? 93 : 88]], { w: 1.3, wob: false });
          text(x, '0', MX0 - 6, 96, { size: 22, align: 'right' });
          Ink.stroke(x, [[MX0 + MAXP * MSC, 66], [MX0 + MAXP * MSC, 110]], { w: 2.2, color: GR, seed: 54, retrace: false });
          text(x, 'your max: 300 N', MX0 + MAXP * MSC, 134, { size: 22, align: 'center', color: GR });
          Ink.stroke(x, [[MX0 + LOAD * MSC, 66], [MX0 + LOAD * MSC, 110]], { w: 2.2, seed: 55, retrace: false });
          text(x, 'teacher: 800 N', MX0 + LOAD * MSC, 134, { size: 22, align: 'center' });
          // the teacher's weight
          text(x, '800 N', 256, 262, { size: 26, align: 'center', color: RD });
        });
      }
      buildArt(); S.onFonts = buildArt;

      function dim(x, a, b, y, label, cap) {
        pen(x, [[a, y], [b, y]], { w: 1.8, seed: 61 });
        pen(x, [[a, y - 8], [a, y + 8]], { w: 1.8, wob: false }); pen(x, [[b, y - 8], [b, y + 8]], { w: 1.8, wob: false });
        pen(x, [[a + 10, y - 6], [a + 1, y], [a + 10, y + 6]], { w: 1.6, wob: false }); pen(x, [[b - 10, y - 6], [b - 1, y], [b - 10, y + 6]], { w: 1.6, wob: false });
        text(x, label, (a + b) / 2, y + 28, { size: 24, align: 'center' });
        text(x, cap, (a + b) / 2, y + 54, { size: 22, align: 'center', a: 0.7 });
      }

      S.render = (dt, t) => {
        const x = S.ctx; let busy = false;
        const target = PX0 + d * M;
        if (Math.abs(target - xf) > 0.4) { xf += (target - xf) * Math.min(1, dt * 20); busy = true; } else xf = target;
        const n = need(d), can = n <= MAXP;
        // pushing
        if (push.active) {
          busy = true;
          const held = push.down || t - push.t0 < 1.7 || (push.res && t - push.tRes < 1.1) || !push.res;
          if (held) {
            push.force = Math.min(Math.min(n, MAXP), push.force + dt * MAXP / 0.75);
            if (can && push.force >= n) push.tilt = Math.min(1, push.tilt + dt / 0.7);
            if (!push.res && (can ? push.tilt >= 1 : push.force >= MAXP)) finish(can, t);
          } else {
            push.tilt = Math.max(0, push.tilt - dt / 0.5); push.force = Math.max(0, push.force - dt * MAXP / 0.4);
            if (push.tilt <= 0 && push.force <= 0) { push.active = false; if (can && push.res) Book.sfx('thud', { gain: 0.25, f: 120 }); }
          }
        }
        const ang = ease(push.tilt) * Math.asin(FH / ((4 - d) * M));
        const fail = push.active && push.res === 'fail', jig = fail ? Math.sin(t * 46) * 1.6 : 0;

        S.blit(sprStat, 0, 0);
        S.blit(sprF, xf - 48, GY - 68 - 1);
        // drag arrows either side of the fulcrum
        [-1, 1].forEach((s) => pen(x, [[xf + s * 58, GY - 34], [xf + s * 74, GY - 22], [xf + s * 58, GY - 10]], { w: 2.6, color: RD, wob: false, a: dragging ? 1 : 0.75 }));
        if (!moved) text(x, 'drag me!', xf, GY + 34, { font: 'hand', size: 24, align: 'center', color: RD });
        // plank + teacher turn about the top of the fulcrum
        x.save(); x.translate(xf, PY + TH); x.rotate(ang); x.translate(-xf, -(PY + TH));
        const pl = [[PX0 - 34, PY], [PX1 + 34, PY], [PX1 + 34, PY + TH], [PX0 - 34, PY + TH]];
        Ink.stroke(x, close(pl), { w: 2.6, seed: 71 });
        pen(x, [[PX0 + 60, PY + 5], [PX0 + 250, PY + 6]], { w: 1, a: 0.5, seed: 3 }); pen(x, [[PX0 + 300, PY + 9], [PX1 - 40, PY + 8]], { w: 1, a: 0.5, seed: 5 });
        S.blit(sprT, PX0 - 75, PY - 262);
        x.restore();
        // red weight arrow beside the teacher
        const ty = -Math.sin(ang) * (xf - PX0);
        Ink.stroke(x, [[256, 272 + ty], [256, 330 + ty]], { w: 2.6, color: RD, seed: 72 });
        Ink.stroke(x, [[246, 318 + ty], [256, 332 + ty], [266, 318 + ty]], { w: 2.6, color: RD, seed: 73, retrace: false });
        // the student and the pushing arm
        const hx = xf + (PX1 - xf) * Math.cos(ang), hy = PY + TH + (PX1 - xf) * Math.sin(ang) - TH * Math.cos(ang);
        const lean = push.active ? Math.min(1, push.force / 120) * 5 : 0;
        S.blit(sprS, 760 + jig - lean, GY - 214);
        const sh = [796 + jig - lean, GY - 214 + 74], el = [(sh[0] + hx) / 2 + 6, (sh[1] + hy) / 2 + 16 - lean];
        Ink.stroke(x, [sh, el, [hx + 4, hy - 6]], { w: 2.4, seed: 74 });
        Ink.stroke(x, geo.ellipse(hx + 2, hy - 8, 9, 7), { w: 2, seed: 75, retrace: false });
        if (push.active && push.force > 0) { // effort arrow
          const L = 16 + 40 * (push.force / MAXP);
          Ink.stroke(x, [[hx - 22, hy - 30 - L], [hx - 22, hy - 22]], { w: 2.6, color: can ? GR : RD, seed: 76 });
          Ink.stroke(x, [[hx - 31, hy - 34], [hx - 22, hy - 21], [hx - 13, hy - 34]], { w: 2.6, color: can ? GR : RD, seed: 77, retrace: false });
        }
        if (fail) [[-34, -150], [-48, -128], [-30, -112]].forEach(([a, b], i) => pen(x, [[794 + a, GY + b], [794 + a - 5, GY + b + 9 + (Math.sin(t * 9 + i) + 1) * 3]], { w: 2, color: RD, wob: false }));
        // distances
        dim(x, PX0, xf, 500, d + ' m', 'teacher to fulcrum');
        dim(x, xf, PX1, 500, 4 - d + ' m', 'fulcrum to your hand');
        // meter
        const col = can ? GR : RD, off = n > 1000, mx = MX0 + Math.min(n, 1000) * MSC;
        text(x, n + ' N', MX0 + 196, 32, { size: 34, color: col });
        if (off) text(x, 'off the scale! »', MX1, 30, { font: 'hand', size: 22, align: 'right', color: RD });
        const tri = [[mx - 11, 46], [mx + 11, 46], [mx, 69]];
        if (!off) { Ink.hatchFill(x, tri, 1, col, 2.4); Ink.stroke(x, close(tri), { w: 2, color: col, seed: 78, retrace: false }); }
        else Ink.stroke(x, [[MX1 - 16, 76], [MX1 - 4, 86], [MX1 - 16, 96]], { w: 3, color: RD, seed: 79, retrace: false });
        if (push.force > 2) { const fw = push.force * MSC; Ink.hatchFill(x, [[MX0 + 3, 75], [MX0 + fw, 75], [MX0 + fw, 97], [MX0 + 3, 97]], 1, col, 2.2); }
        // what happened
        if (msg && msg.d === d) {
          if (msg.ok) {
            Ink.drawBubble(x, 'LIFTED!', 500, 200, 46, GR, 1, -0.03, 'center');
            text(x, 'your hand moved down 40 cm', 500, 250, { font: 'hand', size: 24, align: 'center', color: GR });
            text(x, 'the teacher rose only ' + Math.round((40 * d) / (4 - d)) + ' cm', 500, 286, { font: 'hand', size: 24, align: 'center', color: GR });
            if (push.tilt > 0.5) text(x, 'Whoa!', 196, 150, { font: 'hand', size: 26, color: B, rot: -0.1 });
          } else {
            Ink.drawBubble(x, "WON'T BUDGE!", 500, 200, 44, RD, 1, -0.03, 'center');
            text(x, 'this needs ' + n + ' N', 500, 250, { font: 'hand', size: 24, align: 'center', color: RD });
            text(x, 'you only have 300 N', 500, 286, { font: 'hand', size: 24, align: 'center', color: RD });
          }
        } else if (!push.active) text(x, tried.length ? 'try another spot…' : 'where will it be easiest?', 470, 240, { font: 'hand', size: 24, align: 'center', a: 0.6 });
        return busy || dragging;
      };

      function finish(ok, t) {
        push.res = ok ? 'lift' : 'fail'; push.tRes = t; msg = { ok, d, n: need(d) };
        Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
        if (!tried.some((q) => q.d === d)) tried.push({ d, n: need(d), ok });
        const best = Math.min(...tried.map((q) => q.n)), lifted = tried.some((q) => q.ok);
        r.set({ answer: 'fulcrum tried at ' + tried.map((q) => `${q.d} m from teacher (${q.n} N, ${q.ok ? 'lifted' : 'no lift'})`).join('; ') + `. Lowest effort found: ${best} N. Teacher lifted: ${lifted ? 'yes' : 'no'}`,
          correct: lifted ? true : null, score: lifted ? 1 : 0, max: 1, tried: tried.slice(), best });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); // no changing the prediction after testing
        status();
      }
      function startPush(e) {
        if (e) e.preventDefault();
        if (dragging) return;
        push.down = true;
        if (push.active) return;
        Object.assign(push, { active: true, t0: performance.now() / 1000, force: 0, tilt: 0, res: null });
        msg = null; Book.sfx('swish', { gain: 0.2 }); S.go();
      }
      const endPush = () => { push.down = false; };
      btn.addEventListener('pointerdown', (e) => { try { btn.setPointerCapture(e.pointerId); } catch (er) {} startPush(e); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btn.addEventListener(ev, endPush));
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
      btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) startPush(e); });
      btn.addEventListener('keyup', endPush);

      // dragging the fulcrum (horizontal drags only: vertical swipes still scroll the page)
      const setD = (px) => { const nd = clamp(Math.round(((px - PX0) / M) * 4) / 4, 0.5, 3.5); if (nd !== d) { d = nd; Book.sfx('tick', { gain: 0.4 }); } };
      S.c.addEventListener('pointerdown', (e) => {
        const [px, py] = S.pos(e);
        if (push.down || py < PY - 30 || px < PX0 - 40 || px > PX1 + 40) return;
        Object.assign(push, { active: false, force: 0, tilt: 0 }); dragging = true; moved = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {}
        setD(px); S.go();
      });
      S.c.addEventListener('pointermove', (e) => { if (dragging) { setD(S.pos(e)[0]); S.go(); } });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { dragging = false; }));

      // ------------------------------------------------------------------ after the experiment
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e.closest('.ink-anim-wrap') || e); return e; };
      add(ui.el('h2', '', 'What did you find?'));
      const found = add(ui.box('', { tag: 'Result' }));
      const check = add(ui.mcq({ id: 'p01.check', label: 'Why is it easier with the fulcrum near the load?', q: 'Why does moving the fulcrum <b>nearer the teacher</b> make the teacher easier to lift?',
        options: [
          { t: 'Your push is now much further from the fulcrum than the teacher is, so it turns the plank more easily', ok: true },
          { t: 'The teacher gets lighter when the fulcrum is close to them, so there is less weight for you to lift', mis: 'moment-distance', why: 'The teacher weighs 800 N wherever the fulcrum is. Look at what else changed when you dragged it.' },
          { t: 'A plank gives you extra force for free, so the teacher lifts just as far with a much smaller push', mis: 'ma-free-lunch', why: 'Nothing is free: your hand moved 40 cm but the teacher only rose a few cm. Look at the two distances.' },
          { t: 'Most of the plank is now on your side, and the weight of the plank does the lifting for you', why: 'We ignored the weight of the plank. Think about how far each force is from the fulcrum.' },
        ],
        explain: 'A force has a bigger turning effect the further it is from the fulcrum. Your small push, far away, beats a big load close in.' }));
      const notes = add(ui.box('A plank on a fulcrum is a <span class="key">lever</span>. It balances when<br><b>effort × its distance = load × its distance</b> (distances from the fulcrum).<br>Fulcrum 0.5 m from the teacher: effort × 3.5 = 800 × 0.5 = 400, so effort ≈ <b>114&nbsp;N</b>.<br><span class="small">The catch: your hand moves <b>further</b> than the load does. You never get something for nothing!</span>', { tag: 'Notes' }));
      add(ui.rate({ id: 'p01.conf', label: 'Confidence: why fulcrum position changes the effort', q: 'How confident are you that you could explain this to a friend?' }));
      const answered = () => { const it = got('p01.check'); return !!(it && it.correct === true); };
      if (!answered()) { notes.classList.add('peek-lock'); check.addEventListener('click', () => setTimeout(() => { if (answered()) notes.classList.remove('peek-lock'); }, 50)); }

      const WHERE = { 'Near the teacher': true };
      function status() {
        const lifted = tried.some((q) => q.ok), nT = tried.length, done = lifted && nT >= 3;
        stat.innerHTML = done ? `Tested <b>${nT}</b> positions. Lowest effort so far: <b>${Math.min(...tried.map((q) => q.n))} N</b>. ${tried.some((q) => q.d === 0.5) ? 'That is the lowest this plank allows!' : 'Can you beat it?'}`
          : `Positions tested: <b>${Math.min(nT, 3)} / 3</b> · Teacher lifted: <b>${lifted ? 'yes ✓' : 'not yet'}</b><br>Test 3 positions <b>and</b> lift the teacher to carry on.`;
        rest.style.display = done ? '' : 'none';
        if (!done) return;
        const p = (got('p01.predict') || {}).answer, best = tried.slice().sort((a, b) => a.n - b.n)[0], mid = tried.find((q) => q.d === 2);
        found.innerHTML = '<span class="tag">Result</span>The <b>nearer the fulcrum is to the teacher</b>, the <b>less effort</b> you need.'
          + ` Your best: fulcrum <b>${best.d} m</b> from the teacher, where a push of just <b>${best.n} N</b> lifts 800 N!`
          + (mid ? ' In the middle it took the full 800 N.' : '')
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${WHERE[p] ? 'green' : 'red'}">${WHERE[p] ? '✓ spot on' : '✗ not this time'}</b>.` : '');
        requestAnimationFrame(() => Ink.frame(found));
      }
      function unlockLab() {
        const on = !!got('p01.predict');
        lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none'; btn.disabled = !on;
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (tried.length) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      }
      unlockLab(); status(); S.go();
    },
  });
})();
