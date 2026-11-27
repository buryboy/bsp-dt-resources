/* Motion kit: lets a diagram also be shown as an animation and as a 3D model.
   ANIMS[id]  = { stages: [[from, to, 'Name', 'What happens'], ...], draw: (t, uid) => svg markup, dur }      one cycle, t runs 0 to 1
             or { loop: true, watch: ['What to look for', ...], draw, dur }                                      a process that runs continuously
   MODELS[id] = { build: (M, variant) => ({ root, frame(t), parts: { key: ['Name', 'What it does'] }, front: [groups hidden when cut open], home: { t: [x, y, z], d } }),
                  stages (or the ones in ANIMS[id]), slider: 'Label' for a plain slider instead of a cycle, variants: ['...'] }
   The engine wraps any notes figure whose id is in ANIMS or MODELS in tabs: Diagram, Animation, 3D model.
   three.js is only fetched (from book-kit/three, cached for offline use) the first time a 3D tab is opened. */
const ANIMS = {}, MODELS = {};
// 2D drawing helpers that work in the machine's own units: S pixels per unit, (ox, oy) is where the origin sits, y is up
const U2 = (S, ox, oy) => {
  const ink = D.K.ink, f1 = (v) => +v.toFixed(1), X = (x) => f1(ox + x * S), Y = (y) => f1(oy - y * S);
  const sk = (w) => `stroke="${ink}" stroke-width="${w == null ? 2 : w}" stroke-linejoin="round" stroke-linecap="round"`;
  const col = (f) => D.K[f] || f || 'none';
  const R = (x0, x1, y0, y1, f, rx, w) => `<rect x="${X(x0)}" y="${Y(y1)}" width="${f1((x1 - x0) * S)}" height="${f1((y1 - y0) * S)}" rx="${rx || 0}" fill="${col(f)}" ${sk(w)}/>`;
  const PG = (pts, f, w, dx, dy) => `<polygon points="${pts.map((p) => X(p[0] + (dx || 0)) + ',' + Y(p[1] + (dy || 0))).join(' ')}" fill="${col(f)}" ${w === 0 ? 'stroke="none"' : sk(w)}/>`;
  const PL = (pts, w, c, dash) => `<polyline points="${pts.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ')}" fill="none" stroke="${col(c) === 'none' ? ink : col(c)}" stroke-width="${w || 2}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const C = (x, y, r, f, w) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${f1(r * S)}" fill="${col(f)}" ${sk(w)}/>`;
  const SH = (x0, x1, y0, y1) => `<rect x="${X(x0)}" y="${Y(y1)}" width="${f1((x1 - x0) * S)}" height="${f1((y1 - y0) * S)}" fill="#fff" opacity=".45"/>`;
  const AR = (x1, y1, x2, y2, c) => D.a(X(x1), Y(y1), X(x2), Y(y2), c || 'ink2', 3.5);
  const ROT = (x, y, r, a0, a1, c) => D.rot(X(x), Y(y), r * S, a0, a1, c);
  const T = (x, y, s, size, anchor, c) => FIGX.still === true ? '' : D.t(X(x), Y(y), s, size || 13, anchor, c);
  const both = (pf) => pf.concat(pf.slice().reverse().map((p) => [p[0], -p[1]]));
  const hatchDef = (id) => `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${ink}" stroke-width="1" opacity=".38"/></pattern>`;
  return { X, Y, S, R, PG, PL, C, SH, AR, ROT, T, both, sk, hatchDef, col };
};

