// Page 7 — Outputs: light & sound. Two play benches (filament lamp vs LED, buzzer vs speaker) with real sound,
// two questions, the notes, then "who needs what?" (pick an output for five users) and a true/false.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2;
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const glow = (x, cx, cy, r, col, a) => {
    if (a <= 0.01) return; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(col, 0.95 * a)); g.addColorStop(0.45, rgba(col, 0.4 * a)); g.addColorStop(1, rgba(col, 0));
    x.save(); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
  };

  // an interactive canvas with an on-demand render loop (sleeps when nothing moves, off screen or page hidden)
  function Stage(parent, W, Hh) {
    const wrap = document.createElement('div'); wrap.className = 'p07-stage'; parent.appendChild(wrap);
    const c = document.createElement('canvas'); wrap.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'manipulation', userSelect: 'none', webkitUserSelect: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, wrap, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(W * dpr); L.height = Math.ceil(Hh * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); return L; };
    S.blit = (L) => ctx.drawImage(L, 0, 0, W, Hh);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; }
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 500); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    S.go();
    return S;
  }

  // ---------- real sound: plain WebAudio, created on the first tap, silent when the book is muted ----------
  let ac = null, master = null;
  function AC() {
    if (Book.muted) return null;
    try {
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination); }
      if (ac.state === 'suspended') ac.resume();
    } catch (e) { return null; }
    return ac;
  }
  function tone(f, dur, type, gain) {
    const a = AC(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + 0.01; o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.012); g.gain.setValueAtTime(gain, t + Math.max(0.03, dur - 0.05)); g.gain.linearRampToValueAtTime(0, t + dur);
    let node = o; if (type === 'square') { const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; o.connect(lp); node = lp; }
    node.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  const BUZZ_F = 1175; // the buzzer's one and only note
  const NOTES = [['C', 523.25], ['D', 587.33], ['E', 659.25], ['G', 783.99], ['A', 880]];
  const TUNE = [[2, 0.3], [1, 0.3], [0, 0.3], [1, 0.3], [2, 0.3], [2, 0.3], [2, 0.55]]; // E D C D E E E (key index, seconds)

  Book.page({
    id: 'p07',
    title: 'Outputs: light & sound',
    build(ui, root) {
      const item = (id) => Book.state.items[id];
      const css = document.createElement('style');
      css.textContent = `
        .p07-stage{position:relative;margin:0}
        .p07-bench{position:relative;margin:0 0 calc(var(--R)*1.2);padding:8px 12px 14px;background:rgba(251,250,245,.86)}
        .p07-ctrl{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;align-items:start}
        .p07-ctrl>div{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;min-width:0}
        .p07-sw{font:700 17px Fredoka;color:var(--ink);background:#fff;border:2px solid var(--ink);border-radius:12px;min-height:48px;padding:8px 14px;cursor:pointer;line-height:1.2;box-shadow:0 3px 0 rgba(12,22,96,.35);touch-action:manipulation}
        .p07-sw:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(12,22,96,.35)}
        .p07-sw.on{background:var(--ink);color:#fff}
        .p07-sw.red{border-color:var(--red);color:var(--red);box-shadow:0 3px 0 rgba(120,20,26,.3)}
        .p07-slide{display:flex;align-items:center;gap:8px;font:600 16px Fredoka;color:var(--ink);flex:1 1 200px;min-width:170px}
        .p07-slide input{flex:1;min-width:90px;height:44px;accent-color:#1e2e96;touch-action:pan-y}
        .p07-keys{display:flex;gap:5px}
        .p07-key{width:50px;height:96px;border:2px solid var(--ink);border-radius:5px 5px 10px 10px;background:#fff;color:var(--ink);font:700 18px Fredoka;display:flex;align-items:flex-end;justify-content:center;padding:0 0 8px;cursor:pointer;box-shadow:0 4px 0 rgba(12,22,96,.35);touch-action:manipulation}
        .p07-key.down{background:#dfe5ff;transform:translateY(3px);box-shadow:0 1px 0 rgba(12,22,96,.35)}
        .p07-wait{font-size:17px;color:rgba(30,46,150,.75);border:2px dashed rgba(30,46,150,.4);border-radius:12px;padding:10px 16px;margin:0 0 calc(var(--R)*1.2)}
        .p07-sc{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1.5px dashed rgba(30,46,150,.28)}
        .p07-sc:first-of-type{border-top:0}
        .p07-sc canvas{flex:0 0 104px;width:104px;height:80px}
        .p07-sc .p07-body{flex:1;min-width:0}
        .p07-sc .p07-txt{margin:0 0 6px;line-height:1.4;font-size:19px}
        .p07-pick{display:flex;flex-wrap:wrap;gap:8px}
        .p07-pick .opt{min-height:46px;min-width:92px;text-align:center;padding:6px 12px;font-size:18px}
        .p07-sc .fb{margin-top:6px;font-size:17px;line-height:1.4}
        @media (max-width:700px){.p07-key{width:44px}.p07-sc canvas{flex-basis:84px;width:84px;height:65px}}`;
      root.appendChild(css);

      ui.h('Outputs: light & sound');
      ui.p('The <span class="key">output</span> is the last block of a system. It turns the electrical signal into something we can <b>see</b>, <b>hear</b> or <b>use</b>. Here are four output devices on the test bench. <b>Play with all four</b> before you answer anything.');

      // what the student has tried on the benches (saved for the teacher; no marks)
      const playRec = ui.record('p07.play', { label: 'Output test bench: what they tried', type: 'explore', max: 0 });
      const tried = {}; const keysTried = new Set();
      const NAMES = { lamp: 'lamp', led: 'LED', flip: 'LED flipped round', colour: 'LED colours', buzz: 'buzzer', pitch: 'buzzer pitch slider', btune: 'buzzer "tune"', keys: 'speaker keys', stune: 'speaker tune' };
      const did = (k) => { if (k === 'keys') { const n = keysTried.size; if (tried.keys === n) return; tried.keys = n; } else { if (tried[k]) return; tried[k] = 1; }
        playRec.set({ answer: 'tried: ' + Object.keys(NAMES).filter((n) => tried[n]).map((n) => NAMES[n] + (n === 'keys' ? ' ×' + tried.keys : '')).join(', '), correct: null }); };

      // =====================================================================================================
      // BENCH 1: filament lamp vs LED
      // =====================================================================================================
      ui.p('<b>1. Light.</b> Switch each one on and watch the two meters. Then turn the LED round and try again.');
      const bench1 = ui.el('div', 'p07-bench'); requestAnimationFrame(() => Ink.frame(bench1, { w: 2.2 }));
      const S1 = Stage(bench1, 860, 372);
      const L = { lamp: false, led: false, flip: false, col: 0, lv: 0, dv: 0, heatL: 0, heatD: 0, useL: 0, useD: 0, fx: 1, onFor: 0 };
      const LEDCOL = [[235, 45, 45], [40, 185, 85], [60, 115, 250], [245, 190, 20]];
      const AMBER = [255, 196, 40], ORANGE = [226, 120, 20];
      const glass = geo.curve([274, 216], [270, 186], [228, 180], [228, 136], 16).concat(geo.curve([228, 136], [228, 94], [260, 62], [300, 62], 16), geo.curve([300, 62], [340, 62], [372, 94], [372, 136], 16), geo.curve([372, 136], [372, 180], [330, 186], [326, 216], 16));
      // meters: an "energy used" bar and a "wasted as heat" thermometer
      const meterStatic = (x, ox) => {
        Ink.stroke(x, closeP(box(ox + 34, 70, 34, 200)), { w: 2.2, seed: 11, amp: 0.5 });
        for (let i = 1; i < 4; i++) Ink.stroke(x, [[ox + 34, 70 + i * 50], [ox + 44, 70 + i * 50]], { w: 1.4, seed: 13 + i, retrace: false });
        text(x, 'energy', ox + 51, 312, { size: 22 }); text(x, 'used', ox + 51, 338, { size: 22 });
        Ink.stroke(x, [[ox + 131, 258], [ox + 131, 76], [ox + 134, 68], [ox + 141, 64], [ox + 148, 68], [ox + 151, 76], [ox + 151, 258]], { w: 2.2, seed: 17, amp: 0.4 });
        Ink.stroke(x, geo.ellipse(ox + 141, 272, 19, 19, -1.05, -1.05 + TAU - 1.05), { w: 2.2, seed: 19, amp: 0.4 });
        for (let i = 0; i < 5; i++) Ink.stroke(x, [[ox + 151, 90 + i * 38], [ox + 161, 90 + i * 38]], { w: 1.4, seed: 23 + i, retrace: false });
        text(x, 'wasted', ox + 141, 320, { size: 22 }); text(x, 'as heat', ox + 141, 346, { size: 22 });
      };
      const meterLive = (x, ox, use, heat) => {
        if (use > 0.004) { const h = 196 * use, P = box(ox + 36, 268 - h, 30, h); fillP(x, P, 'rgba(90,120,240,0.25)'); Ink.hatchFill(x, P, 1, B, 1.5); }
        x.save(); x.fillStyle = rgba([225, 50, 50], 0.78); x.beginPath(); x.arc(ox + 141, 272, 14, 0, 7); x.fill();
        const h = 8 + 176 * heat; x.fillRect(ox + 135, 262 - h, 12, h + 2); x.restore();
      };
      let lay1 = null;
      const paint1 = (x) => {
        meterStatic(x, 0); meterStatic(x, 430);
        // --- filament lamp: glass, stem, coiled filament, screw cap, holder ---
        Ink.stroke(x, glass, { w: 2.8, seed: 3, amp: 0.7 });
        Ink.stroke(x, [[246, 100], [254, 86], [266, 77]], { w: 1.6, seed: 5, retrace: false });
        Ink.stroke(x, [[290, 216], [288, 180], [282, 150]], { w: 1.8, seed: 7 }); Ink.stroke(x, [[310, 216], [312, 180], [318, 150]], { w: 1.8, seed: 9 });
        Ink.stroke(x, [[292, 200], [300, 192], [308, 200]], { w: 1.6, seed: 10, retrace: false });
        const cap = box(273, 216, 54, 46); Ink.hatchShadow(x, cap, 1, 6, 6); Ink.stroke(x, closeP(cap), { w: 2.6, seed: 21, amp: 0.5 });
        for (let i = 0; i < 4; i++) Ink.stroke(x, [[273, 226 + i * 10], [327, 222 + i * 10]], { w: 1.6, seed: 31 + i, retrace: false });
        Ink.hatchFill(x, box(305, 216, 22, 46), 1, B, 1.4);
        const tip = [[286, 262], [314, 262], [308, 276], [292, 276]]; Ink.hatchFill(x, tip, 1, B, 2); Ink.stroke(x, closeP(tip), { w: 2.2, seed: 37 });
        text(x, 'filament lamp', 300, 322, { font: 'hand', size: 24 });
        // --- LED terminals (fixed): the + and - of the supply ---
        [[690, '+'], [770, '−']].forEach(([cx, s], i) => {
          const P = box(cx - 20, 268, 40, 24); Ink.hatchShadow(x, P, 1, 4, 4); Ink.hatchFill(x, P, 1, B, 1.6); Ink.stroke(x, closeP(P), { w: 2.2, seed: 41 + i, amp: 0.4 });
          text(x, s, cx + (i ? 44 : -44), 292, { size: 34, color: RD });
        });
        text(x, 'LED', 730, 352, { font: 'hand', size: 24 });
      };
      const zig = []; for (let i = 0; i <= 12; i++) zig.push([282 + i * 3, 150 - (i % 2 ? 9 : 0) - Math.sin(i / 12 * Math.PI) * 6]);
      const drawLED = (x, col, lit, fx) => {
        x.save(); x.translate(730, 0); x.scale(fx || 0.001, 1);
        const dome = [[-34, 200], [-34, 126]].concat(geo.ellipse(0, 126, 34, 34, Math.PI, TAU), [[34, 200]]);
        fillP(x, dome, rgba(col, 0.16 + 0.62 * lit));
        Ink.stroke(x, dome, { w: 2.8, seed: 51, amp: 0.5 });
        const fl = [[-42, 200], [36, 200], [36, 213], [-42, 213]]; fillP(x, fl, rgba(col, 0.2)); Ink.stroke(x, closeP(fl), { w: 2.4, seed: 53, amp: 0.4 });
        // inside: small post (long leg) and the bigger anvil with the chip (short leg)
        Ink.stroke(x, [[-14, 200], [-14, 150], [-6, 142]], { w: 2, seed: 55 });
        const anv = [[14, 200], [14, 158], [-4, 150], [-4, 138], [22, 138], [22, 200]]; Ink.stroke(x, anv, { w: 2, seed: 57, amp: 0.4 }); Ink.hatchFill(x, anv, 1, B, 1.6);
        Ink.stroke(x, [[-22, 108], [-14, 100], [-4, 96]], { w: 1.5, seed: 59, retrace: false });
        // legs: long one on the left, short one on the right (as drawn before flipping)
        Ink.stroke(x, [[-14, 213], [-14, 232], [-40, 250], [-40, 316]], { w: 2.6, seed: 61, amp: 0.4 });
        Ink.stroke(x, [[14, 213], [14, 232], [40, 250], [40, 286]], { w: 2.6, seed: 63, amp: 0.4 });
        x.restore();
      };
      S1.onFonts = () => { lay1 = null; };
      S1.render = (dt, now) => {
        if (!lay1) lay1 = S1.layer(paint1);
        const x = S1.ctx, ease = (v, to, r) => v + (to - v) * Math.min(1, dt * r);
        const ledLit = L.led && !L.flip;
        L.lv = ease(L.lv, L.lamp ? 1 : 0, L.lamp ? 9 : 5); L.dv = ease(L.dv, ledLit ? 1 : 0, 30);
        L.useL = ease(L.useL, L.lamp ? 0.93 : 0, 8); L.useD = ease(L.useD, ledLit ? 0.07 : 0, 8);
        L.heatL = ease(L.heatL, L.lamp ? 0.92 : 0, L.lamp ? 0.55 : 0.4); L.heatD = ease(L.heatD, ledLit ? 0.05 : 0, 0.6);
        L.fx = ease(L.fx, L.flip ? -1 : 1, 9); L.onFor = ledLit ? L.onFor + dt : 0;
        // glows first (so the ink sits on top)
        glow(x, 300, 136, 170, AMBER, L.lv * (0.92 + 0.08 * Math.sin(now * 23)));
        glow(x, 730, 140, 150, LEDCOL[L.col], L.dv);
        S1.blit(lay1);
        // filament: blue when cold, glowing red-orange when on
        Ink.stroke(x, zig, { w: 2, seed: 71, amp: 0.2, color: L.lv > 0.3 ? ORANGE : B });
        if (L.lv > 0.05) { x.save(); x.globalAlpha = L.lv; for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i - 5.5) * 0.44, r0 = 92 + ((i + Math.floor(now * 6)) % 2) * 5, r1 = r0 + 20; Ink.stroke(x, [[300 + Math.cos(a) * r0, 136 + Math.sin(a) * r0], [300 + Math.cos(a) * r1, 136 + Math.sin(a) * r1]], { w: 2.2, color: ORANGE, seed: 80 + i, amp: 0.3, retrace: false }); } x.restore(); }
        // heat shimmer rising off the hot glass
        if (L.heatL > 0.12) { x.save(); x.strokeStyle = rgba(RD, 0.6 * clamp((L.heatL - 0.12) * 2)); x.lineWidth = 2.2; [-44, -15, 15, 44].forEach((ox, i) => { x.beginPath(); const top = 46 - 34 * L.heatL; for (let y = 54; y >= top; y -= 3) { const px = 300 + ox + Math.sin(y * 0.2 + now * 7 + i * 1.7) * 5; if (y === 54) x.moveTo(px, y - Math.abs(ox) * -0.25); else x.lineTo(px, y + Math.abs(ox) * 0.25); } x.stroke(); }); x.restore(); }
        if (L.heatL > 0.6) text(x, 'HOT!', 196, 122, { font: 'hand', size: 24, color: RD, a: clamp((L.heatL - 0.6) * 5) });
        meterLive(x, 0, L.useL, L.heatL); meterLive(x, 430, L.useD, L.heatD);
        drawLED(x, LEDCOL[L.col], L.dv, L.fx);
        if (L.dv > 0.05) { x.save(); x.globalAlpha = L.dv; for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.42, r0 = 52, r1 = 74; Ink.stroke(x, [[730 + Math.cos(a) * r0, 124 + Math.sin(a) * r0], [730 + Math.cos(a) * r1, 124 + Math.sin(a) * r1]], { w: 2.2, color: LEDCOL[L.col], seed: 100 + i, amp: 0.3, retrace: false }); } x.restore(); }
        if (L.led && L.flip && Math.abs(L.fx + 1) < 0.1) text(x, 'nothing…', 730, 66, { font: 'hand', size: 26, color: RD });
        if (L.onFor > 2.2) text(x, 'still cool', 632, 122, { font: 'hand', size: 22, color: GR, a: clamp((L.onFor - 2.2) * 2) });
        const settling = Math.abs(L.heatL - (L.lamp ? 0.92 : 0)) > 0.004 || Math.abs(L.heatD - (ledLit ? 0.05 : 0)) > 0.003 || Math.abs(L.fx - (L.flip ? -1 : 1)) > 0.004 || Math.abs(L.lv - (L.lamp ? 1 : 0)) > 0.004 || L.useL > 0.004 && !L.lamp;
        return L.lamp || ledLit || settling || (L.onFor > 0 && L.onFor < 3);
      };
      const ctrl1 = ui.el('div', 'p07-ctrl', '', bench1), c1a = ui.el('div', '', '', ctrl1), c1b = ui.el('div', '', '', ctrl1);
      const mk = (parent, label, cls) => { const b = ui.el('button', 'p07-sw' + (cls ? ' ' + cls : ''), label, parent); b.type = 'button'; return b; };
      const bLamp = mk(c1a, 'Lamp: switch ON'), bLed = mk(c1b, 'LED: switch ON'), bFlip = mk(c1b, 'Turn the LED round', 'red'), bCol = mk(c1b, 'Colour');
      const sync1 = () => { bLamp.textContent = L.lamp ? 'Lamp: switch OFF' : 'Lamp: switch ON'; bLamp.classList.toggle('on', L.lamp); bLed.textContent = L.led ? 'LED: switch OFF' : 'LED: switch ON'; bLed.classList.toggle('on', L.led); S1.go(); };
      const togLamp = () => { L.lamp = !L.lamp; Book.sfx('click', { gain: 0.9 }); did('lamp'); sync1(); };
      const togLed = () => { L.led = !L.led; Book.sfx('click', { gain: 0.9 }); did('led'); if (L.led && L.flip) { did('flip'); Book.sfx('tock', { gain: 0.3, f: 300 }); } sync1(); };
      bLamp.onclick = togLamp; bLed.onclick = togLed;
      bFlip.onclick = () => { L.flip = !L.flip; Book.sfx('paper', { gain: 0.3, dur: 0.2 }); if (L.led) did('flip'); sync1(); };
      bCol.onclick = () => { L.col = (L.col + 1) % LEDCOL.length; Book.sfx('tick', { gain: 0.5 }); did('colour'); sync1(); };
      S1.c.addEventListener('click', (e) => { const [px] = S1.pos(e); (px < 430 ? togLamp : togLed)(); });

      // =====================================================================================================
      // BENCH 2: buzzer vs speaker
      // =====================================================================================================
      ui.p('<b>2. Sound.</b> Sound the buzzer and try to change its pitch. Then play the speaker\'s keys. Ask each one for a tune!');
      const bench2 = ui.el('div', 'p07-bench'); requestAnimationFrame(() => Ink.frame(bench2, { w: 2.2, seed: 5 }));
      const S2 = Stage(bench2, 860, 300);
      const Z = { buzzUntil: 0, spkUntil: 0, spkF: 0, spkName: '', ph: 0, bph: 0, pitchMoved: false, lastKey: -1 };
      let lay2 = null;
      const paint2 = (x) => {
        // --- buzzer: a squat black cylinder with a sound hole and two legs ---
        const body = geo.ellipse(190, 190, 70, 24, 0, Math.PI).concat([[120, 108]], geo.ellipse(190, 108, 70, 24, Math.PI, TAU));
        Ink.hatchShadow(x, body, 1, 9, 7);
        fillP(x, body, 'rgba(60,75,170,0.2)'); Ink.hatchFill(x, body, 1, B, 2.2);
        Ink.stroke(x, [[120, 108], [120, 190]], { w: 2.8, seed: 3 }); Ink.stroke(x, [[260, 108], [260, 190]], { w: 2.8, seed: 5 });
        Ink.stroke(x, geo.ellipse(190, 190, 70, 24, 0, Math.PI), { w: 2.8, seed: 7, amp: 0.5 });
        const top = geo.ellipse(190, 108, 70, 24, 0, TAU);
        x.save(); x.globalCompositeOperation = 'destination-out'; path(x, top); x.fill(); x.restore(); fillP(x, top, 'rgba(60,75,170,0.1)');
        Ink.stroke(x, geo.ellipse(190, 108, 70, 24, 0.3, 0.3 + TAU + 0.1), { w: 2.8, seed: 9, amp: 0.5 });
        fillP(x, geo.ellipse(190, 108, 11, 4.5, 0, TAU), rgba(B, 0.9));
        Ink.stroke(x, [[146, 102], [158, 102]], { w: 2, seed: 11, retrace: false }); Ink.stroke(x, [[152, 98], [152, 106]], { w: 2, seed: 13, retrace: false });
        Ink.stroke(x, [[165, 213], [165, 258]], { w: 2.6, seed: 15 }); Ink.stroke(x, [[215, 213], [215, 258]], { w: 2.6, seed: 17 });
        text(x, 'buzzer', 190, 290, { font: 'hand', size: 24 });
        // --- speaker (side view): magnet, frame; the cone is drawn live because it moves ---
        const mag = box(476, 112, 44, 76); Ink.hatchShadow(x, mag, 1, 7, 7); Ink.hatchFill(x, mag, 1, B, 2.2); Ink.stroke(x, closeP(mag), { w: 2.6, seed: 21, amp: 0.5 });
        Ink.stroke(x, [[520, 122], [604, 56]], { w: 2.4, seed: 23 }); Ink.stroke(x, [[520, 178], [604, 244]], { w: 2.4, seed: 25 });
        const rim = box(604, 48, 12, 204); Ink.hatchFill(x, rim, 1, B, 1.6); Ink.stroke(x, closeP(rim), { w: 2.4, seed: 27, amp: 0.4 });
        Ink.stroke(x, [[540, 106], [540, 118]], { w: 1.6, seed: 28, retrace: false }); Ink.stroke(x, [[566, 86], [566, 98]], { w: 1.6, seed: 29, retrace: false });
        Ink.stroke(x, [[540, 194], [540, 182]], { w: 1.6, seed: 30, retrace: false }); Ink.stroke(x, [[566, 214], [566, 202]], { w: 1.6, seed: 31, retrace: false });
        text(x, 'speaker', 548, 290, { font: 'hand', size: 24 });
      };
      const waves = (x, cx, cy, ph, gap, a0, col, rmax) => {
        x.save(); x.strokeStyle = rgba(col, 1); x.lineWidth = 2.6; x.lineCap = 'round';
        for (let r = 16 + (ph % gap); r < rmax; r += gap) { x.globalAlpha = a0 * clamp(1 - r / rmax) * clamp(r / 30); x.beginPath(); x.arc(cx, cy, r, -0.62, 0.62); x.stroke(); }
        x.restore();
      };
      S2.onFonts = () => { lay2 = null; };
      S2.render = (dt, now) => {
        if (!lay2) lay2 = S2.layer(paint2);
        const x = S2.ctx, t = performance.now(), buzzing = t < Z.buzzUntil, playing = t < Z.spkUntil;
        S2.blit(lay2);
        if (buzzing) { Z.bph += dt * 150; waves(x, 262, 122, Z.bph, 20, 1, RD, 150); const j = Math.sin(now * 90) * 1.5; Ink.stroke(x, [[100 + j, 96], [92 + j, 84]], { w: 2, color: RD, seed: 3, retrace: false }); Ink.stroke(x, [[96 + j, 122], [82 + j, 120]], { w: 2, color: RD, seed: 5, retrace: false }); Ink.stroke(x, [[100 + j, 150], [90 + j, 160]], { w: 2, color: RD, seed: 7, retrace: false }); }
        if (Z.pitchMoved && buzzing) text(x, 'same note!', 330, 60, { font: 'hand', size: 24, color: RD });
        // the moving cone
        const dx = playing ? Math.sin(now * (14 + Z.spkF / 40)) * 6 : 0;
        const cone = [[604, 62], [524 + dx, 134], [524 + dx, 166], [604, 238]];
        fillP(x, cone, 'rgba(120,140,235,0.14)');
        Ink.stroke(x, [[604, 62], [524 + dx, 134]], { w: 2.6, seed: 41, amp: 0.4 }); Ink.stroke(x, [[604, 238], [524 + dx, 166]], { w: 2.6, seed: 43, amp: 0.4 });
        Ink.stroke(x, geo.curve([524 + dx, 134], [548 + dx, 138], [548 + dx, 162], [524 + dx, 166], 12), { w: 2.4, seed: 45, amp: 0.3 });
        const coil = box(506 + dx, 138, 18, 24); Ink.stroke(x, closeP(coil), { w: 1.8, seed: 47, amp: 0.3, retrace: false });
        if (playing) { Z.ph += dt * 150; waves(x, 606, 150, Z.ph, clamp(30000 / Z.spkF, 14, 60) * 0.62, 1, B, 215); text(x, 'note: ' + Z.spkName, 752, 50, { size: 26 }); }
        return buzzing || playing;
      };
      const ctrl2 = ui.el('div', 'p07-ctrl', '', bench2), c2a = ui.el('div', '', '', ctrl2), c2b = ui.el('div', '', '', ctrl2);
      const bBuzz = mk(c2a, 'Buzzer ON');
      const sl = ui.el('label', 'p07-slide', 'pitch <input type="range" min="1" max="10" value="5" aria-label="buzzer pitch"> <span>5</span>', c2a);
      const bBT = mk(c2a, 'Play a tune');
      const keyWrap = ui.el('div', 'p07-keys', '', c2b);
      const bST = mk(c2b, 'Play a tune');
      let seqTimers = [];
      const stopSeq = () => { seqTimers.forEach(clearTimeout); seqTimers = []; };
      const buzz = (dur) => { tone(BUZZ_F, dur, 'square', 0.085); Z.buzzUntil = performance.now() + dur * 1000; S2.go(); };
      const keyEls = NOTES.map(([n], i) => { const k = ui.el('button', 'p07-key', n, keyWrap); k.type = 'button'; k.setAttribute('aria-label', 'note ' + n); return k; });
      const play = (i, dur) => { const [n, f] = NOTES[i]; tone(f, dur, 'triangle', 0.3); Z.spkF = f; Z.spkName = n; Z.spkUntil = performance.now() + dur * 1000; keyEls[i].classList.add('down'); setTimeout(() => keyEls[i].classList.remove('down'), Math.min(260, dur * 900)); S2.go(); };
      bBuzz.onclick = () => { stopSeq(); buzz(0.9); did('buzz'); };
      let lastSl = 0;
      sl.querySelector('input').addEventListener('input', (e) => { sl.querySelector('span').textContent = e.target.value; Z.pitchMoved = true; did('pitch'); const n = performance.now(); if (n - lastSl > 260) { lastSl = n; stopSeq(); buzz(0.45); } });
      bBT.onclick = () => { stopSeq(); did('btune'); let at = 0; TUNE.forEach(([, d]) => { seqTimers.push(setTimeout(() => buzz(d * 0.82), at * 1000)); at += d; }); };
      keyEls.forEach((k, i) => k.addEventListener('pointerdown', (e) => { e.preventDefault(); stopSeq(); play(i, 0.5); keysTried.add(i); did('keys'); }));
      bST.onclick = () => { stopSeq(); did('stune'); let at = 0; TUNE.forEach(([i, d]) => { seqTimers.push(setTimeout(() => play(i, d * 0.92), at * 1000)); at += d; }); };

      // =====================================================================================================
      // two questions (the benches blur while answering), then the notes appear
      // =====================================================================================================
      ui.p('Now two questions. <span class="small">(The test bench blurs while you answer: use what you saw and heard.)</span>');
      const q1 = ui.mcq({
        id: 'p07.lamp-led', label: 'Why LEDs have replaced filament lamps', q: 'Why have <b>LEDs</b> replaced <b>filament lamps</b> in most products?',
        options: [
          { t: 'They use far less energy, stay cool and last much longer', ok: true, why: 'Yes. A filament lamp wastes most of its energy as heat. An LED gives light using very little energy, stays cool and has a long life.' },
          { t: 'They give out more heat, so they glow brighter for longer', why: 'Other way round: it was the filament lamp that got hot. Heat is wasted energy. Think about the two meters.' },
          { t: 'They work either way round, so they are quicker to fit', why: 'Remember what happened when you turned the LED round? Think about the meters instead.' },
          { t: 'They sense when it gets dark, so they switch on by themselves', mis: 'input-vs-output', why: 'An LED is an output: it gives out light. Sensing light is the job of an input. Think about the meters.' },
        ],
      });
      const q2 = ui.mcq({
        id: 'p07.buzz-speak', label: 'Difference between a buzzer and a speaker', q: 'What is the difference between a <b>buzzer</b> and a <b>speaker</b>?',
        options: [
          { t: 'A buzzer makes one fixed tone; a speaker can play a range of sounds', ok: true, why: 'Yes. A buzzer makes ONE fixed tone when it is switched on. A speaker turns a changing signal into any sound: tunes, speech, music.' },
          { t: 'A buzzer can play tunes and speech; a speaker makes one fixed tone', mis: 'buzzer-vs-speaker', why: 'You have them swapped. Which one ignored the pitch slider and beeped the same note for its "tune"?' },
          { t: 'They do the same job; a speaker is simply a much louder buzzer', mis: 'buzzer-vs-speaker', why: 'Not the same. One of them could only ever make a single note, whatever you asked for.' },
          { t: 'A buzzer is an input that senses sound; a speaker is an output', mis: 'input-vs-output', why: 'Both are outputs: both turn an electrical signal into sound. The difference is in WHAT sounds they can make.' },
        ],
      });
      ui.hideWhile(q1, 'p07.lamp-led', [bench1, bench2]);
      ui.hideWhile(q2, 'p07.buzz-speak', [bench1, bench2]);

      const wait = ui.el('p', 'p07-wait', 'Answer both questions and your notes will appear here.');
      let notes = null;
      const NOTES_HTML = `<p style="margin:0 0 6px"><b>Filament lamp:</b> gives light, but <span class="key">wastes a lot of energy as heat</span>.</p>
        <p style="margin:0 0 6px"><b>LED</b> (light-emitting diode): gives light using <span class="key">very little energy</span>. Long life, stays cool, many colours. It <span class="key">only works one way round</span>. Standby lights, displays, modern torches, bike lights.</p>
        <p style="margin:0 0 6px"><b>Buzzer:</b> makes <span class="key">one fixed tone</span> when it is switched on. Simple and cheap. Alarms, smoke alarms, timers, game buzzers.</p>
        <p style="margin:0 0 6px"><b>Speaker:</b> turns a <span class="key">changing signal</span> into sound, so it can play a <span class="key">range of sounds</span>: tunes, speech, music. Radios, phones.</p>
        <p style="margin:0"><b>Choosing an output:</b> what does the user need? To <b>SEE</b> it (lamp / LED), <b>HEAR</b> it (buzzer / speaker) or have something <b>MOVE</b> (a motor gives movement: it can spin or vibrate).</p>`;
      const bothDone = () => (item('p07.lamp-led') || {}).correct === true && (item('p07.buzz-speak') || {}).correct === true;
      const showNotes = (fresh) => {
        if (notes || !bothDone()) return;
        notes = ui.box(NOTES_HTML, { tag: 'Notes' }); root.insertBefore(notes, wait); wait.remove();
        if (fresh) Book.scribble(0.5);
        syncLock();
      };
      [q1, q2].forEach((q) => q.addEventListener('click', () => setTimeout(() => showNotes(true), 80)));

      // =====================================================================================================
      // who needs what? five users, first tap on each one counts
      // =====================================================================================================
      ui.h('Who needs what?', { size: 40 });
      ui.p('Five products, five users. Tap the <b>simplest output that does the job</b> for each. Your <b>first tap</b> on each one is your answer. <span class="small">(The notes and the test bench blur until you finish the page.)</span>');
      const OPTS = ['LED', 'Buzzer', 'Speaker', 'Motor'];
      const doodle = {
        clock(x) { Ink.stroke(x, geo.ellipse(52, 46, 24, 24), { w: 2.4, seed: 3 }); Ink.stroke(x, [[52, 46], [52, 32]], { w: 2, seed: 5 }); Ink.stroke(x, [[52, 46], [62, 50]], { w: 2, seed: 7 });
          Ink.stroke(x, geo.ellipse(32, 22, 9, 6, 2.6, 2.6 + Math.PI), { w: 2.2, seed: 9 }); Ink.stroke(x, geo.ellipse(72, 22, 9, 6, 3.7, 3.7 + Math.PI), { w: 2.2, seed: 11 });
          Ink.stroke(x, [[38, 66], [32, 74]], { w: 2.2, seed: 13 }); Ink.stroke(x, [[66, 66], [72, 74]], { w: 2.2, seed: 15 }); Ink.stroke(x, [[88, 30], [96, 26]], { w: 1.6, seed: 17, color: RD, retrace: false }); Ink.stroke(x, [[90, 40], [99, 40]], { w: 1.6, seed: 19, color: RD, retrace: false }); },
        door(x) { const d = box(26, 8, 40, 66); Ink.stroke(x, closeP(d), { w: 2.4, seed: 3 }); Ink.stroke(x, closeP(box(33, 16, 26, 20)), { w: 1.6, seed: 5, retrace: false }); Ink.stroke(x, geo.ellipse(59, 46, 2.5, 2.5), { w: 2, seed: 7 });
          Ink.stroke(x, closeP(box(74, 34, 12, 16)), { w: 2, seed: 9 }); fillP(x, geo.ellipse(80, 42, 3, 3, 0, TAU), rgba(RD, 0.9)); Ink.stroke(x, [[18, 74], [92, 74]], { w: 2, seed: 11 });
          fillP(x, geo.ellipse(90, 20, 4, 3, 0, TAU), rgba(B, 0.9)); Ink.stroke(x, [[94, 20], [94, 6], [100, 9]], { w: 1.8, seed: 13, retrace: false }); },
        micro(x) { const b = box(10, 16, 84, 52); Ink.hatchShadow(x, b, 1, 4, 4); Ink.stroke(x, closeP(b), { w: 2.4, seed: 3 }); const w = box(17, 23, 50, 38); Ink.stroke(x, closeP(w), { w: 2, seed: 5 }); Ink.hatchFill(x, w, 1, B, 0.9);
          Ink.stroke(x, closeP(box(74, 24, 13, 8)), { w: 1.6, seed: 7, retrace: false }); [42, 50, 58].forEach((y, i) => fillP(x, geo.ellipse(80, y, 2.4, 2.4, 0, TAU), rgba(B, 0.85)));
          Ink.stroke(x, [[20, 68], [20, 73]], { w: 2, seed: 9 }); Ink.stroke(x, [[84, 68], [84, 73]], { w: 2, seed: 11 }); },
        tv(x) { const b = box(8, 10, 88, 52); Ink.hatchShadow(x, b, 1, 4, 4); Ink.stroke(x, closeP(b), { w: 2.6, seed: 3 }); Ink.stroke(x, closeP(box(13, 15, 78, 40)), { w: 1.6, seed: 5, retrace: false }); Ink.hatchFill(x, box(13, 15, 78, 40), 1, B, 1.8);
          Ink.stroke(x, [[52, 62], [52, 70]], { w: 2.4, seed: 7 }); Ink.stroke(x, [[34, 72], [70, 72]], { w: 2.4, seed: 9 }); Ink.stroke(x, geo.ellipse(86, 58.5, 2.4, 2.4), { w: 1.8, seed: 11, color: RD }); },
        teddy(x) { Ink.stroke(x, geo.ellipse(40, 30, 17, 16), { w: 2.4, seed: 3 }); Ink.stroke(x, geo.ellipse(26, 15, 6, 6), { w: 2, seed: 5 }); Ink.stroke(x, geo.ellipse(54, 15, 6, 6), { w: 2, seed: 7 });
          Ink.stroke(x, geo.ellipse(40, 60, 16, 15, -1.2, 4.4), { w: 2.4, seed: 9 }); fillP(x, geo.ellipse(34, 27, 2, 2, 0, TAU), rgba(B, 0.9)); fillP(x, geo.ellipse(46, 27, 2, 2, 0, TAU), rgba(B, 0.9)); Ink.stroke(x, [[36, 36], [40, 39], [44, 36]], { w: 1.8, seed: 11, retrace: false });
          const sb = geo.rect(64, 6, 36, 26, 8); Ink.stroke(x, sb, { w: 1.8, seed: 13, color: RD }); Ink.stroke(x, [[70, 32], [62, 40], [78, 32]], { w: 1.8, seed: 15, color: RD, retrace: false }); Ink.stroke(x, [[71, 16], [93, 16]], { w: 1.5, seed: 17, color: RD, retrace: false }); Ink.stroke(x, [[71, 23], [87, 23]], { w: 1.5, seed: 19, color: RD, retrace: false }); },
      };
      const SC = [
        { k: 'deaf alarm clock', d: 'clock', t: 'An <b>alarm clock</b> for a user who is <b>deaf</b>. It has to wake them up.', ok: ['LED', 'Motor'],
          good: { LED: 'A bright flashing light can be SEEN: no hearing needed.', Motor: 'A motor can make a pad under the pillow vibrate: the user FEELS it. A flashing light would work too.' },
          why: { Buzzer: 'A deaf user cannot hear a buzzer. This user needs something to SEE or FEEL.', Speaker: 'A deaf user cannot hear a speaker. This user needs something to SEE or FEEL.' }, mis: { Buzzer: 'output-choice', Speaker: 'output-choice' } },
        { k: 'microwave done signal', d: 'micro', t: 'A <b>microwave oven</b> tells you from across the kitchen that the food is <b>done</b>: one plain beep.', ok: ['Buzzer'],
          good: { Buzzer: 'One plain beep is all it needs, and a buzzer is simple and cheap.' },
          why: { LED: 'You are across the kitchen, not looking at it: the user needs to HEAR this one.', Speaker: 'It would work, but it is more than the job needs. For one plain beep there is a simpler, cheaper part.', Motor: 'Movement would not tell you anything from across the kitchen: the user needs to HEAR it.' }, mis: { LED: 'output-choice', Speaker: 'output-choice', Motor: 'output-choice' } },
        { k: 'musical doorbell', d: 'door', t: 'A <b>doorbell</b> that plays a different <b>tune</b> for the front door and the back door.', ok: ['Speaker'],
          good: { Speaker: 'Tunes need lots of different notes: only the speaker can play a range of sounds.' },
          why: { Buzzer: 'A buzzer has one fixed tone, so both doors would sound exactly the same. No tunes!', LED: 'A light plays no tune, and you might be in another room: the user needs to HEAR it.', Motor: 'A motor gives movement, not a tune.' }, mis: { Buzzer: 'buzzer-vs-speaker', LED: 'output-choice', Motor: 'output-choice' } },
        { k: 'TV standby indicator', d: 'tv', t: 'A <b>TV</b> shows that it is on <b>standby</b>, silently, all day and all night.', ok: ['LED'],
          good: { LED: 'A small light that uses very little energy, stays cool and lasts for years.' },
          why: { Buzzer: 'A beep all day and all night? The user only needs to SEE that it is on standby.', Speaker: 'It has to be silent: the user only needs to SEE that it is on standby.', Motor: 'Nothing needs to move: the user only needs to SEE that it is on standby.' }, mis: { Buzzer: 'output-choice', Speaker: 'output-choice', Motor: 'output-choice' } },
        { k: 'talking toy', d: 'teddy', t: 'A <b>cuddly toy</b> that <b>says a sentence</b> when you squeeze its paw.', ok: ['Speaker'],
          good: { Speaker: 'Speech is a changing signal: only the speaker can turn that into sound.' },
          why: { Buzzer: 'A buzzer can only make its one fixed tone: it cannot say words.', LED: 'A light cannot speak: the user needs to HEAR words.', Motor: 'A motor could make it wriggle, but it cannot speak.' }, mis: { Buzzer: 'buzzer-vs-speaker', LED: 'output-choice', Motor: 'output-choice' } },
      ];
      const chooseRec = ui.record('p07.choose', { label: 'Who needs what? Output for 5 users', type: 'choose', max: 5 });
      const chAct = ui.el('div', 'act'); chAct.dataset.id = 'p07.choose'; requestAnimationFrame(() => Ink.frame(chAct, { shadow: false, w: 2.2 }));
      const prevCh = (chooseRec.get() || {}).rows;
      const rows = SC.map((s, i) => (prevCh && prevCh[i]) || { taps: [], done: false });
      const commitCh = () => {
        const started = rows.some((r) => r.taps.length), done = rows.every((r) => r.done);
        const score = rows.filter((r, i) => r.taps.length && SC[i].ok.includes(r.taps[0])).length;
        const mis = []; rows.forEach((r, i) => r.taps.forEach((t) => { const m = SC[i].mis[t]; if (m && !mis.includes(m)) mis.push(m); }));
        chooseRec.set({ answer: rows.map((r, i) => SC[i].k + ': ' + (r.taps.length ? r.taps.map((t) => t + (SC[i].ok.includes(t) ? ' ✓' : ' ✗')).join(' → ') : '(blank)')).join('; '), correct: done ? score === 5 : started ? false : null, score, max: 5, mis: mis.join(','), rows });
      };
      SC.forEach((s, i) => {
        const row = ui.el('div', 'p07-sc', '', chAct);
        const cv = document.createElement('canvas'); cv.width = 208; cv.height = 160; row.appendChild(cv);
        const x = cv.getContext('2d'); x.scale(2, 2); x.lineCap = 'round'; x.lineJoin = 'round'; doodle[s.d](x);
        const body = ui.el('div', 'p07-body', '', row); ui.el('p', 'p07-txt', `<b style="font-family:Fredoka;color:var(--red)">${i + 1}.</b> ${s.t}`, body);
        const pick = ui.el('div', 'p07-pick', '', body), f = ui.el('div', 'fb', '', body);
        const btns = OPTS.map((o) => { const b = ui.el('button', 'opt', o, pick); b.type = 'button'; return b; });
        const paint = () => {
          const r = rows[i];
          btns.forEach((b, k) => { const o = OPTS[k]; if (r.taps.includes(o)) b.classList.add(s.ok.includes(o) ? 'right' : 'wrong'); b.disabled = r.done || r.taps.includes(o); });
          if (r.taps.length) { const last = r.taps[r.taps.length - 1], ok = s.ok.includes(last); f.className = 'fb on ' + (ok ? 'good' : 'bad'); f.textContent = (ok ? '✓ ' : '✗ ') + (ok ? s.good[last] : s.why[last] + ' Try again.'); }
        };
        btns.forEach((b, k) => (b.onclick = () => {
          const r = rows[i], o = OPTS[k]; if (r.done || r.taps.includes(o)) return;
          r.taps.push(o); const ok = s.ok.includes(o); if (ok) r.done = true;
          Book.sfx(ok ? 'success' : 'error', { gain: 0.35 }); Book.scribble(0.12);
          paint(); commitCh(); syncLock();
        }));
        paint();
      });

      // one last check; the notes stay blurred until it is answered
      const tf = ui.tf({ id: 'p07.tf', label: 'T/F: an LED lights whichever way round it is connected', statement: 'An LED lights up whichever way round it is connected.', answer: false,
        explain: 'An LED only works <b>one way round</b>. Turn it round and it stays off (a filament lamp does not mind).' });
      let tfSeen = false;
      function syncLock() {
        const started = rows.some((r) => r.taps.length), tfDone = !!item('p07.tf');
        [bench1, bench2].forEach((e) => e.classList.toggle('peek-lock', started && !tfDone));
        if (notes) notes.classList.toggle('peek-lock', (started || tfSeen) && !tfDone);
      }
      tf.addEventListener('click', () => setTimeout(syncLock, 60));
      if (window.IntersectionObserver) new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting) && !tfSeen) { tfSeen = true; syncLock(); } }, { threshold: 0.6 }).observe(tf);
      showNotes(false); syncLock();
    },
  });
})();
