// NEA kit: landscape A3 "folder sheets" for the exercise-book engine.
// Each book page is one A3-landscape sheet that fits the screen (pinch / ⌘-scroll / buttons to zoom).
// A slim guidance strip runs down the left; the rest holds text boxes, photo frames and sketch frames.
// Students can rearrange and resize everything, add extra text / photos / sketches, draw with Apple Pencil,
// and export the whole folder as an A3-landscape PDF.
// Needs: book-kit (book.js, ink.js), nea-kit/core.js, the book's rubric.js, and BOOK_CONFIG.backend for photo upload.
(function () {
  'use strict';
  const W = 1600, H = 1131, GX = 336, GY = 112, GW = W - GX - 28, GH = H - GY - 30, COLS = 12, ROWS = 9, GAP = 16;
  const C = window.BOOK_CONFIG || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mk = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const gridBox = (at) => { const cw = GW / COLS, rh = GH / ROWS; return [Math.round(GX + at[0] * cw + GAP / 2), Math.round(GY + at[1] * rh + GAP / 2), Math.round(at[2] * cw - GAP), Math.round(at[3] * rh - GAP)]; };
  const S = (window.Sheets = { W, H, pinching: false, penSeen: localStorage.getItem('nea.pen') === '1', list: [] });

  // ---------------- storage: IndexedDB for photos and sketch strokes ----------------
  let dbp = null;
  const db = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open('nea-photos', 1); r.onupgradeneeded = () => r.result.createObjectStore('p'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const idb = async (mode, fn) => { const d = await db(); return new Promise((res, rej) => { const t = d.transaction('p', mode), q = fn(t.objectStore('p')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  const put = (k, v) => idb('readwrite', (s) => s.put(v, C.lesson + '|' + k)).catch(() => {});
  const get = (k) => idb('readonly', (s) => s.get(C.lesson + '|' + k)).catch(() => null);
  const del = (k) => idb('readwrite', (s) => s.delete(C.lesson + '|' + k)).catch(() => {});
  const student = () => (Book.state || {}).student;
  const post = async (body) => { const r = await fetch(C.backend, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'text/plain;charset=utf-8' } }); return r.json(); };
  const remote = async (id, size) => { if (!id || !student() || !C.backend) return null; try { const j = await (await fetch(C.backend + '?a=img' + (size ? '&size=' + size : '') + '&id=' + encodeURIComponent(id) + '&email=' + encodeURIComponent(student().email))).json(); return j.ok ? j.data : null; } catch (e) { return null; } };
  const upload = async (data, box, cap) => { const s = student(); if (!s || !C.backend) throw new Error('offline'); const j = await post({ a: 'img', lesson: C.lesson, student: s, box, cap, at: Date.now(), data }); if (!j.ok) throw new Error(j.error); return j.id; };
  const drop = (id) => { if (id && student() && C.backend) post({ a: 'imgdel', id, student: student() }).catch(() => {}); };
  let lastPush = 0, pushT = null;
  const pushSoon = () => { clearTimeout(pushT); pushT = setTimeout(() => { lastPush = Date.now(); Book.saveNow && Book.saveNow(); }, Math.max(4000, 60000 - (Date.now() - lastPush))); };
  async function shrink(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', 0.82);
    } finally { URL.revokeObjectURL(url); }
  }
  function lightbox(src, cap) { const d = mk('div', 'lightbox', `<img src="${src}" alt=""><p>${esc(cap || '')}</p>`, document.body); d.onclick = () => d.remove(); }
  const pickFiles = (multiple) => new Promise((res) => { const i = mk('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = !!multiple; i.onchange = () => res([...i.files]); i.click(); });

  // ---------------- the board (paper + guidance strip + title) ----------------
  function boardEl(sec, sheet, n, total) {
    const b = mk('div', 'board');
    const g = sheet.guide || {};
    const strip = mk('div', 'strip', '', b);
    strip.innerHTML = `<div class="s-sec">${esc(sec.col || sec.key)}${sec.marks ? ` · ${sec.marks} marks` : ''}</div><div class="s-title">${esc(sec.title)}</div>
      ${g.what ? `<div class="s-h">This sheet</div><p>${g.what}</p>` : ''}${g.why ? `<div class="s-h">Why it matters</div><p>${g.why}</p>` : ''}
      ${g.look && g.look.length ? `<div class="s-h">${esc(NEA.board === 'Edexcel' ? 'Assessors look for' : 'The moderator looks for')}</div><ul>${g.look.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
      ${(g.tips || []).map((x) => `<p class="s-tip">${x}</p>`).join('')}`;
    mk('div', 'b-title', `<span class="b-chip">${esc(sec.col || sec.key)}</span>${esc(sheet.title)}`, b);
    mk('div', 'b-num', `${esc(C.short || C.title)} · sheet ${n} of ${total}`, b);
    return b;
  }
  const place = (el, r) => { el.style.left = r[0] + 'px'; el.style.top = r[1] + 'px'; el.style.width = r[2] + 'px'; el.style.height = r[3] + 'px'; el._r = r.slice(); };

  // ---------------- widgets ----------------
  // text box scored against a rubric field
  function textBox(ui, f) {
    const r = ui.record('nea.' + f.id, { label: f.label, type: 'nea', max: f.max || 0 });
    const d = mk('div', 'it it-text');
    const code = f.label.split(' ')[0], name = f.label.split(' ').slice(1).join(' ');
    d.innerHTML = `<div class="ih"><b>${esc(code)}</b><span>${esc(name)}</span></div><div class="iq">${esc(f.q)}</div>`;
    const ta = mk('textarea', 'ta', null, d); ta.placeholder = f.hint || 'Write here…';
    const wc = mk('div', 'wc', '', d);
    const prev = r.get(); if (prev && prev.answer) ta.value = prev.answer;
    const paint = (saved) => { const w = NEA.words(ta.value), n = NEA.lines(ta.value); wc.innerHTML = `<span class="${w >= f.words ? 'ok' : ''}">${w} / ~${f.words} words</span>${f.list ? `<span class="${n >= f.list ? 'ok' : ''}">${n} of ${f.list}+ points</span>` : ''}${saved ? '<span class="sv">saved ✓</span>' : ''}`; };
    let t = null;
    const commit = () => { clearTimeout(t); const v = ta.value.trim(), it = r.get(); if ((it ? it.answer || '' : '') === v) return; const s = NEA.score(f, v); r.set({ answer: v, correct: null, score: s.score, max: s.max, mis: s.flags.join(',') }); paint(true); pushSoon(); };
    ta.addEventListener('input', () => { paint(); clearTimeout(t); t = setTimeout(commit, 2500); });
    ta.addEventListener('blur', commit);
    paint();
    return d;
  }

  // photo frame: one or more photos (shown as a mosaic), each with its own caption.
  // value = { list: [{ k, id, cap, at }], gone: [k…] }  (older single-photo values { k, id, cap, at } still read fine)
  const plist = (v) => { if (!v) return { list: [], gone: [] }; if (v.list) return { list: v.list.slice(), gone: (v.gone || []).slice() }; return v.k ? { list: [v], gone: [] } : { list: [], gone: [] }; };
  S.plist = plist;
  function photoFrame(label, io) {
    const d = mk('div', 'it it-photo');
    d.innerHTML = `<div class="ih"><span>${esc(label)}</span><i class="tools"></i></div><div class="pf"></div>`;
    const pf = d.querySelector('.pf'), tools = d.querySelector('.tools'), status = {};
    const val = () => plist(io.get());
    const store = (v) => io.set(v.list.length || v.gone.length ? { list: v.list, gone: v.gone.slice(-60) } : null);
    const paint = () => {
      const v = val(), n = v.list.length;
      tools.innerHTML = n ? '<button data-a="add" title="Add another photo">＋</button>' : '';
      if (!n) { pf.className = 'pf'; pf.innerHTML = `<button class="addph">📷 Add photo</button><span class="ph-or">or paste / drop a picture here</span>`; return; }
      const cols = n === 1 ? 1 : n <= 4 ? 2 : 3;
      pf.className = 'pf mosaic'; pf.style.setProperty('--cols', cols);
      pf.innerHTML = '';
      v.list.forEach((q) => {
        const st = status[q.k] || (q.id ? 'ok' : 'wait');
        const t = mk('div', 'tile', `<div class="ti"><img alt=""><span class="st ${st}">${{ ok: '✓', up: 'uploading…', wait: 'not uploaded yet' }[st]}</span><button class="tdel" title="Remove this photo">✕</button></div><input class="cap" placeholder="Caption: what does this show?">`, pf);
        const cap = t.querySelector('.cap'); cap.value = q.cap || '';
        cap.addEventListener('change', () => { const v2 = val(), x = v2.list.find((y) => y.k === q.k); if (x) { x.cap = cap.value.trim(); store(v2); } });
        const img = t.querySelector('img');
        (async () => { let src = await get('img:' + q.k); if (!src) src = await remote(q.id, 'thumb'); if (src) img.src = src; })();
        img.onclick = async () => { const big = (await get('img:' + q.k)) || (await remote(q.id)) || img.src; if (big) lightbox(big, q.cap); };
        const x = t.querySelector('.tdel');
        x.onclick = () => {
          if (!x.classList.contains('sure')) { x.classList.add('sure'); x.textContent = 'Delete?'; setTimeout(() => { x.classList.remove('sure'); x.textContent = '✕'; }, 3000); return; }
          const v2 = val(); v2.list = v2.list.filter((y) => y.k !== q.k); v2.gone.push(q.k); store(v2); del('img:' + q.k); drop(q.id); paint();
        };
      });
    };
    const send = async (k) => {
      const data = await get('img:' + k); if (!data) return;
      status[k] = 'up'; paint();
      try { const id = await upload(data, label, ''); const v = val(), x = v.list.find((y) => y.k === k); if (x) { x.id = id; store(v); } status[k] = 'ok'; }
      catch (e) { status[k] = 'wait'; }
      paint();
    };
    const add = async (files) => {
      if (!student()) return Book.toast('Sign in on the cover first');
      for (const file of files) {
        if (!/^image\//.test(file.type)) continue;
        let data; try { data = await shrink(file); } catch (e) { Book.toast('Could not read that picture'); continue; }
        const q = { k: uid(), id: '', cap: '', at: Date.now() };
        await put('img:' + q.k, data); const v = val(); v.list.push(q); store(v); paint(); send(q.k);
      }
    };
    d.addEventListener('click', async (e) => {
      const a = e.target.closest('button'); if (!a) return;
      if (a.classList.contains('addph') || a.dataset.a === 'add') { const fs = await pickFiles(true); if (fs.length) add(fs); }
    });
    d._accept = (files) => { const fs = files.filter((x) => /^image\//.test(x.type)); if (fs.length) add(fs); return !!fs.length; };
    d._repaint = paint;
    paint();
    const retry = () => val().list.filter((q) => !q.id).forEach((q) => send(q.k)); // uploads that did not finish
    retry(); addEventListener('online', retry);
    return d;
  }
  // merging copies of one answer saved on two devices: photo frames and sheet extras keep everything from both
  const parse = (s) => { try { return JSON.parse(s || 'null'); } catch (e) { return null; } };
  const unionBy = (a, b, gone) => { const m = new Map(); a.concat(b).forEach((x) => { if (!x || gone.has(x.k)) return; const o = m.get(x.k); m.set(x.k, o ? Object.assign({}, o, x, { id: o.id || x.id, cap: x.cap || o.cap }) : x); }); return [...m.values()].sort((p, q) => (p.at || 0) - (q.at || 0)); };
  Book.mergeItem = (id, la, ra) => {
    if (/^ph\./.test(id)) {
      const L = plist(parse(la)), R = plist(parse(ra)), gone = new Set(L.gone.concat(R.gone));
      const out = { list: unionBy(L.list, R.list, gone), gone: [...gone] };
      return out.list.length || out.gone.length ? JSON.stringify(out) : '';
    }
    if (/^sheet\./.test(id)) {
      const L = parse(la) || {}, R = parse(ra) || {}, gone = new Set((L.gone || []).concat(R.gone || []));
      return JSON.stringify({ lay: Object.assign({}, R.lay || {}, L.lay || {}), extra: unionBy(L.extra || [], R.extra || [], gone), gone: [...gone].slice(-60) });
    }
    return null;
  };

  // sketch frame (Apple Pencil, mouse, or finger once the frame is tapped). value = { k, id, at, n }
  const INKS = { graphite: '#2c2c30', red: '#b0402a', blue: '#24539c', green: '#2f6a43' };
  function sketchFrame(label, io) {
    const d = mk('div', 'it it-sketch');
    d.innerHTML = `<div class="ih"><span>${esc(label)}</span><i class="tools">${Object.keys(INKS).map((c, i) => `<button data-c="${c}" class="ink ${i ? '' : 'on'}" style="--c:${INKS[c]}" title="${c}"></button>`).join('')}<button data-a="er" title="Eraser">⌫</button><button data-a="undo" title="Undo">↶</button><button data-a="clr" title="Clear">🗑</button></i></div>`;
    const cv = mk('canvas', 'skc', null, d), x = cv.getContext('2d');
    let strokes = [], bg = null, cur = null, ink = INKS.graphite, eraser = false, dirty = false, upT = null, bgSrc = null;
    const k = () => { let v = io.get(); if (!v) { v = { k: uid(), id: '', at: Date.now(), n: 0 }; io.set(v); } return v.k; };
    const size = () => { const w = Math.max(50, d._r ? d._r[2] - 4 : 400), h = Math.max(40, (d._r ? d._r[3] : 300) - 38); cv.width = w * 2; cv.height = h * 2; redraw(); };
    function line(s) {
      if (!s.p.length) return;
      x.globalCompositeOperation = s.e ? 'destination-out' : 'source-over'; x.strokeStyle = s.c; x.lineCap = 'round'; x.lineJoin = 'round';
      for (let i = 1; i < s.p.length; i++) { const a = s.p[i - 1], b = s.p[i]; x.lineWidth = (s.e ? 18 : s.w) * (0.35 + (b[2] || 0.5)) * 2; x.beginPath(); x.moveTo(a[0] * cv.width, a[1] * cv.height); x.lineTo(b[0] * cv.width, b[1] * cv.height); x.stroke(); }
      if (s.p.length === 1) { const a = s.p[0]; x.fillStyle = s.c; x.beginPath(); x.arc(a[0] * cv.width, a[1] * cv.height, s.w, 0, 7); x.fill(); }
      x.globalCompositeOperation = 'source-over';
    }
    function redraw() { x.clearRect(0, 0, cv.width, cv.height); if (bg) x.drawImage(bg, 0, 0, cv.width, cv.height); strokes.forEach(line); }
    const save = () => {
      const v = io.get() || { k: k() }; put('sk:' + v.k, { strokes, bg: bgSrc }); dirty = true;
      io.set(Object.assign({}, v, { at: Date.now(), n: strokes.length })); clearTimeout(upT); upT = setTimeout(sendPng, 15000);
    };
    async function sendPng() {
      if (!dirty) return; const v = io.get(); if (!v) return; dirty = false;
      const data = cv.toDataURL('image/png'); const old = v.id;
      try { const id = await upload(data, label, ''); io.set(Object.assign({}, io.get(), { id })); if (old) drop(old); } catch (e) { dirty = true; }
    }
    d._flush = sendPng;
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, e.pressure && e.pointerType === 'pen' ? e.pressure : 0.5]; };
    cv.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'pen') { S.penSeen = true; localStorage.setItem('nea.pen', '1'); }
      const armed = d.classList.contains('on'); document.querySelectorAll('.it-sketch.on').forEach((o) => o !== d && o.classList.remove('on')); d.classList.add('on');
      if (S.pinching || S.arranging) return;
      if (e.pointerType === 'touch' && (S.penSeen || !armed)) return; // finger pans/zooms if a Pencil is in use; otherwise first tap arms the frame
      e.stopPropagation(); cv.setPointerCapture(e.pointerId);
      cur = { c: ink, w: eraser ? 9 : 2.4, e: eraser, p: [pt(e)] }; strokes.push(cur); line(cur);
    });
    cv.addEventListener('pointermove', (e) => { if (!cur) return; if (S.pinching) { strokes.pop(); cur = null; redraw(); return; } (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach((ev) => cur.p.push(pt(ev))); redraw(); });
    const end = () => { if (!cur) return; cur = null; save(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    d.cancelStroke = () => { if (cur) { strokes.pop(); cur = null; redraw(); } };
    d.querySelector('.tools').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.c) { ink = INKS[b.dataset.c]; eraser = false; d.querySelectorAll('.tools button').forEach((o) => o.classList.toggle('on', o === b)); }
      if (b.dataset.a === 'er') { eraser = !eraser; b.classList.toggle('on', eraser); }
      if (b.dataset.a === 'undo' && strokes.length) { strokes.pop(); redraw(); save(); }
      if (b.dataset.a === 'clr') { if (!b.classList.contains('sure')) { b.classList.add('sure'); setTimeout(() => b.classList.remove('sure'), 2500); return; } strokes = []; bg = null; bgSrc = null; redraw(); save(); }
    });
    (async () => { // load strokes (this device) or the uploaded picture (another device)
      const v = io.get(); if (!v) return size();
      const loc = await get('sk:' + v.k);
      if (loc) { strokes = loc.strokes || []; bgSrc = loc.bg || null; } else if (v.id) bgSrc = await remote(v.id);
      if (bgSrc) { bg = new Image(); bg.onload = redraw; bg.src = bgSrc; }
      size();
    })();
    d._resize = size;
    return d;
  }

  function freeText(x, save) {
    const d = mk('div', 'it it-free');
    d.innerHTML = `<div class="ih"><span>Note</span></div>`;
    const ta = mk('textarea', 'ta', null, d); ta.value = x.text || ''; ta.placeholder = 'Add notes, annotations, a table…';
    let t = null; ta.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { x.text = ta.value.slice(0, 2000); save(); }, 1500); });
    ta.addEventListener('blur', () => { x.text = ta.value.slice(0, 2000); save(); });
    return d;
  }

  function scaleRow(ui, it) {
    const r = ui.record(it.id, { label: it.label, type: 'rate', max: 0 });
    const d = mk('div', 'it it-scale', `<div class="iq">${it.q}</div><div class="opts"></div>`);
    const o = d.querySelector('.opts'), v = (r.get() || {}).answer;
    it.opts.forEach((t) => { const b = mk('button', 'opt' + (v === t ? ' sel' : ''), esc(t), o); b.onclick = () => { r.set({ answer: t, correct: null }); o.querySelectorAll('button').forEach((q) => q.classList.toggle('sel', q === b)); }; });
    return d;
  }

  // ---------------- pan & zoom ----------------
  function zoomable(stage, board, page) {
    const z = { s: 1, tx: 0, ty: 0, fit: 1 };
    const apply = () => { board.style.transform = `translate(${z.tx}px,${z.ty}px) scale(${z.s})`; stage.toggleAttribute('data-noswipe', z.s > z.fit * 1.02 || S.pinching); stage.classList.toggle('zoomed', z.s > z.fit * 1.02); };
    const clamp = () => {
      const sw = stage.clientWidth, sh = stage.clientHeight, bw = W * z.s, bh = H * z.s;
      z.tx = bw <= sw ? (sw - bw) / 2 : Math.min(0, Math.max(sw - bw, z.tx));
      z.ty = bh <= sh ? (sh - bh) / 2 : Math.min(0, Math.max(sh - bh, z.ty));
    };
    z.fitNow = () => { const sw = stage.clientWidth, sh = stage.clientHeight; if (!sw) return; z.fit = Math.min(sw / W, sh / H); z.s = z.fit; clamp(); apply(); };
    z.zoomAt = (ns, cx, cy) => { ns = Math.max(z.fit, Math.min(z.fit * 5, ns)); const px = (cx - z.tx) / z.s, py = (cy - z.ty) / z.s; z.s = ns; z.tx = cx - px * ns; z.ty = cy - py * ns; clamp(); apply(); };
    z.step = (f) => z.zoomAt(z.s * f, stage.clientWidth / 2, stage.clientHeight / 2);
    new ResizeObserver(() => { const was = z.s <= z.fit * 1.02; const old = z.fit; z.fitNow(); if (!was) { z.s = Math.max(z.fit, z.s * (z.fit / old)); clamp(); apply(); } }).observe(stage);
    const pts = new Map(); let pinch = null, pan = null, lastTap = 0;
    const rel = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const free = (e) => !e.target.closest('.it, .sheet-tools, button, input, textarea, select');
    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pts.set(e.pointerId, rel(e));
      if (pts.size === 2 && e.pointerType !== 'mouse') {
        const [a, b] = [...pts.values()]; S.pinching = true; document.querySelectorAll('.it-sketch').forEach((s) => s.cancelStroke && s.cancelStroke());
        pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: z.s, m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], tx: z.tx, ty: z.ty }; pan = null; apply();
      } else if (pts.size === 1 && free(e)) {
        const now = Date.now();
        if (now - lastTap < 320) { const [cx, cy] = rel(e); z.s > z.fit * 1.05 ? z.fitNow() : z.zoomAt(z.fit * 2.2, cx, cy); lastTap = 0; return; }
        lastTap = now;
        if (z.s > z.fit * 1.02) { pan = { p: rel(e), tx: z.tx, ty: z.ty }; stage.setPointerCapture(e.pointerId); }
      }
    }, true);
    stage.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, rel(e));
      if (pinch && pts.size >= 2) {
        const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        const ns = Math.max(z.fit, Math.min(z.fit * 5, pinch.s * d / pinch.d)), px = (pinch.m[0] - pinch.tx) / pinch.s, py = (pinch.m[1] - pinch.ty) / pinch.s;
        z.s = ns; z.tx = m[0] - px * ns; z.ty = m[1] - py * ns; clamp(); apply(); e.preventDefault();
      } else if (pan) { const p = rel(e); z.tx = pan.tx + p[0] - pan.p[0]; z.ty = pan.ty + p[1] - pan.p[1]; clamp(); apply(); }
    }, true);
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2 && pinch) { pinch = null; setTimeout(() => { S.pinching = false; apply(); }, 350); } if (!pts.size) pan = null; };
    stage.addEventListener('pointerup', up, true); stage.addEventListener('pointercancel', up, true);
    stage.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); const [cx, cy] = rel(e); z.zoomAt(z.s * Math.exp(-e.deltaY / 300), cx, cy); }
      else if (z.s > z.fit * 1.02 && !e.target.closest('textarea')) { e.preventDefault(); z.tx -= e.deltaX; z.ty -= e.deltaY; clamp(); apply(); }
    }, { passive: false });
    // Safari's own pinch gesture events: stop the browser zooming the whole page
    ['gesturestart', 'gesturechange'].forEach((t) => stage.addEventListener(t, (e) => e.preventDefault()));
    return z;
  }

  // ---------------- arrange mode: move / resize anything on the sheet ----------------
  function arrangeable(board, getZ, onDone) {
    board.addEventListener('pointerdown', (e) => {
      if (!S.arranging) return;
      const h = e.target.closest('.grab, .rs'); if (!h) return;
      const it = h.closest('.it'); if (!it) return;
      e.preventDefault(); e.stopPropagation(); h.setPointerCapture(e.pointerId);
      const r0 = it._r.slice(), p0 = [e.clientX, e.clientY], resize = h.classList.contains('rs');
      const move = (ev) => {
        const s = getZ().s, dx = (ev.clientX - p0[0]) / s, dy = (ev.clientY - p0[1]) / s, snap = (v) => Math.round(v / 8) * 8;
        const r = resize ? [r0[0], r0[1], Math.max(140, snap(r0[2] + dx)), Math.max(110, snap(r0[3] + dy))] : [Math.max(GX - 10, Math.min(W - 60, snap(r0[0] + dx))), Math.max(GY - 20, Math.min(H - 60, snap(r0[1] + dy))), r0[2], r0[3]];
        place(it, r); if (resize && it._resize) it._resize();
      };
      const stop = () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', stop); h.removeEventListener('pointercancel', stop); onDone(it); };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', stop); h.addEventListener('pointercancel', stop);
    }, true);
  }

  // ---------------- build one live sheet page ----------------
  function live(ui, sec, sheet, n, total) {
    const root = ui.root; root.classList.add('sheet-root');
    const stage = mk('div', 'stage', '', root), board = boardEl(sec, sheet, n, total); stage.appendChild(board);
    const srec = ui.record('sheet.' + sheet.id, { label: `${sheet.title}: layout & extras`, type: 'sheet', max: 0 });
    const sd = NEA.parse((srec.get() || {}).answer, {}); sd.lay = sd.lay || {}; sd.extra = sd.extra || [];
    let sT = null; const saveSheet = () => { clearTimeout(sT); sT = setTimeout(() => { srec.set({ answer: JSON.stringify(sd), correct: null }); pushSoon(); }, 600); };
    const recIO = (id, label, type) => { const r = ui.record(id, { label, type, max: 0 }); return { get: () => NEA.parse((r.get() || {}).answer, null), set: (v) => { r.set({ answer: v ? JSON.stringify(v) : '', correct: null, mis: type === 'photo' && v && !v.cap ? 'no-caption' : '' }); pushSoon(); } }; };
    const addItem = (key, el, rect, extra) => {
      el.dataset.key = key; el.setAttribute('data-noswipe', ''); mk('div', 'grab', '<span>⤧ drag</span>', el); mk('div', 'rs', '', el);
      if (extra) { const x = mk('button', 'xdel', '✕', el); x.title = 'Remove'; x.onclick = () => { if (!x.classList.contains('sure')) { x.classList.add('sure'); x.textContent = 'Remove?'; return; } const i = sd.extra.findIndex((q) => q.k === key); if (i >= 0) { const q = sd.extra[i]; if (q.v) { plist(q.v).list.forEach((y) => { del('img:' + y.k); drop(y.id); }); if (q.v.k) del('sk:' + q.v.k); if (q.kind === 'sketch') drop(q.v.id); } sd.extra.splice(i, 1); sd.gone = (sd.gone || []).concat(key).slice(-60); } el.remove(); saveSheet(); }; }
      board.appendChild(el); place(el, sd.lay[key] || rect); if (el._resize) el._resize();
    };
    sheet.items.forEach((it) => {
      const rect = gridBox(it.at);
      if (it.t === 'text') { const f = typeof it.f === 'string' ? NEA.field(it.f) : it.f; addItem('f:' + f.id, textBox(ui, f), rect); }
      else if (it.t === 'photo') addItem('p:' + it.id, photoFrame(it.label, recIO('ph.' + it.id, `${sheet.title} · photo: ${it.label}`, 'photo')), rect);
      else if (it.t === 'sketch') addItem('s:' + it.id, sketchFrame(it.label, recIO('sk.' + it.id, `${sheet.title} · sketch: ${it.label}`, 'sketch')), rect);
      else if (it.t === 'scale') addItem('r:' + it.id, scaleRow(ui, it), rect);
      else if (it.t === 'html') { const d = mk('div', 'it it-html', it.html); addItem('h:' + (it.id || uid()), d, rect); }
    });
    const exIO = (x) => ({ get: () => x.v || null, set: (v) => { x.v = v; saveSheet(); } });
    const addExtra = (x) => {
      const el = x.kind === 'text' ? freeText(x, saveSheet) : x.kind === 'photo' ? photoFrame('Extra photo', exIO(x)) : sketchFrame('Extra sketch', exIO(x));
      addItem(x.k, el, x.r, true); return el;
    };
    sd.extra.forEach(addExtra);
    // toolbar (stays put while the sheet zooms)
    const tb = mk('div', 'sheet-tools', `<button data-z="out" title="Zoom out">−</button><button data-z="fit" title="Fit the sheet">⤢</button><button data-z="in" title="Zoom in">+</button><span class="sep"></span>
      <button data-x="text" title="Add a text box">＋ Text</button><button data-x="photo" title="Add a photo">＋ Photo</button><button data-x="sketch" title="Add a sketch frame">＋ Sketch</button><span class="sep"></span>
      <button data-m="arr" title="Move and resize things on this sheet">⤧ Arrange</button><button data-m="reset" class="only-arr" title="Put everything back where it started">Reset layout</button><span class="sep"></span><button data-m="pdf" title="Download your whole folder as an A3 PDF">⬇ PDF</button>`, root);
    tb.setAttribute('data-noswipe', '');
    const z = zoomable(stage, board, root);
    arrangeable(board, () => z, (el) => { const k = el.dataset.key, x = sd.extra.find((q) => q.k === k); if (x) x.r = el._r.slice(); else sd.lay[k] = el._r.slice(); saveSheet(); });
    let nx = 0;
    tb.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.z) return b.dataset.z === 'fit' ? z.fitNow() : z.step(b.dataset.z === 'in' ? 1.4 : 1 / 1.4);
      if (b.dataset.x) {
        if (!student()) return Book.toast('Sign in on the cover first');
        const off = (nx++ % 6) * 28, x = { k: 'x' + uid(), kind: b.dataset.x, r: [GX + 380 + off, GY + 240 + off, b.dataset.x === 'text' ? 420 : 460, b.dataset.x === 'text' ? 300 : 360], at: Date.now() };
        sd.extra.push(x); saveSheet(); const el = addExtra(x);
        if (x.kind === 'photo') { const fs = await pickFiles(false); if (fs[0]) el._accept(fs); }
        return;
      }
      if (b.dataset.m === 'arr') { S.arranging = !S.arranging; document.querySelectorAll('.board').forEach((q) => q.classList.toggle('arranging', S.arranging)); document.querySelectorAll('.sheet-root').forEach((q) => q.classList.toggle('arr', S.arranging)); document.querySelectorAll('.sheet-tools [data-m=arr]').forEach((q) => q.classList.toggle('on', S.arranging)); }
      if (b.dataset.m === 'reset') { if (!b.classList.contains('sure')) { b.classList.add('sure'); b.textContent = 'Reset? tap again'; setTimeout(() => { b.classList.remove('sure'); b.textContent = 'Reset layout'; }, 3000); return; } sd.lay = {}; saveSheet(); board.querySelectorAll('.it').forEach((el) => { const k = el.dataset.key; const it = sheet.items.find((q) => ({ text: 'f:' + (typeof q.f === 'string' ? q.f : q.f && q.f.id), photo: 'p:' + q.id, sketch: 's:' + q.id, scale: 'r:' + q.id }[q.t] === k)); if (it) { place(el, gridBox(it.at)); el._resize && el._resize(); } }); }
      if (b.dataset.m === 'pdf') S.exportPDF();
    });
    // paste / drop pictures: onto a photo frame fills it; anywhere else adds an extra photo
    const takeFiles = (e, files) => {
      files = [...(files || [])].filter((f) => /^image\//.test(f.type)); if (!files.length) return;
      e.preventDefault(); const fr = e.target.closest && e.target.closest('.it-photo');
      if (fr && fr._accept) return fr._accept(files);
      files.forEach((f, i) => { const x = { k: 'x' + uid(), kind: 'photo', r: [GX + 360 + i * 30, GY + 200 + i * 30, 460, 360], at: Date.now() }; sd.extra.push(x); const el = addExtra(x); el._accept([f]); });
      saveSheet();
    };
    root.addEventListener('paste', (e) => takeFiles(e, e.clipboardData && e.clipboardData.files));
    stage.addEventListener('dragover', (e) => { if ([...(e.dataTransfer.items || [])].some((i) => i.kind === 'file')) e.preventDefault(); });
    stage.addEventListener('drop', (e) => takeFiles(e, e.dataTransfer.files));
    if (S.arranging) board.classList.add('arranging'), root.classList.add('arr'), tb.querySelector('[data-m=arr]').classList.add('on');
    requestAnimationFrame(() => z.fitNow());
  }

  // ---------------- static board for the PDF ----------------
  async function staticBoard(sec, sheet, n, total) {
    const items = (Book.state || {}).items || {}, g = (id) => items[id] || null;
    const b = boardEl(sec, sheet, n, total); b.classList.add('print');
    const sd = NEA.parse((g('sheet.' + sheet.id) || {}).answer, {}), lay = sd.lay || {};
    const imgFor = async (v) => (v ? (await get('img:' + v.k)) || (await remote(v.id)) : null);
    const sketchImg = async (v, w, h) => {
      if (!v) return null; const loc = await get('sk:' + v.k); const c = document.createElement('canvas'); c.width = w * 2; c.height = h * 2; const x = c.getContext('2d');
      const bgs = loc ? loc.bg : await remote(v.id); if (bgs) { const i = new Image(); await new Promise((r) => { i.onload = r; i.onerror = r; i.src = bgs; }); x.drawImage(i, 0, 0, c.width, c.height); }
      (loc ? loc.strokes : []).forEach((s) => { x.globalCompositeOperation = s.e ? 'destination-out' : 'source-over'; x.strokeStyle = s.c; x.lineCap = x.lineJoin = 'round'; for (let i = 1; i < s.p.length; i++) { const a = s.p[i - 1], q = s.p[i]; x.lineWidth = (s.e ? 18 : s.w) * (0.35 + (q[2] || 0.5)) * 2; x.beginPath(); x.moveTo(a[0] * c.width, a[1] * c.height); x.lineTo(q[0] * c.width, q[1] * c.height); x.stroke(); } });
      return c.toDataURL('image/png');
    };
    const mosaic = async (v) => {
      const L = plist(v).list; if (!L.length) return '<div class="pf"><span class="empty">(no photo yet)</span></div>';
      const tiles = []; for (const q of L) { const src = await imgFor(q); tiles.push(`<div class="tile"><div class="ti">${src ? `<img src="${src}">` : ''}</div>${q.cap ? `<div class="cap pt">${esc(q.cap)}</div>` : ''}</div>`); }
      return `<div class="pf mosaic" style="--cols:${L.length === 1 ? 1 : L.length <= 4 ? 2 : 3}">${tiles.join('')}</div>`;
    };
    const box = (cls, key, rect, html) => { const d = mk('div', 'it ' + cls, html, b); place(d, lay[key] || rect); return d; };
    for (const it of sheet.items) {
      const rect = gridBox(it.at);
      if (it.t === 'text') { const f = typeof it.f === 'string' ? NEA.field(it.f) : it.f, a = (g('nea.' + f.id) || {}).answer || ''; box('it-text', 'f:' + f.id, rect, `<div class="ih"><b>${esc(f.label.split(' ')[0])}</b><span>${esc(f.label.split(' ').slice(1).join(' '))}</span></div><div class="iq">${esc(f.q)}</div><div class="ta pt">${esc(a) || '<span class="empty">(not filled in yet)</span>'}</div>`); }
      else if (it.t === 'photo') box('it-photo', 'p:' + it.id, rect, `<div class="ih"><span>${esc(it.label)}</span></div>${await mosaic(NEA.parse((g('ph.' + it.id) || {}).answer, null))}`);
      else if (it.t === 'sketch') { const v = NEA.parse((g('sk.' + it.id) || {}).answer, null), r = lay['s:' + it.id] || rect, src = await sketchImg(v, r[2], r[3] - 38); box('it-sketch', 's:' + it.id, rect, `<div class="ih"><span>${esc(it.label)}</span></div>${src ? `<img class="skc" src="${src}">` : ''}`); }
      else if (it.t === 'scale') { const a = (g(it.id) || {}).answer || '–'; box('it-scale', 'r:' + it.id, rect, `<div class="iq">${it.q}</div><div class="opts"><span class="opt sel">${esc(a)}</span></div>`); }
      else if (it.t === 'html') box('it-html', 'h:' + (it.id || ''), rect, it.html);
    }
    for (const x of sd.extra || []) {
      if (x.kind === 'text') box('it-free', x.k, x.r, `<div class="ih"><span>Note</span></div><div class="ta pt">${esc(x.text || '')}</div>`);
      else if (x.kind === 'photo') box('it-photo', x.k, x.r, `<div class="ih"><span>Photo</span></div>${await mosaic(x.v)}`);
      else { const src = await sketchImg(x.v, x.r[2], x.r[3] - 38); box('it-sketch', x.k, x.r, `<div class="ih"><span>Sketch</span></div>${src ? `<img class="skc" src="${src}">` : ''}`); }
    }
    return b;
  }
  const loadScript = (src) => new Promise((res, rej) => { if ([...document.scripts].some((s) => s.src.endsWith(src))) return res(); const s = mk('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  S.exportPDF = async () => {
    if (!student()) return Book.toast('Sign in on the cover first');
    document.querySelectorAll('.it-sketch').forEach((s) => s._flush && s._flush());
    const ov = mk('div', 'pdf-ov', '<div><b>Making your PDF…</b><p>Keep this page open.</p><span></span></div>', document.body), msg = ov.querySelector('span');
    try {
      await Promise.all([loadScript('../nea-kit/vendor/html2canvas.min.js'), loadScript('../nea-kit/vendor/jspdf.umd.min.js')]);
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3', compress: true });
      const host = mk('div', 'pdf-host ' + document.body.className, '', document.body);
      const all = S.list; let first = true;
      for (let i = 0; i < all.length; i++) {
        msg.textContent = `Sheet ${i + 1} of ${all.length}`;
        const b = await staticBoard(all[i].sec, all[i].sheet, i + 1, all.length); host.innerHTML = ''; host.appendChild(b);
        await Promise.all([...b.querySelectorAll('img')].map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; }))));
        const c = await window.html2canvas(b, { scale: 1.3, backgroundColor: null, logging: false, width: W, height: H, windowWidth: W, windowHeight: H });
        if (!first) pdf.addPage('a3', 'landscape'); first = false;
        pdf.addImage(c.toDataURL('image/jpeg', 0.86), 'JPEG', 0, 0, 420, 297);
      }
      host.remove();
      const name = (student().name || 'folder').replace(/[^\w -]+/g, '').trim();
      pdf.save(`${C.short || 'NEA'} - ${name}.pdf`);
    } catch (e) { console.error(e); Book.toast('Sorry, the PDF could not be made: ' + (e.message || e)); }
    ov.remove();
  };

  // ---------------- turn sections into book pages ----------------
  // intro: optional array of { sec, sheet } shown first; outro likewise at the end.
  S.pages = (o) => {
    const list = [];
    (o.intro || []).forEach((p) => list.push(p));
    NEA.sections.forEach((sec) => (sec.sheets || []).forEach((sheet) => list.push({ sec, sheet })));
    (o.outro || []).forEach((p) => list.push(p));
    S.list = list;
    list.forEach((p, i) => Book.page({ id: 's-' + p.sheet.id, title: `${p.sec.col || p.sec.key}: ${p.sheet.title}`, build(ui) { live(ui, p.sec, p.sheet, i + 1, list.length); } }));
  };
  S.gridBox = gridBox;
  document.documentElement.classList.add('sheets-book');
})();
