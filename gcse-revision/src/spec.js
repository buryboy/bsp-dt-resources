/* AQA GCSE Design and Technology 8552: course details for the revision app.
   The engine is shared with the A level app (alevel-revision/src/engine.js); APP below is what makes this one GCSE.
   The self-check rows live in the booklet files: each one calls SPEC.push([id, topic, code, title, points, question, marks, mark scheme]). */
const APP = {
  store: 'dt-revision-8552-v1', old: 'dt-selfcheck-8552-v0',
  title: 'GCSE Design & Technology revision',
  kick: 'AQA 8552 · Paper 1 · 2 hours · 100 marks',
  cls: '11D', file: 'GCSE DT revision', subject: 'GCSE D&T revision list', listHead: 'GCSE Design & Technology (AQA 8552) self-check',
  // topics are numbered 1 to 22 inside the app; this is what the student sees
  lab: { 1: '3.1.1', 2: '3.1.2', 3: '3.1.3', 4: '3.1.4', 5: '3.1.5', 6: '3.1.6', 7: '3.2.1', 8: '3.2.2', 9: '3.2.3', 10: '3.2.4', 11: '3.2.5', 12: '3.2.6', 13: '3.2.7', 14: '3.2.8', 15: '3.2.9',
    16: '3.3.1', 17: '3.3.2', 18: '3.3.3', 19: '3.3.4', 20: '3.3.5', 21: '3.3.6', 22: '3.3.7–11' },
  groups: [['Section A · Core technical principles (20 marks)', [1, 2, 3, 4, 5, 6]], ['Section B · Specialist technical principles (30 marks)', [7, 8, 9, 10, 11, 12, 13, 14, 15]], ['Section C · Designing and making principles (50 marks)', [16, 17, 18, 19, 20, 21, 22]]],
  lvWord: 'band',
  examIntro: 'Start with the command word (highlighted). Answer first: the mark scheme opens once you have written at least 15 characters. AQA gives <b>1 mark for a simple point</b> and <b>2 marks for a point that is explained</b>, so always add “because…” or “so that…”. Answers worth <b>6 marks or more</b> are marked by band. Questions that say <b>Draw</b> are done on paper. Then mark yourself honestly.',
  // AQA marks its longer answers (6 marks and up) by band: best fit, not by counting points. Band summaries are in our own words.
  LV: {
    6: [['Basic', '1–2', 'One or two simple points; little or no explanation; no examples'], ['Good', '3–4', 'Several relevant points, some explained; examples may be general rather than specific'], ['Thorough', '5–6', 'Detailed, well-explained points that answer the question asked; clear, specific examples']],
    8: [['Limited', '1–2', 'One or two simple points on one side only; no examples'], ['Basic', '3–4', 'Some relevant points; little explanation; no real judgement; few or no examples'], ['Good', '5–6', 'Both sides considered and explained; some relevant examples'], ['Detailed', '7–8', 'Both sides explained in detail and weighed up; relevant, specific examples throughout']],
    10: [['Limited', '1–2', 'One or two simple points; no explanation or examples'], ['Basic', '3–5', 'Some relevant points on one side; little explanation; few examples; no real judgement'], ['Good', '6–8', 'Points on both sides, mostly explained; relevant examples; some judgement'], ['Detailed', '9–10', 'Detailed, well-explained points on both sides; specific examples throughout; a clear, supported conclusion']],
    9: [['Basic', '1–3', 'A few simple points; little explanation; no examples'], ['Good', '4–6', 'Relevant points, mostly explained; some examples; a simple judgement'], ['Thorough', '7–9', 'Detailed, well-explained points on all parts of the question; specific examples; a supported judgement']],
  },
  levelled: (q, m) => m >= 6 && !/\*\*(Calculate|Complete|Draw|Sketch|Give)\*\*/i.test(q),
};
const TOPICS = { 1: 'New and emerging technologies', 2: 'Energy generation and storage', 3: 'Developments in new materials', 4: 'Systems approach to designing', 5: 'Mechanical devices', 6: 'Materials and their working properties',
  7: 'Selection of materials or components', 8: 'Forces and stresses', 9: 'Ecological and social footprint', 10: 'Sources and origins', 11: 'Using and working with materials', 12: 'Stock forms, types and sizes', 13: 'Scales of production', 14: 'Specialist techniques and processes', 15: 'Surface treatments and finishes',
  16: 'Investigation, primary and secondary data', 17: 'Environmental, social and economic challenge', 18: 'The work of others', 19: 'Design strategies', 20: 'Communication of design ideas', 21: 'Prototype development', 22: 'Making: materials, tolerances, tools and techniques' };
const SPEC = [];
