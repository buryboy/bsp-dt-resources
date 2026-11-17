/* Shared helpers for BSP D&T classroom tools. Everything stays on this device (localStorage); nothing is sent anywhere.
   TK.classes()                      → { 'Class name': ['Name', ...], ... }
   TK.saveClasses(obj)
   TK.classSelect(el, onChange)      → fills a <select class="tk-class"> with the saved classes (+ "Edit classes…" link); remembers the last choice
   TK.currentClass()                 → { name, students: [...] } or null
   TK.store(key, default) / TK.save(key, value)    per-tool JSON storage ('bsp-tools.<key>')
   TK.fullscreen(btn)                → wire a full-screen toggle button
   TK.idle(els, ms)                  → hide controls after ms without mouse movement (adds .idle)
   TK.beep(kind)                     → 'tick' | 'ding' | 'alarm' | 'tada' | 'buzz' short WebAudio sounds (no files)
   TK.shuffle(arr) / TK.pick(arr)
   TK.top(title)                     → inserts the standard top bar (← Tools link, title, theme toggle, full-screen) and returns its right-hand slot */
(function () {
  const K = 'bsp-tools.';
  const get = (k, d) => { try { const v = localStorage.getItem(K + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const set = (k, v) => { try { localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} };
  let ac;
  const tone = (f, t0, dur, type = 'sine', vol = 0.25) => {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, ac.currentTime + t0); g.gain.linearRampToValueAtTime(vol, ac.currentTime + t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t0 + dur);
    o.connect(g).connect(ac.destination); o.start(ac.currentTime + t0); o.stop(ac.currentTime + t0 + dur + 0.05);
  };
  const TK = {
    store: get, save: set,
    classes: () => get('classes', {}),
    saveClasses: (o) => set('classes', o),
    currentClass() { const c = TK.classes(), n = get('lastClass', ''); return c[n] ? { name: n, students: c[n].slice() } : null; },
    classSelect(el, onChange) {
      const fill = () => {
        const c = TK.classes(), last = get('lastClass', ''), names = Object.keys(c).sort();
        el.innerHTML = (names.length ? '' : '<option value="">No classes yet</option>') + names.map((n) => `<option ${n === last ? 'selected' : ''}>${n.replace(/</g, '&lt;')}</option>`).join('') + '<option value="__edit">✎ Edit classes…</option>';
        if (names.length && !c[last]) set('lastClass', names[0]);
      };
      fill();
      el.addEventListener('change', () => { if (el.value === '__edit') { location.href = (location.pathname.includes('/tools/') ? '' : 'tools/') + 'classes.html?back=' + encodeURIComponent(location.pathname.split('/').pop()); return; } set('lastClass', el.value); onChange && onChange(TK.currentClass()); });
      return { refresh: fill };
    },
    fullscreen(btn) { btn.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); }); },
    idle(els, ms = 3000) { let t; const wake = () => { els.forEach((e) => e.classList.remove('idle')); clearTimeout(t); t = setTimeout(() => els.forEach((e) => e.classList.add('idle')), ms); }; ['mousemove', 'pointerdown', 'touchstart', 'keydown'].forEach((ev) => addEventListener(ev, wake)); wake(); },
    beep(kind = 'ding') {
      try {
        if (kind === 'tick') tone(1200, 0, 0.05, 'square', 0.08);
        else if (kind === 'ding') { tone(880, 0, 0.6); tone(1320, 0.05, 0.5, 'sine', 0.12); }
        else if (kind === 'alarm') for (let i = 0; i < 6; i++) tone(i % 2 ? 660 : 880, i * 0.18, 0.16, 'square', 0.15);
        else if (kind === 'tada') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.5, 'triangle', 0.2));
        else if (kind === 'buzz') tone(140, 0, 0.5, 'sawtooth', 0.2);
      } catch (e) {}
    },
    shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    pick: (a) => a[Math.floor(Math.random() * a.length)],
    top(title) {
      const bar = document.createElement('div'); bar.className = 'tk-top';
      bar.innerHTML = `<a class="home" href="./">← Tools</a><h1>${title}</h1><span class="tk-slot"></span><button class="btn tk-theme" title="Light / dark" aria-label="Light / dark"><svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button><button class="btn tk-fs" title="Full screen" aria-label="Full screen"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4"/></svg></button>`;
      document.body.prepend(bar);
      if (get('dark', false)) document.body.classList.add('dark');
      bar.querySelector('.tk-theme').onclick = () => { document.body.classList.toggle('dark'); set('dark', document.body.classList.contains('dark')); };
      TK.fullscreen(bar.querySelector('.tk-fs'));
      return bar.querySelector('.tk-slot');
    },
  };
  window.TK = TK;
})();
