// NEA practice book: photos of sketches, models and making, kept with the workbook.
// Students add photos (camera, file, paste or drag) to a section's gallery, tag each to a box and caption it.
// Each photo is shrunk to ~1600 px JPEG, kept on the device (IndexedDB) and uploaded privately to the teacher's Google Drive.
(function () {
  'use strict';
  const C = window.BOOK_CONFIG || {}, esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // ---- tiny IndexedDB store: key -> dataURL
  let dbp = null;
  const db = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open('nea-photos', 1); r.onupgradeneeded = () => r.result.createObjectStore('p'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const idb = async (mode, fn) => { const d = await db(); return new Promise((res, rej) => { const t = d.transaction('p', mode), s = t.objectStore('p'), q = fn(s); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  const put = (k, v) => idb('readwrite', (s) => s.put(v, k)).catch(() => {});
  const get = (k) => idb('readonly', (s) => s.get(k)).catch(() => null);
  const del = (k) => idb('readwrite', (s) => s.delete(k)).catch(() => {});
  const key = (k) => C.lesson + '|' + k;

  // shrink to max 1600 px, JPEG ~0.82
  async function shrink(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const s = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', 0.82);
    } finally { URL.revokeObjectURL(url); }
  }
  const post = async (body) => { const r = await fetch(C.backend, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'text/plain;charset=utf-8' } }); return r.json(); };
  const student = () => (Book.state || {}).student;

  function lightbox(src, cap) {
    const d = document.createElement('div'); d.className = 'lightbox';
    d.innerHTML = `<img src="${src}" alt=""><p>${esc(cap || '')}</p>`; d.onclick = () => d.remove(); document.body.appendChild(d);
  }

  // one gallery per section page
  window.neaGallery = (ui, sec) => {
    const r = ui.record('nea.' + sec.key.toLowerCase() + '.photos', { label: `${sec.key} Photos of sketches, models & making`, type: 'photos', max: 0 });
    const boxes = [['', 'General']].concat(sec.fields.map((f) => [f.id, f.label]));
    const d = ui.el('div', 'act nea-gallery');
    d.innerHTML = `<p class="q"><b>${sec.key}📷</b>Your sketchbook evidence</p>
      <p>Photograph your sketches, models and making for this section and add them here, so the whole record of your work stays in one place. Tag each photo to the box it supports and give it a caption that says what it shows.</p>
      <p class="hint">On a phone or iPad, “Add photos” opens the camera. On a laptop you can also paste a picture (Ctrl/⌘ V) or drag one onto any box on this page.</p>
      <label class="btn ghost addph">📷 Add photos<input type="file" accept="image/*" multiple hidden></label><div class="ph-grid"></div>`;
    requestAnimationFrame(() => Ink.frame(d, { shadow: false }));
    const grid = d.querySelector('.ph-grid');
    let list = []; try { list = JSON.parse((r.get() || {}).answer || '[]'); } catch (e) { list = []; }
    const status = {};
    const commit = () => r.set({ answer: list.length ? JSON.stringify(list) : '', correct: null, mis: list.some((p) => !p.cap) ? 'no-caption' : '' });

    async function upload(p) {
      const s = student(); if (!s || !C.backend) { status[p.k] = 'wait'; return paint(); }
      const data = await get(key(p.k)); if (!data) { status[p.k] = 'lost'; return paint(); }
      status[p.k] = 'up'; paint();
      try {
        const j = await post({ a: 'img', lesson: C.lesson, student: s, box: p.box, cap: p.cap, at: p.at, data });
        if (!j.ok) throw new Error(j.error);
        p.id = j.id; status[p.k] = 'ok'; commit(); Book.saveNow && Book.saveNow();
      } catch (e) { status[p.k] = 'wait'; }
      paint();
    }
    async function thumb(p, img) {
      let src = await get(key(p.k));
      if (!src && p.id && student()) { // photo taken on another device: fetch a small copy
        try { const j = await (await fetch(C.backend + '?a=img&size=thumb&id=' + encodeURIComponent(p.id) + '&email=' + encodeURIComponent(student().email))).json(); if (j.ok) src = j.data; } catch (e) {}
      }
      if (src) img.src = src; else img.alt = 'photo not on this device';
      img.onclick = async () => {
        let big = await get(key(p.k));
        if (!big && p.id) { try { const j = await (await fetch(C.backend + '?a=img&id=' + encodeURIComponent(p.id) + '&email=' + encodeURIComponent(student().email))).json(); if (j.ok) big = j.data; } catch (e) {} }
        if (big || src) lightbox(big || src, p.cap);
      };
    }
    function paint() {
      grid.innerHTML = list.length ? '' : '<p class="small muted">No photos yet.</p>';
      list.forEach((p, i) => {
        const st = status[p.k] || (p.id ? 'ok' : 'wait');
        const c = document.createElement('div'); c.className = 'ph';
        c.innerHTML = `<img alt=""><select>${boxes.map(([v, t]) => `<option value="${v}" ${v === p.box ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
          <textarea rows="3" placeholder="What does this show? What did you learn from it?">${esc(p.cap || '')}</textarea>
          <div class="ph-foot"><span class="ph-st ${st}">${{ ok: 'saved ✓', up: 'uploading…', wait: 'not uploaded yet', lost: 'missing on this device' }[st]}</span><span>${new Date(p.at).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span><button class="ph-del" title="Remove">✕</button></div>`;
        thumb(p, c.querySelector('img'));
        c.querySelector('select').onchange = (e) => { p.box = e.target.value; commit(); };
        c.querySelector('textarea').onchange = (e) => { p.cap = e.target.value.trim(); commit(); };
        const x = c.querySelector('.ph-del');
        x.onclick = async () => {
          if (!x.classList.contains('sure')) { x.classList.add('sure'); x.textContent = 'Delete?'; setTimeout(() => { x.classList.remove('sure'); x.textContent = '✕'; }, 3000); return; }
          list.splice(i, 1); commit(); paint(); del(key(p.k));
          if (p.id && student()) post({ a: 'imgdel', id: p.id, student: student() }).catch(() => {});
        };
        grid.appendChild(c);
      });
    }
    const add = async (files, box) => {
      if (!student()) return Book.toast('Sign in on the cover first');
      for (const f of files) {
        if (!/^image\//.test(f.type)) continue;
        let data; try { data = await shrink(f); } catch (e) { Book.toast('Could not read that picture'); continue; }
        const p = { k: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), id: '', box: box || '', cap: '', at: Date.now() };
        await put(key(p.k), data); list.push(p); commit(); paint(); upload(p);
      }
      d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    d.querySelector('input[type=file]').onchange = (e) => { add([...e.target.files]); e.target.value = ''; };
    paint();
    list.filter((p) => !p.id).forEach(upload); // retry anything that did not upload last time
    addEventListener('online', () => list.filter((p) => !p.id).forEach(upload));
    // paste / drop on the gallery or any box on the page
    const root = ui.root;
    const pick = (e, dt) => { const fs = [...(dt && dt.files ? dt.files : [])].filter((f) => /^image\//.test(f.type)); if (!fs.length) return false; e.preventDefault(); const fld = e.target.closest && e.target.closest('[data-box]'); add(fs, fld ? fld.dataset.box : ''); return true; };
    root.addEventListener('paste', (e) => pick(e, e.clipboardData));
    root.addEventListener('dragover', (e) => { if ([...(e.dataTransfer.items || [])].some((i) => i.kind === 'file')) { e.preventDefault(); (e.target.closest('.act') || d).classList.add('drop'); } });
    root.addEventListener('dragleave', (e) => { const a = e.target.closest && e.target.closest('.act'); a && a.classList.remove('drop'); });
    root.addEventListener('drop', (e) => { root.querySelectorAll('.drop').forEach((x) => x.classList.remove('drop')); pick(e, e.dataTransfer); });
    return { add };
  };
})();
