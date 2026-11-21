// iPad version of the level-based activities (Woods & Timbers, KS3 Electronics): no data sent anywhere.
// Loaded at the top of every page in <activity>/ipad/ (made by book-kit/tools/make_solo_pages.py).
// Adds a "Save as PDF" button: a picture of the whole page with the student's name, page and time on it, in an A4 PDF,
// handed to the iPad's share sheet (Showbie, Save to Files). Also registers the offline cache (sw.js).
(function () {
  'use strict';
  window.SOLO = true;
  // keep 3D (WebGL) drawings readable so they appear in the PDF instead of a black box
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, opts) { if (/webgl/.test(type)) opts = Object.assign({}, opts, { preserveDrawingBuffer: true }); return gc.call(this, type, opts); };
  const KIT = new URL('.', document.currentScript.src).href, VENDOR = new URL('../nea-kit/vendor/', KIT).href;
  { const s = document.createElement('script'); s.src = KIT + 'install-help.js'; document.head.appendChild(s); } // how to add it to the home screen
  if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k) || ''; localStorage.setItem(k, v); } catch (e) { return ''; } };
  const loadScript = (src) => new Promise((res, rej) => { if ([...document.scripts].some((s) => s.src === src)) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('could not load ' + src)); document.head.appendChild(s); });
  const safe = (s) => String(s || '').replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const who = () => ({ name: ls('solo-name') || ls('wt-name'), cls: ls('solo-class') || ls('wt-class') });

  function overlay(html) { const d = document.createElement('div'); d.className = 'solo-ov'; d.innerHTML = `<div class="solo-card">${html}</div>`; document.body.appendChild(d); return d; }
  function askName() {
    return new Promise((res) => {
      const w = who(), ov = overlay(`<b>Who is this work by?</b><label>Your name</label><input id="so-n" value="${esc(w.name)}" autocomplete="name" placeholder="First name and surname"><label>Your class</label><input id="so-c" value="${esc(w.cls)}" placeholder="e.g. 8B"><div class="solo-btns"><button class="solo-b" data-a="ok">Save PDF</button><button class="solo-b ghost" data-a="x">Cancel</button></div>`);
      ov.addEventListener('click', (e) => {
        const a = e.target.closest('button'); if (!a) return;
        if (a.dataset.a === 'x') { ov.remove(); return res(null); }
        const n = ov.querySelector('#so-n').value.trim(); if (!n) return ov.querySelector('#so-n').focus();
        ls('solo-name', n); ls('solo-class', ov.querySelector('#so-c').value.trim()); ov.remove(); res(who());
      });
    });
  }
  function offer(file, pdf) {
    const ov = overlay(`<b>Your PDF is ready</b><p>${esc(file.name)}</p><p class="solo-small">Tap <b>Share / save</b>, then choose <b>Showbie</b> to hand it in, or <b>Save to Files</b>.</p><div class="solo-btns"><button class="solo-b" data-a="share">Share / save</button><button class="solo-b ghost" data-a="close">Close</button></div>`);
    ov.addEventListener('click', async (e) => {
      const a = e.target.closest('button'); if (!a) return;
      if (a.dataset.a === 'close') return ov.remove();
      try { if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: file.name }); else pdf.save(file.name); ov.remove(); }
      catch (err) { if (err && err.name === 'AbortError') return; pdf.save(file.name); ov.remove(); }
    });
  }
  function addTall(pdf, canvas) {
    const W = 210, H = 297, M = 8, iw = W - 2 * M, k = canvas.width / iw, slice = Math.floor((H - 2 * M) * k);
    for (let y = 0, i = 0; y < canvas.height; y += slice, i++) {
      const h = Math.min(slice, canvas.height - y), c = document.createElement('canvas'); c.width = canvas.width; c.height = h;
      c.getContext('2d').drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (i) pdf.addPage('a4', 'portrait');
      pdf.addImage(c.toDataURL('image/jpeg', 0.8), 'JPEG', M, M, iw, h / k);
    }
  }
  // el: what to photograph (default the whole page); label: what goes in the header and file name
  async function save(el, label) {
    const w = who().name ? who() : await askName(); if (!w) return;
    const ov = overlay('<b>Making your PDF…</b><p class="solo-small">This takes a few seconds.</p>');
    try {
      await Promise.all([loadScript(VENDOR + 'html2canvas.min.js'), loadScript(VENDOR + 'jspdf.umd.min.js')]);
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const target = el || document.body, title = label || document.title.split('·')[0].trim();
      const head = `<div class="solo-head"><b>${esc(w.name)}</b>${w.cls ? ' · ' + esc(w.cls) : ''}<span>${esc(title)}</span><span>${esc(new Date().toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</span></div>`;
      const full = target === document.body;
      const canvas = await window.html2canvas(target, {
        scale: 1.5, logging: false, useCORS: true, backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff',
        width: full ? document.documentElement.scrollWidth : undefined, height: full ? document.documentElement.scrollHeight + 70 : undefined,
        windowWidth: document.documentElement.scrollWidth, windowHeight: full ? document.documentElement.scrollHeight + 70 : undefined,
        onclone: (doc, c) => { doc.querySelectorAll('.solo-fab, .solo-ov').forEach((x) => x.remove()); c.insertAdjacentHTML('afterbegin', head); if (!full) { c.style.maxHeight = 'none'; c.style.overflow = 'visible'; } },
      });
      const pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      addTall(pdf, canvas);
      const file = new File([pdf.output('blob')], `${safe(w.name)} - ${safe(title)}.pdf`, { type: 'application/pdf' });
      ov.remove(); offer(file, pdf);
    } catch (e) { console.error(e); ov.remove(); alert('Sorry, the PDF could not be made: ' + (e.message || e)); }
  }
  window.SoloPDF = { save, saveEl: (el, label) => save(el, label) };

  addEventListener('DOMContentLoaded', () => {
    const css = document.createElement('style');
    css.textContent = `
    .solo-fab { position: fixed; right: 14px; bottom: calc(14px + env(safe-area-inset-bottom)); z-index: 9000; font: 700 16px system-ui, -apple-system, sans-serif; color: #fff; background: #1f4d36; border: 3px solid #fff; border-radius: 999px; padding: 12px 18px; box-shadow: 0 6px 18px rgba(0,0,0,.3); cursor: pointer; }
    .solo-head { display: flex; flex-wrap: wrap; gap: 6px 18px; align-items: baseline; padding: 12px 16px; margin: 0 0 12px; background: #fff; border-bottom: 3px solid #1f4d36; font: 600 15px system-ui, -apple-system, sans-serif; color: #1f2a24; }
    .solo-head b { font-size: 18px; } .solo-head span { color: #4b5a51; }
    .solo-ov { position: fixed; inset: 0; z-index: 9500; display: grid; place-items: center; background: rgba(15,20,17,.55); padding: 20px; }
    .solo-card { background: #fffdf7; color: #1d2b24; border-radius: 16px; padding: 22px 24px; max-width: 420px; width: 100%; box-shadow: 0 18px 40px rgba(0,0,0,.35); font: 400 17px/1.4 system-ui, -apple-system, sans-serif; text-align: left; }
    .solo-card b { font-size: 20px; } .solo-card p { margin: 8px 0; word-break: break-word; } .solo-small { font-size: 15px; color: #4b5a51; }
    .solo-card label { display: block; font: 600 13px system-ui, sans-serif; margin: 12px 0 4px; color: #4b5a51; }
    .solo-card input { width: 100%; box-sizing: border-box; font: 400 18px system-ui, sans-serif; padding: 10px 12px; border: 2px solid #cfd8d2; border-radius: 10px; }
    .solo-btns { display: flex; gap: 10px; margin-top: 16px; }
    .solo-b { font: 700 17px system-ui, sans-serif; padding: 10px 16px; border-radius: 10px; border: 0; background: #1f4d36; color: #fff; cursor: pointer; } .solo-b.ghost { background: #e6ece8; color: #1f4d36; }`;
    document.head.appendChild(css);
    const b = document.createElement('button'); b.className = 'solo-fab'; b.textContent = '📄 Save as PDF'; b.onclick = () => save();
    document.body.appendChild(b);
  });
})();
