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
  let cur = -1, busy = false, enterAt = Date.now();
  const st = JSON.parse(localStorage.getItem(LS) || 'null') || { student: null, session: Math.random().toString(36).slice(2, 10), items: {}, pages: {}, at: 0 };
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) {} };
  Book.state = st;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = (a, seed) => { const r = H.rng(seed || 1), b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  Book.shuffle = shuffle; Book.esc = esc;

  // ---------------- sound ----------------
  let actx = null, kit = null, kitBase = 0; Book.muted = localStorage.getItem('book.muted') === '1'; Ink.muted = Book.muted;
  function audio() { if (Book.muted || !window.SOUND) return null; if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); kit = SOUND.kit(actx, { start: 0 }); kitBase = actx.currentTime; } catch (e) { return null; } } if (actx.state === 'suspended') actx.resume(); return kit; }
  Book.sfx = (name, p) => { const k = audio(); if (k) try { k.play(name, actx.currentTime - kitBase + 0.01, p); } catch (e) {} };
  Book.scribble = (dur = 0.25) => Book.sfx('stroke', { material: 'pen', dur, gain: 0.7 });

  // ---------------- saving ----------------
  const queue = JSON.parse(localStorage.getItem(LS + '.q') || '[]');
  let sending = false;
  const chipSave = () => $('#savechip');
  function setChip(cls) { const c = chipSave(); if (!c) return; c.classList.remove('saving', 'saved', 'offline'); if (cls) c.classList.add(cls); }
  async function flush() {
    if (sending || !queue.length) return;
    if (!C.backend) { setChip('saved'); queue.length = 0; localStorage.setItem(LS + '.q', '[]'); return; }
    sending = true; setChip('saving');
    try {
      while (queue.length) {
        const body = JSON.stringify(queue[0]);
        const r = await fetch(C.backend, { method: 'POST', body, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        queue.shift(); localStorage.setItem(LS + '.q', JSON.stringify(queue));
      }
      setChip('saved');
    } catch (e) { setChip('offline'); setTimeout(() => { sending = false; flush(); }, 8000); return; }
    sending = false;
  }
  function send(event, pg, extra) {
    if (!st.student) return;
    const p = pg || pages[cur]; if (!p) return;
    const items = p.ids.map((id) => {
      const it = st.items[id] || {};
      return { id, label: (p.meta[id] || {}).label || id, type: (p.meta[id] || {}).type || '', answer: it.answer ?? '', correct: it.correct ?? null, first: it.first ?? null, score: it.score ?? null, max: it.max ?? (p.meta[id] || {}).max ?? null, attempts: it.attempts || 0, mis: it.mis || '' };
    });
    const unanswered = items.filter((i) => !i.attempts && i.answer === '').map((i) => i.id);
    const pst = st.pages[p.id] || {};
    queue.push(Object.assign({ v: 1, lesson: LESSON, event, session: st.session, student: st.student, page: { id: p.id, title: p.title, n: pages.indexOf(p) }, seconds: Math.round(pst.seconds || 0), visits: pst.visits || 0, items, unanswered, ts: Date.now() }, extra || {}));
    if (queue.length > 200) queue.splice(0, queue.length - 200);
    localStorage.setItem(LS + '.q', JSON.stringify(queue));
    flush();
  }
  Book.flush = flush;
  // live "where are they" ping every 45 s
  setInterval(() => { if (st.student && pages[cur] && document.visibilityState === 'visible') queue.push({ v: 1, lesson: LESSON, event: 'ping', session: st.session, student: st.student, page: { id: pages[cur].id, title: pages[cur].title, n: cur }, ts: Date.now() }) && flush(); }, 45000);
  addEventListener('online', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pages[cur]) { tally(); send('leave'); } });

  // ---------------- recording answers ----------------
  function rec(pageObj, id, meta) {
    if (!pageObj.meta[id]) { pageObj.ids.push(id); pageObj.meta[id] = meta; }
    return {
      get: () => st.items[id],
      set(v) {
        const it = st.items[id] || (st.items[id] = { attempts: 0 });
        it.attempts++; it.ts = Date.now();
        Object.assign(it, v);
        if (it.first == null && v.correct != null) it.first = !!v.correct;
        if (v.max != null) it.max = v.max;
        save(); updateContents();
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

    ui.record = (id, o = {}) => rec(pageObj, id, { label: o.label || id, type: o.type || 'custom', max: o.max ?? 1 });

    ui.mcq = (o) => {
      const r = rec(pageObj, o.id, { label: o.label || o.q, type: 'mcq', max: 1 });
      const d = act(o.id, o.label, o.q), box = el('div', 'opts', '', d), f = fb(d);
      const opts = o.shuffle === false ? o.options : shuffle(o.options, o.id.length * 31 + 7);
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
      const cards = shuffle(o.items, o.id.length * 17).map((it) => { const c = el('span', 'card', esc(it.t), tray); c._it = it; return c; });
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
      const defs = shuffle(o.pairs.map((p, k) => ({ t: p[1], k, mis: p[2] })), o.id.length * 13 + 3);
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
        <div class="field"><label>School email</label><input id="cv-email" type="email" autocapitalize="off" placeholder="name@${esc(C.emailDomain || 'school')}" inputmode="email"></div>
        <div class="field"><label>Class</label><select id="cv-class"><option value="">choose…</option>${(C.classes || []).map((c) => `<option>${esc(c)}</option>`).join('')}</select></div>
        <div class="err" id="cv-err"></div>`;
      if (st.student) { $('#cv-name', f).value = st.student.name; $('#cv-email', f).value = st.student.email; $('#cv-class', f).value = st.student.cls; }
      ui.p(`<span class="small">Your answers save automatically every time you turn a page, so your teacher can see how you got on. Take your time and have a go at everything.</span>`);
    }, gate: null };
  }
  function checkCover() {
    const name = $('#cv-name').value.trim(), email = $('#cv-email').value.trim().toLowerCase(), cls = $('#cv-class').value;
    const dom = (C.emailDomain || '').toLowerCase();
    const err = !name || name.split(/\s+/).length < 2 ? 'Please write your first name and surname.' : dom && !email.endsWith('@' + dom) ? `Please use your school email (…@${dom}).` : !cls && (C.classes || []).length ? 'Please choose your class.' : '';
    $('#cv-err').textContent = err; if (err) { Book.sfx('error', { gain: 0.3 }); return false; }
    const changed = !st.student || st.student.email !== email;
    st.student = { name, email, cls }; if (changed) st.session = Math.random().toString(36).slice(2, 10);
    save(); return true;
  }
  function finishPage() {
    return { id: 'finish', title: 'Finished!', ids: [], meta: {}, build(ui, root) {
      ui.h('Well done!', { size: 64 });
      const sum = ui.el('div', 'box'); requestAnimationFrame(() => Ink.frame(sum));
      const paint = () => {
        let sc = 0, mx = 0, blank = []; pages.forEach((p) => p.ids.forEach((id) => { const it = st.items[id], m = p.meta[id]; if (m.max) { mx += m.max; sc += (it && it.score) || 0; } if (!it || (!it.attempts && !it.answer)) blank.push(`${pages.indexOf(p)}. ${esc(p.title)}`); }));
        sum.innerHTML = `<p style="margin:0">You scored <b class="key">${sc} / ${mx}</b> on the marked activities.</p>` + (blank.length ? `<p style="margin:10px 0 0" class="red">Still blank: ${[...new Set(blank)].join(', ')}. Tap Contents to go back and finish them.</p>` : '<p style="margin:10px 0 0" class="green">You had a go at everything. Brilliant!</p>');
      };
      p_finish.onShow = () => { paint(); send('finish', p_finish); };
      paint();
      ui.p('Your answers have been sent to your teacher. You can still go back and improve them: they will update automatically.');
    } };
  }
  let p_finish;

  // ---------------- start ----------------
  Book.start = () => {
    document.body.insertAdjacentHTML('beforeend', `<div id="book"></div>
      <div id="topbar"><span class="chip" id="contbtn">☰ Contents</span><span class="chip" id="savechip">${st.student ? esc(st.student.name.split(' ')[0]) : 'not signed in'}</span><span class="chip" id="mute">${Book.muted ? '🔇' : '🔊'}</span></div>
      <div id="bottombar"><button class="navbtn back" id="prev">◂ Back</button><span id="pagenum"></span><button class="navbtn" id="next">Next ▸</button></div>
      <div id="contents"></div><div id="toast"></div>`);
    const cov = coverPage(); cov.gate = null; pages.unshift(cov);
    p_finish = finishPage(); pages.push(p_finish);
    // gate leaving the cover
    $('#next').onclick = () => { if (cur === 0 && !checkCover()) return; if (cur === 0) $('#savechip').textContent = st.student.name.split(' ')[0]; Book.next(); };
    $('#prev').onclick = Book.prev;
    $('#contbtn').onclick = () => { if (!st.student) return Book.toast('Sign in on the cover first'); const c = $('#contents'); c.classList.toggle('on'); updateContents(); };
    $('#mute').onclick = () => { Book.muted = !Book.muted; Ink.muted = Book.muted; localStorage.setItem('book.muted', Book.muted ? '1' : '0'); $('#mute').textContent = Book.muted ? '🔇' : '🔊'; };
    // swipe to turn (only when the swipe starts on empty paper, not on an activity)
    let sx = 0, sy = 0, st0 = 0;
    $('#book').addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st0 = Date.now(); }, { passive: true });
    $('#book').addEventListener('touchend', (e) => {
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Date.now() - st0 < 600 && Math.abs(dx) > 90 && Math.abs(dy) < 50 && !e.target.closest('.act,canvas,input,textarea,select,.card,.bucket')) (dx < 0 ? $('#next').onclick() : Book.prev());
    }, { passive: true });
    // tooth texture for the paper
    try { const c = H.layer(256, 256), x = c.getContext('2d'), img = x.createImageData(256, 256), r = H.rng(907); for (let i = 0; i < img.data.length; i += 4) { img.data[i] = 120; img.data[i + 1] = 108; img.data[i + 2] = 88; img.data[i + 3] = (0.02 + (r() - 0.5) * 0.05) * 255; } x.putImageData(img, 0, 0); document.documentElement.style.setProperty('--tooth', `url(${c.toDataURL()})`); } catch (e) {}
    const resume = st.student ? Math.min(st.at || 0, pages.length - 1) : 0;
    show(resume, 0);
    flush();
  };
  Book.pages = pages;
  Book.current = () => cur;
})();
