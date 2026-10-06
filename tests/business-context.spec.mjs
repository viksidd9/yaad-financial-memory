import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const landing = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const mockups = fs.readFileSync(path.join(root, 'mockups/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'context-sections.css'), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

// Preserve current live surfaces.
for (const text of ['Your month makes sense.','Yaad knows when to decide, ask, and wait.','Money still in motion stays visible.','Understanding is not authority.']) {
  check(landing.includes(text), 'existing landing content changed: ' + text);
}
const screenCount = (mockups.match(/<article class="screen-card(?:\s+wide)?"/g) || []).length;
check(screenCount === 13, 'existing 13 mockup screens must remain intact; found ' + screenCount);
for (const text of ['FINANCIAL MEMORY GRAPH','HDFC Savings','SBI Savings','Arjun Kumar','UrbanStep']) {
  check(mockups.includes(text), 'existing mockup hero context changed: ' + text);
}

// New structure.
check(landing.includes('href="context-sections.css"'), 'landing context stylesheet link missing');
check(mockups.includes('href="../context-sections.css"'), 'mockups context stylesheet link missing');
check((landing.match(/class="story-rail"/g) || []).length === 1, 'landing story rail must appear once');
check((mockups.match(/class="mock-section-nav"/g) || []).length === 1, 'mockups section nav must appear once');
check((mockups.match(/id="interaction-library"/g) || []).length === 1, 'interaction library heading must appear once');

// Landing additions.
for (const id of ['research-proof','before-after','audience','trust','phonepe-case','first-1000','north-star']) {
  check((landing.match(new RegExp('id="' + id + '"','g')) || []).length === 1, 'landing section missing/duplicated: ' + id);
}
for (const stat of ['80%','83%','60%','57%']) check(landing.includes(stat), 'research stat missing: ' + stat);
for (const text of ['The problem isn’t missing transactions. It’s missing meaning.','Before Yaad','With Yaad','UPI-heavy young adults','Why inside PhonePe?','100 dogfood users','% of material financial events correctly explained with zero manual input']) {
  check(landing.includes(text), 'landing content missing: ' + text);
}
const landingOrder = ['research-proof','before-after','how','audience','trust','phonepe-case','first-1000','north-star','join'].map(id => landing.indexOf('id="' + id + '"'));
check(landingOrder.every((v,i,a)=>v>=0 && (i===0 || v>a[i-1])), 'landing chapters are not in intended story order');

// Mockups additions.
for (const id of ['decision-evidence','ai-provenance','rail-reality','raw-vs-meaning','memory-timeline','failure-modes','beyond-demo','permission-change']) {
  check((mockups.match(new RegExp('id="' + id + '"','g')) || []).length === 1, 'mockups section missing/duplicated: ' + id);
}
for (const text of ['Evidence → Decision → State change','GPT-5.6 Sol','LIVE_MODEL','OpenAI · LIVE','Gnani · LIVE','Setu / Pine · SIMULATED','Delhivery · SIMULATED','Raw evidence','Yaad interpretation','Designed beyond the demo','ACT is OFF']) {
  check(mockups.includes(text), 'mockups evidence content missing: ' + text);
}
check(mockups.indexOf('id="decision-evidence"') < mockups.indexOf('id="interaction-library"'), 'judge evidence must precede interaction library');
check(mockups.indexOf('id="interaction-library"') < mockups.indexOf('<main class="map interaction-depth-map">'), 'interaction library heading must precede existing cards');

// Responsive layout.
for (const klass of ['story-rail','business-grid','judge-evidence-grid','decision-proof-grid','permission-control']) {
  check(css.includes('.' + klass), 'context CSS missing: ' + klass);
}
check(/@media\(max-width:650px\)/.test(css), 'mobile context breakpoint missing');

if (failures.length) {
  console.error('FAIL');
  failures.forEach(f => console.error('- ' + f));
  process.exit(1);
}
console.log('PASS: restructured business/judge context preserves all existing product content');
