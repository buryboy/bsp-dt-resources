/* Where each diagram goes. This file runs after all the booklets and adds diagram blocks to their pages, so the
   drawings (diagrams/*.js) and the booklet text stay separate. For a page it can add:
     fig    labelled figures, placed straight after the page's first notes
     label  label-the-diagram activities          } placed just before the page's exam practice
     stages put-the-stage-pictures-in-order        }
     draw   [question, marks, mark scheme, diagram] a draw-it-on-paper exam question with a model sketch */
(() => {
 const PLACE = {
  t3: {
   'Printing processes': { fig: ['offset-litho', 'flexography', 'gravure', 'screen-printing'], label: ['offset-litho', 'screen-printing'],
     draw: [['Using labelled sketches, **describe** the process of offset lithography.', 4, ['Plate, blanket and impression cylinders shown in contact, with the paper passing between blanket and impression cylinders (1)', 'Inking and damping rollers shown on the plate cylinder (1)', 'Oil-based ink sticks to the image area; water keeps it off the non-image area (1)', 'The image is offset from the plate to the rubber blanket, then onto the paper (1)', 'Max 3 marks if there are no sketches, or sketches with no labels'], 'offset-litho']] },
   'Casting': { fig: ['sand-casting', 'die-casting', 'investment-casting'], label: ['die-casting', 'sand-casting'], stages: ['investment-casting'],
     draw: [['Using labelled sketches, **describe** the process of die-casting.', 4, ['Molten metal is ladled or fed into a shot chamber (1)', 'A hydraulic plunger forces the metal under high pressure into the cavity of a water-cooled steel die (1)', 'The metal solidifies quickly, and the moving die half opens (1)', 'Ejector pins push the casting out; sprue and flash are trimmed and the cycle repeats (1)', 'Max 3 marks if there are no sketches, or sketches with no labels'], 'die-casting']] },
   'Machining and sheet forming': { fig: ['centre-lathe', 'milling', 'press-forming'], label: ['centre-lathe', 'milling'],
     draw: [['Using labelled sketches, **describe** how a sheet-metal dish is press formed.', 4, ['A flat sheet-metal blank is placed over the die (1)', 'A blank holder (pressure pad) grips the edge to stop it wrinkling (1)', 'The punch is forced down by a hydraulic or mechanical press, drawing the sheet into the die (1)', 'The punch withdraws and the formed part is ejected; the edge is trimmed (1)', 'Max 3 marks if there are no sketches, or sketches with no labels'], 'press-forming']] },
   'Moulding, extrusion and lamination': { fig: ['injection-moulding', 'extrusion', 'blow-moulding', 'vacuum-forming', 'rotational-moulding', 'compression-moulding', 'laminating'], label: ['injection-moulding', 'extrusion', 'compression-moulding'], stages: ['blow-moulding', 'vacuum-forming', 'rotational-moulding'],
     draw: [['Using labelled sketches, **describe** the process of injection moulding.', 4, ['Polymer granules fall from the hopper into a heated barrel (1)', 'A rotating screw moves the polymer forward as heater bands melt it (1)', 'The screw acts as a ram, injecting the melt through the nozzle into the closed, water-cooled mould (1)', 'The polymer cools and sets, the mould opens and ejector pins push the moulding out (1)', 'Max 3 marks if there are no sketches, or sketches with no labels'], 'injection-moulding'],
            ['Using labelled sketches, **describe** how a polymer bottle is made by extrusion blow moulding.', 4, ['A tube of hot polymer (the parison) is extruded downwards between the open mould halves (1)', 'The mould closes, sealing the bottom of the parison (1)', 'Compressed air is blown in so the parison expands to the shape of the mould (1)', 'It cools against the mould, the mould opens, and the bottle is ejected and trimmed (1)', 'Max 3 marks if there are no sketches, or sketches with no labels'], 'blow-moulding']] },
   'Marking out, measuring and quality control tools': { fig: ['go-no-go'] },
   'Joining': { fig: ['wood-joints', 'mig-welding'], label: ['mig-welding'] },
   'Finishing and preservation': { fig: ['powder-coating'], label: ['powder-coating'] },
  },
  t1: { 'Woods': { fig: ['timber-conversion'] }, 'Composites and manufactured boards': { fig: ['manufactured-boards', 'composite-layup'], label: ['composite-layup'] }, 'Textiles': { fig: ['weaves'] } },
  t2: { 'Forces, stress and how materials fail': { fig: ['forces', 'stress-strain'], label: ['stress-strain'] }, 'Testing materials': { fig: ['tensile-test', 'hardness-test', 'impact-test'], label: ['tensile-test', 'impact-test'] } },
  t4: { 'CNC lathes, milling machines and routers': { fig: ['cnc-router'], label: ['cnc-router'] }, 'CNC laser cutters and vinyl cutters': { fig: ['laser-cutter'], label: ['laser-cutter'] }, 'Rapid prototyping (3D printing)': { fig: ['fdm-printer', 'sla-printer'], label: ['fdm-printer', 'sla-printer'] } },
  t8: { 'Quality control': { fig: ['control-chart', 'go-no-go'], label: ['control-chart'] } },
  t9: { 'End of life': { fig: ['waste-hierarchy'] } },
  t12: { 'The product life cycle': { fig: ['product-life-cycle'], label: ['product-life-cycle'] } },
 };
 BOOKLETS.forEach((bk) => { const map = PLACE[bk.id]; if (!map || !bk.pages) return; bk.pages.forEach((pg) => { const m = map[pg.t]; if (!m) return;
   const figs = (m.fig || []).map((id) => ({ fig: id }));
   const acts = (m.label || []).map((id) => ({ label: id })).concat((m.stages || []).map((id) => ({ stages: id })));
   if (m.draw) acts.push({ eh: 'Draw it on paper', exam: m.draw.map(([q, mk, ms, fig]) => [q, mk, ms, 'sketch', fig]) });
   let i = pg.blocks.findIndex((b) => b.notes); pg.blocks.splice(i < 0 ? 0 : i + 1, 0, ...figs);
   let j = pg.blocks.findIndex((b) => b.exam); if (j < 0) j = pg.blocks.findIndex((b) => b.nea); pg.blocks.splice(j < 0 ? pg.blocks.length : j, 0, ...acts); }); });
})();
