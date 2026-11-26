/* Where each diagram goes in the GCSE booklets. The drawings are shared with the A level app
   (alevel-revision/src/diagrams); this file only says which page gets which. See the A level copy for the options. */
(() => {
 const PLACE = {
  g14: {
   'Wastage processes': { fig: ['centre-lathe', 'milling'], label: ['centre-lathe'] },
   'Addition processes': { fig: ['mig-welding', 'fdm-printer'], label: ['fdm-printer'] },
   'Deforming and reforming processes': { fig: ['vacuum-forming', 'injection-moulding', 'blow-moulding', 'extrusion', 'sand-casting', 'press-forming'], label: ['injection-moulding', 'extrusion'], stages: ['vacuum-forming', 'blow-moulding'],
     draw: [['Using notes and/or sketches, **describe** the process of vacuum forming in detail.', 5, ['A mould is placed on the platen and a thermoforming sheet such as HIPS is clamped above it', 'The heater softens the sheet until it is flexible', 'The platen is raised so the mould pushes into the sheet', 'The vacuum pump removes the air, so the sheet is pulled tightly over the mould', 'The sheet cools, is unclamped, and the waste is trimmed off', '5 marks: all stages, in order, clearly labelled, with correct terms. 3–4: most stages. 1–2: a basic outline'], 'vacuum-forming'],
            ['Using notes and/or sketches, **describe** the process of injection moulding in detail.', 5, ['Polymer granules are fed from the hopper into a heated barrel', 'A rotating screw moves the polymer forward while heaters melt it', 'The screw pushes the molten polymer through the nozzle into the closed mould', 'The polymer cools and solidifies in the mould', 'The mould opens and ejector pins push the part out', '5 marks: all stages, in order, clearly labelled, with correct terms. 3–4: most stages. 1–2: a basic outline'], 'injection-moulding']] },
   'Commercial processes': { fig: ['offset-litho', 'die-casting'], label: ['offset-litho'] },
   'Quality control and exam practice': { fig: ['go-no-go'] },
  },
  g8: { 'The five forces': { fig: ['forces'] } },
  g10: { 'Timber and paper': { fig: ['timber-conversion'] } },
  g6: { 'Timbers: natural and manufactured': { fig: ['manufactured-boards'] }, 'Textiles: fibres and fabrics': { fig: ['weaves'] } },
  g3: { 'Composite materials': { fig: ['composite-layup'], label: ['composite-layup'] } },
  g15: { 'Finishes for metals and polymers': { fig: ['powder-coating'] }, 'Papers, boards, textiles, systems and exam practice': { fig: ['screen-printing'] } },
  g22: { 'Techniques, processes and finishes': { fig: ['wood-joints', 'laminating'] }, 'Tools, equipment and working safely': { fig: ['laser-cutter'], label: ['laser-cutter'] } },
 };
 BOOKLETS.forEach((bk) => { const map = PLACE[bk.id]; if (!map || !bk.pages) return; bk.pages.forEach((pg) => { const m = map[pg.t]; if (!m) return;
   const figs = (m.fig || []).map((id) => ({ fig: id }));
   const acts = (m.label || []).map((id) => ({ label: id })).concat((m.stages || []).map((id) => ({ stages: id })));
   if (m.draw) acts.push({ eh: 'Draw it on paper', exam: m.draw.map(([q, mk, ms, fig]) => [q, mk, ms, 'sketch', fig]) });
   let i = pg.blocks.findIndex((b) => b.notes); pg.blocks.splice(i < 0 ? 0 : i + 1, 0, ...figs);
   let j = pg.blocks.findIndex((b) => b.exam); if (j < 0) j = pg.blocks.findIndex((b) => b.nea); pg.blocks.splice(j < 0 ? pg.blocks.length : j, 0, ...acts); }); });
})();
