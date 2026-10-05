import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const landing = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(/assets\/home-final-light@2x\.png/.test(landing), 'landing hero must use high-DPI home asset');
check(/\.landing-page\s+\.proofbar span[^\{]*\{[^\}]*font-weight\s*:\s*(500|600|700)/is.test(css), 'landing proof captions need stronger font weight');
check(/\.landing-page\s+\.hero-product[^\{]*\{[^\}]*width\s*:\s*min\(100%,\s*822px\)/is.test(css), 'landing hero needs integer-pixel product frame target');

if (failures.length) {
  console.error('FAIL');
  failures.forEach(f => console.error('- ' + f));
  process.exit(1);
}
console.log('PASS: landing sharpness requirements');
