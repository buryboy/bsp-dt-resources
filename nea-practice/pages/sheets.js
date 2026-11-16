// The whole practice folder as A3 landscape sheets: two intro sheets, the section sheets from rubric.js, and a check-yourself sheet.
(function () {
  const P = BOOK_CONFIG.project || {}, START = { key: 'Start', col: 'Start', title: 'Your practice NEA' }, END = { key: 'End', col: 'Finish', title: 'Looking back' };
  const marks = `<h3>The six sections</h3><table><tr><th>Section</th><th>What you do</th><th>Marks</th><th>Real NEA</th></tr>${NEA.sections.map((s) => `<tr><td><b>${s.key}</b></td><td>${s.title}</td><td>${s.marks}</td><td>~${s.hours} h</td></tr>`).join('')}<tr><td></td><td><b>Total</b></td><td><b>${NEA.total}</b></td><td>30–35 h</td></tr></table>`;
  const how = `<h3>How this practice folder works</h3>Each page is one A3 sheet, like your PowerPoint folder. Pinch to zoom in on a box. Write in the boxes, add photos of your sketchbook and models, and draw straight onto sketch frames with an Apple Pencil. Use <b>⤧ Arrange</b> to move and resize things, <b>＋</b> to add more, and <b>⬇ PDF</b> to download your folder.`;
  Sheets.pages({
    intro: [
      { sec: START, sheet: { id: 'intro-nea', title: 'What is the NEA?', guide: { what: 'The NEA is one design-and-make project worth <b>50%</b> of your GCSE: a working prototype and a concise A3 design folder (about 20 sheets).', why: 'This practice run lets you try every section once, on a small project, before the real thing.', tips: ['C, D, E and F are worth twice as much as A and B. Plan your time to match.'] },
        items: [{ t: 'html', id: 'marks', html: marks, at: [0, 0, 7, 7] }, { t: 'html', id: 'how', html: how, at: [7, 0, 5, 7] },
          { t: 'scale', id: 'p01.hardest', label: 'Section expected to be hardest', q: 'Before you start: which section do you expect to find hardest?', opts: NEA.sections.map((s) => s.key + ': ' + s.title.split(' ')[0]), at: [0, 7, 12, 2] }] } },
      { sec: START, sheet: { id: 'intro-project', title: P.title || 'Your practice project', guide: { what: 'The challenge for this practice run, your time plan and your client.', tips: ['In the real NEA, AQA publishes three contextual challenges on 1 June and you pick one.'] },
        items: [{ t: 'html', id: 'brief', html: `<h3>The challenge</h3>${P.context || ''}${P.rules ? `<ul>${P.rules.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}`, at: [0, 0, 7, 5] },
          { t: 'text', f: { id: 'p0-plan', label: 'P1 Time plan', q: 'Which lessons will you spend on each section, and what will be finished by the end of each?', hint: 'One line per lesson or week.', words: 60, max: 0, list: 4, kw: [] }, at: [7, 0, 5, 5] },
          { t: 'text', f: { id: 'p0-client', label: 'P2 Your client', q: 'Who is your client, and when can you talk to them?', hint: 'A real person you can reach at least three times.', words: 40, max: 0, kw: [] }, at: [0, 5, 7, 4] },
          { t: 'photo', id: 'p0-context', label: 'A photo that sums up the context', at: [7, 5, 5, 4] }] } },
    ],
    outro: [
      { sec: END, sheet: { id: 'check', title: 'Check yourself', guide: { what: 'How confident are you that each section of this practice folder would convince a moderator?', tips: ['Be honest: this is for you.'] },
        items: NEA.sections.map((s, i) => ({ t: 'scale', id: 'p09.conf-' + s.key, label: 'Confidence: section ' + s.key, q: `<b>${s.key}</b> · ${s.title}`, opts: ['not yet', 'getting there', 'fairly sure', 'confident'], at: [0, i * 1.5, 7, 1.5] }))
          .concat([{ t: 'text', f: { id: 'p9-targets', label: 'T1 Targets for the real NEA', q: 'Three specific targets, based on this practice run.', hint: 'One per line, e.g. “Interview my client before writing the spec”.', words: 50, max: 0, list: 3, kw: [] }, at: [7, 0, 5, 9] }]) } },
    ],
  });
})();
