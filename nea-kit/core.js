// NEA kit core: indicative scoring and helpers shared by the workbooks and the teacher dashboard.
// A book's rubric.js calls NEA.define({ sections, flags }) after this file has loaded.
//
// A field:  { id, label, q, hint, words (aim), max (marks inside its section), kw: [[name, regex], ...],
//             why: true if it should justify, nums: true if it should hold measurements or data,
//             list: n if it should be a list of at least n lines }
// A section: { key, col (short column name), title, marks, hours?, what, why, look[], tips[], fields[], sheets[] }
// A sheet:   { id, title, guide: { what, why?, look[]?, tips[]? }, items: [ {t:'text', f, at}, {t:'photo', id, label, at}, {t:'sketch', id, label, at} ] }
//            at = [col, row, colSpan, rowSpan] on a 12 × 9 grid to the right of the guidance strip.
(function () {
  const JUST = /because|so that|therefore|this means|as a result|which means|since|so i |consequently|hence|thus/i;
  function words(t) { return (String(t || '').match(/[A-Za-z0-9À-ÿ'’£€$%±.-]+/g) || []).filter((w) => /[A-Za-z0-9]/.test(w)).length; }
  function lines(t) { return String(t || '').split(/\n+/).filter((l) => words(l) >= 3).length; }
  // indicative score for one box: length 35%, coverage of what the criteria look for 50%, structure 15%
  function score(f, text) {
    const t = String(text || ''), w = words(t), max = f.max || 0;
    if (!w) return { score: 0, max, words: 0, hits: [], misses: (f.kw || []).map((k) => k[0]), flags: ['blank'], lines: 0 };
    const hits = [], misses = [];
    (f.kw || []).forEach(([name, re]) => (new RegExp(re, 'im').test(t) ? hits : misses).push(name));
    const len = Math.min(1, w / (f.words || 50)), cov = f.kw && f.kw.length ? hits.length / f.kw.length : 1, n = lines(t);
    const parts = [len];
    if (f.list) parts.push(Math.min(1, n / f.list));
    if (f.nums) parts.push(/\d/.test(t) ? 1 : 0);
    if (f.why) parts.push(JUST.test(t) ? 1 : 0);
    const struct = parts.reduce((a, b) => a + b, 0) / parts.length;
    let raw = 0.35 * len + 0.5 * cov + 0.15 * struct;
    if (w < 12) raw *= 0.5;
    const flags = [];
    if (w < (f.words || 50) * 0.4) flags.push('thin');
    if (f.why && !JUST.test(t)) flags.push('no-why');
    if (f.nums && !/\d/.test(t)) flags.push('no-numbers');
    if (f.list && n < f.list) flags.push('short-list');
    if (cov < 0.5) flags.push('gaps');
    return { score: Math.round(raw * max * 2) / 2, max, words: w, hits, misses, flags, lines: n };
  }
  const parse = (s, d) => { try { return JSON.parse(s || '') || d; } catch (e) { return d; } };
  // every photo / sketch a student has put on a section's sheets. get(itemId) -> saved item ({answer}) or null
  function media(sec, get) {
    const out = [];
    (sec.sheets || []).forEach((sh) => {
      sh.items.forEach((it) => {
        if (it.t !== 'photo' && it.t !== 'sketch') return;
        const r = get((it.t === 'photo' ? 'ph.' : 'sk.') + it.id), v = parse(r && r.answer, null);
        if (v && v.list) v.list.forEach((q) => out.push({ kind: 'photo', id: q.id || '', cap: q.cap || '', at: q.at || 0, where: sh.title + ' · ' + it.label }));
        else if (v && (v.id || v.k)) out.push({ kind: it.t, id: v.id || '', cap: v.cap || '', at: v.at || 0, where: sh.title + ' · ' + it.label });
      });
      const s = parse((get('sheet.' + sh.id) || {}).answer, {});
      (s.extra || []).forEach((x) => {
        const v = x.v || {};
        if (x.kind === 'photo') (v.list || (v.k ? [v] : [])).forEach((q) => out.push({ kind: 'photo', id: q.id || '', cap: q.cap || '', at: q.at || x.at || 0, where: sh.title + ' · added' }));
        else if (x.kind === 'sketch' && (v.id || v.k)) out.push({ kind: 'sketch', id: v.id || '', cap: '', at: v.at || x.at || 0, where: sh.title + ' · added' });
      });
    });
    return out;
  }
  const NEA = (window.NEA = { score, words, lines, media, parse, JUST,
    flags: { blank: 'Left blank', thin: 'Much shorter than expected', 'no-why': 'Decisions not justified (no “because…”)', 'no-numbers': 'No measurements or data', 'short-list': 'Fewer points / ideas than expected', gaps: 'Misses half or more of what the criteria look for', 'no-caption': 'Photo without a caption' } });
  NEA.define = (o) => {
    NEA.sections = o.sections; NEA.total = o.sections.reduce((a, s) => a + s.marks, 0);
    Object.assign(NEA.flags, o.flags || {}); NEA.board = o.board || 'NEA';
    NEA.field = (id) => { for (const s of o.sections) for (const f of s.fields) if (f.id === id) return f; return null; };
  };
})();
