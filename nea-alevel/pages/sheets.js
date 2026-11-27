// The A level practice portfolio as A3 landscape sheets: intro, the 11 assessment grids from rubric.js, and a self-review.
(function () {
  const P = BOOK_CONFIG.project || {}, START = { key: 'Start', col: 'Start', title: 'Component 2 practice' }, END = { key: 'End', col: 'Review', title: 'Self-review' };
  const grids = `<h3>The assessment grids</h3><table><tr><th>Grid</th><th>What is assessed</th><th>Marks</th></tr>${NEA.sections.map((s) => `<tr><td><b>${s.key.slice(1)}</b></td><td>${s.title}</td><td>${s.marks}</td></tr>`).join('')}<tr><td></td><td><b>Total</b></td><td><b>${NEA.total}</b></td></tr></table>`;
  const how = `<h3>Using this portfolio</h3><p>Each page is an A3 landscape sheet. Pinch or use the zoom buttons to work on a section. Write in the boxes, photograph and upload sketchbook pages, models and making, and draw directly onto sketch frames with an Apple Pencil.</p><p><b>⤧ Arrange</b> moves and resizes anything; <b>＋</b> adds text, photos or sketch frames; <b>⬇ PDF</b> exports the portfolio as A3 pages.</p>`;
  Sheets.pages({
    intro: [
      { sec: START, sheet: { id: 'al-intro', title: 'The independent design and make project', guide: { what: 'Component 2 is <b>50%</b> of the A level: a substantial design, make and evaluate project, presented as a portfolio of about 40 A3 sides plus the final prototype.', why: 'This practice run takes you through every assessment grid once, on a smaller project, so the real portfolio is deliberate rather than linear.', tips: ['Moderators repeatedly ask for a genuine client–designer relationship and a commercial approach. Build both from sheet one.'] },
        items: [{ t: 'html', id: 'grids', html: grids, at: [0, 0, 7, 9] }, { t: 'html', id: 'how', html: how, at: [7, 0, 5, 6] },
          { t: 'scale', id: 'al.confidence', label: 'Starting confidence', q: 'How confident are you about running an independent project?', opts: ['low', 'moderate', 'good', 'high'], at: [7, 6, 5, 3] }] } },
      { sec: START, sheet: { id: 'al-project', title: P.title || 'Practice context', guide: { what: 'The practice context, your plan and your client.', tips: ['Choose a client you can genuinely reach. Assessors can tell when the client is fictional.'] },
          items: [{ t: 'html', id: 'ctx', html: `<h3>Context</h3><p>${P.context || ''}</p>${P.rules ? `<ul>${P.rules.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}`, at: [0, 0, 7, 5] },
            { t: 'text', f: { id: 'al-plan', label: 'P1 Project plan', q: 'Outline your plan: milestones for each grid, and when you will consult your client.', hint: 'One milestone per line.', words: 80, max: 0, list: 5, kw: [] }, at: [7, 0, 5, 5] },
            { t: 'text', f: { id: 'al-client', label: 'P2 Client', q: 'Who is your client, what is their situation, and how will you stay in contact?', hint: 'Initials are fine.', words: 60, max: 0, kw: [] }, at: [0, 5, 7, 4] },
            { t: 'photo', id: 'al-context', label: 'The context', at: [7, 5, 5, 4] }] } },
    ],
    outro: [
      { sec: END, sheet: { id: 'al-review', title: 'Self-review against the grids', guide: { what: 'Judge your practice portfolio against each grid before the real project.', tips: ['Where would an assessor place you, honestly?'] },
        items: [{ t: 'html', id: 'band-note', html: '<p class="small">Rate each grid: 1 = superficial · 2 = partial · 3 = competent · 4 = comprehensive / perceptive.</p>', at: [0, 0, 7, 0.7] }]
          .concat(NEA.sections.map((s, i) => ({ t: 'scale', id: 'al.conf-' + s.key, label: 'Self-rating ' + s.col, q: `<b>${s.col}</b> · ${s.title}`, opts: ['1', '2', '3', '4'], at: [i % 2 ? 3.5 : 0, 0.7 + Math.floor(i / 2) * 1.38, 3.5, 1.38] })))
          .concat([{ t: 'text', f: { id: 'al-targets', label: 'T1 Targets for the real NEA', q: 'Three precise targets for your real portfolio, each tied to a grid.', hint: 'e.g. “Grid 5: use FEA to justify the wall thickness rather than guessing.”', words: 70, max: 0, list: 3, kw: [] }, at: [7, 0, 5, 9] }]) } },
    ],
  });
})();
