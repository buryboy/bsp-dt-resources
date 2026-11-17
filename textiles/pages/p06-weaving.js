// Page 6 — The weaving loom. The student lifts warp threads and passes the shuttle to weave three swatches for real
// (plain, twill, satin: every over/under is drawn as woven), zooms out to the fabric, rubs it and concludes.
// Then: cut edge v selvedge (rub to fray), label warp / weft / selvedge / bias, and match weaves to fabrics.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mod = (a, n) => ((a % n) + n) % n;
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const got = (id) => Book.state.items[id];

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round';
    if (o.dash) x.setLineDash(o.dash);
    x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const box4 = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); c.className = 'tw6-stage'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
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
    // drag inside a hit zone (that touch no longer scrolls the page); a touch that hardly moves is a tap
    S.drag = (hit, on) => {
      let id = null, p0 = null, moved = 0, tgt = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); tgt = hit(p); if (id !== null || !tgt) return; id = e.pointerId; p0 = p; moved = 0; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p, tgt); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; const p = S.pos(e); moved += Math.hypot(p[0] - p0[0], p[1] - p0[1]); on.move && on.move(p, p0, tgt); p0 = p; S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; S.dragged = performance.now(); on.end && on.end(moved < 10, tgt); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false; S.dragged = 0;
    // a plain tap that was not part of a drag
    S.tap = (fn) => c.addEventListener('click', (e) => { if (performance.now() - S.dragged < 350) return; fn(S.pos(e)); S.go(); });
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  function css() {
    if (document.getElementById('tw6-css')) return;
    const s = document.createElement('style'); s.id = 'tw6-css';
    s.textContent = `
      .tw6-lab { position: relative; margin: 0 0 calc(var(--R) * 1.2); padding: 12px 14px 14px; background: rgba(251,250,245,.9); }
      .tw6-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 24px; margin-top: 4px; }
      .tw6-task { font-size: 18px; line-height: 1.45; margin: 2px 0 8px; }
      .tw6-task b { font-family: Fredoka, system-ui; font-weight: 600; }
      .tw6-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 6px 0 8px; }
      .tw6-row .opt { flex: 1 1 120px; text-align: center; min-height: 52px; }
      .tw6-row .opt.tiny { flex: 0 0 auto; min-width: 96px; font: 600 17px Fredoka, system-ui; }
      .tw6-row .btn { margin-top: 0; min-height: 52px; }
      .tw6-col .opt { display: block; width: 100%; margin: 0 0 8px; }
      .tw6-msg { font-size: 18px; line-height: 1.45; min-height: 28px; margin: 4px 0; }
      .tw6-msg.red, .tw6-red { color: var(--red); } .tw6-msg.green, .tw6-green { color: var(--green); }
      .tw6-hide { display: none !important; }
      .tw6-stage { border-radius: 6px; }
    `;
    document.head.appendChild(s);
  }

  // ======================================================================================
  // the weaves. A woven row is a string, one letter per warp: O = the weft goes OVER that warp, U = UNDER it.
  // ======================================================================================
  const ROWS = 6;
  const phase = (row, per) => { for (let k = 0; k < per; k++) if ([...row].every((ch, i) => (ch === 'U') === (i % per === k))) return k; return -1; };
  const WEAVES = [
    { key: 'plain', id: 'p06.plain', n: 10, per: 2, tab: 'Plain weave', label: 'Loom: plain weave swatch + rub test conclusion',
      rule: 'the weft goes <b>over 1, under 1</b> all the way across. Each new row does the <b>opposite</b> of the row below.',
      fabric: 'calico (plain cotton cloth)', cell: (c, r) => mod(c + r, 2) === 0,
      check(rows, j) {
        const k = phase(rows[j], 2); if (k < 0) return 'That row is not over 1, under 1 all the way across.';
        if (j && phase(rows[j - 1], 2) === k) return 'That row is the same as the row below, so nothing locks the two wefts apart. Swap every warp.';
        return null;
      },
      note: '<b>Plain weave</b>: the weft goes <b>over one, under one</b>. Strong, hard-wearing and firm, the same on both sides, cheap and simple to make.<br>E.g. calico, cotton shirting, poplin.' },
    { key: 'twill', id: 'p06.twill', n: 9, per: 3, tab: 'Twill weave', label: 'Loom: twill weave swatch + rub test conclusion',
      rule: 'the weft goes <b>over 2, under 1</b> all the way across. Each new row, the whole pattern <b>steps 1 warp sideways</b> (always the same way).',
      fabric: 'denim', cell: (c, r, d) => mod(c - d * r, 3) !== 0,
      check(rows, j) {
        const k = phase(rows[j], 3); if (k < 0) return 'That row is not over 2, under 1 all the way across.';
        if (!j) return null;
        const s = mod(k - phase(rows[j - 1], 3), 3); if (s === 0) return 'The pattern did not step sideways: it is the same as the row below.';
        if (j >= 2 && s !== mod(phase(rows[1], 3) - phase(rows[0], 3), 3)) return 'It stepped the other way this time, so the line would zig-zag. Keep stepping the same way.';
        return null;
      },
      note: '<b>Twill weave</b>: the weft goes <b>over two (or more), under one</b>, shifting one step each row. That gives a <b>diagonal line</b> pattern. Strong, hard-wearing, drapes well and hides dirt.<br>E.g. denim, gabardine, chino.' },
    { key: 'satin', id: 'p06.satin', n: 10, per: 5, tab: 'Satin weave', label: 'Loom: satin weave swatch + rub test conclusion',
      rule: 'the weft <b>floats over 4</b> warps, then dips under 1. Each new row, the pattern steps <b>2 warps</b> sideways, so the dips are scattered.',
      fabric: 'satin (ribbons, linings)', cell: (c, r) => mod(c - 2 * r, 5) !== 0,
      check(rows, j) {
        const k = phase(rows[j], 5); if (k < 0) return 'That row is not over 4, under 1 all the way across.';
        if (!j) return null;
        const s = mod(k - phase(rows[j - 1], 5), 5); if (s === 0) return 'The pattern did not step sideways: the dips are stacked on top of each other.';
        if (s === 1 || s === 4) return 'Stepping by only 1 puts the dips in a diagonal line (that is a twill). Step 2 warps.';
        return null;
      },
      note: '<b>Satin weave</b>: the weft <b>floats over four or more</b> warp yarns. That gives a <b>smooth, shiny</b> (lustrous) surface that drapes well, but the floats can <b>snag</b> and it is less hard-wearing.<br>E.g. evening wear, linings, ribbons.' },
  ];
  const SAID = {
    plain: 'A tight, even criss-cross. Nothing snagged when I rubbed it.',
    twill: 'Clear diagonal lines across it. Nothing snagged when I rubbed it.',
    satin: 'Long smooth floats on top. Some threads snagged when I rubbed it.',
  };

  function loomLab(ui, lab, onChange) {
    const W = 860, H = 540, XC = 430, SP = 52, WW = 18, WH = 20, PITCH = 36, YS = 190, PARK = [70, 790];
    const rowY = (j) => 462 - PITCH * j;
    const recs = WEAVES.map((w) => ui.record(w.id, { label: w.label, type: 'weave', max: 1 }));
    const st = WEAVES.map((w) => {
      const it = got(w.id) || {}, rows = (it.rows || []).slice(0, ROWS);
      const s = { w, rows, lifted: new Array(w.n).fill(false), bad: it.bad || 0, rub: it.rub ? 1 : 0, said: it.said || '', ok: it.correct === true, view: 'loom', err: null };
      if (rows.length) { s.lifted = [...rows[rows.length - 1]].map((ch) => ch === 'U'); s.err = w.check(rows, rows.length - 1); }
      if (rows.length === ROWS && !s.err) s.view = 'fabric';
      return s;
    });
    const woven = (s) => s.rows.length === ROWS && !s.err;
    const nValid = (s) => s.rows.length - (s.err ? 1 : 0);
    let ci = Math.max(0, st.findIndex((s) => !s.ok)); if (ci < 0) ci = 0;
    const cur = () => st[ci];
    const xs = (s) => { const n = s.w.n; return Array.from({ length: n }, (_, i) => XC + (i - (n - 1) / 2) * SP); };
    const ext = (s) => { const X = xs(s); return [X[0] - 34, X[X.length - 1] + 34]; };

    // ---- DOM
    const tabs = ui.el('div', 'tw6-row', null, lab);
    const tabB = WEAVES.map((w, k) => { const b = ui.el('button', 'opt tiny', '', tabs); b.type = 'button'; b.onclick = () => { if (sh.busy()) return; ci = k; Book.sfx('tick', { gain: 0.5 }); resetShuttle(); refresh(); }; return b; });
    const rule = ui.el('div', 'tw6-task', '', lab);
    const stageBox = ui.el('div', '', null, lab);
    const S = Stage(stageBox, W, H);
    const tools = ui.el('div', 'tw6-row', null, lab);
    const mk = (cls, t, fn) => { const b = ui.el('button', cls, t, tools); b.type = 'button'; b.onclick = fn; return b; };
    const editable = () => { const s = cur(); return s.view === 'loom' && !woven(s) && !s.err && !sh.busy(); };
    const bSwap = mk('opt tiny', '⇅ swap all', () => { if (!editable()) return; const s = cur(); s.lifted = s.lifted.map((v) => !v); Book.sfx('tick', { gain: 0.5 }); paint(); });
    const bStep = mk('opt tiny', 'step ▸', () => { if (!editable()) return; const s = cur(); s.lifted.unshift(s.lifted.pop()); Book.sfx('tick', { gain: 0.5 }); paint(); });
    const bDown = mk('opt tiny', 'all down', () => { if (!editable()) return; cur().lifted.fill(false); Book.sfx('tick', { gain: 0.5 }); paint(); });
    const bUn = mk('btn ghost', '✂ unpick a row', () => { const s = cur(); if (sh.busy() || !s.rows.length || s.view !== 'loom') return; s.rows.pop(); s.err = null; Book.sfx('paper', { gain: 0.4 }); resetShuttle(); save(s); refresh(); });
    const bView = mk('btn ghost', '', () => { const s = cur(); if (!woven(s)) return; s.view = s.view === 'loom' ? 'fabric' : 'loom'; refresh(); });
    const msg = ui.el('div', 'tw6-msg', '', lab);
    // conclusions (one per weave)
    const concs = WEAVES.map((w, k) => {
      const s = st[k], d = ui.el('div', '', null, lab);
      ui.el('div', 'tw6-step', '3 · What did you find?', d);
      ui.el('div', 'tw6-task', 'Look closely at your zoomed-out swatch and think about the rub test. Which is true for <b>this</b> fabric?', d);
      const col = ui.el('div', 'tw6-col', null, d), fb = ui.el('div', 'fb', '', d);
      const note = ui.box(w.note, { tag: 'Notes' }); d.appendChild(note); note.style.marginTop = '14px';
      const order = Book.shuffle(Object.keys(SAID), 5 + k * 3);
      const bs = order.map((key) => {
        const b = ui.el('button', 'opt', SAID[key], col); b.type = 'button';
        b.onclick = () => {
          const ok = key === w.key; s.said = SAID[key]; s.ok = ok; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
          b.classList.add(ok ? 'right' : 'wrong'); save(s); show(); onChange();
        };
        return b;
      });
      function show() {
        if (s.ok) { bs.forEach((b, i) => { b.disabled = true; if (order[i] === w.key) b.classList.add('right'); }); fb.className = 'fb on good'; fb.innerHTML = '✓ That is what your swatch shows.'; }
        else if (s.said) { fb.className = 'fb on bad'; fb.innerHTML = '✗ Not this fabric. Look again at the zoomed-out swatch: what pattern do the threads make, and did any pull out when you rubbed?'; }
        note.classList.toggle('tw6-hide', !s.ok);
      }
      show();
      return d;
    });

    function save(s) {
      const k = st.indexOf(s);
      const answer = `wove ${nValid(s)}/${ROWS} rows` + (s.bad ? ` (${s.bad} wrong row${s.bad > 1 ? 's' : ''} woven)` : '') + (s.rub >= 1 ? '; rub test done' : '') + (s.said ? `; said: "${s.said}" ${s.ok ? '✓' : '✗'}` : '');
      recs[k].set({ answer, correct: s.said ? s.ok : null, score: s.ok ? 1 : 0, max: 1, mis: s.said && !s.ok ? 'weave-type' : '', rows: s.rows.slice(), bad: s.bad, rub: s.rub >= 1, said: s.said });
    }

    // ---- drawing
    let cloth = null, shuttleL = null; const fabL = {};
    // one weft row: visible wherever it is not hidden under a warp. Erases whatever is beneath where it is on top.
    function drawRow(x, s, row, y, l, r, base) {
      const X = xs(s), pieces = []; let c0 = ext(s)[0]; const end = ext(s)[1];
      [...row].forEach((ch, i) => { if (ch === 'U') { pieces.push([c0, X[i] - WW / 2 - 1.5]); c0 = X[i] + WW / 2 + 1.5; } });
      pieces.push([c0, end]);
      pieces.forEach(([a, b]) => {
        a = Math.max(a, l); b = Math.min(b, r); if (b - a < 1.5) return;
        x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.fillRect(a, y - WH / 2, b - a, WH); x.restore();
        x.save(); x.globalCompositeOperation = base; x.fillStyle = rgba(RD, 0.22); x.fillRect(a, y - WH / 2, b - a, WH);
        x.strokeStyle = rgba(RD, 0.9); x.lineWidth = 1.9; x.beginPath(); x.moveTo(a, y - WH / 2); x.lineTo(b, y - WH / 2); x.moveTo(a, y + WH / 2); x.lineTo(b, y + WH / 2); x.stroke();
        // twist marks on the yarn
        x.strokeStyle = rgba(RD, 0.4); x.lineWidth = 1; x.beginPath(); for (let q = Math.ceil(a / 9) * 9 + 3; q < b - 6; q += 9) { x.moveTo(q, y + WH / 2 - 3); x.lineTo(q + 6, y - WH / 2 + 3); } x.stroke(); x.restore();
      });
    }
    function paintCloth() {
      const s = cur(), X = xs(s), [xa, xb] = ext(s), fell = rowY(Math.max(0, s.rows.length - 1)) - (s.rows.length ? PITCH / 2 : -PITCH / 2);
      cloth = S.layer(W, H, (x) => {
        // frame: two beams and two posts
        const L = XC - 5 * SP - 40, R = XC + 5 * SP + 40;
        [[L - 18, 30, R - L + 36, 30], [L - 18, 486, R - L + 36, 30]].forEach(([bx, by, bw, bh], k) => { const P = geo.rect(bx, by, bw, bh, 8); Ink.hatchShadow(x, P, 1, 6, 6); Ink.hatchFill(x, P, 1, B, 0.7); Ink.stroke(x, P, { w: 2.6, seed: 31 + k, amp: 0.5 }); });
        [L, R].forEach((px, k) => { pen(x, [[px - 7, 60], [px - 7, 486]], { w: 2.2, seed: 41 + k }); pen(x, [[px + 7, 60], [px + 7, 486]], { w: 2.2, seed: 44 + k }); });
        // warps
        X.forEach((px, i) => {
          x.fillStyle = rgba(B, 0.1); x.fillRect(px - WW / 2, 60, WW, 426);
          if (s.lifted[i] && s.view === 'loom' && !woven(s)) { x.fillStyle = rgba(B, 0.3); x.fillRect(px - WW / 2, 116, WW, Math.max(0, fell - 6 - 116)); }
          pen(x, [[px - WW / 2, 60], [px - WW / 2, 486]], { w: 1.8, seed: 3 + i, amp: 0.4 }); pen(x, [[px + WW / 2, 60], [px + WW / 2, 486]], { w: 1.8, seed: 23 + i, amp: 0.4 });
        });
        // woven rows (bottom row first), each with its turn round the edge warp to the next row
        s.rows.forEach((row, j) => {
          drawRow(x, s, row, rowY(j), xa, xb, 'source-over');
          if (j + 1 < s.rows.length) { const ex = j % 2 === 0 ? xb : xa, o = j % 2 === 0 ? 1 : -1; pen(x, geo.curve([ex, rowY(j)], [ex + o * 20, rowY(j) - 4], [ex + o * 20, rowY(j + 1) + 4], [ex, rowY(j + 1)], 12), { w: 3.2, color: RD, wob: false }); }
          const bad = s.err && j === s.rows.length - 1;
          if (bad) Ink.cross(x, R + 44, rowY(j), 0.9); else Ink.tick(x, R + 30, rowY(j) + 2, 0.8);
        });
        if (s.rows.length) { const tx = xa; pen(x, [[tx, rowY(0)], [tx - 26, rowY(0) + 16]], { w: 3, color: RD, wob: false }); }
        // heddle tabs: filled with an arrow = lifted
        if (s.view === 'loom' && !woven(s)) {
          X.forEach((px, i) => {
            const P = geo.ellipse(px, 92, 19, 19);
            x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(px, 92, 19, 0, 7); x.fill(); x.restore();
            if (s.lifted[i]) { x.fillStyle = rgba(B, 0.88); x.beginPath(); x.arc(px, 92, 19, 0, 7); x.fill(); x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(px, 80); x.lineTo(px + 10, 99); x.lineTo(px - 10, 99); x.closePath(); x.fill(); x.restore(); }
            else { x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(px, 92, 18, 0, 7); x.fill(); }
            Ink.stroke(x, P, { w: 2.2, seed: 60 + i, amp: 0.3, retrace: false });
          });
          text(x, 'tap a warp', 2, 84, { font: 'hand', size: 22 }); text(x, 'to lift it', 2, 112, { font: 'hand', size: 22 });
          text(x, '▲ = lifted', R + 28, 100, { size: 22 });
        }
        text(x, 'warp', X[0] - 4, 24, { size: 22, align: 'right' }); pen(x, [[X[0], 16], [X[0], 34]], { w: 1.6, wob: false, a: 0.6 });
      });
    }
    function paintShuttle() {
      shuttleL = S.layer(120, 50, (x) => {
        x.translate(60, 25);
        const P = [[-52, 0], [-32, -15], [32, -15], [52, 0], [32, 15], [-32, 15], [-52, 0]];
        x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill();
        Ink.hatchFill(x, P, 1, B, 0.8); Ink.stroke(x, P, { w: 2.6, seed: 77, amp: 0.4 });
        const Q = box4(-22, -7, 44, 14); x.fillStyle = '#fff'; x.fillRect(-22, -7, 44, 14); x.fillStyle = rgba(RD, 0.55); x.fillRect(-22, -7, 44, 14);
        Ink.stroke(x, Q, { w: 1.8, seed: 78, amp: 0.3, color: RD, retrace: false });
      });
    }
    function paintFabric(k) {
      const s = st[k], w = s.w, C = 56, R = 34, cs = 9, x0 = 178, y0 = 106;
      const d = w.key === 'twill' && s.rows.length > 1 && mod(phase(s.rows[1], 3) - phase(s.rows[0], 3), 3) === 2 ? -1 : 1;
      fabL[k] = S.layer(W, H, (x) => {
        const P = geo.rect(x0 - 8, y0 - 8, C * cs + 16, R * cs + 16, 6);
        Ink.hatchShadow(x, P, 1, 8, 8); x.fillStyle = 'rgba(255,255,255,.9)'; x.fillRect(x0 - 8, y0 - 8, C * cs + 16, R * cs + 16);
        for (let r = 0; r < R; r++) {
          const y = y0 + r * cs + cs / 2, rr = R - 1 - r; let run = -1;
          for (let c = 0; c <= C; c++) {
            const over = c < C && w.cell(c, rr, d);
            if (over && run < 0) run = c;
            if (!over && run >= 0) { x.strokeStyle = rgba(RD, 0.8); x.lineWidth = 3.4; x.beginPath(); x.moveTo(x0 + run * cs + 1.5, y); x.lineTo(x0 + c * cs - 1.5, y); x.stroke(); run = -1; }
            if (c < C && !over) { x.strokeStyle = rgba(B, 0.95); x.lineWidth = 3.6; x.beginPath(); x.moveTo(x0 + c * cs + cs / 2, y - cs / 2 + 0.5); x.lineTo(x0 + c * cs + cs / 2, y + cs / 2 - 0.5); x.stroke(); }
          }
        }
        Ink.stroke(x, P, { w: 2.6, seed: 91, amp: 0.6 });
        text(x, 'Zoomed out: this is how ' + w.fabric + ' is woven.', W / 2, 46, { font: 'hand', size: 24, align: 'center' });
        text(x, 'red = weft on top', W / 2 - 16, 84, { size: 22, color: RD, align: 'right' }); text(x, 'blue = warp on top', W / 2 + 16, 84, { size: 22 });
      });
    }
    function art() { paintShuttle(); paintCloth(); Object.keys(fabL).forEach((k) => delete fabL[k]); }

    // ---- the shuttle
    const sh = { x: PARK[0], auto: 0, beat: -1, back: false, busy() { return this.auto !== 0 || this.beat >= 0 || this.back || S.dragging(); } };
    const side = () => cur().rows.length % 2; // 0 = shuttle waits on the left
    function resetShuttle() { sh.x = PARK[side()]; sh.auto = 0; sh.beat = -1; sh.back = false; }
    const canWeave = () => { const s = cur(); return s.view === 'loom' && s.rows.length < ROWS && !s.err; };
    function commit() {
      const s = cur(), row = s.lifted.map((v) => (v ? 'U' : 'O')).join('');
      s.rows.push(row); s.err = s.w.check(s.rows, s.rows.length - 1);
      if (s.err) { s.bad++; Book.sfx('error', { gain: 0.35 }); } else Book.sfx('thud', { gain: 0.4 });
      resetShuttle(); save(s);
      if (woven(s)) { Book.sfx('success', { gain: 0.35 }); setTimeout(() => { if (woven(s) && s.view === 'loom') { s.view = 'fabric'; refresh(); } }, 1100); }
      refresh();
    }
    S.drag((p) => {
      const s = cur();
      if (s.view === 'fabric') return s.rub < 1 && p[0] > 150 && p[0] < 710 && p[1] > 80 && p[1] < 420 ? 'rub' : null;
      return canWeave() && !sh.busy() && Math.abs(p[0] - sh.x) < 75 && Math.abs(p[1] - YS) < 50 ? 'shuttle' : null;
    }, {
      move(p, p0, tgt) {
        const s = cur();
        if (tgt === 'rub') {
          s.rubD = (s.rubD || 0) + Math.hypot(p[0] - p0[0], p[1] - p0[1]); rubAt = p;
          const before = s.rub; s.rub = Math.min(1, s.rubD / 2600);
          if (Math.floor(before * 7) !== Math.floor(s.rub * 7)) Book.sfx(s.w.key === 'satin' ? 'pop' : 'stroke', { gain: 0.3, material: 'pen', dur: 0.15 });
          if (s.rub >= 1 && before < 1) { Book.sfx(s.w.key === 'satin' ? 'error' : 'success', { gain: 0.3 }); save(s); refresh(); }
        } else if (tgt === 'shuttle') sh.x = clamp(p[0], PARK[0], PARK[1]);
      },
      end(tap, tgt) {
        if (tgt !== 'shuttle') { rubAt = null; return; }
        const far = PARK[1 - side()];
        if (tap) sh.auto = 1; else if (Math.abs(sh.x - far) < 60) { sh.x = far; sh.beat = 0; } else sh.back = true;
      },
    });
    let rubAt = null;
    S.tap((p) => {
      const s = cur(); if (!editable()) return;
      if (p[1] < 62 || p[1] > 260) return;
      const X = xs(s); let bi = -1, bd = 27; X.forEach((px, i) => { const d = Math.abs(px - p[0]); if (d < bd) { bd = d; bi = i; } });
      if (bi < 0) return; s.lifted[bi] = !s.lifted[bi]; Book.sfx('tick', { gain: 0.5 }); paint();
    });
    const SNAGS = [[250, 160], [520, 200], [360, 260], [610, 310], [290, 350], [470, 380]];
    S.render = (dt, t) => {
      const x = S.ctx, s = cur(); let busy = S.dragging();
      if (s.view === 'fabric') {
        if (!fabL[ci]) paintFabric(ci);
        S.blit(fabL[ci], 0, 0);
        if (s.w.key === 'satin') SNAGS.forEach(([sx, sy], k) => { if (s.rub * 7 >= k + 1) { Ink.stroke(x, geo.curve([sx - 20, sy], [sx - 8, sy - 34], [sx + 10, sy - 30], [sx + 20, sy], 14), { w: 3, color: RD, seed: 5 + k, amp: 0.6 }); pen(x, [[sx - 34, sy + 3], [sx - 20, sy]], { w: 2, color: RD, wob: false }); pen(x, [[sx + 20, sy], [sx + 34, sy + 3]], { w: 2, color: RD, wob: false }); } });
        // rub meter + result
        const mx = 178, my = 440, mw = 504;
        if (s.rub < 1) {
          text(x, '2 · Test: rub the fabric hard with your finger (back and forth).', W / 2, my + 4, { font: 'hand', size: 22, align: 'center' });
          pen(x, box4(mx, my + 22, mw, 22), { w: 2, seed: 8 }); x.fillStyle = rgba(B, 0.45); x.fillRect(mx + 2, my + 24, (mw - 4) * s.rub, 18);
          text(x, 'rubbing…', mx + mw + 14, my + 42, { size: 22 });
          if (rubAt) Ink.stroke(x, geo.ellipse(rubAt[0], rubAt[1], 26, 26), { w: 2, seed: (t * 20) | 0, amp: 1.5, retrace: false });
        } else if (s.w.key === 'satin') Ink.drawBubble(x, SNAGS.length + ' threads snagged!', W / 2, 488, 38, RD, 1, -0.02, 'center');
        else Ink.drawBubble(x, 'no snags', W / 2, 488, 38, GR, 1, -0.02, 'center');
        return busy;
      }
      S.blit(cloth, 0, 0);
      const [xa, xb] = ext(s), sd = side(), dir = sd ? -1 : 1, far = PARK[1 - sd], home = PARK[sd];
      if (sh.auto) { sh.x += dir * 1000 * dt; busy = true; if ((far - sh.x) * dir <= 0) { sh.x = far; sh.auto = 0; sh.beat = 0; } }
      if (sh.back) { sh.x -= dir * 1400 * dt; busy = true; if ((sh.x - home) * dir <= 0) { sh.x = home; sh.back = false; } }
      if (canWeave() || sh.beat >= 0) {
        const row = s.lifted.map((v) => (v ? 'U' : 'O')).join(''), j = s.rows.length;
        if (sh.beat >= 0) {
          sh.beat += dt / 0.35; busy = true;
          const y = YS + (rowY(j) - YS) * ease(clamp(sh.beat));
          drawRow(x, s, row, y, xa, xb, 'multiply');
          // the reed pushing the row down
          pen(x, [[xa - 10, y - WH / 2 - 7], [xb + 10, y - WH / 2 - 7]], { w: 3, a: 0.5, wob: false });
          if (sh.beat >= 1) { commit(); return true; }
        } else {
          const tail = clamp(sh.x - dir * 46, xa, xb), l = sd ? tail : xa, r = sd ? xb : tail;
          if (r - l > 2) drawRow(x, s, row, YS, l, r, 'multiply');
          // the weft running from the cloth up to the shed
          if (j) { const ex = sd ? xb : xa; pen(x, [[ex, rowY(j - 1)], [ex + (sd ? 16 : -16), (rowY(j - 1) + YS) / 2], [ex, YS]], { w: 2.6, color: RD, a: 0.8, seed: 15 }); }
          if (sh.x === home) text(x, sd ? '◂ drag' : 'drag ▸', home, YS + 58, { font: 'hand', size: 22, align: 'center' });
        }
        S.blit(shuttleL, sh.x - 60, YS - 25);
      }
      return busy;
    };

    function paint() { paintCloth(); S.go(); }
    function refresh() {
      const s = cur();
      tabB.forEach((b, k) => { b.textContent = (st[k].ok ? '✓ ' : k + 1 + ' · ') + WEAVES[k].tab; b.classList.toggle('sel', k === ci); b.classList.toggle('right', st[k].ok && k !== ci); });
      rule.innerHTML = `<b>${s.w.tab}:</b> ` + s.w.rule;
      const loom = s.view === 'loom', done = woven(s);
      [bSwap, bStep, bDown].forEach((b) => { b.classList.toggle('tw6-hide', !loom || done); b.disabled = !!s.err; });
      bUn.classList.toggle('tw6-hide', !loom || !s.rows.length);
      bView.classList.toggle('tw6-hide', !done); bView.textContent = loom ? '🔍 zoom out to the fabric' : '↩ back to my weaving';
      msg.className = 'tw6-msg' + (s.err ? ' red' : done ? ' green' : '');
      msg.innerHTML = s.err ? '✗ ' + s.err + ' Press <b>✂ unpick a row</b>, set the warps again and re-weave it.'
        : !loom ? (s.rub < 1 ? 'Your swatch from further away. <b>Rub it</b> to test it.' : 'Rub test done. Now answer below.')
        : done ? '✓ Swatch woven! Zooming out…'
        : s.rows.length ? `✓ Row ${s.rows.length} of ${ROWS} woven and beaten down. Set the warps for the next row.`
        : 'Lift warps (tap them), then <b>drag the shuttle</b> across, or tap it. The weft goes <b>under</b> lifted warps and <b>over</b> the rest.';
      concs.forEach((d, k) => d.classList.toggle('tw6-hide', !(k === ci && woven(st[k]) && st[k].rub >= 1)));
      paint(); onChange();
    }
    S.onFonts = () => { art(); };
    art(); resetShuttle(); refresh();
    return { done: () => st.every((s) => s.ok) };
  }

  // ======================================================================================
  // cut edge v selvedge: rub each edge
  // ======================================================================================
  function frayLab(ui, lab, onDone) {
    const W = 860, H = 350, C = 44, R = 24, cs = 9, x0 = 290, y0 = 104, x1 = x0 + C * cs, K = 4;
    const rec = ui.record('p06.fray', { label: 'Edge demo: rubbed the cut edge and the selvedge', type: 'demo', max: 0 });
    const it = got('p06.fray') || {};
    let fA = it.a ? 1 : 0, fB = it.b ? 1 : 0, dA = 0, dB = 0, shake = 0;
    const S = Stage(lab, W, H);
    let base = null;
    const cell = (c, r) => mod(c + r, 2) === 0;
    function rowsLayer(x, r0, r1) {
      for (let r = r0; r < r1; r++) for (let c = 0; c < C; c++) {
        const cx = x0 + c * cs + cs / 2, cy = y0 + r * cs + cs / 2;
        if (cell(c, r)) { x.strokeStyle = rgba(RD, 0.8); x.lineWidth = 3.2; x.beginPath(); x.moveTo(cx - cs / 2 + 1, cy); x.lineTo(cx + cs / 2 - 1, cy); x.stroke(); }
        else { x.strokeStyle = rgba(B, 0.95); x.lineWidth = 3.4; x.beginPath(); x.moveTo(cx, cy - cs / 2 + 0.5); x.lineTo(cx, cy + cs / 2 - 0.5); x.stroke(); }
      }
    }
    function art() {
      base = S.layer(W, H, (x) => {
        rowsLayer(x, K, R);
        // the weft turning round the edge warps down both sides
        for (let r = 0; r < R - 1; r++) { const y = y0 + r * cs + cs / 2, left = r % 2 === 0; const ex = left ? x0 : x1, o = left ? -1 : 1; if (r >= K) pen(x, geo.curve([ex, y], [ex + o * 7, y + 1], [ex + o * 7, y + cs - 1], [ex, y + cs], 6), { w: 1.8, color: RD, wob: false }); }
        // the roll it came off
        const P = geo.rect(x0 - 26, y0 + R * cs, C * cs + 52, 26, 12); Ink.hatchShadow(x, P, 1, 6, 6); Ink.hatchFill(x, P, 1, B, 0.8); Ink.stroke(x, P, { w: 2.4, seed: 12, amp: 0.5 });
        text(x, '✂', x0 - 62, y0 + 12, { size: 40, color: RD }); pen(x, [[x0 - 24, y0 - 2], [x0 - 6, y0 - 2]], { w: 1.8, color: RD, dash: [5, 5], wob: false });
        text(x, 'edge A', x1 + 40, y0 - 18, { size: 24, color: RD }); text(x, '(cut)', x1 + 40, y0 + 10, { font: 'hand', size: 22, color: RD });
        pen(x, [[x1 + 34, y0 - 22], [x1 + 8, y0 - 4]], { w: 2, color: RD, seed: 4 });
        text(x, 'edge B', x1 + 62, y0 + 120, { size: 24 }); text(x, '(side)', x1 + 62, y0 + 148, { font: 'hand', size: 22 });
        pen(x, [[x1 + 56, y0 + 114], [x1 + 14, y0 + 114]], { w: 2, seed: 5 });
        text(x, 'edge B', x0 - 62, y0 + 120, { size: 24, align: 'right' }); pen(x, [[x0 - 56, y0 + 114], [x0 - 14, y0 + 114]], { w: 2, seed: 6 });
      });
    }
    art(); S.onFonts = art;
    const save = () => rec.set({ answer: [fA >= 1 ? 'rubbed cut edge: it frayed' : '', fB >= 1 ? 'rubbed side edge: it held' : ''].filter(Boolean).join('; '), correct: null, a: fA >= 1, b: fB >= 1 });
    S.drag((p) => (p[1] < y0 + 46 && p[0] > x0 - 40 && p[0] < x1 + 40 ? 'A' : p[1] >= y0 + 46 && p[1] < y0 + R * cs && (Math.abs(p[0] - x0) < 56 || Math.abs(p[0] - x1) < 56) ? 'B' : null), {
      move(p, p0, tgt) {
        const d = Math.hypot(p[0] - p0[0], p[1] - p0[1]);
        if (tgt === 'A' && fA < 1) { dA += d; const b = fA; fA = Math.min(1, dA / 1500); if (Math.floor(b * 6) !== Math.floor(fA * 6)) Book.sfx('stroke', { material: 'pen', dur: 0.15, gain: 0.4 }); if (fA >= 1) { Book.sfx('pop', { gain: 0.4 }); save(); onDone(fA >= 1 && fB >= 1); } }
        if (tgt === 'B') { shake = 0.25; if (fB < 1) { dB += d; fB = Math.min(1, dB / 1100); if (fB >= 1) { Book.sfx('thud', { gain: 0.35 }); save(); onDone(fA >= 1 && fB >= 1); } } }
      },
    });
    S.render = (dt, t) => {
      const x = S.ctx; let busy = S.dragging();
      if (shake > 0) { shake -= dt; busy = true; }
      x.save(); if (shake > 0) x.translate(Math.sin(t * 70) * 1.5, 0);
      S.blit(base, 0, 0);
      const f = fA;
      // the top K rows: woven while f = 0; pulled apart as f grows
      for (let c = 0; c < C; c++) {
        const cx = x0 + c * cs + cs / 2, lean = Math.sin(c * 2.3) * 5 * f;
        x.strokeStyle = rgba(B, 0.95); x.lineWidth = f > 0 ? 2.2 : 3.4;
        if (f > 0) { x.beginPath(); x.moveTo(cx, y0 + K * cs); x.lineTo(cx + lean, y0 - 4 * f - Math.abs(Math.sin(c * 1.7)) * 6 * f); x.stroke(); }
        else for (let r = 0; r < K; r++) if (!cell(c, r)) { const cy = y0 + r * cs + cs / 2; x.beginPath(); x.moveTo(cx, cy - cs / 2 + 0.5); x.lineTo(cx, cy + cs / 2 - 0.5); x.stroke(); }
      }
      for (let r = 0; r < K; r++) {
        const cy = y0 + r * cs + cs / 2;
        x.strokeStyle = rgba(RD, 0.8);
        if (f <= 0) { x.lineWidth = 3.2; x.beginPath(); for (let c = 0; c < C; c++) if (cell(c, r)) { const cx = x0 + c * cs; x.moveTo(cx + 1, cy); x.lineTo(cx + cs - 1, cy); } x.stroke(); }
        else {
          const up = f * (44 - r * 9) * (0.6 + 0.4 * Math.sin(r * 2 + 1)), out = f * (16 + r * 5), tilt = f * (r % 2 ? 10 : -12);
          x.lineWidth = 2.4; x.beginPath();
          for (let q = 0; q <= 40; q++) { const u = q / 40, px = x0 - out + (C * cs + 2 * out) * u, py = cy - up + tilt * (u - 0.5) + Math.sin(u * 19 + r * 2) * 4 * f; q ? x.lineTo(px, py) : x.moveTo(px, py); }
          x.stroke();
        }
      }
      x.restore();
      if (fA < 1 || fB < 1) text(x, fA < 1 ? 'Rub along edge A with your finger…' : 'Now rub along edge B…', W / 2, 30, { font: 'hand', size: 24, align: 'center' });
      if (fA >= 1) Ink.drawBubble(x, 'A: it frays!', 12, 64, 30, RD, 1, -0.03);
      if (fB >= 1) Ink.drawBubble(x, 'B: holds firm', 12, H - 40, 30, GR, 1, 0.02);
      return busy;
    };
    S.go();
    return { done: () => fA >= 1 && fB >= 1, S };
  }

  // ======================================================================================
  // label the fabric: warp, weft, selvedge, bias
  // ======================================================================================
  function labelLab(ui, act, onState) {
    const W = 860, H = 420, WORDS = ['warp', 'weft', 'selvedge', 'bias'];
    const MK = [
      { k: 'A', ans: 'weft', at: [430, 128], word: [464, 137, 'left'] },
      { k: 'B', ans: 'selvedge', at: [706, 250], word: [706, 304, 'center'] },
      { k: 'C', ans: 'bias', at: [286, 232], word: [286, 286, 'center'] },
      { k: 'D', ans: 'warp', at: [560, 296], word: [560, 350, 'center'] },
    ];
    const rec = ui.record('p06.label', { label: 'Label the fabric: warp, weft, selvedge, bias', type: 'label', max: 4 });
    const it = got('p06.label') || {};
    const pick = Object.assign({}, it.pick || {}); let sel = 0, marks = it.marks || null, tries = it.tries || 0;
    const fin = () => (got('p06.label') || {}).correct === true || tries >= 3;
    const S = Stage(act, W, H);
    let base = null;
    function art() {
      base = S.layer(W, H, (x) => {
        const fx = 240, fw = 380, fy = 66, fh = 318;
        // cloth with faint threads, cut bottom edge, firm side edges
        x.fillStyle = 'rgba(255,255,255,.85)'; x.fillRect(fx, fy, fw, fh);
        x.strokeStyle = rgba(B, 0.2); x.lineWidth = 1; x.beginPath();
        for (let q = fx + 16; q < fx + fw - 8; q += 12) { x.moveTo(q, fy); x.lineTo(q, fy + fh); } for (let q = fy + 12; q < fy + fh; q += 12) { x.moveTo(fx + 8, q); x.lineTo(fx + fw - 8, q); } x.stroke();
        [fx, fx + fw].forEach((px, k) => { Ink.stroke(x, [[px, fy], [px, fy + fh]], { w: 2.8, seed: 20 + k, amp: 0.4 }); const o = k ? -8 : 8; pen(x, [[px + o, fy], [px + o, fy + fh]], { w: 1.4, seed: 24 + k, amp: 0.3 }); x.strokeStyle = rgba(B, 0.6); x.lineWidth = 1.2; x.beginPath(); for (let q = fy + 6; q < fy + fh; q += 5) { x.moveTo(px, q); x.lineTo(px + o, q); } x.stroke(); });
        const zig = []; for (let q = 0; q <= 38; q++) zig.push([fx + q * 10, fy + fh + (q % 2 ? 7 : 0)]); pen(x, zig, { w: 2, wob: false });
        for (let q = 1; q < 38; q += 2) pen(x, [[fx + q * 10, fy + fh + 7], [fx + q * 10 + (q % 3) - 1, fy + fh + 18]], { w: 1.2, wob: false, a: 0.7 });
        // the roll (bolt) the fabric comes off
        const P = geo.rect(196, 26, 468, 46, 22); Ink.hatchShadow(x, P, 1, 7, 7); x.fillStyle = '#fff'; x.fillRect(200, 28, 460, 42); Ink.hatchFill(x, P, 1, B, 0.7); Ink.stroke(x, P, { w: 2.8, seed: 30, amp: 0.5 });
        Ink.stroke(x, geo.ellipse(652, 49, 10, 22), { w: 2, seed: 31, amp: 0.3, retrace: false });
        text(x, 'fabric coming off the roll', 20, 40, { font: 'hand', size: 22 }); pen(x, [[150, 50], [192, 54]], { w: 1.8, seed: 3 });
        // A: across
        const arrow = (p, q, o = {}) => { Ink.stroke(x, [p, q], Object.assign({ w: 3, color: RD, amp: 0.5 }, o)); pen(x, geo.head([q, p]), { w: 2.6, color: RD, wob: false }); pen(x, geo.head([p, q]), { w: 2.6, color: RD, wob: false }); };
        arrow([292, 196], [568, 196], { seed: 40 }); pen(x, [[430, 152], [430, 190]], { w: 1.6, color: RD, dash: [4, 5], wob: false });
        // B: the side edge
        pen(x, [[632, 180], [640, 180], [640, 330], [632, 330]], { w: 2.8, color: RD, wob: false }); pen(x, [[640, 252], [682, 250]], { w: 1.8, color: RD, seed: 7 });
        // C: at 45 degrees
        x.save(); x.setLineDash([9, 7]); x.strokeStyle = rgba(RD, 0.9); x.lineWidth = 3; x.beginPath(); x.moveTo(306, 380); x.lineTo(420, 266); x.stroke(); x.restore();
        pen(x, geo.head([[306, 380], [420, 266]]), { w: 2.6, color: RD, wob: false }); pen(x, geo.head([[420, 266], [306, 380]]), { w: 2.6, color: RD, wob: false });
        text(x, '45°', 352, 372, { size: 22, color: RD }); pen(x, [[304, 252], [352, 328]], { w: 1.6, color: RD, dash: [4, 5], wob: false });
        // D: lengthways
        arrow([500, 232], [500, 376], { seed: 43 }); pen(x, [[536, 300], [506, 304]], { w: 1.6, color: RD, dash: [4, 5], wob: false });
      });
    }
    art(); S.onFonts = art;
    S.render = () => {
      const x = S.ctx; S.blit(base, 0, 0);
      MK.forEach((m, i) => {
        const [cx, cy] = m.at;
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = i === sel && !fin() ? '#fff3b0' : '#fff'; x.beginPath(); x.arc(cx, cy, 24, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(cx, cy, 24, 24), { w: i === sel && !fin() ? 3.6 : 2.4, color: i === sel && !fin() ? RD : B, seed: 50 + i, amp: 0.4, retrace: false });
        text(x, m.k, cx, cy + 9, { size: 28, align: 'center' });
        const w = pick[m.k];
        if (w) {
          const [wx, wy, al] = m.word; x.save(); x.font = LABF(24); const tw = x.measureText(w).width, lx = al === 'left' ? wx : wx - tw / 2;
          x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(255,255,255,.92)'; x.fillRect(lx - 6, wy - 24, tw + 12, 32); x.restore();
          const good = marks && marks[m.k];
          text(x, w, wx, wy, { size: 24, align: al, color: marks ? (good ? GR : RD) : B });
          if (marks) (good ? Ink.tick : Ink.cross)(x, lx + tw + (good ? 10 : 24), wy - 8, 0.7);
        }
      });
      return false;
    };
    S.tap((p) => { if (fin()) return; let bi = -1, bd = 46; MK.forEach((m, i) => { const d = Math.hypot(m.at[0] - p[0], m.at[1] - p[1]); if (d < bd) { bd = d; bi = i; } }); if (bi >= 0) { sel = bi; Book.sfx('tick', { gain: 0.5 }); draw(); } });
    const lead = ui.el('div', 'tw6-task', '', act);
    const row = ui.el('div', 'tw6-row', null, act);
    const chips = WORDS.map((w) => { const b = ui.el('button', 'opt tiny', w, row); b.type = 'button'; b.onclick = () => {
      if (fin()) return; const m = MK[sel]; Object.keys(pick).forEach((k) => { if (pick[k] === w) delete pick[k]; }); pick[m.k] = w; marks = null; Book.scribble(0.12);
      const nx = MK.findIndex((q) => !pick[q.k]); if (nx >= 0) sel = nx; draw(); }; return b; });
    const btn = ui.el('button', 'btn', 'Check', act); btn.type = 'button';
    const fb = ui.el('div', 'fb', '', act);
    btn.onclick = () => {
      if (fin()) return;
      if (MK.some((m) => !pick[m.k])) { fb.className = 'fb on bad'; fb.innerHTML = 'Label all four letters first.'; return; }
      marks = {}; let score = 0; const mis = new Set();
      MK.forEach((m) => { const ok = pick[m.k] === m.ans; marks[m.k] = ok; if (ok) score++; else { if (m.ans === 'selvedge' || pick[m.k] === 'selvedge') mis.add('selvedge'); if ((m.ans === 'warp' || m.ans === 'weft') && (pick[m.k] === 'warp' || pick[m.k] === 'weft')) mis.add('warp-weft'); } });
      tries++; const ok = score === 4; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
      rec.set({ answer: MK.map((m) => m.k + '=' + pick[m.k]).join(', '), correct: ok, score, max: 4, mis: [...mis].join(','), pick: Object.assign({}, pick), marks, tries });
      draw();
    };
    function draw() {
      const done = fin(), okAll = (got('p06.label') || {}).correct === true;
      lead.innerHTML = done ? '' : `Letter <b>${MK[sel].k}</b> is selected. Tap the word that names it (or tap another letter first).`;
      chips.forEach((b) => { b.disabled = done; b.classList.toggle('sel', !done && pick[MK[sel].k] === b.textContent); });
      btn.classList.toggle('tw6-hide', done);
      if (marks) {
        const n = MK.filter((m) => marks[m.k]).length;
        fb.className = 'fb on ' + (okAll ? 'good' : 'bad');
        fb.innerHTML = okAll ? '✓ All four right. The <b>warp</b> runs lengthways, the <b>weft</b> runs across, the <b>selvedge</b> is the firm side edge and the <b>bias</b> is at 45°.'
          : done ? `✗ ${n}/4. The answers: A = weft (across), B = selvedge (the firm side edge), C = bias (at 45°), D = warp (lengthways, along the roll).`
          : `${n}/4 right. Change the red ones and check again.`;
      }
      onState(done); S.go();
    }
    draw();
    return { started: () => Object.keys(pick).length > 0 || tries > 0, done: fin };
  }

  // ======================================================================================
  Book.page({
    id: 'p06', title: 'The weaving loom',
    build(ui, root) {
      css();
      ui.h('The weaving loom');
      const intro = ui.p('A <b>woven</b> fabric is made on a <b>loom</b> by <b>interlacing</b> two sets of yarns at right angles. The <span class="key">warp</span> yarns are held <b>lengthways</b> on the loom. The <span class="key">weft</span> yarn is carried <b>across</b> from side to side, over and under the warp.');
      ui.p('Weave three swatches. Each one has a different rule. <span class="small">(6 rows each: the buttons under the loom save you tapping.)</span>');

      const lab = ui.el('div', 'tw6-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
      ui.el('div', 'tw6-step', '1 · Weave it', lab);
      loomLab(ui, lab, () => {});

      ui.el('h2', '', 'Cut edge or selvedge?');
      ui.p('This piece was cut off the roll with scissors. Test its edges.');
      const fl = ui.el('div', 'tw6-lab'); requestAnimationFrame(() => Ink.frame(fl, { shadow: false, w: 2.2 }));
      const notes = ui.box('<b>Warp</b> yarns run <b>lengthways</b> (along the fabric). <b>Weft</b> yarns run <b>across</b>, from side to side.<br>The <span class="key">selvedge</span> is the firm, self-finished edge down <b>both sides</b>, parallel to the warp. It <b>does not fray</b>, because the weft turns back round the edge.<br>Woven fabrics <b>fray at cut edges</b> and have little stretch, except on the <span class="key">bias</span> (at 45° to the warp and weft).', { tag: 'Notes' });
      const fray = frayLab(ui, fl, (both) => notes.classList.toggle('tw6-hide', !both));
      notes.classList.toggle('tw6-hide', !fray.done());

      ui.el('h2', '', 'Label the fabric');
      ui.p('Tap a letter on the drawing, then tap its name. <span class="small">Everything above will blur while you do this.</span>');
      const act = ui.el('div', 'act'); act.dataset.id = 'p06.label'; requestAnimationFrame(() => Ink.frame(act, { shadow: false, w: 2.2 }));
      const hide = [intro, lab, fl, notes]; let touched = false;
      const lock = (done) => hide.forEach((e) => e.classList.toggle('peek-lock', touched && !done));
      const ll = labelLab(ui, act, (done) => lock(done));
      act.addEventListener('pointerdown', () => { if (!touched && !ll.done()) { touched = true; lock(false); } }, { passive: true });

      ui.el('h2', '', 'Which weave for which fabric?');
      ui.p('<span class="small">Your looms and notes will blur while you match.</span>');
      const m = ui.match({ id: 'p06.uses', label: 'Match each weave to its fabrics', q: 'Tap a weave, then tap the fabrics made with it.',
        pairs: [['Plain weave', 'calico, cotton shirting and poplin', 'weave-type'], ['Twill weave', 'denim, gabardine and chino', 'weave-type'], ['Satin weave', 'evening wear, linings and ribbons', 'weave-type']] });
      ui.hideWhile(m, 'p06.uses', [lab, notes]);
    },
  });
})();
