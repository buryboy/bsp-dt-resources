// Page 1 — Starter: the scrapyard magnet. Predict how many of 8 scrap objects a crane's electromagnet will lift,
// then drag the magnet over each one (or tap it) and watch: some are hoisted, some never move. The words
// ferrous / non-ferrous only appear in the reveal at the end.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const close = (P) => P.concat([P[0]]);
  const PAPER = '#fbfaf5';

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  // a flat felt-tip wash inside a closed shape (drawn before the ink so the ink sits on top)
  function wash(x, pts, css) { x.save(); x.fillStyle = css; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
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
    // drag inside a hit zone: that touch no longer scrolls the page; everywhere else a vertical swipe still scrolls
    S.drag = (hit, on) => {
      let id = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); if (id !== null || !hit(p)) return; id = e.pointerId; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; on.move && on.move(S.pos(e)); S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; on.end && on.end(S.pos(e)); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false;
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ---------------------------------------------------------------- the eight bits of scrap
  // Each is painted into a 92 x 120 sprite: centre x = 46, standing on y = 112. h = height the magnet comes down to.
  const COPPER = 'rgba(214,120,62,.42)', BRASS = 'rgba(240,200,60,.5)';
  const OBJ = [
    { k: 'door', name: 'steel car door', short: 'car door', lift: true, h: 100, say: 'CLUNK! The steel car door swings up into the air.',
      paint(x) {
        const body = [[8, 112], [8, 42], [22, 12], [78, 12], [84, 42], [84, 112]];
        Ink.hatchFill(x, [[8, 60], [84, 60], [84, 112], [8, 112]], 1, B, 0.55);
        Ink.stroke(x, close(body), { w: 2.4, seed: 3, amp: 0.5 });
        Ink.stroke(x, close([[16, 42], [26, 19], [73, 19], [77, 42]]), { w: 1.8, seed: 4, retrace: false, amp: 0.4 });
        pen(x, [[8, 50], [84, 50]], { w: 1.4, seed: 5 });
        Ink.stroke(x, geo.rect(60, 60, 16, 7, 3), { w: 1.6, seed: 6, retrace: false, amp: 0.2 });
        pen(x, [[30, 36], [44, 23]], { w: 1.1, a: 0.5, wob: false }); pen(x, [[38, 38], [52, 24]], { w: 1.1, a: 0.5, wob: false });
      } },
    { k: 'can', name: 'aluminium drinks can', short: 'drinks can', lift: false, h: 68, say: 'Nothing. The aluminium can stays on the ground.',
      paint(x) {
        Ink.stroke(x, [[29, 52], [29, 107]], { w: 2.2, seed: 3, amp: 0.3 }); Ink.stroke(x, [[63, 52], [63, 107]], { w: 2.2, seed: 4, amp: 0.3 });
        Ink.stroke(x, geo.ellipse(46, 50, 15, 5), { w: 2, seed: 5, retrace: false, amp: 0.2 });
        pen(x, geo.curve([29, 52], [26, 46], [34, 44], [34, 46], 8), { w: 1.6, wob: false }); pen(x, geo.curve([63, 52], [66, 46], [58, 44], [58, 46], 8), { w: 1.6, wob: false });
        pen(x, geo.curve([29, 107], [34, 114], [58, 114], [63, 107], 12), { w: 2.2 });
        pen(x, geo.ellipse(48, 50, 5, 2.2), { w: 1.4, wob: false });
        pen(x, geo.curve([30, 70], [40, 76], [52, 76], [62, 70], 10), { w: 1.3, a: 0.7 }); pen(x, geo.curve([30, 90], [40, 96], [52, 96], [62, 90], 10), { w: 1.3, a: 0.7 });
        Ink.hatchFill(x, [[52, 54], [63, 54], [63, 108], [52, 108]], 1, B, 0.8);
      } },
    { k: 'pipe', name: 'copper pipe', short: 'copper pipe', lift: false, h: 28, say: 'Nothing. The copper pipe does not even twitch.',
      paint(x) {
        const tube = [[10, 88], [80, 88], [80, 110], [10, 110]];
        wash(x, tube, COPPER); wash(x, geo.ellipse(80, 99, 6, 11), COPPER);
        Ink.stroke(x, [[10, 88], [80, 88]], { w: 2.2, seed: 3, amp: 0.3 }); Ink.stroke(x, [[10, 110], [80, 110]], { w: 2.2, seed: 4, amp: 0.3 });
        pen(x, geo.ellipse(10, 99, 5, 11, Math.PI / 2, Math.PI * 1.5), { w: 2 });
        Ink.stroke(x, geo.ellipse(80, 99, 6, 11), { w: 2, seed: 5, retrace: false, amp: 0.2 });
        pen(x, geo.ellipse(80, 99, 3, 7), { w: 1.3, wob: false });
        // a soldered joint ring
        pen(x, geo.ellipse(38, 99, 4, 12, Math.PI * 1.5, Math.PI * 2.5), { w: 1.8 }); pen(x, geo.ellipse(46, 99, 4, 12, Math.PI * 1.5, Math.PI * 2.5), { w: 1.8 });
        pen(x, [[38, 86], [46, 86]], { w: 1.6, wob: false }); pen(x, [[38, 112], [46, 112]], { w: 1.6, wob: false });
        pen(x, [[14, 93], [32, 93]], { w: 1, a: 0.5, wob: false }); pen(x, [[54, 93], [72, 93]], { w: 1, a: 0.5, wob: false });
      } },
    { k: 'drain', name: 'cast-iron drain cover', short: 'drain cover', lift: true, h: 30, say: 'CLUNK! The heavy cast-iron drain cover comes straight up.',
      paint(x) {
        const top = [[14, 86], [70, 86], [82, 100], [4, 100]];
        Ink.stroke(x, close(top), { w: 2.3, seed: 3, amp: 0.4 });
        const front = [[4, 100], [82, 100], [82, 111], [4, 111]];
        Ink.hatchFill(x, front, 1, B, 1.6); Ink.stroke(x, close(front), { w: 2.2, seed: 4, amp: 0.3 });
        for (let i = 0; i < 5; i++) { const u = (i + 0.5) / 5, xa = 17 + u * 50, xb = 9 + u * 68; const s = [[xa - 3, 89], [xa + 3, 89], [xb + 4, 97], [xb - 4, 97]]; Ink.hatchFill(x, s, 1, B, 3); pen(x, close(s), { w: 1.3, wob: false }); }
      } },
    { k: 'tap', name: 'brass tap', short: 'brass tap', lift: false, h: 64, say: 'Nothing. The brass tap stays exactly where it is.',
      paint(x) {
        const base = [[28, 104], [60, 104], [60, 112], [28, 112]], stem = [[38, 68], [50, 68], [50, 104], [38, 104]];
        const spout = [[50, 74], [70, 74], [80, 82], [80, 96], [70, 96], [70, 86], [66, 84], [50, 84]];
        const handle = [[26, 50], [62, 50], [62, 58], [26, 58]], hub = [[40, 58], [48, 58], [48, 68], [40, 68]];
        [base, stem, spout, handle, hub].forEach((p) => wash(x, p, BRASS));
        Ink.stroke(x, close(base), { w: 2, seed: 3, amp: 0.3 }); Ink.stroke(x, [[38, 104], [38, 68]], { w: 2, seed: 4, amp: 0.3 });
        Ink.stroke(x, [[50, 104], [50, 84], [66, 84], [70, 86], [70, 96], [80, 96], [80, 82], [70, 74], [50, 74], [50, 68]], { w: 2, seed: 5, amp: 0.3 });
        Ink.stroke(x, close(geo.rect(26, 50, 36, 8, 4)), { w: 2, seed: 6, amp: 0.3, retrace: false });
        pen(x, [[40, 58], [40, 68]], { w: 1.8, wob: false }); pen(x, [[48, 58], [48, 68]], { w: 1.8, wob: false });
        pen(x, [[75, 100], [75, 106]], { w: 1.4, a: 0.6, wob: false });
      } },
    { k: 'bolt', name: 'steel bolt', short: 'steel bolt', lift: true, h: 72, say: 'CLICK! The little steel bolt jumps up to meet the magnet.',
      paint(x) {
        const head = [[28, 42], [64, 42], [64, 58], [28, 58]];
        Ink.hatchFill(x, [[52, 42], [64, 42], [64, 58], [52, 58]], 1, B, 2);
        Ink.stroke(x, close(head), { w: 2.3, seed: 3, amp: 0.3 }); pen(x, [[40, 42], [40, 58]], { w: 1.5, wob: false }); pen(x, [[52, 42], [52, 58]], { w: 1.5, wob: false });
        Ink.stroke(x, [[38, 58], [38, 108]], { w: 2.2, seed: 4, amp: 0.3 }); Ink.stroke(x, [[54, 58], [54, 108]], { w: 2.2, seed: 5, amp: 0.3 });
        pen(x, [[38, 108], [41, 112], [51, 112], [54, 108]], { w: 2, wob: false });
        for (let y = 72; y < 108; y += 6) pen(x, [[38, y + 3], [54, y]], { w: 1.4, wob: false, a: 0.8 });
      } },
    { k: 'pan', name: 'aluminium saucepan', short: 'saucepan', lift: false, h: 44, say: 'Nothing. The aluminium saucepan stays on the ground.',
      paint(x) {
        Ink.stroke(x, [[10, 72], [12, 108], [56, 108], [58, 72]], { w: 2.3, seed: 3, amp: 0.3 });
        Ink.stroke(x, geo.ellipse(34, 72, 24, 5), { w: 2, seed: 4, retrace: false, amp: 0.2 });
        pen(x, [[12, 108], [16, 112], [52, 112], [56, 108]], { w: 2, wob: false });
        const hd = [[58, 78], [88, 73], [89, 80], [58, 86]]; Ink.hatchFill(x, hd, 1, B, 2.4); Ink.stroke(x, close(hd), { w: 1.8, seed: 5, retrace: false, amp: 0.2 });
        Ink.hatchFill(x, [[42, 78], [57, 78], [56, 108], [42, 108]], 1, B, 0.9);
      } },
    { k: 'bucket', name: 'zinc-coated bucket', short: 'zinc-coated bucket', lift: true, h: 62, say: 'CLUNK! Up it goes. Scratch the zinc coating and you find steel underneath.',
      paint(x) {
        Ink.stroke(x, [[16, 56], [26, 110], [66, 110], [76, 56]], { w: 2.3, seed: 3, amp: 0.3 });
        Ink.stroke(x, geo.ellipse(46, 56, 30, 6), { w: 2, seed: 4, retrace: false, amp: 0.2 });
        pen(x, geo.curve([26, 110], [36, 115], [56, 115], [66, 110], 10), { w: 2 });
        pen(x, geo.curve([19, 72], [34, 79], [58, 79], [73, 72], 10), { w: 1.3, a: 0.7 }); pen(x, geo.curve([23, 94], [36, 100], [56, 100], [69, 94], 10), { w: 1.3, a: 0.7 });
        // the handle, folded down over the front
        pen(x, geo.curve([16, 58], [20, 88], [72, 88], [76, 58], 16), { w: 2, a: 0.9 });
        // the mottled "spangle" of a zinc coating
        const rr = H.rng(5); for (let i = 0; i < 9; i++) { const sx = rr.range(26, 64), sy = rr.range(62, 104); pen(x, [[sx - 4, sy], [sx, sy - 4], [sx + 4, sy], [sx, sy + 4], [sx - 4, sy]], { w: 1, a: 0.45, wob: false }); }
      } },
  ];
  const N = OBJ.length;

  Book.page({
    id: 'p01',
    title: 'Starter: the scrapyard magnet',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      ui.h('The scrapyard magnet');
      ui.p('A scrapyard crane has a huge <b>electromagnet</b> on the end of its cable. Switch it on and it grabs scrap metal; switch it off and the scrap drops. Today\'s pile: <b>eight metal objects</b>.');

      const RIGHT = 'About half of them';
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: how many of the 8 metal objects the magnet lifts', q: '<b>Predict:</b> how many of the eight metal objects will the magnet lift?',
        options: ['All eight of them', 'Most of them', RIGHT, 'None of them'], onPick: () => unlockLab() });

      ui.el('h2', '', 'Now work the crane');
      const how = ui.p('<b>Drag the magnet</b> along the crane arm and let go above an object (or just <b>tap the object</b>). Try all eight.');
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 10px;transition:opacity .3s';
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the crane switches on.'); lockMsg.style.marginTop = '-4px';

      const W = 860, HH = 440, GY = 344, JY = 52, REST = 118, MH = 34, MW = 84;
      const XS = OBJ.map((o, i) => 138 + i * 92);
      const S = Stage(lab, W, HH);
      const r = ui.record('p01.try', { label: 'Scrapyard magnet: tested the 8 objects', type: 'experiment', max: 1 });
      const tested = ((r.get() || {}).tested || []).filter((k) => OBJ.some((o) => o.k === k));
      const isDone = (i) => tested.includes(OBJ[i].k);

      // the tally board under the crane: one big button per object (tap = send the magnet there)
      const board = ui.el('div', ''); board.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin:0 0 10px';
      const chips = OBJ.map((o, i) => {
        const b = ui.el('button', 'opt', '', board); b.type = 'button'; b.style.cssText = 'min-height:56px;padding:6px 10px;font:600 17px Fredoka,system-ui;line-height:1.25';
        b.onclick = () => { if (phase === 'idle') start(i); };
        return b;
      });
      const stat = ui.el('p', '', ''); stat.style.minHeight = 'calc(var(--R) * 2)';

      let spr = [], sprStat, sprMag;
      function art() {
        spr = OBJ.map((o) => S.layer(92, 120, (x) => o.paint(x)));
        sprStat = S.layer(W, HH, (x) => {
          // the ground and a scatter of scrapyard grit
          Ink.stroke(x, [[8, GY], [W - 8, GY]], { w: 2.8, seed: 51 });
          const rr = H.rng(9); for (let i = 0; i < 34; i++) { const gx = rr.range(16, W - 40), gy = rr.range(GY + 6, GY + 16); pen(x, [[gx, gy], [gx + rr.range(6, 22), gy + rr.range(-1, 1)]], { w: 1, a: 0.35, wob: false }); }
          // crane tower (lattice) and its concrete foot
          Ink.stroke(x, [[30, GY], [30, JY + 22]], { w: 2.6, seed: 3 }); Ink.stroke(x, [[66, GY], [66, JY + 22]], { w: 2.6, seed: 4 });
          for (let y = JY + 22, k = 0; y < GY - 20; y += 36, k++) pen(x, k % 2 ? [[30, y], [66, y + 36]] : [[66, y], [30, y + 36]], { w: 1.6, seed: k });
          for (let y = JY + 22; y < GY; y += 36) pen(x, [[30, y], [66, y]], { w: 1.4, wob: false, a: 0.7 });
          const foot = [[16, GY - 14], [80, GY - 14], [80, GY], [16, GY]]; wash(x, foot, PAPER); Ink.hatchFill(x, foot, 1, B, 1.8); Ink.stroke(x, close(foot), { w: 2.2, seed: 6 });
          // the arm (jib): two rails with zig-zag bracing, and the driver's cab
          Ink.stroke(x, [[12, JY], [W - 10, JY]], { w: 2.6, seed: 7 }); Ink.stroke(x, [[12, JY + 20], [W - 10, JY + 20]], { w: 2.6, seed: 8 });
          const zz = []; for (let xx = 12, k = 0; xx <= W - 10; xx += 20, k++) zz.push([xx, k % 2 ? JY + 20 : JY]); pen(x, zz, { w: 1.3, a: 0.7, wob: false });
          pen(x, [[W - 10, JY], [W - 10, JY + 20]], { w: 2.4, wob: false }); pen(x, [[12, JY], [12, JY + 20]], { w: 2.4, wob: false });
          Ink.stroke(x, [[48, JY], [48, 14], [300, JY]], { w: 1.8, seed: 9, retrace: false }); Ink.stroke(x, [[48, 14], [12, JY]], { w: 1.8, seed: 10, retrace: false });
          const cab = geo.rect(22, JY + 24, 52, 44, 6); wash(x, cab, PAPER); Ink.hatchShadow(x, cab, 1, 5, 5); Ink.stroke(x, cab, { w: 2.2, seed: 12 });
          Ink.stroke(x, geo.rect(30, JY + 31, 36, 18, 3), { w: 1.6, seed: 13, retrace: false });
          // numbers under each object
          XS.forEach((cx, i) => { Ink.stroke(x, geo.ellipse(cx, GY + 36, 15, 15), { w: 1.8, seed: 20 + i, retrace: false, amp: 0.4 }); text(x, String(i + 1), cx, GY + 44, { size: 22, align: 'center' }); });
        });
        // the electromagnet: a fat disc with a lifting eye. 100 x 60, hangs from (50, 0); bottom face at y = MH + 20
        sprMag = S.layer(100, 64, (x) => {
          pen(x, [[50, 0], [28, 20]], { w: 2, wob: false }); pen(x, [[50, 0], [72, 20]], { w: 2, wob: false }); pen(x, [[50, 0], [50, 20]], { w: 2, wob: false });
          const body = geo.rect(50 - MW / 2, 20, MW, MH, 9); wash(x, body, PAPER); Ink.hatchFill(x, body, 1, B, 1.7); Ink.stroke(x, body, { w: 2.8, seed: 3, amp: 0.4 });
          pen(x, [[50 - MW / 2 + 6, 31], [50 + MW / 2 - 6, 31]], { w: 1.6, wob: false, a: 0.8 }); pen(x, [[50 - MW / 2 + 4, 44], [50 + MW / 2 - 4, 44]], { w: 1.6, wob: false, a: 0.8 });
        });
      }
      art(); S.onFonts = art;

      // ---- the crane's little state machine
      let mx = 112, my = REST, phase = 'idle', cur = -1, tPh = 0, lift = 0, vy = 0, moved = tested.length > 0, hover = -1, dust = 0, flash = 0;
      const yDown = (i) => GY - OBJ[i].h - MH - 20;
      const nearest = (px) => { let b = -1, d = 47; XS.forEach((cx, i) => { if (Math.abs(cx - px) < d) { d = Math.abs(cx - px); b = i; } }); return b; };
      function start(i) { if (phase !== 'idle' || !got('p01.predict')) return; cur = i; phase = 'move'; tPh = 0; moved = true; hover = i; pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); paintBoard(); S.go(); }
      function finish() {
        const o = OBJ[cur];
        if (!tested.includes(o.k)) tested.push(o.k);
        stat.innerHTML = `<b>${cur + 1}. ${o.name}:</b> <span class="${o.lift ? 'green' : 'red'}">${o.say}</span>`;
        commit(); phase = 'idle'; paintBoard(); status();
      }
      function commit() {
        const up = OBJ.filter((o) => o.lift && tested.includes(o.k)).map((o) => o.short), no = OBJ.filter((o) => !o.lift && tested.includes(o.k)).map((o) => o.short);
        const all = tested.length === N;
        r.set({ answer: `tested ${tested.length}/${N}. Lifted: ${up.join(', ') || 'none yet'}. Stayed on the ground: ${no.join(', ') || 'none yet'}`, correct: all ? true : null, score: all ? 1 : 0, max: 1, tested: tested.slice() });
      }
      function paintBoard() {
        chips.forEach((b, i) => {
          const o = OBJ[i], d = isDone(i);
          b.innerHTML = `<span style="display:inline-block;min-width:1.4em">${i + 1}</span>${o.name}<br><span style="font-weight:400;font-size:15px;color:${d ? (o.lift ? 'var(--green)' : 'var(--red)') : '#667'}">${d ? (o.lift ? '▲ LIFTED' : '✗ stayed on the ground') : 'not tested yet'}</span>`;
          b.classList.toggle('sel', i === cur && phase !== 'idle'); b.disabled = phase !== 'idle' || !got('p01.predict');
        });
      }

      S.render = (dt, t) => {
        const x = S.ctx; let busy = S.dragging();
        const o = cur >= 0 ? OBJ[cur] : null; tPh += dt;
        if (phase === 'move') { const tx = XS[cur], d = tx - mx, st = 520 * dt; if (Math.abs(d) <= st) { mx = tx; phase = 'lower'; tPh = 0; } else mx += Math.sign(d) * st; if (my > REST) my = Math.max(REST, my - 300 * dt); }
        else if (phase === 'lower') { const ty = yDown(cur); my = Math.min(ty, my + 330 * dt); if (my >= ty) { phase = 'zap'; tPh = 0; flash = 1; Book.sfx(o.lift ? 'thud' : 'tick', { gain: o.lift ? 0.5 : 0.6 }); } }
        else if (phase === 'zap') { if (tPh > 0.55) { phase = 'raise'; tPh = 0; } }
        else if (phase === 'raise') { my = Math.max(REST, my - 210 * dt); if (o.lift) lift = yDown(cur) - my; if (my <= REST) { phase = 'hold'; tPh = 0; if (!o.lift) Book.sfx('error', { gain: 0.25 }); } }
        else if (phase === 'hold') { if (tPh > (o.lift ? 0.9 : 0.5)) { if (o.lift) { phase = 'drop'; vy = 0; Book.sfx('tick', { gain: 0.5 }); } else finish(); } }
        else if (phase === 'drop') { vy += 1500 * dt; lift -= vy * dt; if (lift <= 0) { lift = 0; dust = 0.4; Book.sfx('thud', { gain: 0.55 }); finish(); } }
        if (phase !== 'idle') busy = true;
        if (flash > 0) { flash = Math.max(0, flash - dt * 2); busy = true; }
        if (dust > 0) { dust = Math.max(0, dust - dt); busy = true; }
        const on = phase === 'zap' || phase === 'raise' || phase === 'hold';

        S.blit(sprStat, 0, 0);
        // the objects (the one on the hook rides up with the magnet, swinging a little)
        OBJ.forEach((ob, i) => {
          const up = i === cur ? lift : 0, sw = i === cur && up > 4 && phase !== 'drop' ? Math.sin(t * 5) * 0.035 : 0;
          x.save(); x.translate(XS[i], GY - up - ob.h); x.rotate(sw); S.blit(spr[i], -46, -(112 - ob.h)); x.restore();
          if (isDone(i) && !(i === cur && phase !== 'idle')) { if (ob.lift) Ink.tick(x, XS[i] + 22, GY + 40, 0.8); else Ink.cross(x, XS[i] + 32, GY + 36, 0.75); }
        });
        if (dust > 0 && cur >= 0) { const cx = XS[cur], p = 1 - dust / 0.4; [-1, 1].forEach((sg) => { pen(x, [[cx + sg * 34, GY - 4], [cx + sg * (44 + p * 16), GY - 10 - p * 8]], { w: 2, a: 1 - p, wob: false }); pen(x, [[cx + sg * 38, GY - 2], [cx + sg * (54 + p * 18), GY - 3]], { w: 2, a: 1 - p, wob: false }); }); }
        // trolley on the arm, cable, magnet
        const tr = geo.rect(mx - 22, JY + 20, 44, 13, 4); wash(x, tr, PAPER); Ink.stroke(x, tr, { w: 2.2, seed: 31, amp: 0.3 });
        [-12, 12].forEach((dx) => pen(x, geo.ellipse(mx + dx, JY + 20, 4.5, 4.5), { w: 1.6, wob: false }));
        pen(x, [[mx - 2, JY + 33], [mx - 2, my]], { w: 1.6, wob: false }); pen(x, [[mx + 2, JY + 33], [mx + 2, my]], { w: 1.6, wob: false });
        S.blit(sprMag, mx - 50, my);
        if (on) { // the magnet is switched on: red zig-zags round it
          const by = my + 20 + MH / 2, a = 0.55 + 0.45 * Math.sin(t * 22);
          [-1, 1].forEach((sg) => { const bx = mx + sg * (MW / 2 + 8); pen(x, [[bx, by - 14], [bx + sg * 9, by - 6], [bx + sg * 2, by], [bx + sg * 12, by + 10]], { w: 2.6, color: RD, a, wob: false }); });
          pen(x, [[mx - 8, my + 6], [mx + 2, my + 12], [mx - 4, my + 16]], { w: 2.2, color: RD, a, wob: false });
        }
        if (flash > 0 && o) Ink.drawBubble(x, o.lift ? 'CLUNK!' : 'tap…', mx + (mx > 640 ? -150 : 60), my + 16, 30, RD, 1, -0.05, 'left');
        if (phase === 'hold' && o && !o.lift && tPh < 0.5) text(x, 'nothing!', XS[cur], GY - o.h - 14, { font: 'hand', size: 24, color: RD, align: 'center' });
        if (!moved && got('p01.predict')) { text(x, 'drag me →', mx + 52, my + 46, { font: 'hand', size: 24, color: RD }); }
        // what the magnet is over
        const hv = phase !== 'idle' ? cur : hover;
        if (hv >= 0) text(x, `${hv + 1}: ${OBJ[hv].name}`, W / 2, HH - 14, { font: 'hand', size: 26, align: 'center' });
        else text(x, `${tested.length} of ${N} tested`, W / 2, HH - 14, { font: 'hand', size: 24, align: 'center', a: 0.7 });
        return busy;
      };

      // drag the magnet along the arm; letting go over an object tests it. Tapping an object does the same.
      S.drag((p) => phase === 'idle' && !!got('p01.predict') && Math.abs(p[0] - mx) < 70 && p[1] < REST + 150, {
        start: () => { moved = true; },
        move: (p) => { mx = clamp(p[0], 104, W - 60); hover = nearest(mx); },
        end: () => { const i = nearest(mx); if (i >= 0) start(i); },
      });
      S.c.addEventListener('click', (e) => { const [px, py] = S.pos(e); if (phase !== 'idle' || py < REST + 150) return; const i = nearest(px); if (i >= 0) start(i); });

      // ------------------------------------------------------------------ after the experiment
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      add(ui.el('h2', '', 'What is going on?'));
      const found = add(ui.box('', { tag: 'What you found' }));
      const check = add(ui.mcq({ id: 'p01.check', label: 'What the four lifted objects have in common', q: 'Look at the four objects the magnet <b>lifted</b>. What do they have in common that the other four do not?',
        options: [
          { t: 'They all contain the metal iron', ok: true },
          { t: 'They are the four heaviest objects', mis: 'ferrous-meaning', why: 'The steel bolt is tiny and light, yet it jumped straight up to the magnet. Weight is not what the magnet cares about.' },
          { t: 'They are all a silvery-grey colour', mis: 'ferrous-meaning', why: 'The drinks can and the saucepan are silvery too, and they both stayed on the ground. Colour is not the reason.' },
          { t: 'They all conduct electricity well', mis: 'ferrous-meaning', why: 'All eight objects are metal, so all eight conduct. The copper pipe conducts brilliantly, and it never moved.' },
        ],
        explain: 'Steel and cast iron are both made mostly of iron, and it is the iron that the magnet grabs.' }));
      const reveal = add(ui.box('Metals that <b>contain iron</b> are called <span class="key">ferrous</span> metals: steel and cast iron are two of them. Most ferrous metals are <b>magnetic</b>.<br>Metals with <b>no iron</b> in them are called <span class="key">non-ferrous</span> metals: aluminium and copper are two. They are <b>not magnetic</b>.<br>Brass is a mixture of copper and zinc: no iron, so no lift. And scrapyards really do this: steel is separated for recycling with <b>magnets</b>.', { tag: 'Two new words' }));
      const conf = add(ui.rate({ id: 'p01.conf', label: 'Confidence: which metals a magnet picks up', q: 'How confident are you that you could say which metals a magnet will pick up?' }));
      check.addEventListener('click', () => setTimeout(status, 60));

      function status() {
        const all = tested.length === N;
        rest.style.display = all ? '' : 'none';
        if (!all) { if (!tested.length) stat.innerHTML = ''; return; }
        const p = (got('p01.predict') || {}).answer, ok = p === RIGHT;
        found.innerHTML = '<span class="tag">What you found</span>The magnet lifted <b>four</b> of the eight: the steel car door, the cast-iron drain cover, the steel bolt and the zinc-coated bucket (which is steel underneath its coating).<br>It could not lift the aluminium drinks can, the copper pipe, the brass tap or the aluminium saucepan. So <b>not every metal is magnetic</b>.'
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ not this time'}</b>.` : '');
        requestAnimationFrame(() => Ink.frame(found));
        const named = !!(got('p01.check') && got('p01.check').correct === true);
        reveal.style.display = named ? '' : 'none'; conf.style.display = named ? '' : 'none';
        if (named) requestAnimationFrame(() => Ink.frame(reveal));
      }
      function unlockLab() {
        const on = !!got('p01.predict');
        lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none'; board.style.opacity = on ? 1 : 0.4;
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (r.get()) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        paintBoard(); S.go();
      }
      unlockLab(); status(); S.go();
    },
  });
})();
