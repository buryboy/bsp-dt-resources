// Final quiz: 20 questions, one go. a = correct answer, d = three wrong answers, mis = misconception tag (optional).
Book.finalQuiz({
  questions: [
    // motion
    { q: 'A child on a playground <b>swing</b> shows which type of motion?', a: 'Oscillating', d: ['Reciprocating', 'Rotary', 'Linear'], mis: 'recip-vs-oscill' },
    { q: 'Which is the best description of <b>reciprocating</b> motion?', a: 'Back and forth in a straight line', d: ['Back and forth along a curved arc', 'One way only along a straight line', 'Round and round about an axis'], mis: 'recip-vs-oscill' },
    { q: 'Which of these is an example of <b>linear</b> motion?', a: 'A train on a straight track', d: ['A needle in a sewing machine', 'A pendulum inside a clock', 'A blade in a jigsaw'], mis: 'linear-vs-recip' },
    // lever parts and orders
    { q: 'What is the <b>effort</b> of a lever?', a: 'The input force that you apply', d: ['The fixed point that it turns about', 'The output force that gets moved', 'The rigid bar that does the turning'], mis: 'fulcrum-load-effort' },
    { q: 'In a <b>second-order</b> lever, which part is in the middle?', a: 'The load', d: ['The fulcrum', 'The effort', 'The pivot'], mis: 'lever-order' },
    { q: 'Which of these is a <b>first-order</b> lever?', a: 'A crowbar', d: ['A wheelbarrow', 'A fishing rod', 'A bottle opener'], mis: 'lever-order' },
    { q: 'Which order of lever <b>always</b> has a mechanical advantage of less than 1?', a: 'Third order', d: ['First order', 'Second order', 'Every order'], mis: 'third-order-ma' },
    // mechanical advantage
    { q: 'A lever lifts a load of <b>1000 N</b> with an effort of <b>250 N</b>. What is its mechanical advantage?', a: '4', d: ['0.25', '750', '1250'], mis: 'ma-upside-down' },
    { q: 'A lever has a mechanical advantage of <b>4</b>. What effort is needed to lift a load of <b>600 N</b>?', a: '150 N', d: ['2400 N', '596 N', '604 N'], mis: 'ma-upside-down' },
    { q: 'A lever has a mechanical advantage of <b>3</b>. What load can an effort of <b>150 N</b> lift?', a: '450 N', d: ['50 N', '153 N', '147 N'], mis: 'ma-upside-down' },
    { q: 'A lever has a mechanical advantage <b>greater than 1</b>. What is the trade-off?', a: 'Your hand moves further than the load', d: ['Your hand moves less far than the load', 'None: you gain force and distance', 'The load moves faster than your hand'], mis: 'ma-free-lunch' },
    // moments and balance
    { q: 'A force of <b>50 N</b> acts <b>2 m</b> from a fulcrum. What is its moment?', a: '100 Nm', d: ['25 Nm', '52 Nm', '50 Nm'], mis: 'moment-distance' },
    { q: 'A <b>400 N</b> load sits <b>1 m</b> from the fulcrum of a see-saw. What effort balances it from <b>4 m</b> away on the other side?', a: '100 N', d: ['400 N', '1600 N', '396 N'], mis: 'moment-distance' },
    { q: 'A nut is very tight. How can a mechanic undo it with <b>less effort</b>?', a: 'Use a longer spanner and push at its end', d: ['Use a shorter spanner and push near the nut', 'Use any spanner: only the force matters', 'Use a heavier spanner of the same length'], mis: 'moment-distance' },
    // linkages
    { q: 'In a linkage, what is a <b>fixed pivot</b>?', a: 'It is attached to the frame and does not move', d: ['It joins two bars and moves along with them', 'It slides along a guide in a straight line', 'It is the end of the bar where you push'], mis: 'fixed-vs-moving' },
    { q: 'In a <b>push–pull</b> linkage, which way does the output move?', a: 'In the same direction as the input', d: ['In the opposite direction to the input', 'At 90° to the direction of the input', 'Round in a circle about the input'], mis: 'linkage-type' },
    { q: 'The fixed pivot of a <b>reverse motion</b> linkage is moved nearer the output. What does the output get?', a: 'A bigger force but a smaller movement', d: ['A bigger force and a bigger movement', 'A smaller force but a bigger movement', 'The same force and the same movement'], mis: 'ma-free-lunch' },
    { q: 'The <b>treadle</b> of an old sewing machine converts…', a: 'oscillating motion into rotary motion', d: ['reciprocating motion into rotary motion', 'rotary motion into linear motion', 'linear motion into oscillating motion'], mis: 'motion-conversion' },
    // products
    { q: 'Which mechanism in a <b>bicycle brake</b> caliper turns the pull of the cable through 90°?', a: 'Bell crank linkage', d: ['Reverse motion linkage', 'Push–pull linkage', 'Lazy tongs linkage'], mis: 'linkage-type' },
    { q: 'Which mechanism in a <b>car engine</b> turns the motion of the pistons into the rotation of the crankshaft?', a: 'Crank and slider', d: ['Treadle linkage', 'Bell crank linkage', 'Push–pull linkage'], mis: 'motion-conversion' },
  ],
});
