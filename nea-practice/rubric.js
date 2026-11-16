// NEA practice workbook: the six AQA 8552 NEA sections, every fill-in box, and the teacher-only indicative scoring.
// Loaded by the workbook (to build the pages and score each box) and by the teacher dashboard (to show the breakdown).
// Scores are a rough guide from length + what the writing covers. They are NOT a moderated mark and students never see them.
//
// A field:  { id, label, q, hint, words (aim), max (marks inside its section), kw: [[name, regex], ...],
//             why: true if it should justify (because / so that…), nums: true if it should contain measurements or data,
//             list: n if it should be a list of at least n lines (one idea / point per line) }
(function () {
  const S = [
    {
      key: 'A', title: 'Identifying & investigating design possibilities', marks: 10, hours: 4,
      what: 'You pick one of the contextual challenges, find out who has a problem inside it, and investigate their needs, wants and values. You look at existing products and the work of other designers, and you finish with a short list of design possibilities.',
      why: 'Everything later is judged against what you find here. If you never talk to a real client or user, your brief, your specification and your evaluation have nothing solid to stand on.',
      look: ['A real client or user, and their needs, wants and values investigated, not guessed', 'Research that leads somewhere: each piece ends with “so this means…”', 'Existing products and other designers’ work analysed, not just pictured', 'Social, moral, environmental and economic issues considered', 'A few clear design possibilities that grow out of the research'],
      tips: ['Interview your client early, then again before you write the specification.', 'Cut anything that does not change a decision. Moderators reward selective, relevant research.'],
      fields: [
        { id: 'a1', label: 'A1 Exploring the context', q: 'Explore the practice context. Who could have a problem here, where, and why does it matter to them?', hint: 'Think: people, places, activities, problems. Aim for three or four possible problems.', words: 120, max: 1.5, list: 3,
          kw: [['people affected', 'client|user|people|person|student|teacher|child|elderly|family|customer'], ['a problem or need', 'problem|need|issue|struggle|difficult|hard to|annoy'], ['where / when it happens', 'home|school|room|desk|kitchen|bedroom|outside|office|space|when|during'], ['why it matters', 'because|so that|which means|matters|important']] },
        { id: 'a2', label: 'A2 Client / user profile', q: 'Describe your client (a real person you can talk to) and the users. What do they need, want and value?', hint: 'Name (or initials), age, situation, what they do, what they like, what annoys them.', words: 120, max: 2,
          kw: [['who the client is', 'client|user|my (mum|dad|brother|sister|friend|teacher)|year \\d+|aged? \\d+|\\d+ years? old'], ['needs', 'need'], ['wants / likes', 'want|like|prefer|enjoy|favourite'], ['values', 'value|care about|important to|eco|sustainab|cheap|budget|quality|safe'], ['how you found out', 'ask|interview|told me|said|survey|questionnaire|observ']] },
        { id: 'a3', label: 'A3 Primary research', q: 'Record your primary research: interview, questionnaire or observation. What did you ask and what did you find?', hint: 'Include numbers if you can (e.g. 7 out of 10 people…). End with what it tells you.', words: 150, max: 2, nums: true, why: true,
          kw: [['method used', 'interview|questionnaire|survey|observ|asked|measured|photograph'], ['results / data', '\\d+ ?(%|out of|people|of the)|most|majority|few|half'], ['findings', 'found|showed|results?|discovered|learn'], ['what it means', 'so |this means|therefore|this tells|which shows|as a result|conclude']] },
        { id: 'a4', label: 'A4 Existing product analysis', q: 'Analyse one existing product that solves a similar problem (try ACCESS FM: aesthetics, cost, customer, environment, size, safety, function, materials).', hint: 'Say what is good, what is not, and what you will take from it.', words: 160, max: 2, nums: true,
          kw: [['aesthetics', 'aesthetic|look|colou?r|shape|style|form|texture'], ['cost', 'cost|price|£|€|\\$|cheap|expensive'], ['customer', 'customer|user|client|target|aimed at'], ['environment', 'environment|sustainab|recycl|eco|carbon|waste|reuse'], ['size', 'size|mm|cm|dimension|height|width|length|big|small'], ['safety', 'safe|safety|sharp|hazard|toxic|edge'], ['function', 'function|works|purpose|use[sd]?|hold|store'], ['materials', 'material|wood|timber|plastic|polymer|metal|steel|alumin|card|fabric|mdf|ply|acrylic|pine|oak'], ['what you will use', 'i will|i could|i would|my design|take from|inspire|improve']] },
        { id: 'a5', label: 'A5 Work of others', q: 'Look at a designer or company whose work links to your context. What do they do and how might it influence you?', hint: 'Name them, describe their style or approach, say what you could borrow.', words: 100, max: 1,
          kw: [['a named designer or company', '[A-Z][a-z]+ [A-Z][a-z]+|ikea|dyson|apple|muji|bauhaus|alessi|starck|eames|rams|braun|hay|vitra|designer|company|brand'], ['their style / approach', 'style|approach|known for|famous for|uses|minimal|organic|geometric|modern|classic'], ['influence on you', 'influence|inspire|i could|i will|my design|borrow|like how']] },
        { id: 'a6', label: 'A6 Design possibilities', q: 'Sum up your research. List two or three design possibilities it points to, and say which you will follow and why.', hint: 'One possibility per line, then your choice with a reason.', words: 100, max: 1.5, list: 2, why: true,
          kw: [['a summary of research', 'research|found|showed|client said|survey|from my'], ['possibilities', 'possib|could design|opportunit|idea|product that'], ['a decision', 'i will|i have chosen|i chose|going to|decided'], ['a reason', 'because|so that|as |since|therefore']] },
      ],
    },
    {
      key: 'B', title: 'Producing a design brief & specification', marks: 10, hours: 2,
      what: 'You turn the research into a short design brief (what you will design, for whom, and why) and a specification: a numbered list of the things your product must and should do.',
      why: 'The specification is the yardstick. Your ideas are checked against it, your models are tested against it, and your final evaluation goes through it point by point.',
      look: ['A clear, concise brief that names the client and the problem', 'A specification that comes from your research, not a generic list', 'Points that are measurable or testable (sizes, weights, costs, times)', 'Each point justified: why it matters to this client', 'The client involved in agreeing or changing it'],
      tips: ['If you cannot test a point, rewrite it until you can.', '“It must look nice” is not a specification point. “It must use the client’s colours: grey and teal” is.'],
      fields: [
        { id: 'b1', label: 'B1 Design brief', q: 'Write your design brief: the problem, who it is for, and what you will design and make.', hint: 'Three to five sentences. Name the client.', words: 70, max: 3,
          kw: [['the problem', 'problem|need|struggle|issue|difficult|lack'], ['the client / user', 'client|user|for [A-Z]|for my|people who'], ['what you will make', 'design and make|design a|make a|product|prototype|i will'], ['the context', 'context|home|school|space|room|environment']] },
        { id: 'b2', label: 'B2 Specification', q: 'Write at least eight specification points, one per line, each with a reason. Use numbers wherever you can.', hint: 'e.g. “It must be no wider than 300 mm, because the client’s shelf is 320 mm wide.”', words: 200, max: 5, list: 8, nums: true, why: true,
          kw: [['must / should wording', 'must|should|will need to'], ['measurable values', '\\d+ ?(mm|cm|m|kg|g|£|€|minutes|hours|n|°|%)'], ['reasons', 'because|so that|as the|since|this is'], ['function', 'function|hold|store|carry|support|open|close|fit'], ['user / ergonomics', 'user|client|ergonomic|anthropometric|grip|reach|comfort|easy'], ['materials / manufacture', 'material|made from|manufactur|cost|£|budget'], ['environment', 'environment|sustainab|recycl|waste|eco'], ['safety', 'safe|safety|edges|toxic|stable']] },
        { id: 'b3', label: 'B3 Client sign-off', q: 'Show your client the brief and specification. What did they say, and what did you change?', hint: 'Quote them if you can, and say exactly which points changed.', words: 70, max: 2, why: true,
          kw: [['the client’s response', 'client|user|said|told|feedback|agreed|liked'], ['a change made', 'chang|added|removed|rewrote|updated|amend'], ['a reason', 'because|so that|as ']] },
      ],
    },
    {
      key: 'C', title: 'Generating design ideas', marks: 20, hours: 6,
      what: 'You produce a wide range of imaginative ideas, using different design strategies, and communicate them with sketches, models and annotation. You get feedback and choose a direction.',
      why: 'The first idea is rarely the best. A wide spread of ideas, built using proper strategies, shows you explored the problem rather than fixing on one answer early.',
      look: ['A wide range of different ideas, not small variations of one', 'Design strategies used and named (e.g. collaboration, user-centred design, iteration, avoiding design fixation)', 'Clear sketching and modelling, with technical annotation', 'Ideas checked against the specification', 'Client or third-party feedback used to choose a direction'],
      tips: ['Annotation should explain, not label: “4 mm ply, finger joint, laser cut” beats “wood”.', 'Model early. A quick card model often tells you more than three sketches.'],
      fields: [
        { id: 'c1', label: 'C1 Design strategies', q: 'Which design strategies did you use to get ideas, and how did each one help?', hint: 'Name at least two, e.g. user-centred design, collaboration, iterative design, systems thinking, SCAMPER, biomimicry, avoiding design fixation.', words: 100, max: 3, why: true,
          kw: [['a named strategy', 'user.centred|collaborat|iterat|systems|scamper|biomim|mood ?board|fixation|brainstorm|mind ?map|random|morpholog|existing product'], ['a second strategy', '(user.centred|collaborat|iterat|systems|scamper|biomim|mood ?board|fixation|brainstorm|mind ?map|random|morpholog)[\\s\\S]*(user.centred|collaborat|iterat|systems|scamper|biomim|mood ?board|fixation|brainstorm|mind ?map|random|morpholog)'], ['how it helped', 'helped|led to|gave me|meant|so i|because']] },
        { id: 'c2', label: 'C2 Range of ideas', q: 'List your initial ideas, one per line: what it is, how it works, and one strength or weakness.', hint: 'Aim for at least six genuinely different ideas.', words: 180, max: 5, list: 6,
          kw: [['how it works', 'works|slides|folds|hinge|clip|stack|rotat|open|lift|magnet|slot'], ['materials', 'material|wood|ply|mdf|acrylic|plastic|metal|card|fabric|3d print|pla'], ['strengths', 'good|strength|advantage|works well|easy|cheap|strong'], ['weaknesses', 'weak|disadvantage|problem|but|however|might break|expensive|hard to']] },
        { id: 'c3', label: 'C3 Annotation practice', q: 'Write the annotation for your best sketch: materials, sizes, joining methods, how it is made, and how it meets the spec.', hint: 'Technical words and numbers win marks here.', words: 120, max: 4, nums: true,
          kw: [['materials', 'material|wood|ply|mdf|pine|oak|acrylic|hips|abs|pla|steel|alumin|card'], ['dimensions', '\\d+ ?(mm|cm)'], ['joining / fixing', 'joint|glue|pva|screw|nail|dowel|finger|butt|mortise|rivet|bolt|weld|tab|slot'], ['manufacture', 'laser|cnc|3d print|cut|saw|drill|vacuum form|line bend|mould|sand|finish'], ['link to spec / user', 'spec|specification|client|user|meets|because']] },
        { id: 'c4', label: 'C4 Feedback on ideas', q: 'Show your ideas to your client or other people. What did they say about which ideas, and what did you learn?', hint: 'Who said what, about which idea.', words: 100, max: 3, why: true,
          kw: [['who gave feedback', 'client|user|friend|teacher|class|peer|parent|third.party'], ['what they said', 'said|liked|disliked|thought|prefer|suggest'], ['what you learned / will change', 'learn|chang|will|realis|decided|so i']] },
        { id: 'c5', label: 'C5 Choosing a direction', q: 'Which idea (or mix of ideas) will you develop? Justify it against your specification and feedback.', hint: 'Refer to at least two specification points by number.', words: 100, max: 5, why: true,
          kw: [['a clear choice', 'chose|chosen|choose|select|develop|going with|combine'], ['specification points', 'spec|specification|point \\d|#\\d|\\b\\d\\.'], ['feedback used', 'client|feedback|user|said'], ['reasons', 'because|so that|as it|since|therefore']] },
      ],
    },
    {
      key: 'D', title: 'Developing design ideas', marks: 20, hours: 8,
      what: 'You take your chosen idea and improve it through modelling, testing and iteration until you have a final design, then write a manufacturing specification someone else could follow.',
      why: 'Development is where an idea becomes a product that actually works. Moderators want to see the changes and why you made them, not just a neat final drawing.',
      look: ['Models in different materials and CAD, each one tested', 'Clear iterations: what changed, and why', 'Client feedback during development', 'A final design with materials, sizes and finishes fully resolved', 'A detailed manufacturing specification (cutting list, stages, tools, quality checks)'],
      tips: ['Photograph every model, including the failures, and say what each one taught you.', 'Your manufacturing spec should be good enough for a classmate to make it without asking you.'],
      fields: [
        { id: 'd1', label: 'D1 Modelling log', q: 'Log your models, one per line: what you modelled, the material or software, how you tested it, what you learned.', hint: 'e.g. “Card model of the lid hinge, opened it 50 times, card tore, so the real one needs a piano hinge.”', words: 180, max: 5, list: 3,
          kw: [['model / prototype', 'model|prototype|mock.?up|mockup|test piece'], ['modelling material / CAD', 'card|foam|styrofoam|clay|lego|mdf|cad|fusion|onshape|sketchup|2d design|tinkercad|3d print'], ['testing', 'test|tried|checked|measured|asked'], ['what you learned', 'learn|found|realis|showed|so the|so i|this means']] },
        { id: 'd2', label: 'D2 Iterations', q: 'Describe how your design changed from your first developed idea to your final design. What changed each time, and why?', hint: 'Version 1 → version 2 → version 3, with a reason for every change.', words: 150, max: 4, why: true,
          kw: [['versions / stages', 'version|iteration|v\\d|first|second|third|then|next|final'], ['changes', 'chang|improv|modif|alter|added|removed|made it'], ['reasons', 'because|so that|as it|since|feedback|test']] },
        { id: 'd3', label: 'D3 Client feedback in development', q: 'What did your client say during development, and how did it shape the design?', hint: 'Be specific: which feature, what they said, what you did.', words: 80, max: 3,
          kw: [['client involved', 'client|user'], ['their opinion', 'said|liked|thought|prefer|wanted|suggest'], ['the effect', 'so i|changed|i will|i made|decided']] },
        { id: 'd4', label: 'D4 Final design', q: 'Describe your final design fully: overall sizes, every part, materials, components and finishes.', hint: 'Write as if describing a working drawing.', words: 150, max: 4, nums: true,
          kw: [['overall dimensions', '\\d+ ?(mm|cm) ?(x|×|by)'], ['parts / components', 'part|component|hinge|screw|handle|lid|base|side|leg|shelf|magnet|led|battery'], ['materials', 'material|ply|mdf|pine|oak|acrylic|hips|pla|steel|alumin|fabric'], ['finishes', 'finish|varnish|wax|oil|paint|lacquer|sand|polish|powder|anodis']] },
        { id: 'd5', label: 'D5 Manufacturing specification', q: 'Write your manufacturing plan, one step per line: what you do, the tools or machines, the time, and the quality check.', hint: 'Include a cutting list if you can (part, material, size, quantity).', words: 200, max: 4, list: 6, nums: true,
          kw: [['steps in order', '^\\s*\\d|step|first|then|next|finally'], ['tools / machines', 'saw|drill|laser|cnc|sander|file|chisel|3d print|vacuum|strip heater|router|lathe|disc'], ['timings', '\\d+ ?(min|minutes|hour|hrs|lesson)'], ['quality checks', 'check|measure|square|tolerance|±|accura|jig|template|test fit'], ['safety', 'safe|goggles|guard|apron|extract|ppe|clamp']] },
      ],
    },
    {
      key: 'E', title: 'Realising design ideas', marks: 20, hours: 12,
      what: 'You make a high-quality prototype, selecting and using the right materials, tools and processes, working accurately and safely, and solving problems as they come up.',
      why: 'The prototype proves your design works. The marks reward the skill, accuracy and quality of your making, and how well you chose your processes, so record what you did and why.',
      look: ['Appropriate materials, tools, equipment and processes, chosen with reasons', 'Accuracy and precision, with quality-control checks', 'Safe working, with risks identified and controlled', 'Problems solved during making and recorded', 'A prototype that is complete, well finished and fit for purpose'],
      tips: ['Keep a making diary with a photo every lesson.', 'Making the same part twice to get it right is good evidence. Write down why the first one failed.'],
      fields: [
        { id: 'e1', label: 'E1 Choosing materials & processes', q: 'Which materials, tools and processes did you choose for the main parts, and why were they the right choice?', hint: 'Compare with an alternative you rejected.', words: 120, max: 4, why: true,
          kw: [['materials', 'ply|mdf|pine|oak|acrylic|hips|pla|steel|alumin|fabric|material'], ['processes', 'laser|cnc|3d print|vacuum form|line bend|saw|drill|turn|braz|weld|sew|mould|cast'], ['reasons', 'because|so that|as it|since|better|more accurate|stronger|cheaper'], ['an alternative', 'instead of|rather than|alternative|could have|rejected|compared']] },
        { id: 'e2', label: 'E2 Making diary', q: 'Keep a diary, one entry per lesson: date, what you did, any problem, what is next.', hint: 'e.g. “12/11: cut both sides on the bandsaw, one 2 mm short, recut. Next: finger joints.”', words: 200, max: 6, list: 4, nums: true,
          kw: [['dates / lessons', '\\d{1,2}[\\/.-]\\d{1,2}|monday|tuesday|wednesday|thursday|friday|lesson|week'], ['practical work', 'cut|mark|drill|glue|sand|join|assembl|print|laser|shape|fold|finish|paint'], ['problems', 'problem|mistake|wrong|went|too|broke|short|crack|didn.t'], ['next steps', 'next|tomorrow|then|plan']] },
        { id: 'e3', label: 'E3 Quality control', q: 'How did you make sure parts were accurate? List the checks, tolerances, jigs or templates you used.', hint: 'Numbers please: ±0.5 mm, checked with a try square…', words: 100, max: 4, nums: true,
          kw: [['measuring / checking', 'measur|check|ruler|vernier|calliper|caliper|try square|steel rule|gauge'], ['tolerances', 'toleran|±|\\+/-|within \\d'], ['jigs / templates / CAD', 'jig|template|fixture|cad|cam|laser|cnc|stop'], ['what you did about errors', 'recut|redo|adjust|correct|sand|fix|again']] },
        { id: 'e4', label: 'E4 Working safely', q: 'Write a short risk assessment for the three riskiest processes: hazard, risk, how you controlled it.', hint: 'One process per line.', words: 100, max: 3, list: 3,
          kw: [['hazards', 'hazard|blade|heat|hot|dust|fume|sharp|spinning|laser|chemical'], ['risks', 'risk|cut|burn|injur|inhal|trap|eye'], ['control measures', 'goggles|guard|apron|extract|clamp|vice|mask|gloves|ppe|tie hair|supervis|push stick']] },
        { id: 'e5', label: 'E5 Problem solving', q: 'Describe a problem you hit while making, and how you solved it.', hint: 'What went wrong, why, what you tried, what worked.', words: 100, max: 3, why: true,
          kw: [['the problem', 'problem|wrong|issue|broke|didn.t|failed|crack|warp|loose'], ['the cause', 'because|caused|due to|reason|happened'], ['the solution', 'solved|fixed|so i|instead|changed|tried|used']] },
      ],
    },
    {
      key: 'F', title: 'Analysing & evaluating', marks: 20, hours: 3,
      what: 'You test and evaluate throughout the project and at the end: testing the prototype against your specification, getting feedback from the client and others, and proposing improvements.',
      why: 'Evaluation shows you can judge your own work honestly against what you set out to do. It is worth as much as making, and many students lose easy marks by rushing it.',
      look: ['Evaluation running through the whole project, not only at the end', 'Testing of the prototype, with results', 'Every specification point checked, with evidence', 'Client and third-party opinions collected and used', 'Realistic, justified improvements, ideally sketched'],
      tips: ['Photograph the client using the product.', 'Say what did not work. Honest, evidenced criticism scores higher than “it went well”.'],
      fields: [
        { id: 'f1', label: 'F1 Testing the prototype', q: 'How did you test your prototype? List each test, what you did, and the result.', hint: 'One test per line, with a result you can measure.', words: 140, max: 4, list: 3, nums: true,
          kw: [['tests', 'test|tried|checked|measured|timed|loaded|dropped|asked'], ['results', 'result|held|lasted|took|passed|failed|worked|broke|\\d+ ?(kg|seconds|mm|times|%)'], ['link to spec', 'spec|specification|point|requirement']] },
        { id: 'f2', label: 'F2 Evaluation against the spec', q: 'Go through your specification point by point: met, partly met or not met, with evidence.', hint: 'One spec point per line.', words: 200, max: 6, list: 6, why: true,
          kw: [['judgements', 'met|achieved|not met|partly|failed|meets|succeeded'], ['evidence', 'because|test|measured|shown|photo|client said|result'], ['spec references', 'spec|point|\\b\\d+[.)]']] },
        { id: 'f3', label: 'F3 Client & third-party feedback', q: 'What did your client and at least one other person say about the finished prototype?', hint: 'Quote them and say what you take from it.', words: 100, max: 4,
          kw: [['client', 'client|user'], ['a third party', 'teacher|friend|parent|peer|expert|third.party|someone else|another'], ['their opinions', 'said|liked|thought|felt|suggest|would'], ['what you take from it', 'this shows|so|means|i agree|i will|improve']] },
        { id: 'f4', label: 'F4 Improvements', q: 'What modifications would you make for a final version or for manufacture in quantity? Justify each one.', hint: 'Think: function, materials, manufacture in batch / mass, cost, sustainability.', words: 140, max: 4, list: 2, why: true,
          kw: [['improvements', 'improv|would change|modif|would add|would use|next time|instead'], ['reasons', 'because|so that|as it|since|this would'], ['manufacture at scale', 'batch|mass|injection|jig|cnc|cost|quantity|production'], ['sustainability', 'sustainab|recycl|environment|waste|material use|repair']] },
        { id: 'f5', label: 'F5 Reflection', q: 'Look back at your whole practice project. What went well, what would you do differently in the real NEA, and how did you manage your time?', hint: 'Be honest: this part is for you.', words: 100, max: 2,
          kw: [['what went well', 'went well|good|pleased|proud|success'], ['what to change', 'differently|next time|would|should have|improve'], ['time management', 'time|hours|deadline|plan|late|rushed|behind|ahead']] },
      ],
    },
  ];

  const JUST = /because|so that|therefore|this means|as a result|which means|since|so i /i;
  function words(t) { return (String(t || '').match(/[A-Za-z0-9À-ÿ'’£€$%±.-]+/g) || []).filter((w) => /[A-Za-z0-9]/.test(w)).length; }
  function lines(t) { return String(t || '').split(/\n+/).filter((l) => words(l) >= 3).length; }
  // indicative score for one box: length 35%, coverage of what the spec looks for 50%, structure (list / numbers / reasons) 15%
  function score(f, text) {
    const t = String(text || ''), w = words(t), max = f.max;
    if (!w) return { score: 0, max, words: 0, hits: [], misses: f.kw.map((k) => k[0]), flags: ['blank'], lines: 0 };
    const hits = [], misses = [];
    f.kw.forEach(([name, re]) => (new RegExp(re, 'im').test(t) ? hits : misses).push(name));
    const len = Math.min(1, w / f.words), cov = hits.length / f.kw.length, n = lines(t);
    const parts = [len];
    if (f.list) parts.push(Math.min(1, n / f.list));
    if (f.nums) parts.push(/\d/.test(t) ? 1 : 0);
    if (f.why) parts.push(JUST.test(t) ? 1 : 0);
    const struct = parts.reduce((a, b) => a + b, 0) / parts.length;
    let raw = 0.35 * len + 0.5 * cov + 0.15 * struct;
    if (w < 12) raw *= 0.5; // a few words is not evidence
    const flags = [];
    if (w < f.words * 0.4) flags.push('thin');
    if (f.why && !JUST.test(t)) flags.push('no-why');
    if (f.nums && !/\d/.test(t)) flags.push('no-numbers');
    if (f.list && n < f.list) flags.push('short-list');
    if (cov < 0.5) flags.push('gaps');
    return { score: Math.round(raw * max * 2) / 2, max, words: w, hits, misses, flags, lines: n };
  }
  window.NEA = { sections: S, score, words, lines, total: S.reduce((a, s) => a + s.marks, 0),
    flags: { blank: 'Left blank', thin: 'Much shorter than expected', 'no-why': 'Decisions not justified (no “because…”)', 'no-numbers': 'No measurements or data', 'short-list': 'Fewer points / ideas than expected', gaps: 'Misses half or more of what the spec looks for' } };
})();
