import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const landing = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const mockups = fs.readFileSync(path.join(root, 'mockups/index.html'), 'utf8');
const analytics = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

check(landing.includes('<script src="analytics.js"></script>'), 'landing analytics script missing');
check(mockups.includes('<script src="../analytics.js"></script>'), 'mockups analytics script missing');
check(analytics.includes("yaad-financial-memory-viksidd9"), 'analytics namespace missing');
check(analytics.includes("analytics_ignore"), 'owner exclusion switch missing');
check(analytics.includes("analytics_include"), 'owner re-enable switch missing');
check(analytics.includes("viksidd9.github.io"), 'production host guard missing');
check(analytics.includes("landing"), 'landing page key missing');
check(analytics.includes("mockups"), 'mockups page key missing');
check(analytics.includes("navigator.doNotTrack"), 'Do Not Track support missing');
check(analytics.includes("action = 'cta'"), 'CTA event tracking missing');
check(analytics.includes("join-pilot"), 'join-pilot event missing');
check(analytics.includes("human-interactions"), 'mockups CTA event missing');

if (failures.length) {
  console.error('FAIL');
  failures.forEach(f => console.error('- ' + f));
  process.exit(1);
}
console.log('PASS: analytics integration is present on landing and mockups');
