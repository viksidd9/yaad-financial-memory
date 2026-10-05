import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const landing = read('index.html');
const mockups = read('mockups/index.html');
const css = read('styles.css');

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(landing.includes('Your month makes sense.'), 'landing key headline missing');
for (const amount of ['₹10,000', '₹1,200', '₹3,499']) check(landing.includes(amount), 'landing scenario amount missing: ' + amount);
for (const word of ['SEE', 'UNDERSTAND', 'ASK', 'ACT']) check(landing.includes(word), 'landing permission word missing: ' + word);

const cardCount = (mockups.match(/<article class="screen-card(?:\s+wide)?"/g) || []).length;
check(cardCount === 13, 'expected 13 mockup screen-card articles, found ' + cardCount);

for (const [name, html] of [['landing', landing], ['mockups', mockups]]) {
  check(/three-memory\.js/.test(html), name + ' missing three-memory.js module');
  check(/motion\.js/.test(html), name + ' missing motion.js module');
  check(/data-three-scene/.test(html), name + ' missing data-three-scene');
  check(/data-three-scene[^>]*aria-hidden="true"|aria-hidden="true"[^>]*data-three-scene/.test(html), name + ' 3D scene must be aria-hidden');
}

check(/prefers-reduced-motion:\s*reduce/.test(css), 'reduced-motion CSS missing');
check(/\.three-fallback/.test(css), 'three-fallback styling missing');

if (failures.length) {
  console.error('FAIL');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}
console.log('PASS: protected content and 3D progressive-enhancement hooks');