const FIGX = (() => {
  const sm = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
  const mix = (a, b, t) => { const h = (c) => [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16)), A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  const has = (id) => !!(ANIMS[id] || MODELS[id]);
  const css = `.ftabs{display:flex;gap:6px;margin:0 0 8px;flex-wrap:wrap}
.ftabs button,.fchips button{font:600 14px/1.2 inherit;font-family:inherit;border:1.5px solid var(--line,#bbb);background:#f4f5f7;border-radius:7px;padding:8px 12px;cursor:pointer;color:var(--ink,#1f2328)}
.ftabs button.on{background:var(--ink,#1f2328);color:#fff;border-color:var(--ink,#1f2328)}
.fchips{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.fchips button{font-size:13.5px;padding:7px 10px}.fchips button.on{background:var(--acc2,#24539c);color:#fff;border-color:var(--acc2,#24539c)}
.fctl{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px}.fctl label{font-size:14px;font-weight:600}
.fctl input[type=range]{flex:1;min-width:150px;accent-color:var(--acc2,#24539c);height:30px;padding:0;border:0;background:none}
.fcap,.finfo{border-left:4px solid var(--acc2,#24539c);background:#f4f7fc;padding:8px 12px;border-radius:0 8px 8px 0;margin:8px 0 2px;font-size:15.5px;line-height:1.45;text-align:left}
.fcap{min-height:4.7em}.finfo{border-left-color:var(--acc,#b0402a);background:#fff;outline:1.5px solid var(--line,#bbb);outline-offset:-1.5px;min-height:3.2em}
.fwatch{margin:8px 0 2px;padding-left:24px;font-size:15.5px;text-align:left}.fwatch li{margin:3px 0}.fwatch li::marker{color:#3b5bdb;font-weight:700}
.f3d{position:relative;aspect-ratio:16/10;background:linear-gradient(#fff,#f1f2ee);border-radius:6px;overflow:hidden;touch-action:none}
.f3d canvas{display:block;width:100%;height:100%;cursor:grab}.f3d .fhint{position:absolute;left:10px;bottom:7px;font-size:12px;color:#5f6670;pointer-events:none}
.f3d .fmsg{padding:24px;margin:0}
@media(max-width:640px){.f3d{aspect-ratio:4/3}}
.pdfmode .figx .ftabs{display:none}.pdfmode .figx .fpane{display:none!important}.pdfmode .figx .fpane[data-fp=still]{display:block!important}`;
  if (typeof document !== 'undefined') { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }

  // the engine calls this with the still figure's markup
  function wrap(id, still) {
    const tabs = [['still', 'Diagram'], ANIMS[id] && ['anim', 'Animation'], MODELS[id] && ['model', '3D model']].filter(Boolean);
    return `<div class="figx" data-fig="${id}"><div class="ftabs">${tabs.map((t, i) => `<button type="button" data-ft="${t[0]}"${i ? '' : ' class="on"'}>${t[1]}</button>`).join('')}</div>
      <div class="fpane" data-fp="still">${still}</div>${tabs.slice(1).map((t) => `<div class="fpane" data-fp="${t[0]}" hidden></div>`).join('')}</div>`;
  }

  // play button, slider, stage buttons and caption; calls onFrame(t) with t from 0 to 1
  function player(pane, cfg, onFrame) {
    const el = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; };
    const ctl = el('<div class="fctl"><button type="button" class="btn small fplay">Play</button></div>'), btn = ctl.firstChild; pane.appendChild(ctl);
    const st = cfg.stages, DUR = cfg.dur || 16000; let t = cfg.start == null ? .4 : cfg.start, playing = false, last = 0, shown = -1, rng, chips, cap;
    if (st) { rng = el('<input type="range" min="0" max="1000" aria-label="Position in the cycle">'); ctl.appendChild(rng); chips = el('<div class="fchips"></div>'); cap = el('<p class="fcap"></p>'); pane.appendChild(chips); pane.appendChild(cap);
      st.forEach((g, i) => { const b = el(`<button type="button">${i + 1} ${g[2]}</button>`); b.onclick = () => { stop(); set(g[4] != null ? g[4] : (g[0] + g[1]) / 2); }; chips.appendChild(b); });
      rng.oninput = () => { stop(); set(rng.value / 1000); }; }
    else if (cfg.watch) pane.appendChild(el(`<ol class="fwatch">${cfg.watch.map((w) => `<li>${w}</li>`).join('')}</ol>`));
    function set(v) { t = v; if (st) { rng.value = Math.round(t * 1000); let k = st.findIndex((g) => t >= g[0] && t < g[1]); if (k < 0) k = st.length - 1;
      if (k !== shown) { shown = k; [...chips.children].forEach((c, i) => c.classList.toggle('on', i === k)); cap.innerHTML = `<b>${k + 1}. ${st[k][2]}.</b> ${st[k][3]}`; } } onFrame(t); }
    function tick(now) { if (!playing) return; if (!pane.isConnected || pane.hidden) return stop(); const d = Math.min(80, now - last); last = now; set((t + d / DUR) % 1); requestAnimationFrame(tick); }
    function stop() { playing = false; btn.textContent = 'Play'; }
    btn.onclick = () => { if (playing) return stop(); playing = true; btn.textContent = 'Pause'; last = performance.now(); requestAnimationFrame(tick); };
    set(t); return { set, ctl };
  }

  function openAnim(pane, id) {
    const a = ANIMS[id], d = DIAGRAMS[id] || {}, box = document.createElement('div'); pane.appendChild(box);
    const frame = (t) => { box.innerHTML = `<svg class="dg" viewBox="0 0 ${a.w || d.w} ${a.h || d.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${(d.t || 'Diagram') + ', animated'}">${a.draw(t, 'a')}</svg>`; };
    const p = player(pane, a, frame); if (a.loop && !matchMedia('(prefers-reduced-motion: reduce)').matches) p.ctl.firstChild.click();
  }

  /* ---------- 3D ---------- */
  let threeP = null;
  const script = (src) => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const three = () => threeP || (threeP = (window.THREE ? Promise.resolve() : script('../../book-kit/three/three.min.js')).then(() => (THREE.OrbitControls ? 0 : script('../../book-kit/three/OrbitControls.js'))).catch((e) => { threeP = null; throw e; }));

  function openModel(pane, id) {
    const mdl = MODELS[id], host = document.createElement('div'); host.className = 'f3d'; host.innerHTML = '<p class="fmsg">Loading the 3D model…</p>'; pane.appendChild(host);
    three().then(() => mount(pane, host, id, mdl)).catch(() => { host.innerHTML = '<p class="fmsg">The 3D model could not load. Open the app once with the internet on, then it will work offline.</p>'; });
  }

  function mount(pane, host, id, mdl) {
    const K = D.K; let renderer; try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { host.innerHTML = '<p class="fmsg">This device cannot show the 3D model.</p>'; return; }
    host.innerHTML = '<span class="fhint">drag to turn · pinch to zoom · tap a part</span>'; host.insertBefore(renderer.domElement, host.firstChild);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.localClippingEnabled = true;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 1.6, .5, 600); scene.add(cam);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8bcc4, .42)); const sun = new THREE.DirectionalLight(0xffffff, .6); sun.position.set(-6, 9, 8); cam.add(sun);
    const ctl = new THREE.OrbitControls(cam, renderer.domElement); ctl.enableDamping = true; ctl.dampingFactor = .12; ctl.maxPolarAngle = Math.PI * .6;
    // toon shading in three steps so surfaces read as flat tones, like the drawings
    const ramp = new THREE.DataTexture(new Uint8Array([150, 150, 150, 215, 215, 215, 255, 255, 255]), 3, 1, THREE.RGBFormat); ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
    const hc = document.createElement('canvas'); hc.width = hc.height = 32; const hx = hc.getContext('2d'); hx.fillStyle = '#fff'; hx.fillRect(0, 0, 32, 32); hx.strokeStyle = 'rgba(31,35,40,.45)'; hx.lineWidth = 2; [-32, 0, 32].forEach((k) => { hx.beginPath(); hx.moveTo(k, 32); hx.lineTo(k + 32, 0); hx.stroke(); });
    const hatchTex = new THREE.CanvasTexture(hc); hatchTex.wrapS = hatchTex.wrapT = THREE.RepeatWrapping; hatchTex.repeat.set(2.2, 2.2);
    const c3 = (c) => K[c] || c;
    const toon = (c) => new THREE.MeshToonMaterial({ color: c3(c), gradientMap: ramp, side: THREE.DoubleSide });
    const flat = (c, hatch) => new THREE.MeshBasicMaterial({ color: c3(c), map: hatch ? hatchTex : null, side: THREE.DoubleSide });
    const ink = () => new THREE.LineBasicMaterial({ color: K.ink });
    let tagged = {};
    const tag = (key, ...objs) => { objs.forEach((o) => { o.userData.part = key; (tagged[key] = tagged[key] || []).push(o); }); return objs[0]; };
    const strip = (pos, n, m) => { const idx = []; for (let k = 0; k < n; k++) idx.push(2 * k, 2 * k + 1, 2 * k + 2, 2 * k + 1, 2 * k + 3, 2 * k + 2); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return new THREE.Mesh(g, m); };
    const line = (pts, m, loop) => new (loop ? THREE.LineLoop : THREE.Line)(new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]))), m || ink());
    // a shape turned about the x axis (or a vertical axis at cx). pf is a closed outline of [distance along the axis, radius].
    // Returns a back half with its cut face and a front half, so the part can be shown cut open; { whole: true } gives one uncut piece.
    function rev(pf, color, o) {
      o = o || {}; const vert = o.axis === 'y', cx = o.cx || 0, oy = o.oy || 0, oz = o.oz || 0, N = o.n || 40;
      const pt = (a, r, phi) => (vert ? [cx + r * Math.cos(phi), a, oz + r * Math.sin(phi)] : [a, oy + r * Math.cos(phi), oz + r * Math.sin(phi)]);
      const half = (p0, p1, withCap) => { const g = new THREE.Group(), m = toon(color), lm = ink(), n = Math.round(N * (p1 - p0) / (2 * Math.PI));
        for (let i = 0; i < pf.length; i++) { const A = pf[i], B = pf[(i + 1) % pf.length]; if (A[1] < 1e-6 && B[1] < 1e-6) continue;
          const pos = []; for (let k = 0; k <= n; k++) { const phi = p0 + (p1 - p0) * k / n; pos.push(...pt(A[0], A[1], phi), ...pt(B[0], B[1], phi)); } g.add(strip(pos, n, m));
          if (A[1] > 1e-6) { const lp = []; for (let k = 0; k <= n; k++) lp.push(pt(A[0], A[1], p0 + (p1 - p0) * k / n)); g.add(line(lp, lm)); } }
        if (withCap) { const cm = flat(o.cap || color, o.hatch); [1, -1].forEach((sg) => { const q = pf.map((p) => (vert ? [cx + sg * p[1], p[0]] : [p[0], oy + sg * p[1]]));
          const mesh = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(q.map((p) => new THREE.Vector2(p[0], p[1])))), cm); mesh.position.z = oz; g.add(mesh); g.add(line(q.map((p) => [p[0], p[1], oz + .012]), lm, true)); }); }
        return g; };
      if (o.whole) return { back: half(0, Math.PI * 2, false) };
      return { back: half(Math.PI, Math.PI * 2, true), front: half(0, Math.PI, false) };
    }
    const cyl = (x0, x1, r) => [[x0, 0], [x0, r], [x1, r], [x1, 0]];
    function box(x0, x1, y0, y1, z0, z1, color) { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), m = new THREE.Mesh(g, toon(color)); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), ink())); return m; }
    // a flat outline [[x, y], ...] pushed through a depth along z (from z0 to z1), with ink edges
    function slab(pts, z0, z1, color, holes) { const sh = new THREE.Shape(pts.map((p) => new THREE.Vector2(p[0], p[1]))); (holes || []).forEach((h) => sh.holes.push(new THREE.Path(h.map((p) => new THREE.Vector2(p[0], p[1])))));
      const g = new THREE.ExtrudeGeometry(sh, { depth: z1 - z0, bevelEnabled: false, curveSegments: 24 }), m = new THREE.Mesh(g, toon(color)); m.position.z = z0; m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 28), ink())); return m; }
    let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const M = { THREE, K, toon, flat, ink, tag, rev, cyl, box, slab, strip, line, rnd, sm, mix, hatchTex };

    let res, need = true, cut = true, lit = [];
    const info = document.createElement('p'); info.className = 'finfo'; info.innerHTML = '<b>Tap a part</b> of the model to see what it is and what it does.';
    function home() { const h = res.home || {}, tg = h.t || [0, 0, 0], d = (h.d || 50) * (host.clientWidth / host.clientHeight < 1.45 ? 1.3 : 1), v = h.v || [-.22, .3, .93]; ctl.target.set(tg[0], tg[1], tg[2]); cam.position.set(tg[0] + d * v[0], tg[1] + d * v[1], tg[2] + d * v[2]); ctl.minDistance = d * .22; ctl.maxDistance = d * 2.2; ctl.update(); need = true; }
    function setCut(v) { cut = v; (res.front || []).forEach((g) => { g.visible = !v; }); if (cutBtn) cutBtn.textContent = v ? 'Show it whole' : 'Cut it open'; need = true; }
    function pick(key) { lit.splice(0).forEach((m) => { if (m.emissive) m.emissive.setHex(0); else m.color.set(K.ink); });
      if (!key || !res.parts[key]) return; (tagged[key] || []).forEach((o) => o.traverse((c) => { const m = c.material; if (!m) return; if (m.emissive) { m.emissive.setHex(0x5a1408); lit.push(m); } else if (m.isLineBasicMaterial) { m.color.set('#b0402a'); lit.push(m); } }));
      info.innerHTML = `<b>${res.parts[key][0]}.</b> ${res.parts[key][1]}`; need = true; }
    function load(variant) { if (res) scene.remove(res.root); tagged = {}; lit = []; res = mdl.build(M, variant); scene.add(res.root); setCut(cut); need = true; }

    // controls under the model
    const el = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; };
    let cutBtn = null, value = mdl.slider ? (mdl.start || 0) : .4;
    if (mdl.variants) { const row = el('<div class="fchips"></div>'); mdl.variants.forEach((v, i) => { const b = el(`<button type="button"${i ? '' : ' class="on"'}>${v}</button>`); b.onclick = () => { [...row.children].forEach((c) => c.classList.toggle('on', c === b)); load(i); res.frame(value); home(); info.innerHTML = res.note || '<b>Tap a part</b> to see what it is.'; }; row.appendChild(b); }); pane.appendChild(row); }
    load(0);
    let ctlRow;
    if (mdl.slider) { ctlRow = el(`<div class="fctl"><label>${mdl.slider}</label><input type="range" min="0" max="1000" value="${Math.round(value * 1000)}" aria-label="${mdl.slider}"></div>`); pane.appendChild(ctlRow); ctlRow.lastChild.oninput = (e) => { value = e.target.value / 1000; res.frame(value); need = true; }; res.frame(value); }
    else { const p = player(pane, { stages: mdl.stages || (ANIMS[id] || {}).stages, dur: mdl.dur }, (t) => { value = t; res.frame(t); need = true; }); ctlRow = p.ctl; }
    if (res.front) { cutBtn = el('<button type="button" class="btn small ghost"></button>'); cutBtn.onclick = () => setCut(!cut); ctlRow.appendChild(cutBtn); setCut(true); }
    const rb = el('<button type="button" class="btn small ghost">Reset view</button>'); rb.onclick = home; ctlRow.appendChild(rb);
    pane.appendChild(info); if (res.note) info.innerHTML = res.note;

    // tap a part to name it
    const ray = new THREE.Raycaster(), cv = renderer.domElement; let down = null;
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    cv.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
    cv.addEventListener('pointerup', (e) => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return; const b = cv.getBoundingClientRect();
      ray.setFromCamera({ x: (e.clientX - b.left) / b.width * 2 - 1, y: -(e.clientY - b.top) / b.height * 2 + 1 }, cam);
      const hit = ray.intersectObjects(res.root.children, true).find((h) => h.object.isMesh && shown(h.object) && !(h.object.material.clippingPlanes || []).some((pl) => pl.distanceToPoint(h.point) < 0));
      let o = hit && hit.object; while (o && !o.userData.part) o = o.parent; pick(o ? o.userData.part : null); });
    function size() { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); need = true; }
    new ResizeObserver(size).observe(host); size(); home();
    ctl.addEventListener('change', () => { need = true; });
    (function loop() { if (!cv.isConnected) { renderer.dispose(); try { renderer.forceContextLoss(); } catch (e) { /* already gone */ } return; } requestAnimationFrame(loop); if (pane.hidden) return; ctl.update(); if (need) { need = false; renderer.render(scene, cam); } })();
    host.__m3 = { pick, setCut, frame: (t) => { res.frame(t); need = true; }, load };
  }

  if (typeof document !== 'undefined') document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.ftabs button'); if (!b) return; const fx = b.closest('.figx'), id = fx.dataset.fig, want = b.dataset.ft;
    fx.querySelectorAll('.ftabs button').forEach((x) => x.classList.toggle('on', x === b));
    fx.querySelectorAll('.fpane').forEach((p) => { p.hidden = p.dataset.fp !== want; });
    const pane = fx.querySelector(`.fpane[data-fp="${want}"]`); if (pane.dataset.ready || want === 'still') return; pane.dataset.ready = 1;
    if (want === 'anim') openAnim(pane, id); else openModel(pane, id);
  });
  return { has, wrap, sm, mix, still: false };   // still: set while a still picture is being drawn from an animation, so watch-point numbers (and, when true, captions) are left out
})();
