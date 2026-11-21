// book.js — the interactive exercise book: pages, page turning, activities and the per-page auto-save.
//
// A page file calls:
//   Book.page({ id: 'p03', title: 'Density & absorbency', build(ui, el) { ... } })
// build() runs once, the first time the page is shown. Use the ui kit (all answers are recorded + auto-saved):
//   ui.h(text, {size})                      bubble-letter heading          ui.p(html) / ui.html(html)  paragraph(s)
//   ui.box(html, {tag, color})              framed note (hand-drawn border, hatched shadow)
//   ui.anim({w, h, duration, draw(k,t), sound(k), autoplay})   pen-drawn animation (see lib/ink.js)
//   ui.mcq({ id, label, q, options:[{t, ok, mis, why}], explain, multi })      multiple choice; mis = misconception tag
//   ui.tf({ id, label, statement, answer, explain, mis })                      true / false
//   ui.fill({ id, label, html: 'Copper is a good {{conductor|conductors}} of heat', explain })   type-the-word blanks
//   ui.write({ id, label, q, marks, lines, scheme:['point 1', ...], model })    written answer + self-mark with scheme
//   ui.sort({ id, label, q, buckets:['A','B'], items:[{t, b, mis}] })           tap a card, tap a bucket
//   ui.match({ id, label, q, pairs:[[term, definition, mis?], ...] })          tap a term, then its definition
//   ui.predict({ id, label, q, options:['..','..'] })                          a prediction (no right/wrong yet)
//   ui.rate({ id, label, q, scale:['not sure', ..., 'very sure'] })            confidence / opinion
//   ui.record(id, { label, type, max })   -> { set({answer, correct, score, mis}) }   for custom games/experiments
//   ui.el(tag, cls, html) creates and appends an element; ui.root is the page content element.
// Every activity needs a unique, stable id (e.g. 'p03.float-predict'). label = short text the teacher sees.
// Each id counts as "expected" on its page: if a student leaves the page without touching it, it is saved as blank.
(function () {
  'use strict';
  const Book = (window.Book = {});
  const C = window.BOOK_CONFIG || {};
  const LESSON = C.lesson || 'lesson';
  const LS = 'book.' + LESSON;
  const pages = [];
  if (new URLSearchParams(location.search).has('reset')) { localStorage.removeItem(LS); localStorage.removeItem(LS + '.q'); history.replaceState(null, '', location.pathname); }
  let cur = -1, busy = false, enterAt = Date.now();
  const st = JSON.parse(localStorage.getItem(LS) || 'null') || { student: null, session: Math.random().toString(36).slice(2, 10), items: {}, pages: {}, at: 0 };
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) {} };
  Book.state = st;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = (a, seed) => { const r = H.rng(seed || 1), b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const idSeed = (id) => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h || 1; };
  Book.shuffle = shuffle; Book.esc = esc;

  // ---------------- sound ----------------
  let actx = null, kit = null, kitBase = 0; Book.muted = localStorage.getItem('book.muted') === '1'; Ink.muted = Book.muted;
  function audio() { if (Book.muted || !window.SOUND) return null; if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); kit = SOUND.kit(actx, { start: 0 }); kitBase = actx.currentTime; } catch (e) { return null; } } if (actx.state === 'suspended') actx.resume(); return kit; }
  Book.sfx = (name, p) => { const k = audio(); if (k) try { k.play(name, actx.currentTime - kitBase + 0.01, p); } catch (e) {} };
  Book.scribble = (dur = 0.25) => Book.sfx('stroke', { material: 'pen', dur, gain: 0.7 });

  // ---------------- saving ----------------
  const queue = JSON.parse(localStorage.getItem(LS + '.q') || '[]');
  let sending = false;
  // squash a long backlog: each page save carries the whole page, so only the newest one per page matters; old pings are pointless
  function compact() {
    if (queue.length < 6) return;
    const keep = [], seen = new Set();
    for (let i = queue.length - 1; i >= 0; i--) {
      const q = queue[i], ev = q.event, pid = q.page && q.page.id;
      if (ev === 'ping') { if (!seen.has('ping')) { seen.add('ping'); keep.push(q); } continue; }
      if ((ev === 'save' || ev === 'enter' || ev === 'leave') && pid && q.items) { const k = (q.lesson || '') + '|' + pid; if (seen.has(k)) continue; seen.add(k); }
      keep.push(q);
    }
    keep.reverse(); queue.length = 0; keep.forEach((q) => queue.push(q)); localStorage.setItem(LS + '.q', JSON.stringify(queue));
  }
  const saveInfo = { fails: 0, ok: 0, err: '' }; let batchOK = true;
  // tap the name chip to see what saving is doing (handy when a device seems stuck)
  Book.saveStatus = () => `v13 · ${queue.length ? queue.length + ' waiting to send' : 'nothing waiting'}${saveInfo.ok ? ' · last saved ' + new Date(saveInfo.ok).toLocaleTimeString() : ''}${saveInfo.err ? ' · last problem: ' + saveInfo.err : ''}${typeof syncInfo !== 'undefined' && syncInfo ? ' · synced ' + new Date(syncInfo.at).toLocaleTimeString() + (syncInfo.err ? ': ' + syncInfo.err : ` (${syncInfo.n} on server, ${syncInfo.changed} updated here)`) : ''}`;
  const chipSave = () => $('#savechip');
  function setChip(cls) { const c = chipSave(); if (!c) return; c.classList.remove('saving', 'saved', 'offline'); if (cls) c.classList.add(cls); }
  async function flush() {
    if (sending || !queue.length) return;
    if (!C.backend) { setChip('saved'); queue.length = 0; localStorage.setItem(LS + '.q', '[]'); return; }
    sending = true; setChip('saving'); compact();
    try {
      while (queue.length) {
        // send up to 15 waiting saves in one go (much faster when a device is catching up); older servers take one at a time
        const n = batchOK && queue.length > 1 ? Math.min(15, queue.length) : 1;
        const body = JSON.stringify(n > 1 ? { a: 'batch', list: queue.slice(0, n) } : queue[0]);
        // never wait for ever: a hung request used to leave the chip on "saving…" and block everything behind it
        const ac = window.AbortController ? new AbortController() : null, to = setTimeout(() => ac && ac.abort(), 60000);
        let r;
        try { r = await fetch(C.backend, { method: 'POST', body, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ac ? ac.signal : undefined }); }
        finally { clearTimeout(to); }
        if (!r.ok) throw new Error('HTTP ' + r.status);
        let j = null; try { j = await r.json(); } catch (e) { throw new Error('server error'); }
        if (n > 1 && j && j.ok === false && j.error === 'missing student') { batchOK = false; continue; } // server not updated yet
        if (j && j.ok === false) throw new Error(j.error || 'server said no');
        queue.splice(0, n); localStorage.setItem(LS + '.q', JSON.stringify(queue)); saveInfo.fails = 0; saveInfo.ok = Date.now();
      }
      setChip('saved');
    } catch (e) {
      saveInfo.err = (e && e.name === 'AbortError' ? 'timed out' : String(e && e.message || e)) + ' at ' + new Date().toLocaleTimeString();
      // the same item failing again and again goes to the back so it cannot block the rest
      if (++saveInfo.fails >= 3 && queue.length > 1) { queue.push(queue.shift()); saveInfo.fails = 0; localStorage.setItem(LS + '.q', JSON.stringify(queue)); }
      setChip('offline'); setTimeout(() => { sending = false; flush(); }, 8000); return;
    }
    sending = false;
  }
  function send(event, pg, extra) {
    if (!st.student) return;
    const p = pg || pages[cur]; if (!p) return;
    const items = (extra && extra.only ? extra.only : p.ids).map((id) => {
      const it = st.items[id] || {};
      return { id, label: (p.meta[id] || {}).label || id, type: (p.meta[id] || {}).type || '', answer: it.answer ?? '', correct: it.correct ?? null, first: it.first ?? null, score: it.score ?? null, max: it.max ?? (p.meta[id] || {}).max ?? null, attempts: it.attempts || 0, mis: it.mis || '', at: it.at || null, last: it.ts || null };
    });
    const unanswered = items.filter((i) => !i.attempts && i.answer === '').map((i) => i.id);
    const pst = st.pages[p.id] || {};
    queue.push(Object.assign({ v: 1, lesson: LESSON, event, session: st.session, student: st.student, page: { id: p.id, title: p.title, n: pages.indexOf(p) }, seconds: Math.round(pst.seconds || 0), visits: pst.visits || 0, items, unanswered, ts: Date.now() }, extra || {}));
    if (queue.length > 200) queue.splice(0, queue.length - 200);
    localStorage.setItem(LS + '.q', JSON.stringify(queue));
    flush();
  }
  Book.flush = flush;
  // save the current page now (for long-writing pages where students stay put for a long time)
  Book.saveNow = () => { if (pages[cur] && pages[cur].id !== 'cover') { tally(); send('save'); } };
  // live "where are they" ping every 45 s
  setInterval(() => { if (st.student && pages[cur] && document.visibilityState === 'visible') queue.push({ v: 1, lesson: LESSON, event: 'ping', session: st.session, student: st.student, page: { id: pages[cur].id, title: pages[cur].title, n: cur }, ts: Date.now() }) && flush(); }, 45000);
  addEventListener('online', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pages[cur]) { tally(); send('leave'); } else if (document.visibilityState === 'visible' && SYNC && st.student) pullProgress(); });

  // ---------------- recording answers ----------------
  function rec(pageObj, id, meta) {
    if (!pageObj.meta[id]) { pageObj.ids.push(id); pageObj.meta[id] = meta; }
    return {
      get: () => st.items[id],
      set(v) {
        const it = st.items[id] || (st.items[id] = { attempts: 0 });
        it.attempts++; it.ts = Date.now(); if (!it.at) it.at = it.ts; // at = first answered, ts = last changed
        Object.assign(it, v);
        if (it.first == null && v.correct != null) it.first = !!v.correct;
        if (v.max != null) it.max = v.max;
        save(); updateContents(); updateQuizChip();
      },
    };
  }

  // ---------------- ui kit ----------------
  function makeUI(pageObj, root) {
    const ui = { root };
    const el = (ui.el = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (parent || root).appendChild(e); return e; });
    ui.h = (text, o = {}) => { const c = Ink.bubble(text, o); root.appendChild(c); return c; };
    ui.p = (html, cls) => el('p', cls || '', html);
    ui.html = (html) => { const d = el('div', '', html); return d; };
    ui.box = (html, o = {}) => { const d = el('div', 'box', (o.tag ? `<span class="tag">${esc(o.tag)}</span>` : '') + html); requestAnimationFrame(() => Ink.frame(d, { color: o.color })); return d; };
    ui.anim = (spec) => { const c = el('canvas'); c.width = spec.w || 820; c.height = spec.h || 420; return Ink.anim(c, spec); };
    const act = (id, label, q, marks) => {
      const d = el('div', 'act'); d.dataset.id = id;
      if (q) el('div', 'q', (marks ? `<span class="marks">[${marks} mark${marks > 1 ? 's' : ''}]</span>` : '') + q, d);
      requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
      return d;
    };
    const fb = (d) => el('div', 'fb', '', d);
    const showFb = (f, ok, html) => { f.className = 'fb on ' + (ok ? 'good' : 'bad'); f.innerHTML = html; };

    // ui.hideWhile(actEl, id, [els]): once the student starts the activity, blur the notes that give the answers
    // away until they get it fully right (or have had 3 tries).
    ui.hideWhile = (actEl, id, els) => {
      const done = () => { const it = st.items[id]; return it && (it.correct === true || it.attempts >= 3); };
      const set = (on) => els.forEach((e) => { const w = e.closest('.ink-anim-wrap') || e; w.classList.toggle('peek-lock', on); });
      if (done()) return;
      const start = () => { if (!done()) { set(true); Ink.stopAll(root); } };
      actEl.addEventListener('pointerdown', start, { passive: true });
      actEl.addEventListener('click', () => setTimeout(() => { if (done()) set(false); }, 50));
    };
    ui.record = (id, o = {}) => rec(pageObj, id, { label: o.label || id, type: o.type || 'custom', max: o.max ?? 1 });

    ui.mcq = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.q, type: 'mcq', max: 1 });
      const d = act(o.id, o.label, o.q), box = el('div', 'opts', '', d), f = fb(d);
      const opts = o.shuffle === false ? o.options : shuffle(o.options, idSeed(o.id));
      const prev = r.get();
      opts.forEach((op) => {
        const b = el('button', 'opt', esc(op.t), box); b.type = 'button';
        b.onclick = () => {
          const ok = !!op.ok; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 }); Book.scribble(0.15);
          b.classList.add(ok ? 'right' : 'wrong');
          r.set({ answer: op.t, correct: ok, score: ok ? 1 : 0, mis: ok ? '' : op.mis || '' });
          if (ok) { box.querySelectorAll('.opt').forEach((x) => (x.disabled = true)); }
          showFb(f, ok, (ok ? '✓ ' : '✗ ') + esc(op.why || (ok ? o.explain || 'Correct!' : 'Not quite: have another go.')) + (ok && op.why && o.explain ? '<br>' + o.explain : ''));
        };
        if (prev && prev.correct && prev.answer === op.t) { b.classList.add('right'); setTimeout(() => box.querySelectorAll('.opt').forEach((x) => (x.disabled = true))); showFb(f, true, '✓ ' + esc(op.why || o.explain || 'Correct!')); }
      });
      return d;
    };

    ui.tf = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.statement, type: 'tf', max: 1 });
      const d = act(o.id, o.label, `<b>True or false?</b> ${o.statement}`), row = el('div', 'tfrow', '', d), f = fb(d);
      const prev = r.get();
      [['True', true], ['False', false]].forEach(([t, v]) => {
        const b = el('button', 'opt', t, row); b.type = 'button';
        b.onclick = () => {
          const ok = v === o.answer; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
          row.querySelectorAll('.opt').forEach((x) => { x.disabled = true; x.classList.remove('sel'); });
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) [...row.children].find((x) => x.textContent === (o.answer ? 'True' : 'False')).classList.add('right');
          r.set({ answer: t, correct: ok, score: ok ? 1 : 0, mis: ok ? '' : o.mis || '' });
          showFb(f, ok, (ok ? '✓ ' : '✗ ') + (o.explain || ''));
        };
      });
      if (prev) { [...row.children].forEach((x) => (x.disabled = true)); const want = o.answer ? 'True' : 'False'; [...row.children].forEach((x) => { if (x.textContent === want) x.classList.add('right'); else if (x.textContent === prev.answer) x.classList.add('wrong'); }); showFb(f, prev.correct, (prev.correct ? '✓ ' : '✗ ') + (o.explain || '')); }
      return d;
    };

    ui.fill = (o) => {
      const answers = []; let i = 0;
      const html = o.html.replace(/\{\{([^}]+)\}\}/g, (_, a) => { answers.push(a.split('|').map((s) => s.trim().toLowerCase())); return `<input class="blank" data-i="${i++}" autocomplete="off" autocapitalize="off" spellcheck="false">`; });
      const r = rec(pageObj, o.id, { label: o.label || o.html.replace(/\{\{[^}]+\}\}/g, '___').slice(0, 80), type: 'fill', max: answers.length });
      const d = act(o.id, o.label, o.q || ''), body = el('div', '', html, d), btn = el('button', 'btn', 'Check', d), f = fb(d);
      const inputs = [...body.querySelectorAll('input')];
      const prev = r.get(); if (prev && prev.answer) prev.answer.split(' | ').forEach((v, k) => inputs[k] && (inputs[k].value = v));
      btn.onclick = () => {
        let score = 0; const vals = inputs.map((inp, k) => { const v = inp.value.trim(); const ok = answers[k].includes(v.toLowerCase().replace(/\s+/g, ' ')); inp.classList.toggle('right', ok); inp.classList.toggle('wrong', !ok); if (ok) score++; return v; });
        const ok = score === answers.length; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
        r.set({ answer: vals.join(' | '), correct: ok, score, max: answers.length });
        showFb(f, ok, ok ? '✓ ' + (o.explain || 'All correct!') : `✗ ${score}/${answers.length} right. Check the red ones${r.get().attempts >= 2 ? ': answers: <b>' + answers.map((a) => a[0]).join(', ') + '</b>' : ' and try again.'}`);
      };
      return d;
    };

    ui.write = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.q, type: 'write', max: o.marks ?? o.scheme.length });
      const d = act(o.id, o.label, o.q, o.marks), ta = el('textarea', 'lines', null, d);
      ta.rows = o.lines || 3; ta.placeholder = 'Write your answer here…'; ta.style.minHeight = `calc(var(--R) * ${o.lines || 3})`;
      const btn = el('button', 'btn', 'Check my answer', d), sc = el('div', 'scheme', '', d);
      sc.innerHTML = `<b style="font-family:Fredoka">Mark scheme: tick each point you made</b>` + o.scheme.map((s, k) => `<label><input type="checkbox" data-k="${k}"> <span>${s}</span></label>`).join('') + (o.model ? `<p class="small" style="margin:8px 0 0"><b>Model answer:</b> ${o.model}</p>` : '');
      const prev = r.get(); if (prev) { ta.value = prev.answer || ''; if (prev.ticks) { sc.classList.add('on'); prev.ticks.forEach((k) => (sc.querySelector(`[data-k="${k}"]`).checked = true)); } }
      const commit = () => {
        const ticks = [...sc.querySelectorAll('input:checked')].map((x) => +x.dataset.k), max = o.marks ?? o.scheme.length, score = Math.min(max, ticks.length);
        r.set({ answer: ta.value.trim(), score, max, correct: ta.value.trim() ? score >= max : false, ticks });
      };
      btn.onclick = () => { if (!ta.value.trim()) { ta.focus(); ta.placeholder = 'Have a go first, then check!'; return; } sc.classList.add('on'); commit(); Book.sfx('paper', { gain: 0.4 }); };
      sc.addEventListener('change', commit);
      ta.addEventListener('blur', () => { if (ta.value.trim() && (!r.get() || r.get().answer !== ta.value.trim())) commit(); });
      return d;
    };

    ui.sort = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.q, type: 'sort', max: o.items.length });
      const d = act(o.id, o.label, o.q || 'Tap a card, then tap the box it belongs in.');
      const tray = el('div', 'tray', '', d), bk = el('div', 'buckets', '', d), btn = el('button', 'btn', 'Check', d), f = fb(d);
      const buckets = o.buckets.map((name, k) => { const b = el('div', 'bucket', `<h4>${esc(name)}</h4>`, bk); b.dataset.k = k; return b; });
      let picked = null;
      const cards = shuffle(o.items, idSeed(o.id) + 17).map((it) => { const c = el('span', 'card', esc(it.t), tray); c._it = it; return c; });
      const pick = (c) => { if (picked) picked.classList.remove('picked'); picked = picked === c ? null : c; if (picked) picked.classList.add('picked'); Book.sfx('tick', { gain: 0.5 }); };
      cards.forEach((c) => (c.onclick = (e) => { e.stopPropagation(); const bk2 = c.parentElement.closest('.bucket'); if (picked && picked !== c && bk2) { bk2.appendChild(picked); picked.classList.remove('picked'); picked = null; Book.scribble(0.12); return; } c.classList.remove('right', 'wrong'); pick(c); }));
      buckets.forEach((b) => (b.onclick = () => { if (!picked) return; b.appendChild(picked); picked.classList.remove('picked'); picked = null; Book.scribble(0.12); }));
      tray.onclick = () => { if (picked) { tray.appendChild(picked); picked.classList.remove('picked'); picked = null; } };
      btn.onclick = () => {
        let score = 0, placed = 0; const mis = [], ans = [];
        cards.forEach((c) => { const bEl = c.parentElement.closest('.bucket'); if (!bEl) { c.classList.remove('right', 'wrong'); return; } placed++; const k = +bEl.dataset.k, ok = k === c._it.b; c.classList.toggle('right', ok); c.classList.toggle('wrong', !ok); if (ok) score++; else if (c._it.mis) mis.push(c._it.mis); ans.push(c._it.t + '→' + o.buckets[k]); });
        const ok = score === o.items.length; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
        r.set({ answer: ans.join('; '), correct: ok, score, max: o.items.length, mis: mis.join(',') });
        showFb(f, ok, ok ? '✓ ' + (o.explain || 'All sorted!') : `${score}/${o.items.length} in the right place${placed < o.items.length ? ' (some cards still to place)' : ''}. Move the red ones and check again.`);
      };
      return d;
    };

    ui.match = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.q, type: 'match', max: o.pairs.length });
      const d = act(o.id, o.label, o.q || 'Tap a word, then tap its meaning.'), grid = el('div', 'pairs', '', d), f = fb(d);
      const defs = shuffle(o.pairs.map((p, k) => ({ t: p[1], k, mis: p[2] })), idSeed(o.id) + 13);
      let sel = null, score = 0, done = 0; const wrongs = [];
      const terms = o.pairs.map((p, k) => { const c = el('span', 'card', `<b style="font-family:Fredoka">${esc(p[0])}</b>`, grid); c._k = k; const dc = el('span', 'card', esc(defs[k].t), grid); dc._k = defs[k].k; dc._def = true; return [c, dc]; }).flat();
      terms.forEach((c) => (c.onclick = () => {
        if (c.classList.contains('right')) return;
        if (!c._def) { terms.forEach((x) => !x._def && x.classList.remove('picked')); sel = c; c.classList.add('picked'); Book.sfx('tick', { gain: 0.5 }); return; }
        if (!sel) return;
        const ok = sel._k === c._k;
        if (ok) { sel.classList.remove('picked'); sel.classList.add('right'); c.classList.add('right'); score++; done++; Book.sfx('success', { gain: 0.25 }); }
        else { c.classList.add('wrong'); wrongs.push(o.pairs[sel._k][0] + '≠' + c.textContent.slice(0, 30)); Book.sfx('error', { gain: 0.3 }); setTimeout(() => c.classList.remove('wrong'), 700); if (defs.find((x) => x.k === c._k).mis) wrongs.push('#' + defs.find((x) => x.k === c._k).mis); }
        if (ok) sel = null;
        const firstTry = Math.max(0, o.pairs.length - wrongs.filter((w) => !w.startsWith('#')).length);
        r.set({ answer: wrongs.length ? 'mistakes: ' + wrongs.filter((w) => !w.startsWith('#')).join('; ') : 'all first time', correct: done === o.pairs.length ? wrongs.length === 0 : null, score: done === o.pairs.length ? Math.min(o.pairs.length, firstTry) : score, max: o.pairs.length, mis: wrongs.filter((w) => w.startsWith('#')).map((w) => w.slice(1)).join(',') });
        if (done === o.pairs.length) showFb(f, !wrongs.length, wrongs.length ? `All matched, with ${wrongs.filter((w) => !w.startsWith('#')).length} wrong tries along the way.` : '✓ All matched first time!');
      }));
      return d;
    };

    ui.predict = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.q, type: 'predict', max: 0 });
      const d = act(o.id, o.label, o.q), box = el('div', 'opts', '', d), prev = r.get();
      o.options.forEach((t) => { const b = el('button', 'opt', esc(t), box); b.type = 'button'; if (prev && prev.answer === t) b.classList.add('sel');
        b.onclick = () => { box.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); Book.scribble(0.12); r.set({ answer: t, correct: null }); o.onPick && o.onPick(t); }; });
      return d;
    };
    ui.rate = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.q, type: 'rate', max: 0 });
      const d = act(o.id, o.label, o.q), box = el('div', 'scale', '', d), prev = r.get();
      (o.scale || ['😟 not yet', '🙂 a bit', '😀 mostly', '🤩 totally']).forEach((t, k) => { const b = el('button', 'opt', esc(t), box); b.type = 'button'; if (prev && prev.answer === t) b.classList.add('sel');
        b.onclick = () => { box.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); r.set({ answer: t, correct: null, score: k }); }; });
      return d;
    };
    return ui;
  }

  // ---------------- pages ----------------
  Book.page = (def) => { pages.push(Object.assign({ ids: [], meta: {}, built: false }, def)); };
  function ensureEl(p) {
    if (p.el) return p.el;
    const pg = document.createElement('section'); pg.className = 'page hidden'; pg.dataset.id = p.id;
    pg.innerHTML = '<div class="sheet"><div class="holes"></div><div class="content"></div></div><div class="turnshade"></div>';
    $('#book').appendChild(pg); p.el = pg;
    const holes = pg.querySelector('.holes'); [0.1, 0.5, 0.9].forEach((f) => { const i = document.createElement('i'); i.style.top = `calc(${f * 100}% - 17px)`; holes.appendChild(i); });
    return pg;
  }
  function build(p) {
    ensureEl(p); if (p.built) return; p.built = true;
    const content = p.el.querySelector('.content');
    try { p.build(makeUI(p, content), content); } catch (e) { console.error(e); content.insertAdjacentHTML('beforeend', `<p class="red">Oops, this page had a problem: ${esc(e.message)}</p>`); }
    if (C.solo && window.BookSolo && p.id !== 'cover') window.BookSolo.pageAdded(p, content); // iPad version: "Save this page as PDF"
  }
  function tally() { const p = pages[cur]; if (!p) return; const ps = st.pages[p.id] || (st.pages[p.id] = { seconds: 0, visits: 0 }); ps.seconds += (Date.now() - enterAt) / 1000; enterAt = Date.now(); save(); }

  function show(i, dir) {
    if (busy || i < 0 || i >= pages.length || i === cur) return;
    if (pages[i].gate && !pages[i].gate()) return;
    const old = pages[cur]; build(pages[i]);
    if (old) { tally(); if (old.id !== 'cover') send('leave', old); Ink.stopAll(old.el); }
    const nu = pages[i], ps = st.pages[nu.id] || (st.pages[nu.id] = { seconds: 0, visits: 0 }); ps.visits++; enterAt = Date.now();
    st.at = i; save();
    nu.el.classList.remove('hidden');
    if (old && dir) {
      busy = true; Book.sfx('paper', { dur: 0.5, gain: 0.8 });
      if (dir > 0) { nu.el.classList.add('under'); old.el.classList.add('turning-out'); }
      else { nu.el.classList.add('turning-in'); old.el.classList.add('under'); }
      setTimeout(() => { old.el.classList.add('hidden'); old.el.classList.remove('turning-out', 'under'); nu.el.classList.remove('turning-in', 'under'); busy = false; }, 870);
    } else if (old) old.el.classList.add('hidden');
    cur = i;
    nu.el.querySelector('.sheet').scrollTop = 0;
    $('#pagenum').textContent = i === 0 ? 'cover' : `${i} / ${pages.length - 1}`;
    $('#prev').disabled = i === 0; $('#next').disabled = i === pages.length - 1;
    $('#next').textContent = i === 0 ? 'Start ▸' : i === pages.length - 2 ? 'Finish ▸' : 'Next ▸';
    if (nu.id !== 'cover') send('enter', nu);
    if (SYNC && st.student && Date.now() - lastPull > 60000) pullProgress();
    nu.onShow && nu.onShow();
    updateContents();
  }
  Book.next = () => show(cur + 1, 1);
  Book.prev = () => show(cur - 1, -1);
  Book.go = (i) => show(i, i > cur ? 1 : -1);
  Book.toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600); };

  function updateContents() {
    const c = $('#contents'); if (!c || !c.classList.contains('on')) return;
    c.innerHTML = '<h2 style="font:700 26px Fredoka;margin:0 0 10px">Contents</h2>' + pages.map((p, i) => {
      const done = p.ids.filter((id) => st.items[id] && (st.items[id].attempts || st.items[id].answer)).length;
      return `<a href="#" data-i="${i}">${i ? i + '. ' : ''}${esc(p.title)}<span class="st">${p.ids.length ? done + '/' + p.ids.length : ''}</span></a>`;
    }).join('');
    c.querySelectorAll('a').forEach((a) => (a.onclick = (e) => { e.preventDefault(); c.classList.remove('on'); Book.go(+a.dataset.i); }));
  }

  // ---------------- cover + finish pages ----------------
  function coverPage() {
    return { id: 'cover', title: 'Cover', ids: [], meta: {}, build(ui, root) {
      root.classList.add('cover');
      ui.el('div', 'small', `${esc(C.course || '')}`);
      ui.h(C.title || 'Exercise book', { size: 64 });
      ui.p(esc(C.subtitle || ''), 'lede');
      const f = ui.el('div', 'box'); requestAnimationFrame(() => Ink.frame(f));
      f.innerHTML = `<div class="field"><label>Your name</label><input id="cv-name" autocomplete="name" placeholder="First name and surname"></div>
        <div class="field"${C.solo ? ' style="display:none"' : ''}><label>School email</label><input id="cv-email" type="email" autocapitalize="off" placeholder="name@${esc(C.emailDomain || 'school')}" inputmode="email"></div>
        <div class="field"><label>Class</label><select id="cv-class"><option value="">choose…</option>${(C.classes || []).map((c) => `<option>${esc(c)}</option>`).join('')}</select></div>
        <div class="err" id="cv-err"></div>`;
      if (st.student) { $('#cv-name', f).value = st.student.name; $('#cv-email', f).value = st.student.email; $('#cv-class', f).value = st.student.cls; }
      ui.p(C.solo ? `<span class="small">Everything you do stays on this iPad: nothing is sent anywhere. At the end of each page, tap <b>Save this page as PDF</b> and hand it in on Showbie. Take your time and have a go at everything.</span>` : `<span class="small">Your answers save automatically every time you turn a page, so your teacher can see how you got on. Take your time and have a go at everything.</span>`);
    }, gate: null };
  }
  function checkCover() {
    const name = $('#cv-name').value.trim(), email = $('#cv-email').value.trim().toLowerCase(), cls = $('#cv-class').value;
    const dom = (C.emailDomain || '').toLowerCase();
    const err = !name || name.split(/\s+/).length < 2 ? 'Please write your first name and surname.' : !C.solo && dom && !email.endsWith('@' + dom) ? `Please use your school email (…@${dom}).` : !cls && (C.classes || []).length ? 'Please choose your class.' : '';
    $('#cv-err').textContent = err; if (err) { Book.sfx('error', { gain: 0.3 }); return false; }
    const changed = !st.student || st.student.email !== email || st.student.name !== name;
    st.student = { name, email, cls }; if (changed) st.session = Math.random().toString(36).slice(2, 10);
    save(); return true;
  }
  function finishPage() {
    return { id: 'finish', title: 'Finished!', ids: [], meta: {}, build(ui, root) {
      ui.h('Well done!', { size: 64 });
      const sum = ui.el('div', 'box'); requestAnimationFrame(() => Ink.frame(sum));
      const paint = () => {
        let sc = 0, mx = 0, blank = []; pages.forEach((p) => p.ids.forEach((id) => { const it = st.items[id], m = p.meta[id]; if (m.max) { mx += m.max; sc += (it && it.score) || 0; } if (!it || (!it.attempts && !it.answer)) blank.push(`${pages.indexOf(p)}. ${esc(p.title)}`); }));
        const filled = pages.reduce((a, p) => a + p.ids.filter((id) => st.items[id] && (st.items[id].attempts || st.items[id].answer)).length, 0), all = pages.reduce((a, p) => a + p.ids.length, 0);
        sum.innerHTML = (C.hideScores ? `<p style="margin:0">You have filled in <b class="key">${filled} of ${all}</b> sections.</p>` : `<p style="margin:0">You scored <b class="key">${sc} / ${mx}</b> on the marked activities.</p>`) + (blank.length ? `<p style="margin:10px 0 0" class="red">Still blank: ${[...new Set(blank)].join(', ')}. Tap Contents to go back and finish them.</p>` : '<p style="margin:10px 0 0" class="green">You had a go at everything. Brilliant!</p>');
      };
      p_finish.onShow = () => { paint(); send('finish', p_finish); };
      paint();
      ui.p(C.solo ? 'Remember to save each page as a PDF and hand them in on Showbie. You can still go back and improve your answers first.' : 'Your answers have been sent to your teacher. You can still go back and improve them: they will update automatically.');
    } };
  }
  let p_finish;


  // ---------------- progress (this device + what the server already has for this email) ----------------
  const MAN = () => window.BOOK_MANIFEST || { ids: [] };
  function progress() {
    const ids = MAN().ids || []; if (!ids.length) return 0;
    const remote = new Set(st.remoteDone || []);
    const done = ids.filter((id) => remote.has(id) || (st.items[id] && (st.items[id].attempts || st.items[id].answer))).length;
    return done / ids.length;
  }
  Book.progress = progress;
  // BOOK_CONFIG.sync: answers saved from another device replace older ones here, and affected pages are redrawn
  let lastPull = 0, syncInfo = null;
  const SYNC = !!(C.sync || C.nea);
  function mergeRemote(items) {
    const changed = new Set();
    let n = 0; const pushBack = [];
    Object.keys(items).forEach((id) => {
      const r = items[id], l = st.items[id]; n++;
      // a book can merge some answers instead of picking the newest (e.g. photo frames: keep both devices' photos)
      if (Book.mergeItem && l && r.answer !== l.answer) {
        const m = Book.mergeItem(id, l.answer, r.answer);
        if (m != null) {
          if (m !== l.answer) { st.items[id] = Object.assign({}, l, { answer: m, ts: Math.max(Date.now(), (r.last || 0) + 1), attempts: Math.max(l.attempts || 0, r.attempts || 0) }); changed.add(id); }
          if (m !== r.answer) pushBack.push(id); // the server should get the combined version too
          return;
        }
      }
      if (!r.last || (l && (l.ts || 0) >= r.last)) return;
      st.items[id] = Object.assign({}, l || {}, { answer: r.answer, correct: r.correct, score: r.score === '' ? null : r.score, max: r.max === '' ? null : r.max, attempts: Math.max(r.attempts || 0, (l && l.attempts) || 0), mis: r.mis, at: (l && l.at) || r.at || r.last, ts: r.last });
      changed.add(id);
    });
    syncInfo = { at: Date.now(), n, changed: changed.size };
    if (pushBack.length) { const pg = pages.find((p) => pushBack.some((id) => p.ids.includes(id))) || pages[cur]; if (pg) send('sync', pg, { only: pushBack }); }
    if (!changed.size) return;
    save();
    pages.forEach((p, i) => {
      if (!p.built || !p.ids.some((id) => changed.has(id))) return;
      if (i === cur && p.el.contains(document.activeElement) && /TEXTAREA|INPUT/.test(document.activeElement.tagName)) return; // never yank text from under someone typing
      p.built = false; p.ids = []; p.el.querySelector('.content').innerHTML = ''; p.el.querySelector('.content').className = 'content';
      if (i === cur) build(p);
    });
    Book.toast('Updated with work saved on another device');
  }
  Book.pull = () => pullProgress();
  async function pullProgress() {
    if (!C.backend || !st.student) return;
    try {
      lastPull = Date.now();
      const r = await fetch(C.backend + '?a=progress&lesson=' + encodeURIComponent(LESSON) + '&email=' + encodeURIComponent(st.student.email) + (SYNC ? '&full=1' : ''), { cache: 'no-store' });
      const j = await r.json(); if (!j.ok) return;
      st.remoteDone = j.done || [];
      if (j.items) mergeRemote(j.items); else if (SYNC) syncInfo = { at: Date.now(), err: 'server sent no answers (old Code.gs?)' };
      if (j.quiz && j.quiz.submitted) st.quiz = Object.assign({}, st.quiz, { submitted: true, score: j.quiz.score, max: j.quiz.max });
      save(); updateQuizChip();
    } catch (e) {}
  }

  // ---------------- final quiz (one go, unlocks at 75%) ----------------
  let FQ = null;
  Book.finalQuiz = (def) => { FQ = def; };
  const UNLOCK = C.quizUnlock ?? 0.75;
  function updateQuizChip() {
    const c = $('#quizchip'); if (!c || !FQ) return;
    const p = progress(), q = st.quiz || {};
    c.style.display = st.student ? '' : 'none';
    c.classList.toggle('locked', !q.submitted && p < UNLOCK);
    c.textContent = q.submitted ? `✓ Final quiz ${q.score}/${q.max}` : p < UNLOCK ? `🔒 Final quiz · ${Math.round(p * 100)}% done` : '★ Final quiz';
  }
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function openQuiz() {
    if (!st.student) return Book.toast('Sign in on the cover first');
    const q = st.quiz || (st.quiz = { answers: {} });
    if (!q.submitted && progress() < UNLOCK) return Book.toast(`Finish ${Math.round(UNLOCK * 100)}% of the book to unlock the final quiz (you're at ${Math.round(progress() * 100)}%)`);
    Ink.stopAll(document);
    const o = $('#quiz'); o.classList.add('on');
    const N = FQ.questions.length, seed = hashStr(st.student.email);
    if (q.submitted) {
      o.innerHTML = `<div class="qsheet"><div class="content" style="padding-top:40px"></div></div>`;
      const c = o.querySelector('.content'); c.appendChild(Ink.bubble('Final quiz', { size: 56 }));
      c.insertAdjacentHTML('beforeend', `<div class="box" id="qdone"><p class="lede" style="margin:0 0 10px">Submitted. You scored <b class="key">${q.score} / ${q.max}</b>.</p><p style="margin:0">Your teacher has your answers and can send you a breakdown of what you got right and wrong.</p></div><button class="btn" id="qclose">◂ Back to the book</button>`);
      requestAnimationFrame(() => Ink.frame(c.querySelector('#qdone')));
      c.querySelector('#qclose').onclick = () => o.classList.remove('on');
      return;
    }
    q.answers = q.answers || {};
    o.innerHTML = `<div class="qsheet"><div class="content" style="padding-top:40px"></div></div>`;
    const c = o.querySelector('.content'); c.appendChild(Ink.bubble('Final quiz', { size: 56 }));
    c.insertAdjacentHTML('beforeend', `<div class="box" id="qrules"><span class="tag">Read this first</span><b>${N} questions. One go only.</b> Pick one answer for each question. You can change your answers until you press <b>Submit</b>; after that they are locked${C.solo ? ', and you save your result as a PDF for Showbie' : ' and sent to your teacher'}. No notes, no helping each other!</div>`);
    requestAnimationFrame(() => Ink.frame(c.querySelector('#qrules'), { color: Ink.RED }));
    FQ.questions.forEach((qu, i) => {
      const id = 'fq.q' + String(i + 1).padStart(2, '0');
      const d = document.createElement('div'); d.className = 'act'; c.appendChild(d);
      d.innerHTML = `<div class="q"><b>${i + 1}.</b> ${qu.q}</div><div class="opts"></div>`;
      requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
      const opts = shuffle([qu.a, ...qu.d], seed + i * 101 + 3), box = d.querySelector('.opts');
      opts.forEach((t) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'opt' + (q.answers[id] === t ? ' sel' : ''); b.textContent = t; box.appendChild(b);
        b.onclick = () => { box.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); q.answers[id] = t; q.times = q.times || {}; q.times[id] = q.times[id] || [Date.now(), 0]; q.times[id][1] = Date.now(); save(); Book.scribble(0.1); count(); }; });
    });
    c.insertAdjacentHTML('beforeend', `<p id="qcount" style="font-family:Fredoka;font-weight:600"></p><button class="btn" id="qsubmit">Submit my answers</button> <button class="btn ghost" id="qclose">◂ Back to the book (answers kept)</button><p class="small" style="margin-top:10px">&nbsp;</p>`);
    const count = () => { const n = Object.keys(q.answers).length; c.querySelector('#qcount').textContent = `Answered ${n} of ${N}.` + (n < N ? ' Unanswered questions score 0.' : ''); };
    count();
    c.querySelector('#qclose').onclick = () => o.classList.remove('on');
    let armed = 0;
    const sb = c.querySelector('#qsubmit');
    sb.onclick = () => {
      if (Date.now() - armed > 6000) { armed = Date.now(); sb.textContent = 'Sure? Tap again to submit. You only get one go.'; setTimeout(() => { if (!q.submitted) sb.textContent = 'Submit my answers'; }, 6000); return; }
      let score = 0;
      const items = FQ.questions.map((qu, i) => { const id = 'fq.q' + String(i + 1).padStart(2, '0'), a = q.answers[id] || '', ok = a === qu.a; if (ok) score++;
        return { id, label: 'Final quiz Q' + (i + 1), type: 'quiz', answer: a, correct: ok, first: ok, score: ok ? 1 : 0, max: 1, attempts: a ? 1 : 0, mis: ok ? '' : qu.mis || '', at: a && q.times && q.times[id] ? q.times[id][0] : null, last: a && q.times && q.times[id] ? q.times[id][1] : null }; });
      q.submitted = true; q.score = score; q.max = N; q.at = Date.now(); save();
      queue.push({ v: 1, lesson: LESSON, event: 'quiz', session: st.session, student: st.student, page: { id: 'fq', title: 'Final quiz', n: 99 }, seconds: 0, visits: 1, items, unanswered: items.filter((x) => !x.answer).map((x) => x.id), ts: Date.now() });
      localStorage.setItem(LS + '.q', JSON.stringify(queue)); flush();
      Book.sfx('success', { gain: 0.5 }); updateQuizChip(); openQuiz();
    };
  }
  Book.openQuiz = openQuiz;

  // ---------------- start ----------------
  Book.start = () => {
    document.body.insertAdjacentHTML('beforeend', `<div id="book"></div>
      <div id="topbar"><span class="chip" id="contbtn">☰ Contents</span><span class="chip quizchip" id="quizchip" style="display:none"></span><span class="chip" id="savechip">${st.student ? esc(st.student.name.split(' ')[0]) : 'not signed in'}</span><span class="chip" id="mute">${Book.muted ? '🔇' : '🔊'}</span></div>
      <div id="bottombar"><button class="navbtn back" id="prev">◂ Back</button><span id="pagenum"></span><button class="navbtn" id="next">Next ▸</button></div>
      <div id="contents"></div><div id="quiz"></div><div id="toast"></div>`);
    $('#quizchip').onclick = openQuiz;
    const cov = coverPage(); cov.gate = null; pages.unshift(cov);
    p_finish = finishPage(); pages.push(p_finish);
    // gate leaving the cover
    $('#next').onclick = () => { if (cur === 0 && !checkCover()) return; if (cur === 0) { $('#savechip').textContent = st.student.name.split(' ')[0]; pullProgress(); updateQuizChip(); } Book.next(); };
    $('#prev').onclick = Book.prev;
    $('#savechip').style.cursor = 'pointer'; $('#savechip').onclick = () => { flush(); const tt = $('#toast'); Book.toast(Book.saveStatus()); clearTimeout(tt._h); tt._h = setTimeout(() => tt.classList.remove('on'), 8000); };
    $('#contbtn').onclick = () => { if (!st.student) return Book.toast('Sign in on the cover first'); const c = $('#contents'); c.classList.toggle('on'); updateContents(); };
    $('#mute').onclick = () => { Book.muted = !Book.muted; Ink.muted = Book.muted; localStorage.setItem('book.muted', Book.muted ? '1' : '0'); $('#mute').textContent = Book.muted ? '🔇' : '🔊'; };
    // swipe to turn (only when the swipe starts on empty paper, not on an activity)
    let sx = 0, sy = 0, st0 = 0;
    $('#book').addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st0 = Date.now(); }, { passive: true });
    $('#book').addEventListener('touchend', (e) => {
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Date.now() - st0 < 600 && Math.abs(dx) > 90 && Math.abs(dy) < 50 && !e.target.closest('.act,canvas,input,textarea,select,.card,.bucket,[data-noswipe]')) (dx < 0 ? $('#next').onclick() : Book.prev());
    }, { passive: true });
    // tooth texture for the paper
    try { const c = H.layer(256, 256), x = c.getContext('2d'), img = x.createImageData(256, 256), r = H.rng(907); for (let i = 0; i < img.data.length; i += 4) { img.data[i] = 120; img.data[i + 1] = 108; img.data[i + 2] = 88; img.data[i + 3] = (0.02 + (r() - 0.5) * 0.05) * 255; } x.putImageData(img, 0, 0); document.documentElement.style.setProperty('--tooth', `url(${c.toDataURL()})`); } catch (e) {}
    const resume = st.student ? Math.min(st.at || 0, pages.length - 1) : 0;
    show(resume, 0);
    flush(); updateQuizChip(); pullProgress();
  };
  Book.pages = pages;
  Book.current = () => cur;
})();
