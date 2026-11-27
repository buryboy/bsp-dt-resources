// A level NEA practice (Pearson Edexcel 9DT0 Product Design, Component 2: Independent Design and Make Project).
// One section per assessment grid (11 grids, 120 marks). Needs ../nea-kit/core.js first.
// Scores are an indicative guide from length + criteria coverage + structure. NOT a moderated mark; students never see them.
(function () {
  const T = (f, at) => ({ t: 'text', f, at }), P = (id, label, at) => ({ t: 'photo', id, label, at }), K = (id, label, at) => ({ t: 'sketch', id, label, at });
  const WHY = 'because|so that|therefore|consequently|this means|as a result|which means|hence|in order to';
  const S = [
    {
      key: 'G1', col: 'Grid 1', title: 'Identification & investigation of a design possibility', marks: 9,
      why: 'Your whole portfolio hangs off the problem you choose. A narrow, real, client-led problem gives you something sophisticated to solve; a vague “design a lamp” does not.',
      fields: [
        { id: 'l1a', label: '1A Design context & stakeholders', q: 'Describe the design context: the setting, the people involved (client, end users, other stakeholders) and the problems they face.', hint: 'Who, where, what goes wrong, and why it matters commercially or socially.', words: 200, max: 3,
          kw: [['context / setting', 'context|setting|environment|home|workplace|studio|kitchen|hospital|school'], ['client / end user', 'client|end.user|user'], ['other stakeholders', 'stakeholder|retailer|manufacturer|carer|family|staff|maintenance'], ['problems identified', 'problem|difficult|struggle|issue|fail|frustrat|barrier'], ['commercial / social relevance', 'market|commercial|retail|cost|social|inclusive|ageing|accessib|sustainab']] },
        { id: 'l1b', label: '1B Design possibilities', q: 'Set out three or more design possibilities within the context, each with its constraints and opportunities.', hint: 'One possibility per line: the opportunity, who benefits, the main constraint.', words: 180, max: 3, list: 3,
          kw: [['possibilities / opportunities', 'possibilit|opportunit|could|potential'], ['constraints', 'constraint|limit|budget|space|regulation|standard|time'], ['who benefits', 'client|user|stakeholder|benefit'], ['feasibility', 'feasib|viab|realistic|manufactur|achievable']] },
        { id: 'l1c', label: '1C Justified choice', q: 'Which possibility will you pursue? Justify the choice against the others: value to the client, feasibility and potential for a sophisticated outcome.', hint: 'Refer back to the client and to your evidence.', words: 150, max: 3, why: true,
          kw: [['a clear choice', 'chose|chosen|select|pursue|decided|will develop'], ['justification', WHY], ['client value', 'client|user|stakeholder'], ['comparison with alternatives', 'whereas|compared|unlike|rather than|instead of|other possibilit'], ['scope for sophistication', 'sophisticat|complex|technical|challenge|innovation|innovative']] },
      ],
      sheets: [
        { id: 'g1-context', title: 'The design context', guide: { what: 'Map the context and the people in it before you commit to a problem.', look: ['A real client and a genuine problem', 'Stakeholders beyond the end user', 'Commercial and social relevance'], tips: ['Build the client relationship now: it is the thread the assessors follow through the whole portfolio.'] },
          items: [T('l1a', [0, 0, 5, 9]), K('g1-map', 'Stakeholder / context map', [5, 0, 7, 5]), P('g1-photo', 'The context (photo)', [5, 5, 7, 4])] },
        { id: 'g1-choice', title: 'Possibilities and the chosen problem', guide: { what: 'Compare several possibilities, then commit to one and justify it.', look: ['Several possibilities investigated in depth', 'One chosen and justified'] },
          items: [T('l1b', [0, 0, 6, 5]), T('l1c', [0, 5, 6, 4]), K('g1-thumbs', 'Thumbnails of each possibility', [6, 0, 6, 9])] },
      ],
    },
    {
      key: 'G2', col: 'Grid 2', title: 'Investigation of needs & research', marks: 15,
      why: 'Research earns marks only when it changes decisions. Every page should end with an implication for the design or the specification.',
      fields: [
        { id: 'l2a', label: '2A Client & end-user needs', q: 'Record what you learned from your client and end users: needs, wants and values, with evidence (interview quotes, observation, anthropometric data).', hint: 'Quote the client. Separate needs (must) from wants (would like) and values (what they care about).', words: 220, max: 4, nums: true,
          kw: [['interview / observation evidence', 'interview|observ|said|told|quote|“|"'], ['needs', 'need'], ['wants', 'want|prefer|would like'], ['values', 'value|care|ethic|sustainab|price|brand|quality'], ['ergonomics / anthropometrics', 'ergonom|anthropometr|percentile|reach|grip|posture|mm']] },
        { id: 'l2b', label: '2B Needs of the prototype', q: 'What must the prototype be in terms of form, function, sustainability and intended scale of production?', hint: 'Think: aesthetics and form, performance, materials, end of life, one-off / batch / mass production.', words: 220, max: 4,
          kw: [['form / aesthetics', 'form|aesthetic|style|proportion|colour|texture'], ['function / performance', 'function|perform|load|durab|strength|use'], ['sustainability / life cycle', 'sustainab|life.?cycle|lca|end of life|recycl|repair|circular|carbon'], ['scale of production', 'one.off|batch|mass|production|volume|units'], ['materials thinking', 'material|polymer|timber|metal|composite|textile']] },
        { id: 'l2c', label: '2C Product analysis', q: 'Analyse an existing product in depth (ideally by disassembly): materials, components, manufacturing processes, cost and how well it serves the user.', hint: 'Identify processes from evidence on the product: ejector pin marks, joints, finishes…', words: 200, max: 3, nums: true,
          kw: [['disassembly / evidence', 'disassembl|took apart|ejector|parting line|joint|fixing'], ['materials', 'abs|pp|hdpe|acrylic|pmma|nylon|oak|beech|birch|mdf|ply|alumin|steel|material'], ['processes', 'injection|extrusion|blow|vacuum|cnc|laser|press|cast|turn|weld|mould'], ['components / standard parts', 'component|screw|bolt|hinge|bearing|spring|standard part'], ['cost / user evaluation', 'cost|£|€|price|user|client|ergonom']] },
        { id: 'l2d', label: '2D Research synthesis', q: 'Pull your research together. What does it mean for the design, and how reliable were your sources?', hint: 'One implication per line, then a comment on primary vs secondary sources.', words: 160, max: 4, list: 3, why: true,
          kw: [['implications', 'implicat|this means|therefore|so the design|must|should'], ['link to specification', 'spec|specification|requirement'], ['primary / secondary sources', 'primary|secondary|source'], ['source reliability', 'reliab|bias|valid|credible|sample|limited']] },
      ],
      sheets: [
        { id: 'g2-client', title: 'Client and end users', guide: { what: 'Evidence of what the client and users need, want and value.', look: ['Needs, wants and values assessed in depth', 'Evidence, not assumption'], tips: ['Record the interview (with permission) and quote it.'] },
          items: [T('l2a', [0, 0, 6, 9]), P('g2-interview', 'Client interview / observation', [6, 0, 6, 5]), K('g2-ergo', 'Ergonomics / anthropometric sketch', [6, 5, 6, 4])] },
        { id: 'g2-prototype', title: 'Needs of the prototype', guide: { what: 'What the prototype has to be: form, function, sustainability and production scale.', look: ['Form, function and sustainability all considered', 'Scale of production decided'] },
          items: [T('l2b', [0, 0, 6, 9]), K('g2-lca', 'Life-cycle / sustainability map', [6, 0, 6, 5]), P('g2-mood', 'Form and aesthetic references', [6, 5, 6, 4])] },
        { id: 'g2-analysis', title: 'Product analysis', guide: { what: 'An existing product taken apart and analysed.', look: ['Materials and processes identified from evidence', 'Judgement, not description'], tips: ['Assessors dislike a generic “page on materials”. Make every fact earn its place.'] },
          items: [T('l2c', [0, 0, 6, 9]), P('g2-prod1', 'The product', [6, 0, 6, 5]), P('g2-prod2', 'Disassembled / detail', [6, 5, 6, 4])] },
        { id: 'g2-synthesis', title: 'Research synthesis', guide: { what: 'What the research means for the design.', look: ['Perceptive links between research and design', 'Sources selected critically'] },
          items: [T('l2d', [0, 0, 7, 9]), P('g2-board', 'Research summary board', [7, 0, 5, 9])] },
      ],
    },
    {
      key: 'G3', col: 'Grid 3', title: 'Specification', marks: 9,
      why: 'The specification is the contract between you and your client. Every later decision and every test refers back to it.',
      fields: [
        { id: 'l3a', label: '3A Design brief', q: 'Write the design brief: the client, the problem, the constraints and the intended outcome.', hint: 'Concise and specific. Avoid naming the solution.', words: 120, max: 2,
          kw: [['client', 'client|user'], ['problem', 'problem|need|issue'], ['constraints', 'constraint|budget|space|time|must not'], ['intended outcome', 'prototype|outcome|product|solution|design and make']] },
        { id: 'l3b', label: '3B Design specification', q: 'Write at least ten measurable specification points, each with a justification drawn from your research.', hint: 'Cover performance, user / ergonomics, materials and manufacture, sustainability, cost, safety and standards.', words: 320, max: 5, list: 10, nums: true, why: true,
          kw: [['measurable values', '\\d+ ?(mm|cm|m|kg|g|n|nm|£|€|%|°|hours|cycles|years)'], ['justification', WHY + '|research|client said|from my'], ['performance', 'load|strength|durab|cycles|withstand|perform|stable'], ['user / ergonomics', 'user|ergonom|anthropometr|percentile|grip|reach'], ['materials & manufacture', 'material|manufactur|process|batch|tolerance'], ['sustainability', 'sustainab|recycl|repair|end of life|carbon|lca'], ['cost', 'cost|£|€|price|budget'], ['safety / standards', 'safe|bs ?en|iso|standard|regulation|toxic|ce mark']] },
        { id: 'l3c', label: '3C Client agreement', q: 'How did the client respond to the brief and specification, and what did you change?', hint: 'Name the specification points that changed.', words: 90, max: 2, why: true,
          kw: [['client response', 'client|agreed|feedback|said'], ['changes made', 'chang|added|removed|revised|amend'], ['specific points', 'point|spec']] },
      ],
      sheets: [
        { id: 'g3-brief', title: 'Design brief and client agreement', guide: { what: 'A brief that fully reflects the client, and evidence the client agreed it.', look: ['Brief reflects user needs comprehensively'] },
          items: [T('l3a', [0, 0, 6, 5]), T('l3c', [0, 5, 6, 4]), P('g3-signoff', 'Client sign-off evidence', [6, 0, 6, 9])] },
        { id: 'g3-spec', title: 'Design specification', guide: { what: 'Measurable, realistic, justified specification points.', look: ['Comprehensive and measurable', 'Performance requirements justified perceptively'], tips: ['Test every point now: if you could not test it on the finished prototype, rewrite it.'] },
          items: [T('l3b', [0, 0, 8, 9]), K('g3-dims', 'Key dimensions and constraints', [8, 0, 4, 9])] },
      ],
    },
    {
      key: 'G4', col: 'Grid 4', title: 'Design ideas', marks: 9,
      why: 'Ideas are judged on how well they respond to the user and the specification, and on how they draw on aesthetics, design history and an understanding of materials.',
      fields: [
        { id: 'l4a', label: '4A Design strategies', q: 'Which design strategies did you use, and how did each move your thinking on?', hint: 'e.g. user-centred design, collaboration, iterative design, biomimicry, morphological analysis, systems thinking.', words: 150, max: 2, why: true,
          kw: [['named strategies', 'user.centred|collaborat|iterat|biomim|morpholog|systems|scamper|fixation|ergonom|parametric'], ['how it helped', 'led to|resulted|helped|revealed|so i|which meant'], ['avoiding fixation', 'fixation|diverge|range|alternative']] },
        { id: 'l4b', label: '4B Initial ideas', q: 'Summarise your initial ideas, one per line: the concept, how it meets the specification, and its main weakness.', hint: 'At least five distinct concepts.', words: 220, max: 3, list: 5,
          kw: [['specification references', 'spec|point \\d|requirement'], ['user', 'user|client'], ['weaknesses', 'weak|however|but|limitation|risk'], ['function / mechanism', 'mechanism|hinge|slide|fold|clamp|joint|lever|spring|magnet']] },
        { id: 'l4c', label: '4C Aesthetics, history & culture', q: 'How have design movements, designers or cultural influences shaped your ideas?', hint: 'Name them and say exactly what you borrowed.', words: 130, max: 2,
          kw: [['movements', 'bauhaus|modernis|art deco|art nouveau|memphis|arts and crafts|scandinavian|post.?modern|de stijl|minimalis'], ['designers', 'rams|dyson|starck|eames|aalto|jacobsen|ive|morrison|grcic|newson|designer'], ['what was borrowed', 'influence|borrow|inspired|adopt|form|colour|material']] },
        { id: 'l4d', label: '4D Materials & processes in the ideas', q: 'What materials and processes do your strongest ideas rely on, and why are they suitable?', hint: 'Properties, not just names.', words: 130, max: 2, why: true,
          kw: [['materials', 'abs|pp|acrylic|nylon|pla|oak|beech|birch|ply|mdf|alumin|steel|composite|material'], ['properties', 'tough|stiff|hard|strength|density|elastic|ductil|malleab|conductiv|properties'], ['processes', 'injection|cnc|laser|cast|turn|bend|vacuum|3d print|weld|mould'], ['justification', WHY]] },
      ],
      sheets: [
        { id: 'g4-strategies', title: 'Strategies and influences', guide: { what: 'How you generated ideas and what influenced them.', look: ['Sophisticated use of design strategies', 'Perceptive use of aesthetics, history and culture'], tips: ['Assessors want a creative, non-linear approach, not a tidy sequence of identical pages.'] },
          items: [T('l4a', [0, 0, 6, 5]), T('l4c', [0, 5, 6, 4]), P('g4-influence', 'Influences (designer / movement)', [6, 0, 6, 9])] },
        { id: 'g4-ideas', title: 'Initial ideas', guide: { what: 'A range of concepts tested against the user and the specification.', look: ['In-depth consideration of user needs and specification', 'In-depth understanding of materials and processes'] },
          items: [T('l4b', [0, 0, 4, 5]), T('l4d', [0, 5, 4, 4]), K('g4-sketch', 'Concept sketches', [4, 0, 8, 5]), P('g4-ideas-photo', 'Sketchbook ideas (photo)', [4, 5, 8, 4])] },
      ],
    },
    {
      key: 'G5', col: 'Grid 5', title: 'Development of design ideas', marks: 9,
      why: 'Development is where research, user feedback and technical knowledge drive real changes. Assessors look for iteration you can trace.',
      fields: [
        { id: 'l5a', label: '5A Iterative development', q: 'Trace the development of your design through its iterations. For each: what changed, what drove the change (research, testing, feedback), and the technical reasoning.', hint: 'Iteration 1 → 2 → 3, one per line.', words: 250, max: 3, list: 4, why: true,
          kw: [['iterations', 'iteration|version|v\\d|stage|prototype \\d'], ['changes', 'chang|modif|refin|revis|improv'], ['what drove it', 'research|test|feedback|client|result'], ['technical reasoning', 'because|stress|load|tolerance|material|process|ergonom']] },
        { id: 'l5b', label: '5B User feedback in development', q: 'How did your client and users shape the development? Be specific about features and decisions.', hint: 'Quote them; say what you changed.', words: 120, max: 2,
          kw: [['client / user', 'client|user'], ['their view', 'said|felt|prefer|suggest|found'], ['resulting decision', 'so i|changed|decided|therefore|as a result']] },
        { id: 'l5c', label: '5C Modelling, CAD & simulation', q: 'Describe the modelling, CAD and simulation you used to test the design, and what each test showed.', hint: 'Test → result → decision. Include numbers.', words: 200, max: 4, nums: true,
          kw: [['physical models', 'model|mock.?up|prototype|foam|card|3d print'], ['CAD', 'cad|fusion|solidworks|onshape|inventor|render'], ['simulation / analysis', 'simulat|fea|stress|finite|motion study|cfd'], ['results', 'result|showed|deflect|fail|passed|\\d+ ?(mm|n|kg|%)'], ['decisions', 'so|therefore|decided|changed']] },
      ],
      sheets: [
        { id: 'g5-iterate', title: 'Iterative development', guide: { what: 'A traceable sequence of changes, each with a reason.', look: ['Research drives the changes', 'Accomplished iterative development with user feedback'] },
          items: [T('l5a', [0, 0, 5, 9]), K('g5-dev', 'Development sketches', [5, 0, 7, 5]), P('g5-model', 'Development model', [5, 5, 7, 4])] },
        { id: 'g5-testing', title: 'Modelling, CAD and simulation', guide: { what: 'Models and simulations used to test, not just to show.', look: ['Sophisticated modelling and simulation that informs testing'] },
          items: [T('l5c', [0, 0, 6, 5]), T('l5b', [0, 5, 6, 4]), P('g5-cad', 'CAD / simulation screenshot', [6, 0, 6, 5]), P('g5-test', 'Model under test', [6, 5, 6, 4])] },
      ],
    },
    {
      key: 'G6', col: 'Grid 6', title: 'Final design solution', marks: 9,
      why: 'The final design must be fully resolved and documented well enough for a third party to manufacture it, with the project planned and costed.',
      fields: [
        { id: 'l6a', label: '6A Final design solution', q: 'Describe the final design fully: overall and critical dimensions, parts, materials, components, finishes, and how it meets the specification.', hint: 'Write it as the brief for a working drawing.', words: 200, max: 3, nums: true,
          kw: [['dimensions', '\\d+ ?(mm|cm)'], ['parts / components', 'part|component|assembly|fixing|hinge|bearing|screw'], ['materials', 'abs|pp|acrylic|nylon|pla|oak|beech|birch|ply|mdf|alumin|steel|material'], ['finishes', 'finish|anodis|powder|lacquer|oil|wax|polish|paint|texture'], ['meets specification', 'spec|specification|meets|requirement']] },
        { id: 'l6b', label: '6B Manufacturing specification', q: 'Write the manufacturing specification: stages in order, processes, tools and machines, tolerances, quality checks and safety.', hint: 'One stage per line. A third party should be able to follow it.', words: 260, max: 3, list: 6, nums: true,
          kw: [['ordered stages', '^\\s*\\d|stage|step|first|then|finally'], ['processes / machines', 'cnc|laser|lathe|mill|router|3d print|vacuum|bend|weld|braz|cast|saw|drill'], ['tolerances', 'toleran|±|\\+/-|within'], ['quality checks', 'check|inspect|measure|gauge|jig|go.?no.?go|calliper|caliper'], ['safety', 'safe|ppe|guard|extract|risk']] },
        { id: 'l6c', label: '6C Project management & costing', q: 'Plan and cost the build: timeline, material quantities and costs, and how you will minimise waste.', hint: 'Include a cutting list, a costing and a timeline (Gantt or critical path).', words: 200, max: 3, nums: true,
          kw: [['timeline', 'gantt|critical path|timeline|week|deadline|schedule'], ['quantities', 'cutting list|quantity|sheet|length|kg|m2|mm ×|x \\d'], ['costs', '£|€|cost|price|total'], ['waste reduction', 'waste|nest|offcut|optimis|yield|recycl']] },
      ],
      sheets: [
        { id: 'g6-final', title: 'The final design', guide: { what: 'The fully resolved design.', look: ['Sophisticated refinement that meets the specification'] },
          items: [T('l6a', [0, 0, 5, 9]), P('g6-render', 'Final render / presentation drawing', [5, 0, 7, 5]), K('g6-views', 'Exploded / orthographic views', [5, 5, 7, 4])] },
        { id: 'g6-plan', title: 'Manufacturing specification and planning', guide: { what: 'How it will be made, by when, and for how much.', look: ['A manufacturing specification a third party could use', 'Quantities, costs and waste reduction calculated'] },
          items: [T('l6b', [0, 0, 6, 9]), T('l6c', [6, 0, 6, 5]), P('g6-gantt', 'Gantt chart / cutting list', [6, 5, 6, 4])] },
      ],
    },
    {
      key: 'G7', col: 'Grid 7', title: 'Review of development & final design', marks: 12,
      why: 'Reflection is assessed in its own right: how well you analyse and evaluate your refinements, your final design, and the designs of others.',
      fields: [
        { id: 'l7a', label: '7A Analysis of refinements', q: 'Analyse the refinements made during development: what each achieved, the feedback behind it, and the material and manufacturing considerations.', hint: 'Analysis = why it worked or did not, not a list of what you did.', words: 200, max: 4, why: true,
          kw: [['refinements', 'refin|modif|change|improv'], ['feedback evidence', 'feedback|client|user|test'], ['materials / manufacture', 'material|process|manufactur|tolerance|cost'], ['analysis', WHY + '|which meant|resulted']] },
        { id: 'l7b', label: '7B Balanced evaluation', q: 'Evaluate the final design before manufacture: strengths, weaknesses and remaining risks, against the specification.', hint: 'Balanced means both sides, with evidence.', words: 160, max: 4,
          kw: [['strengths', 'strength|success|achiev|meets|effective'], ['weaknesses / risks', 'weak|risk|limitation|compromise|however|but'], ['specification', 'spec|specification|requirement'], ['evidence', 'test|feedback|result|measured|\\d']] },
        { id: 'l7c', label: '7C Others’ designs', q: 'Analyse and evaluate the designs of others (existing products or peers’ solutions) in relation to your final design.', hint: 'Compare like with like: what do they do better or worse than yours?', words: 160, max: 4,
          kw: [['other designs', 'existing|competitor|peer|product|brand|designer'], ['comparison', 'compared|whereas|unlike|better|worse|similar'], ['judgement', 'more effective|less|superior|inferior|evaluat|judge']] },
      ],
      sheets: [
        { id: 'g7-review', title: 'Review of development', guide: { what: 'Step back and judge the refinements and the final design honestly.', look: ['Comprehensive analysis of refinements', 'Perceptive, balanced evaluation'] },
          items: [T('l7a', [0, 0, 6, 9]), T('l7b', [6, 0, 6, 5]), P('g7-feedback', 'Feedback evidence', [6, 5, 6, 4])] },
        { id: 'g7-others', title: 'Your design against others', guide: { what: 'Your final design compared with what already exists.', look: ['Comprehensive analysis and perceptive evaluation of others’ designs'] },
          items: [T('l7c', [0, 0, 6, 9]), P('g7-comp1', 'Comparison product', [6, 0, 6, 5]), K('g7-matrix', 'Comparison sketch / matrix', [6, 5, 6, 4])] },
      ],
    },
    {
      key: 'G8', col: 'Grid 8', title: 'Communication of design ideas', marks: 6,
      why: 'Communication is judged across the whole portfolio. Choose the right technique for each job: freehand to explore, CAD to resolve, technical drawing to manufacture.',
      fields: [
        { id: 'l8a', label: '8A Communication techniques', q: 'Which communication techniques have you used across the project (freehand, rendering, CAD, orthographic, exploded views, annotation), and why each one where you used it?', hint: 'Match each technique to its purpose.', words: 140, max: 3, why: true,
          kw: [['freehand / rendering', 'freehand|sketch|render|marker|crating|perspective|isometric'], ['CAD', 'cad|fusion|solidworks|onshape|keyshot|render'], ['technical drawing', 'orthographic|third angle|exploded|section|working drawing|dimension'], ['annotation', 'annotat|label|note'], ['purpose', WHY + '|to show|to explain|to communicate']] },
        { id: 'l8b', label: '8B Presentation of the final proposal', q: 'Describe how you will present the final proposal to your client, and what you would improve about your communication.', hint: 'Self-critical, specific.', words: 100, max: 3,
          kw: [['presentation method', 'present|board|render|animation|model|slide'], ['audience', 'client|user|stakeholder|manufacturer'], ['improvement', 'improve|better|next time|should|would']] },
      ],
      sheets: [
        { id: 'g8-comms', title: 'Communicating the proposal', guide: { what: 'Show your range of communication skills on one sheet.', look: ['Perceptive selection of manual, CAD and written techniques'], tips: ['A rendered presentation drawing here is the place to show off.'] },
          items: [T('l8a', [0, 0, 5, 5]), T('l8b', [0, 5, 5, 4]), K('g8-render', 'Presentation drawing', [5, 0, 7, 5]), P('g8-cad', 'CAD render / technical drawing', [5, 5, 7, 4])] },
      ],
    },
    {
      key: 'G9', col: 'Grid 9', title: 'Tools & equipment', marks: 12,
      why: 'Marks reward the selection of materials, fixtures and components with real understanding of their properties, and accurate, safe use of tools and processes.',
      fields: [
        { id: 'l9a', label: '9A Materials, fixtures & components', q: 'Justify your selection of materials, fixtures and components for each part, referring to properties, the end user and the specification.', hint: 'Part → material / component → property → reason.', words: 200, max: 4, why: true, nums: true,
          kw: [['materials', 'abs|pp|acrylic|nylon|pla|petg|oak|beech|birch|ply|mdf|alumin|steel|brass|material'], ['fixtures / components', 'screw|bolt|insert|hinge|bearing|magnet|fixing|component|fastener'], ['properties', 'tough|stiff|hard|tensile|density|elastic|corrosion|wear|properties|grain'], ['link to user / spec', 'user|client|spec|requirement'], ['justification', WHY]] },
        { id: 'l9b', label: '9B Tools, equipment & processes', q: 'Explain the tools, equipment and processes you used for the critical parts, and how you achieved accuracy.', hint: 'Settings, set-ups, jigs, CAM parameters.', words: 200, max: 4, nums: true,
          kw: [['tools / machines', 'lathe|mill|cnc|router|laser|3d print|bandsaw|pillar drill|vacuum|strip heater|tig|mig|braz'], ['settings / set-up', 'setting|speed|feed|power|rpm|layer|infill|set.?up|cam'], ['accuracy methods', 'jig|fixture|template|datum|toleran|±|measure|calliper|caliper'], ['numbers', '\\d']] },
        { id: 'l9c', label: '9C Safe working', q: 'Risk-assess the most hazardous processes: hazard, risk, control measure.', hint: 'One process per line.', words: 140, max: 4, list: 4,
          kw: [['hazards', 'hazard|blade|heat|dust|fume|chuck|swarf|laser|uv|chemical'], ['risks', 'risk|injur|burn|cut|entangle|inhal|eye'], ['controls', 'guard|ppe|goggles|visor|extract|clamp|vice|gloves|apron|tie back|supervis|coshh']] },
      ],
      sheets: [
        { id: 'g9-materials', title: 'Materials, fixtures and components', guide: { what: 'Why every material and component was chosen.', look: ['Sophisticated, fully appropriate selection', 'In-depth understanding of properties and end-user needs'] },
          items: [T('l9a', [0, 0, 6, 9]), P('g9-materials-photo', 'Materials and components', [6, 0, 6, 9])] },
        { id: 'g9-tools', title: 'Tools, processes and safety', guide: { what: 'How you used tools accurately and safely.', look: ['Accomplished tool use with understanding of accuracy', 'Consistently safe working'] },
          items: [T('l9b', [0, 0, 6, 5]), T('l9c', [0, 5, 6, 4]), P('g9-setup', 'Machine / jig set-up', [6, 0, 6, 5]), P('g9-safety', 'Safe working evidence', [6, 5, 6, 4])] },
      ],
    },
    {
      key: 'G10', col: 'Grid 10', title: 'Quality & accuracy', marks: 18,
      why: 'The largest single grid. It rewards making skill, a fully functional prototype, and iterative manufacture: adapting as you make.',
      fields: [
        { id: 'l10a', label: '10A Manufacturing log', q: 'Log the manufacture session by session: date, what was made, the process, any problem and how you responded.', hint: 'Photograph every session.', words: 300, max: 6, list: 6, nums: true,
          kw: [['dates / sessions', '\\d{1,2}[\\/.-]\\d{1,2}|session|lesson|week|monday|tuesday|wednesday|thursday|friday'], ['processes', 'cut|turn|mill|print|laser|bend|form|join|weld|glue|finish|assembl'], ['problems', 'problem|error|issue|warp|crack|misalign|fail|too'], ['responses', 'so i|solved|adjust|remade|modif|instead']] },
        { id: 'l10b', label: '10B Quality control & accuracy', q: 'How did you control quality? Give the checks, tolerances achieved and any parts remade to standard.', hint: 'Numbers: target vs achieved.', words: 200, max: 6, nums: true,
          kw: [['checks', 'check|inspect|measur|test fit|gauge'], ['tolerances', 'toleran|±|\\+/-|within \\d'], ['target vs achieved', 'target|achieved|actual|measured|\\d+(\\.\\d+)? ?mm'], ['remaking / correction', 'remade|recut|redo|correct|adjust']] },
        { id: 'l10c', label: '10C Iterative manufacture', q: 'Where did the design change during manufacture, and why? How do the changes affect the prototype’s function?', hint: 'Iterative manufacture is expected at the top level.', words: 160, max: 6, why: true,
          kw: [['changes during making', 'chang|modif|adapt|revis|instead'], ['causes', 'because|due to|caused|found|test'], ['effect on function', 'function|perform|works|fit|strength|user']] },
      ],
      sheets: [
        { id: 'g10-log', title: 'Manufacturing log', guide: { what: 'A visual record of the build, session by session.', look: ['Accomplished making skills on a sophisticated problem'], tips: ['Photograph processes in action, not only finished parts.'] },
          items: [T('l10a', [0, 0, 5, 9]), P('g10-p1', 'Making photo 1', [5, 0, 4, 5]), P('g10-p2', 'Making photo 2', [9, 0, 3, 5]), P('g10-p3', 'Making photo 3', [5, 5, 7, 4])] },
        { id: 'g10-quality', title: 'Quality and iterative manufacture', guide: { what: 'Proof of accuracy, and how the design adapted as you made it.', look: ['Fully functional prototype meeting the specification', 'Sophisticated iterative manufacture'] },
          items: [T('l10b', [0, 0, 6, 5]), T('l10c', [0, 5, 6, 4]), P('g10-check', 'Quality check', [6, 0, 6, 4]), P('g10-final', 'Finished prototype', [6, 4, 6, 5])] },
      ],
    },
    {
      key: 'G11', col: 'Grid 11', title: 'Testing & evaluation', marks: 12,
      why: 'Testing must be against measurable criteria; evaluation must be balanced and must reach beyond the product to its social, moral, ethical and environmental impact.',
      fields: [
        { id: 'l11a', label: '11A Testing against measurable criteria', q: 'Test the prototype against your specification: test method, criterion, result, pass / fail.', hint: 'One test per line.', words: 220, max: 3, list: 4, nums: true,
          kw: [['methods', 'test|load|drop|cycle|timed|user trial|measured'], ['criteria', 'criterion|criteria|spec|requirement|target'], ['results', 'result|\\d+ ?(kg|n|mm|s|seconds|cycles|%)'], ['judgements', 'pass|fail|met|not met|partly']] },
        { id: 'l11b', label: '11B Evaluation of prototype & process', q: 'Evaluate the prototype against its purpose and the specification, and evaluate your iterative design process.', hint: 'Balanced, evidenced, honest.', words: 220, max: 3, why: true,
          kw: [['purpose / specification', 'purpose|spec|requirement|client|user'], ['strengths & weaknesses', 'strength|success|weak|limitation|however|but'], ['process', 'process|iteration|development|planning|time'], ['evidence', 'test|result|feedback|measured']] },
        { id: 'l11c', label: '11C Wider impact', q: 'Evaluate the social, moral, ethical and environmental impact of your product if it were manufactured commercially.', hint: 'Life cycle, materials sourcing, inclusivity, labour, end of life.', words: 180, max: 3,
          kw: [['social', 'social|inclusiv|accessib|communit|wellbeing'], ['moral / ethical', 'moral|ethic|fair|labour|worker|sourc'], ['environmental', 'environment|carbon|lca|life.?cycle|recycl|end of life|energy|waste'], ['commercial manufacture', 'mass|batch|commercial|scale|market']] },
        { id: 'l11d', label: '11D Further development', q: 'How would you develop the prototype for commercial manufacture? Justify the changes to design, materials and processes.', hint: 'Think scale of production, cost, standards, sustainability.', words: 160, max: 3, why: true,
          kw: [['design changes', 'redesign|modif|improv|change|refine'], ['materials / processes at scale', 'injection|die.?cast|extrusion|press|mass|batch|jig|tooling'], ['cost / market', 'cost|£|€|price|market|unit'], ['justification', WHY]] },
      ],
      sheets: [
        { id: 'g11-testing', title: 'Testing', guide: { what: 'The prototype tested against measurable criteria.', look: ['Comprehensive analysis against measurable criteria'] },
          items: [T('l11a', [0, 0, 6, 9]), P('g11-test', 'Testing in progress', [6, 0, 6, 5]), P('g11-client', 'Client trial', [6, 5, 6, 4])] },
        { id: 'g11-evaluate', title: 'Evaluation and wider impact', guide: { what: 'A balanced evaluation that looks beyond the product.', look: ['Perceptive, balanced evaluation of purpose and process', 'Social, moral, ethical and environmental impact evaluated'] },
          items: [T('l11b', [0, 0, 6, 9]), T('l11c', [6, 0, 6, 9])] },
        { id: 'g11-next', title: 'Further development', guide: { what: 'From prototype to product.', look: ['Justified modifications for commercial manufacture'] },
          items: [T('l11d', [0, 0, 5, 9]), K('g11-sketch', 'Proposed modifications', [5, 0, 7, 9])] },
      ],
    },
  ];
  S.forEach((s) => { const g = s.sheets[0].guide; g.why = g.why || s.why; });
  window.NEA.define({ sections: S, board: 'Edexcel' });
})();
