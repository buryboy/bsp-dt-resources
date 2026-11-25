/* ===== A level Product Design revision app: engine =====
   Views: home (always first), booklet, self-check (per topic), results.
   Everything saves in localStorage on this device only. */
const STORE = 'pd-revision-9dt0-v1', OLD = 'pd-selfcheck-9dt0-v1';
let S = {};
try { S = JSON.parse(localStorage.getItem(STORE) || 'null') || {}; } catch (e) { S = {}; }
if (!S._v) { // first run: bring over self-check ratings from the old self-check page
  try { const o = JSON.parse(localStorage.getItem(OLD) || '{}'); Object.keys(o).forEach((k) => { if (k !== '_page') S[k] = o[k]; }); } catch (e) {}
  S._v = 1;
}
S.u = S.u || {}; S.lp = S.lp || {};
let saveT = 0;
const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }, 150); };
const $ = (q, el = document) => el.querySelector(q), $$ = (q, el = document) => [...el.querySelectorAll(q)];
const E = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cw = (q) => q.replace(/\*\*(.+?)\*\*/g, '<mark class="cw">$1</mark>');
function hsh(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function shuffle(arr, seed) { let a = arr.slice(), t = parseInt(hsh(seed), 36) || 1; const r = () => { t = (t + 0x6D2B79F5) | 0; let x = Math.imul(t ^ (t >>> 15), 1 | t); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const view = $('#view');
const rag = (p) => (p >= 0.67 ? 2 : p >= 0.34 ? 1 : 0);
const LAB = ["Don't understand", 'Understand a little', 'Confident'];
const rating = (id) => (S['r.' + id] == null ? -1 : +S['r.' + id]);

/* ---------- units: every answerable item, for progress and score ---------- */
// returns [{id, auto, done, ok, marks, got}]
function blockUnits(bk, b) {
  const U = [], u = (id) => S.u[id] || {};
  const add = (id, auto, done, ok, extra) => U.push(Object.assign({ id, auto, done, ok }, extra || {}));
  if (b.keys) b.keys.forEach(([t]) => { const id = bk.id + ':k' + hsh(t), x = u(id); add(id, 1, x.v != null, x.ok); });
  if (b.mcq) b.mcq.forEach(([q]) => { const id = bk.id + ':m' + hsh(q), x = u(id); add(id, 1, x.v != null, x.ok); });
  if (b.tf) b.tf.forEach(([q]) => { const id = bk.id + ':t' + hsh(q), x = u(id); add(id, 1, x.v != null, x.ok); });
  if (b.sort) b.sort.items.forEach(([t]) => { const id = bk.id + ':s' + hsh(b.sort.q + t), x = u(id); add(id, 1, x.v != null, x.ok); });
  if (b.match) b.match.pairs.forEach(([l]) => { const id = bk.id + ':p' + hsh(b.match.q + l), x = u(id); add(id, 1, x.v != null && x.v !== '', x.ok); });
  if (b.gap) { const n = (b.gap.text.match(/\{\{/g) || []).length; for (let i = 0; i < n; i++) { const id = bk.id + ':g' + hsh(b.gap.text) + '.' + i, x = u(id); add(id, 1, x.v != null && x.v !== '', x.ok); } }
  if (b.order) { const id = bk.id + ':o' + hsh(b.order.q), x = u(id); add(id, 1, !!x.chk, x.ok); }
  if (b.calc) b.calc.forEach(([q]) => { const id = bk.id + ':c' + hsh(q), x = u(id); add(id, 1, x.chk === 1, x.ok); });
  if (b.exam) b.exam.forEach(([q, m]) => { const id = bk.id + ':e' + hsh(q), x = u(id); add(id, 0, x.s != null && x.s !== '', null, { marks: m, got: +x.s || 0 }); });
  if (b.nea) { const id = bk.id + ':n' + hsh(b.nea), x = u(id); add(id, 0, (x.v || '').trim().length >= 20, null); }
  return U;
}
const pageUnits = (bk, p) => p.blocks.flatMap((b) => blockUnits(bk, b));
const bookUnits = (bk) => bk.pages.flatMap((p) => pageUnits(bk, p));
function stats(list) {
  const done = list.filter((x) => x.done).length, auto = list.filter((x) => x.auto && x.done), ok = auto.filter((x) => x.ok).length;
  const ex = list.filter((x) => x.marks && x.done);
  return { n: list.length, done, p: list.length ? done / list.length : 0, auto: auto.length, ok, got: ex.reduce((a, x) => a + x.got, 0), max: ex.reduce((a, x) => a + x.marks, 0) };
}
function cpaStats() { // the critical path workbook keeps its own save; estimate progress from the boxes filled in
  try { const c = JSON.parse(localStorage.getItem('cpa-y13-v1') || '{}'); const n = Object.keys(c).filter((k) => !/^(_|name$|class$)/.test(k) && c[k] !== '' && c[k] != null).length; return { p: Math.min(1, n / 36), done: n }; } catch (e) { return { p: 0, done: 0 }; }
}
const bkStats = (bk) => (bk.href ? cpaStats() : stats(bookUnits(bk)));
const progHTML = (p) => `<div class="prog"><i class="c${rag(p)}" style="width:${Math.round(p * 100)}%"></i></div>`;

/* ---------- routing (no history: the app always opens on Home) ---------- */
let V = { v: 'home' };
function go(v) { V = v; render(); scrollTo(0, 0); }
$('#homeBtn').onclick = () => go({ v: 'home' });
function render() {
  $('#homeBtn').style.visibility = V.v === 'home' ? 'hidden' : 'visible';
  $('#jump').style.display = V.v === 'book' ? '' : 'none';
  $('#pnav').style.display = V.v === 'book' ? '' : 'none';
  ({ home: renderHome, book: renderBook, check: renderCheck, results: renderResults })[V.v]();
}

/* ---------- HOME ---------- */
function renderHome() {
  $('#barTitle').textContent = 'A level Product Design revision';
  const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  const live = BOOKLETS.filter((b) => !b.soon);
  const allU = live.filter((b) => !b.href).flatMap(bookUnits), st = stats(allU);
  const conf = SPEC.filter((s) => rating(s[0]) === 2).length, rated = SPEC.filter((s) => rating(s[0]) >= 0).length;
  const bp = live.length ? live.reduce((a, b) => a + bkStats(b).p, 0) / live.length : 0;
  let h = `<div class="kick">Edexcel 9DT0 · Paper 1 · Principles of Design and Technology</div>
  <h2>A level Product Design revision</h2>
  <div class="grid2"><div><label class="l">Your name</label><input type="text" id="nm" value="${E(S.name || '')}" placeholder="First name and surname"></div><div><label class="l">Class</label><input type="text" id="cl" value="${E(S.class || '')}" placeholder="e.g. 13P"></div></div>
  ${standalone ? '' : `<div class="tip noprint"><b>Do this first:</b> tap the Share button in Safari, then <b>Add to Home Screen</b>. The app then works offline, and your progress is safe over the holidays: iPads can clear saved work from websites that haven't been opened for a few weeks.</div>`}
  <div class="big">
   <div class="card"><b>${Math.round(bp * 100)}%</b><span class="muted">of the revision booklets done</span>${progHTML(bp)}</div>
   <div class="card"><b>${conf} / ${SPEC.length}</b><span class="muted">spec points rated confident (${rated} rated)</span>${progHTML(conf / SPEC.length)}</div>
   <div class="card"><b>${st.auto ? Math.round(st.ok / st.auto * 100) + '%' : '–'}</b><span class="muted">quiz answers right${st.max ? ` · exam questions ${st.got}/${st.max} marks` : ''}</span>${progHTML(st.auto ? st.ok / st.auto : 0)}</div>
  </div>
  <p class="muted">Pick any topic, in any order. Each booklet remembers where you got to. The bars go <b style="color:#c0392b">red</b>, <b style="color:#b07210">amber</b>, then <b style="color:#2f7d4a">green</b> as you work through them.</p>
  <div class="topics">`;
  Object.keys(TOPICS).forEach((t) => {
    t = +t;
    const bks = BOOKLETS.filter((b) => b.topic === t), sl = SPEC.filter((s) => s[1] === t);
    const c = [0, 1, 2].map((v) => sl.filter((s) => rating(s[0]) === v).length);
    h += `<div class="tc"><h4><span class="n">${t}</span>${E(TOPICS[t])}</h4>`;
    if (!bks.length) h += `<div class="ln"><span class="lb">Booklet</span><span class="soon">Coming soon</span><span></span><span></span></div>`;
    bks.forEach((b) => {
      if (b.soon) { h += `<div class="ln"><span class="lb">Booklet</span><span class="soon">${E(b.title)} · coming soon</span><span></span><span></span></div>`; return; }
      const s = bkStats(b);
      h += `<div class="ln"><span class="lb">${E(b.short || 'Booklet')}</span>${progHTML(s.p)}<span class="pct">${Math.round(s.p * 100)}%</span><button class="btn small ${s.p >= .67 ? '' : 'blue'}" data-open="${b.id}">${s.p ? 'Continue' : 'Start'} ›</button></div>`;
    });
    h += `<div class="ln"><span class="lb">Self-check</span><div class="prog">${c.map((x, v) => `<i class="c${v}" style="width:${x / sl.length * 100}%"></i>`).join('')}</div><span class="pct">${c[2]}/${sl.length}</span><button class="btn small ghost" data-check="${t}">Rate ›</button></div></div>`;
  });
  h += `</div>
  <div class="row" style="margin-top:22px"><button class="btn blue" id="resBtn">My results and revision list ›</button></div>
  <h3>Keep your work safe</h3>
  <p class="muted">Everything is saved on this iPad only. Make a backup file now and then (save it to Files or OneDrive). If anything goes wrong, Restore puts it all back.</p>
  <div class="row noprint"><button class="btn ghost" id="bkBtn">Back up my progress</button><button class="btn ghost" id="rsBtn">Restore from a backup</button><span class="fb" id="bkFb"></span></div>`;
  view.innerHTML = h;
  $('#nm').oninput = (e) => { S.name = e.target.value; save(); };
  $('#cl').oninput = (e) => { S.class = e.target.value; save(); };
  $$('[data-open]').forEach((b) => b.onclick = () => openBook(b.dataset.open));
  $$('[data-check]').forEach((b) => b.onclick = () => go({ v: 'check', t: +b.dataset.check }));
  $('#resBtn').onclick = () => go({ v: 'results' });
  $('#bkBtn').onclick = backup; $('#rsBtn').onclick = () => $('#restoreIn').click();
}
function openBook(id, page) {
  const b = BOOKLETS.find((x) => x.id === id);
  if (b.href) { location.href = b.href; return; }
  go({ v: 'book', b: id, p: page != null ? page : Math.min(S.lp[id] || 0, b.pages.length - 1) });
}

/* ---------- backup / restore ---------- */
async function backup() {
  const nm = ((S.name || 'My').trim().replace(/[^\w\- ]+/g, '') || 'My'), d = new Date().toISOString().slice(0, 10);
  const data = JSON.stringify({ app: STORE, saved: new Date().toISOString(), S, cpa: localStorage.getItem('cpa-y13-v1') });
  const file = new File([data], `${nm} - Product Design revision backup ${d}.json`, { type: 'application/json' });
  const fb = $('#bkFb');
  try { if (navigator.maxTouchPoints > 1 && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: file.name }); fb.className = 'fb good'; fb.textContent = 'Backup made.'; return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  fb.className = 'fb good'; fb.textContent = 'Backup saved to your downloads.';
}
$('#restoreIn').onchange = (e) => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try { const d = JSON.parse(r.result); if (d.app !== STORE || !d.S) throw new Error('not a backup'); S = d.S; S.u = S.u || {}; S.lp = S.lp || {}; if (d.cpa) localStorage.setItem('cpa-y13-v1', d.cpa); save(); go({ v: 'home' }); const fb = $('#bkFb'); fb.className = 'fb good'; fb.textContent = 'Restored from ' + (d.saved || '').slice(0, 10) + '.'; }
    catch (err) { const fb = $('#bkFb'); fb.className = 'fb bad'; fb.textContent = 'That file is not a revision backup.'; }
    e.target.value = '';
  };
  r.readAsText(f);
};

/* ---------- BOOKLET ---------- */
let BK = null;
function renderBook() {
  BK = BOOKLETS.find((x) => x.id === V.b); const P = BK.pages[V.p]; S.lp[BK.id] = V.p; save();
  $('#barTitle').textContent = `${BK.topic}. ${BK.title}`;
  const j = $('#jump'); j.innerHTML = BK.pages.map((p, i) => `<option value="${i}">${i + 1}. ${E(p.t)}</option>`).join(''); j.value = V.p;
  const bs = stats(bookUnits(BK));
  let h = `<div class="bkbar noprint">${progHTML(bs.p)}<span class="pct">${Math.round(bs.p * 100)}%</span></div>
   <div class="pnav noprint">${BK.pages.map((p, i) => { const s = stats(pageUnits(BK, p)); return `<button data-pg="${i}" class="${i === V.p ? 'cur' : ''} ${s.n && s.done === s.n ? 'd2' : s.done ? 'd1' : ''}" title="${E(p.t)}">${i + 1}</button>`; }).join('')}</div>
   <div class="kick">Topic ${BK.topic}${P.spec ? ' · ' + P.spec : ''} · page ${V.p + 1} of ${BK.pages.length}</div><h2>${E(P.t)}</h2>`;
  P.blocks.forEach((b, bi) => { h += blockHTML(BK, b, bi); });
  const ps = stats(pageUnits(BK, P));
  h += `<div class="savebox noprint"><span class="muted">${ps.n ? `This page: ${ps.done} of ${ps.n} done${ps.auto ? ` · ${ps.ok}/${ps.auto} right` : ''}.` : ''} Saved on this iPad as you go.</span>
   <span class="row">${ps.n ? '<button class="btn small ghost" id="resetPg">Reset this page</button>' : ''}<button class="btn small" id="savePg">Save this page as PDF</button></span></div>`;
  view.innerHTML = h;
  bindBook(BK, P);
  $$('[data-pg]').forEach((b) => b.onclick = () => go({ v: 'book', b: BK.id, p: +b.dataset.pg }));
  $('#prev').disabled = V.p === 0; $('#next').textContent = V.p === BK.pages.length - 1 ? 'Back to Home ›' : 'Next ›';
  if ($('#resetPg')) $('#resetPg').onclick = () => { pageUnits(BK, P).forEach((x) => delete S.u[x.id]); save(); render(); };
  $('#savePg').onclick = () => pdfOf([() => {}], `${who()} - ${BK.title} page ${V.p + 1}.pdf`);
}
$('#jump').onchange = (e) => go({ v: 'book', b: V.b, p: +e.target.value });
$('#prev').onclick = () => { if (V.v === 'book' && V.p > 0) go({ v: 'book', b: V.b, p: V.p - 1 }); };
$('#next').onclick = () => { if (V.v !== 'book') return; if (V.p < BK.pages.length - 1) go({ v: 'book', b: V.b, p: V.p + 1 }); else go({ v: 'home' }); };

function blockHTML(bk, b, bi) {
  let h = '';
  const head = (t, sub) => `<h3>${t}</h3>${sub ? `<p class="muted">${sub}</p>` : ''}`;
  if (b.h) h += `<h3>${b.h}</h3>`;
  if (b.notes) h += `<div class="notes">${b.notes}</div>`;
  if (b.tip) h += `<div class="tip">${b.tip}</div>`;
  if (b.keys) {
    h += head('Key words', 'Tap a card to check yourself, then match each word to its meaning below.');
    h += `<div class="flips">${b.keys.map(([t, d]) => `<div class="flip"><b>${t}</b><div class="d">${d}</div></div>`).join('')}</div>`;
    const defs = shuffle(b.keys.map((k, i) => i), bk.id + b.keys[0][0]);
    h += `<table class="t mt" style="margin-top:12px"><tr><th style="width:28%">Word</th><th>Meaning</th></tr>${b.keys.map(([t], i) => { const id = bk.id + ':k' + hsh(t); return `<tr><td><b>${t}</b></td><td><select class="f" data-u="${id}" data-a="${i}" data-kind="sel"><option value=""></option>${defs.map((d) => `<option value="${d}">${E(b.keys[d][1].replace(/<[^>]+>/g, ''))}</option>`).join('')}</select></td></tr>`; }).join('')}</table>`;
  }
  if (b.mcq) {
    h += head(b.mh || 'Quick quiz', 'Tap an answer. You will see straight away if it is right, and why.');
    h += b.mcq.map(([q, o, a, why], i) => { const id = bk.id + ':m' + hsh(q); const ord = shuffle(o.map((x, k) => k), q); return `<div class="q" data-mq="${id}" data-a="${a}"><span class="qn">Q${i + 1}</span>${q}<div class="opts">${ord.map((k) => `<button class="opt" data-k="${k}">${o[k]}</button>`).join('')}</div><div class="why" style="display:none">${why || ''}</div></div>`; }).join('');
  }
  if (b.tf) {
    h += head(b.th || 'True or false?');
    h += b.tf.map(([q, a, why], i) => { const id = bk.id + ':t' + hsh(q); return `<div class="q" data-tq="${id}" data-a="${a ? 1 : 0}"><span class="qn">${i + 1}</span>${q}<div class="tf"><button class="opt" data-k="1">True</button><button class="opt" data-k="0">False</button></div><div class="why" style="display:none">${why || ''}</div></div>`; }).join('');
  }
  if (b.sort) {
    h += head(b.sort.h || 'Sort them', b.sort.q);
    const items = shuffle(b.sort.items.map((x, i) => i), b.sort.q);
    h += `<div class="sort">${items.map((i) => { const [t, c] = b.sort.items[i], id = bk.id + ':s' + hsh(b.sort.q + t); return `<div class="it" data-su="${id}" data-a="${c}"><span>${t}</span>${b.sort.cats.map((cat, k) => `<button data-k="${k}">${cat}</button>`).join('')}</div>`; }).join('')}</div>`;
  }
  if (b.match) {
    h += head(b.match.h || 'Match them up', b.match.q);
    const rs = shuffle(b.match.pairs.map((p, i) => i), b.match.q);
    h += `<table class="t mt"><tr><th style="width:36%">${b.match.lh || ''}</th><th>${b.match.rh || ''}</th></tr>${b.match.pairs.map(([l], i) => { const id = bk.id + ':p' + hsh(b.match.q + l); return `<tr><td><b>${l}</b></td><td><select class="f" data-u="${id}" data-a="${i}" data-kind="sel"><option value=""></option>${rs.map((r) => `<option value="${r}">${E(b.match.pairs[r][1])}</option>`).join('')}</select></td></tr>`; }).join('')}</table>`;
  }
  if (b.gap) {
    h += head(b.gap.h || 'Fill the gaps', b.gap.q || 'Choose the right word for each gap.');
    const ans = []; b.gap.text.replace(/\{\{(.+?)\}\}/g, (m, a) => { ans.push(a); return m; });
    const bank = shuffle([...new Set(ans.concat(b.gap.extra || []))], b.gap.text);
    let i = -1;
    h += `<div class="card gapt">${b.gap.text.replace(/\{\{(.+?)\}\}/g, (m, a) => { i++; const id = bk.id + ':g' + hsh(b.gap.text) + '.' + i; return `<select data-u="${id}" data-ans="${E(a)}" data-kind="gap"><option value=""></option>${bank.map((w) => `<option>${E(w)}</option>`).join('')}</select>`; })}</div>`;
  }
  if (b.order) {
    const id = bk.id + ':o' + hsh(b.order.q), n = b.order.steps.length, ord = shuffle(b.order.steps.map((s, i) => i), b.order.q);
    h += head(b.order.h || 'Put the stages in order', b.order.q);
    h += `<div class="ord" data-ou="${id}">${ord.map((i) => `<div class="st" data-i="${i}"><select class="f"><option value=""></option>${Array.from({ length: n }, (_, k) => `<option>${k + 1}</option>`).join('')}</select><span>${b.order.steps[i]}</span></div>`).join('')}
     <div class="row"><button class="btn blue small" data-ochk>Check the order</button><span class="fb"></span></div></div>`;
  }
  if (b.calc) {
    h += head(b.ch || 'Calculate', 'Work it out, type the number, then check. The working opens when you check.');
    h += b.calc.map(([q, a, tol, unit, work], i) => { const id = bk.id + ':c' + hsh(q); return `<div class="q" data-cu="${id}" data-a="${a}" data-tol="${tol || 0}"><span class="qn">${i + 1}</span>${q}<div class="row" style="margin-top:8px"><input type="number" step="any" style="width:160px" inputmode="decimal"> <span>${unit || ''}</span><button class="btn blue small">Check</button><span class="fb"></span></div><div class="why" style="display:none">${work}</div></div>`; }).join('');
  }
  if (b.exam) {
    h += head(b.eh || 'Exam practice', 'Start with the command word (highlighted). Write your answer first: the mark scheme opens once you have written at least 15 characters. Then mark yourself honestly.');
    h += b.exam.map(([q, m, ms], i) => { const id = bk.id + ':e' + hsh(q); return `<div class="q" data-eu="${id}"><span class="qn">Q${i + 1}</span>${cw(q)} <span class="tag">${m} mark${m > 1 ? 's' : ''}</span>
      <textarea style="margin-top:8px;min-height:${m >= 6 ? 170 : m >= 4 ? 120 : 80}px" placeholder="Answer as you would in the exam."></textarea>
      <button class="btn ghost small" data-ms style="margin-top:8px">Show the mark scheme</button>
      <div class="ms"><div class="callout blue" style="margin-top:10px"><b>Mark scheme (indicative content)</b><ul style="margin:4px 0 0">${ms.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <label class="key">My mark: <select class="f" style="width:auto;display:inline-block"><option value=""></option>${Array.from({ length: m + 1 }, (_, k) => `<option>${k}</option>`).join('')}</select> / ${m}</label></div></div>`; }).join('');
  }
  if (b.nea) {
    const id = bk.id + ':n' + hsh(b.nea);
    h += `<div class="nea" data-nu="${id}"><b>Link it to your NEA.</b> ${b.nea}<textarea style="margin-top:8px" placeholder="A few sentences about your own project."></textarea></div>`;
  }
  return h;
}

function bindBook(bk, P) {
  const U = (id) => (S.u[id] = S.u[id] || {});
  const after = () => { save(); refreshProg(); };
  // selects: key words, match, gap
  $$('select[data-u]', view).forEach((s) => {
    const id = s.dataset.u, x = S.u[id];
    const judge = () => { const v = s.value; if (v === '') { s.classList.remove('right', 'wrong'); return; } const ok = s.dataset.kind === 'gap' ? v === s.dataset.ans : v === s.dataset.a; s.classList.toggle('right', ok); s.classList.toggle('wrong', !ok); };
    if (x && x.v != null) s.value = x.v; judge();
    s.onchange = () => { const v = s.value; if (v === '') delete S.u[id]; else { const ok = s.dataset.kind === 'gap' ? v === s.dataset.ans : v === s.dataset.a; S.u[id] = { v, ok }; } judge(); after(); };
  });
  // multiple choice + true/false
  $$('[data-mq],[data-tq]', view).forEach((q) => {
    const id = q.dataset.mq || q.dataset.tq, a = q.dataset.a, why = $('.why', q);
    const show = (v) => { $$('.opt', q).forEach((o) => { o.classList.toggle('picked', o.dataset.k === v); o.classList.toggle('ok', o.dataset.k === v && v === a); o.classList.toggle('no', o.dataset.k === v && v !== a); o.classList.toggle('isans', v != null && o.dataset.k === a); }); if (v != null && why.innerHTML.trim()) why.style.display = ''; };
    const x = S.u[id]; show(x && x.v != null ? x.v : null);
    $$('.opt', q).forEach((o) => o.onclick = () => { if (S.u[id] && S.u[id].v != null) return; S.u[id] = { v: o.dataset.k, ok: o.dataset.k === a }; show(o.dataset.k); after(); });
  });
  // sorting
  $$('[data-su]', view).forEach((it) => {
    const id = it.dataset.su, a = it.dataset.a;
    const show = (v) => { $$('button', it).forEach((b) => b.classList.toggle('on', b.dataset.k === v)); it.classList.toggle('right', v != null && v === a); it.classList.toggle('wrong', v != null && v !== a); };
    show(S.u[id] ? S.u[id].v : null);
    $$('button', it).forEach((b) => b.onclick = () => { S.u[id] = { v: b.dataset.k, ok: b.dataset.k === a }; show(b.dataset.k); after(); });
  });
  // ordering
  $$('[data-ou]', view).forEach((o) => {
    const id = o.dataset.ou, x = S.u[id] || {}, sts = $$('.st', o), fb = $('.fb', o);
    if (x.v) sts.forEach((st) => { $('select', st).value = x.v[st.dataset.i] || ''; });
    const mark = () => { let ok = true; sts.forEach((st) => { const r = +$('select', st).value === +st.dataset.i + 1; st.classList.toggle('right', r); st.classList.toggle('wrong', !r); ok = ok && r; }); fb.className = 'fb ' + (ok ? 'good' : 'bad'); fb.textContent = ok ? 'All in the right order.' : 'Not quite: the red ones are in the wrong place.'; return ok; };
    if (x.chk) mark();
    sts.forEach((st) => $('select', st).onchange = () => { const v = {}; sts.forEach((s2) => v[s2.dataset.i] = $('select', s2).value); U(id).v = v; save(); });
    $('[data-ochk]', o).onclick = () => { const v = {}; sts.forEach((s2) => v[s2.dataset.i] = $('select', s2).value); S.u[id] = { v, chk: 1, ok: mark() }; after(); };
  });
  // calculations
  $$('[data-cu]', view).forEach((q) => {
    const id = q.dataset.cu, a = +q.dataset.a, tol = +q.dataset.tol, inp = $('input', q), fb = $('.fb', q), why = $('.why', q), x = S.u[id] || {};
    const mark = () => { const v = parseFloat(inp.value); const ok = !isNaN(v) && Math.abs(v - a) <= tol + 1e-9; fb.className = 'fb ' + (ok ? 'good' : 'bad'); fb.textContent = ok ? 'Correct.' : 'Not quite. Check the working.'; why.style.display = ''; return ok; };
    if (x.v != null) inp.value = x.v; if (x.chk) mark();
    $('button', q).onclick = () => { if (inp.value === '') return; S.u[id] = { v: inp.value, chk: 1, ok: mark() }; after(); };
  });
  // exam questions
  $$('[data-eu]', view).forEach((q) => {
    const id = q.dataset.eu, ta = $('textarea', q), btn = $('[data-ms]', q), ms = $('.ms', q), sel = $('.ms select', q), x = S.u[id] || {};
    ta.value = x.a || ''; sel.value = x.s != null ? x.s : '';
    const upd = () => { btn.disabled = ta.value.trim().length < 15; ms.classList.toggle('show', !!(S.u[id] || {}).o); };
    upd();
    ta.oninput = () => { U(id).a = ta.value; save(); upd(); };
    btn.onclick = () => { U(id).o = 1; save(); upd(); };
    sel.onchange = () => { if (sel.value === '') delete U(id).s; else U(id).s = sel.value; after(); };
  });
  // NEA prompts
  $$('[data-nu]', view).forEach((n) => { const id = n.dataset.nu, ta = $('textarea', n); ta.value = (S.u[id] || {}).v || ''; ta.oninput = () => { U(id).v = ta.value; after(); }; });
  // flip cards
  $$('.flip', view).forEach((f) => f.onclick = () => f.classList.toggle('open'));
}
function refreshProg() {
  if (V.v !== 'book') return;
  const bs = stats(bookUnits(BK)); const bar = $('.bkbar', view); if (bar) bar.innerHTML = `${progHTML(bs.p)}<span class="pct">${Math.round(bs.p * 100)}%</span>`;
  $$('[data-pg]', view).forEach((b) => { const s = stats(pageUnits(BK, BK.pages[+b.dataset.pg])); b.classList.toggle('d2', s.n > 0 && s.done === s.n); b.classList.toggle('d1', s.done > 0 && s.done < s.n); });
  const ps = stats(pageUnits(BK, BK.pages[V.p])), m = $('.savebox .muted', view);
  if (m && ps.n) m.textContent = `This page: ${ps.done} of ${ps.n} done${ps.auto ? ` · ${ps.ok}/${ps.auto} right` : ''}. Saved on this iPad as you go.`;
}

/* ---------- SELF-CHECK (one topic) ---------- */
function renderCheck() {
  const t = V.t, list = SPEC.filter((s) => s[1] === t), bk = BOOKLETS.find((b) => b.topic === t && !b.soon);
  $('#barTitle').textContent = `Self-check · Topic ${t}`;
  let h = `<div class="kick">Self-check · Topic ${t}</div><h2>${E(TOPICS[t])}</h2>
   <p class="muted">Rate each spec point honestly. Tick <b>Confident</b> and an exam-style question opens: answer it, then mark yourself.${bk ? ' Not confident? The revision booklet covers it.' : ''}</p>`;
  list.forEach(([id, , code, title, pts, q, m, ms]) => {
    const pg = bk && bk.pages ? findPage(bk, code, title) : -1;
    h += `<div class="item" id="it-${id}"><div class="top"><div class="ttl"><span class="code">${code}</span><b>${title}</b><div class="pts">${pts}</div>
      ${bk ? `<button class="btn ghost small" style="margin-top:6px" data-rev="${bk.id}" data-pg="${pg}">Revise this ›</button>` : ''}</div>
      <div class="rate">${LAB.map((l, v) => `<button class="v${v}" data-id="${id}" data-v="${v}">${l}</button>`).join('')}</div></div>
      <div class="xq" id="xq-${id}" style="display:none"><b>Prove it.</b> ${cw(q)} <span class="tag">${m} mark${m > 1 ? 's' : ''}</span>
       <textarea data-k="a.${id}" style="margin-top:8px" placeholder="Answer as you would in the exam."></textarea>
       <button class="btn ghost small msbtn" data-id="${id}" style="margin-top:8px">Show the mark scheme</button>
       <div class="ms" id="ms-${id}"><div class="callout blue" style="margin-top:10px"><b>Mark scheme (indicative)</b><ul style="margin:4px 0 0">${ms.map((x) => `<li>${x}</li>`).join('')}</ul></div>
       <label class="key">My mark: <select class="f" data-k="s.${id}" style="width:auto;display:inline-block"><option value=""></option>${Array.from({ length: m + 1 }, (_, k) => `<option>${k}</option>`).join('')}</select> / ${m}</label></div></div></div>`;
  });
  h += `<div class="row" style="margin-top:20px">${t > 1 ? `<button class="btn ghost" data-t="${t - 1}">‹ Topic ${t - 1}</button>` : ''}${t < 12 ? `<button class="btn ghost" data-t="${t + 1}">Topic ${t + 1} ›</button>` : ''}<button class="btn blue" id="toRes">My results ›</button></div>`;
  view.innerHTML = h;
  $$('[data-k]', view).forEach((el) => { const k = el.dataset.k; if (S[k] != null) el.value = S[k]; const up = () => { S[k] = el.value; save(); chkRefresh(list); }; el.addEventListener('input', up); el.addEventListener('change', up); });
  $$('.rate button', view).forEach((b) => b.onclick = () => { const k = 'r.' + b.dataset.id; if (S[k] === +b.dataset.v) delete S[k]; else S[k] = +b.dataset.v; save(); chkRefresh(list); });
  $$('.msbtn', view).forEach((b) => b.onclick = () => { S['o.' + b.dataset.id] = 1; save(); chkRefresh(list); });
  $$('[data-rev]', view).forEach((b) => b.onclick = () => openBook(b.dataset.rev, +b.dataset.pg >= 0 ? +b.dataset.pg : undefined));
  $$('[data-t]', view).forEach((b) => b.onclick = () => go({ v: 'check', t: +b.dataset.t }));
  $('#toRes').onclick = () => go({ v: 'results' });
  chkRefresh(list);
}
function findPage(bk, code, title) { // the booklet page that best matches a self-check row
  const c = code.split('–')[0], w = title.toLowerCase().split(/[^a-z]+/).filter((x) => x.length > 2)[0] || '';
  const same = (p) => p.spec && p.spec.split(/[ ,–]/)[0] === c;
  let i = w ? bk.pages.findIndex((p) => same(p) && p.t.toLowerCase().includes(w)) : -1;
  if (i < 0 && w) i = bk.pages.findIndex((p) => p.spec && p.t.toLowerCase().includes(w));
  if (i < 0) i = bk.pages.findIndex(same);
  if (i < 0) i = bk.pages.findIndex((p) => p.spec && p.spec.startsWith(c + '.'));
  return i;
}
function chkRefresh(list) {
  list.forEach(([id]) => {
    const r = rating(id), it = $('#it-' + id); if (!it) return;
    it.classList.remove('r0', 'r1', 'r2'); if (r >= 0) it.classList.add('r' + r);
    $$('.rate button', it).forEach((b) => b.classList.toggle('on', +b.dataset.v === r));
    $('#xq-' + id).style.display = r === 2 ? '' : 'none';
    $(`.msbtn[data-id="${id}"]`).disabled = (S['a.' + id] || '').trim().length < 15;
    $('#ms-' + id).classList.toggle('show', !!S['o.' + id]);
  });
}

/* ---------- RESULTS ---------- */
const HELPS = ['A re-teach in class', 'Worked exam answers to copy the structure of', 'More practice exam questions', 'A short video or animation', 'A revision worksheet or knowledge organiser', 'Seeing it in the workshop'];
function lists() {
  const lab = (s) => `${s[2]} ${s[3]}`;
  const red = SPEC.filter((s) => rating(s[0]) === 0), amb = SPEC.filter((s) => rating(s[0]) === 1);
  const low = SPEC.filter((s) => rating(s[0]) === 2 && S['o.' + s[0]] && S['s.' + s[0]] !== '' && S['s.' + s[0]] != null && +S['s.' + s[0]] < s[6] / 2);
  const notyet = SPEC.filter((s) => rating(s[0]) === 2 && !S['o.' + s[0]]), unr = SPEC.filter((s) => rating(s[0]) < 0);
  return { lab, red, amb, low, notyet, unr };
}
function renderResults() {
  $('#barTitle').textContent = 'My results';
  const L = lists(), conf = SPEC.filter((s) => rating(s[0]) === 2).length;
  const sec = (title, col, l, note) => l.length ? `<h4 style="color:${col}">${title} (${l.length})</h4>${note ? `<div class="muted">${note}</div>` : ''}<ul>${l.map((s) => `<li>${L.lab(s)}</li>`).join('')}</ul>` : '';
  view.innerHTML = `<div class="kick">My results</div><h2>Where am I, and what next?</h2>
   <p class="muted">${E((S.name || '').trim())}${S.class ? ' · ' + E(S.class) : ''} · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
   <h3>Revision booklets</h3>
   <div class="bars card">${BOOKLETS.filter((b) => !b.soon).map((b) => { const s = bkStats(b); return `<div class="br"><span><b>${b.topic}</b> ${E(b.title)}</span>${progHTML(s.p)}<span class="pct">${Math.round(s.p * 100)}%${s.max ? ` · ${s.got}/${s.max}` : ''}</span></div>`; }).join('')}</div>
   <h3>Self-check</h3>
   <div class="legend"><span style="--c:#c0392b">Don't understand</span><span style="--c:#d9901a">Understand a little</span><span style="--c:#2f7d4a">Confident</span><span style="--c:#e4e6ea">Not rated yet</span></div>
   <div class="bars card">${Object.keys(TOPICS).map((t) => { const l = SPEC.filter((s) => s[1] === +t), c = [0, 1, 2].map((v) => l.filter((s) => rating(s[0]) === v).length); return `<div class="br"><span><b>${t}</b> ${TOPICS[t]}</span><div class="prog">${c.map((x, v) => `<i class="c${v}" style="width:${x / l.length * 100}%"></i>`).join('')}</div><span class="pct">${c[2]}/${l.length}</span></div>`; }).join('')}</div>
   <p class="muted">${conf} of ${SPEC.length} spec points confident.</p>
   <h3>My revision list</h3>
   <div class="rl card">${(sec("Don't understand: start here", '#c0392b', L.red) + sec('Understand a little', '#b07210', L.amb) + sec('Confident, but under half marks on the question', '#24539c', L.low, 'Know it, but the exam answer needs work.') + sec('Confident, question not tried yet', '#5f6670', L.notyet) + (L.unr.length ? `<p class="muted">${L.unr.length} spec points not rated yet.</p>` : '')) || '<p class="muted">Nothing yet. Rate the topics from the Home page.</p>'}</div>
   <h3>What would help me most?</h3>
   <div>${HELPS.map((h, i) => `<label class="chk"><input type="checkbox" data-h="${i}"> ${h}</label>`).join('')}</div>
   <label class="l">Anything else your teacher should know?</label><textarea id="cmt">${E(S.comment || '')}</textarea>
   <h3>Send it</h3>
   <div class="grid2"><div><label class="l">Teacher's email</label><input type="text" id="tem" value="${E(S.temail || '')}" placeholder="your teacher's school email"></div>
    <div class="row" style="align-items:flex-end"><button class="btn blue" id="mailBtn">Email my list to my teacher</button><button class="btn ghost" id="copyBtn">Copy the list</button></div></div>
   <p class="muted">The email button opens your own email app with the list filled in; you check it and press send. It contains your name, class, ratings and booklet progress only.</p><span class="fb" id="copyFb"></span>
   <div class="savebox noprint"><span class="muted">Hand in: save this page as a PDF and upload it to Showbie.</span><button class="btn small" id="savePg">Save this page as PDF</button></div>`;
  $$('[data-h]', view).forEach((c) => { c.checked = !!(S.helps || {})[c.dataset.h]; c.onchange = () => { (S.helps = S.helps || {})[c.dataset.h] = c.checked; save(); }; });
  $('#cmt').oninput = (e) => { S.comment = e.target.value; save(); };
  $('#tem').oninput = (e) => { S.temail = e.target.value; save(); };
  $('#mailBtn').onclick = () => { const n = (S.name || '').trim(); location.href = `mailto:${encodeURIComponent((S.temail || '').trim())}?subject=${encodeURIComponent('9DT0 revision list' + (n ? ' – ' + n : ''))}&body=${encodeURIComponent(listText())}`; };
  $('#copyBtn').onclick = async () => { const t = listText(), f = $('#copyFb'); try { await navigator.clipboard.writeText(t); } catch (e) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } f.className = 'fb good'; f.textContent = 'Copied. Paste it into Showbie or an email.'; };
  $('#savePg').onclick = () => pdfOf([() => {}], `${who()} - Product Design revision results.pdf`);
}
function listText() { // the first line is what the teacher tally page looks for: keep it
  const L = lists(), name = (S.name || '').trim() || '(no name)', cls = (S.class || '').trim();
  const sec = (t, l) => l.length ? `${t}:\n${l.map((s) => ' - ' + L.lab(s)).join('\n')}\n\n` : '';
  const helps = HELPS.filter((_, i) => (S.helps || {})[i]);
  const bk = BOOKLETS.filter((b) => !b.soon).map((b) => ` - ${b.topic} ${b.title}: ${Math.round(bkStats(b).p * 100)}%`).join('\n');
  return `A level Product Design (9DT0) self-check\n${name}${cls ? ' · ' + cls : ''} · ${new Date().toLocaleDateString('en-GB')}\n\n` +
    sec("Don't understand", L.red) + sec('Understand a little', L.amb) + sec('Confident but under half marks on the exam question', L.low) +
    `Confident: ${SPEC.filter((s) => rating(s[0]) === 2).length} of ${SPEC.length} topics. Not rated: ${L.unr.length}.\n\n` +
    `Booklet progress:\n${bk}\n\n` +
    (helps.length ? `What would help me:\n${helps.map((h) => ' - ' + h).join('\n')}\n\n` : '') +
    ((S.comment || '').trim() ? `Comment: ${S.comment.trim()}\n` : '');
}

/* ---------- PDF of what is on screen (or of a whole booklet) ---------- */
const who = () => ((S.name || 'My').trim().replace(/[^\w\- ]+/g, '') || 'My');
async function pdfOf(steps, fname) {
  const ov = $('#ov'); ov.style.display = 'flex';
  const { jsPDF } = window.jspdf; const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PW = 297, PH = 210, M = 8; let first = true;
  document.body.classList.add('pdfmode');
  const keep = Object.assign({}, V);
  try {
    for (const step of steps) {
      step(); await new Promise((r) => setTimeout(r, 40));
      $$('.ms', view).forEach((m) => { if (!m.classList.contains('show')) m.dataset.hid = 1; });
      const c = await html2canvas(view, { scale: 1.5, backgroundColor: '#f6f6f2', windowWidth: 1180 });
      const wmm = PW - 2 * M, pxPerMm = c.width / wmm, slice = Math.floor((PH - 2 * M) * pxPerMm);
      for (let y = 0; y < c.height; y += slice) {
        const h = Math.min(slice, c.height - y), cv = document.createElement('canvas'); cv.width = c.width; cv.height = h;
        cv.getContext('2d').drawImage(c, 0, y, c.width, h, 0, 0, c.width, h);
        if (!first) pdf.addPage(); first = false;
        pdf.addImage(cv.toDataURL('image/jpeg', 0.85), 'JPEG', M, M, wmm, h / pxPerMm);
      }
    }
  } finally { document.body.classList.remove('pdfmode'); V = keep; render(); }
  let shared = false;
  if (navigator.maxTouchPoints > 1 && navigator.canShare) {
    try { const file = new File([pdf.output('blob')], fname, { type: 'application/pdf' }); if (navigator.canShare({ files: [file] })) { ov.style.display = 'none'; await navigator.share({ files: [file], title: fname }); shared = true; } }
    catch (e) { if (e && e.name === 'AbortError') shared = true; }
  }
  if (!shared) pdf.save(fname);
  ov.style.display = 'none';
}
$('#pdfBtn').onclick = () => {
  if (V.v === 'book') { const id = V.b, n = BK.pages.length; pdfOf(Array.from({ length: n }, (_, i) => () => { V = { v: 'book', b: id, p: i }; render(); }), `${who()} - ${BK.title} booklet.pdf`); }
  else pdfOf([() => {}], `${who()} - Product Design revision.pdf`);
};
$('#pdfBtn').textContent = 'Save as PDF';

render();
