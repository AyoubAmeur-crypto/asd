// Comprehensive test suite for ASD IV Chronograph and Debate Logic
const assert = require('assert');

// Test data and math recreation for standalone verification
const LIMIT_STANDARD_MS = 8 * 60 * 1000; // 480,000 ms
const LIMIT_REPLY_MS = 4 * 60 * 1000; // 240,000 ms
const WARNING_STANDARD_MS = 5 * 60 * 1000; // 300,000 ms
const WARNING_REPLY_MS = 3 * 60 * 1000; // 180,000 ms

function formatTime(ms) {
  const clamped = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(clamped / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function isWarning(elapsedMs, mode = 'standard') {
  const threshold = mode === 'reply' ? WARNING_REPLY_MS : WARNING_STANDARD_MS;
  return elapsedMs >= threshold;
}

function isOvertime(elapsedMs, mode = 'standard') {
  const limit = mode === 'reply' ? LIMIT_REPLY_MS : LIMIT_STANDARD_MS;
  return elapsedMs > limit;
}

function getEffectiveElapsed(timer, now) {
  if (!timer) return 0;
  const base = Math.max(0, Number.isFinite(timer.elapsed) ? timer.elapsed : 0);
  if (timer.running && timer.startedAt !== null && Number.isFinite(timer.startedAt)) {
    const delta = Math.max(0, now - timer.startedAt);
    return base + delta;
  }
  return base;
}

console.log('--- RUNNING ASD IV TIMER SUITE ---');

// 1. Format Time tests
assert.strictEqual(formatTime(0), '00:00');
assert.strictEqual(formatTime(299000), '04:59');
assert.strictEqual(formatTime(300000), '05:00');
assert.strictEqual(formatTime(301000), '05:01');
assert.strictEqual(formatTime(480000), '08:00');
assert.strictEqual(formatTime(481000), '08:01');
assert.strictEqual(formatTime(3600000 + 125000), '01:02:05');
console.log('✓ formatTime test passed');

// 2. Warning Threshold tests
assert.strictEqual(isWarning(299999, 'standard'), false);
assert.strictEqual(isWarning(300000, 'standard'), true); // exactly 5:00
assert.strictEqual(isWarning(479999, 'standard'), true);
assert.strictEqual(isWarning(179999, 'reply'), false);
assert.strictEqual(isWarning(180000, 'reply'), true); // exactly 3:00 for reply
console.log('✓ isWarning test passed');

// 3. Overtime Threshold tests
assert.strictEqual(isOvertime(300000, 'standard'), false); // 5:00 is warning, NOT overtime!
assert.strictEqual(isOvertime(480000, 'standard'), false); // exactly 8:00 is NOT overtime
assert.strictEqual(isOvertime(480001, 'standard'), true); // strictly > 8:00 IS overtime!
assert.strictEqual(isOvertime(485000, 'standard'), true);
assert.strictEqual(isOvertime(240000, 'reply'), false); // exactly 4:00 is NOT overtime
assert.strictEqual(isOvertime(240001, 'reply'), true); // strictly > 4:00 reply IS overtime!
console.log('✓ isOvertime test passed');

// 4. Wall-clock Start, Pause, Resume, Drift Protection
let t0 = 1000000;
let timer = { elapsed: 0, startedAt: null, running: false };

// Start
timer = { elapsed: 0, startedAt: t0, running: true };
assert.strictEqual(getEffectiveElapsed(timer, t0 + 15000), 15000);

// Pause after 15s
timer = { elapsed: getEffectiveElapsed(timer, t0 + 15000), startedAt: null, running: false };
assert.strictEqual(timer.elapsed, 15000);
assert.strictEqual(getEffectiveElapsed(timer, t0 + 50000), 15000); // Does not advance while paused

// Resume after 20s break (at t0 + 35000)
let tResume = t0 + 35000;
timer = { elapsed: timer.elapsed, startedAt: tResume, running: true };
assert.strictEqual(getEffectiveElapsed(timer, tResume + 10000), 25000); // 15s + 10s = 25s

// Clock drift test (system clock jumps backwards)
assert.strictEqual(getEffectiveElapsed(timer, tResume - 5000), 15000); // Never goes below previous accumulated elapsed
console.log('✓ Wall-clock drift and pause/resume logic passed');

// 5. Verification of Content Roster
const asdData = require('../content/asd-iv.json');
assert.strictEqual(asdData.sections.length, 3);
let totalDebaters = 0;
asdData.sections.forEach(s => {
  assert.strictEqual(s.teams.government.members.length, 3);
  assert.strictEqual(s.teams.opposition.members.length, 3);
  totalDebaters += 6;
});
assert.strictEqual(totalDebaters, 18);
console.log('✓ Confirmed 18 Debaters across 3 Linguistic Arenas');

// 6. WSD Point of Information (POI - 45s) Rule Check
const POI_MAX_MS = 45000;
function simulatePoi(mainTimer, tPoiStart) {
  const pausedMain = {
    elapsed: getEffectiveElapsed(mainTimer, tPoiStart),
    startedAt: null,
    running: false,
  };
  const poiEnd = tPoiStart + POI_MAX_MS;
  return { pausedMain, poiEnd };
}
const testSpeechTimer = { elapsed: 120000, startedAt: 500000, running: true };
const { pausedMain, poiEnd } = simulatePoi(testSpeechTimer, 530000);
assert.strictEqual(pausedMain.running, false);
assert.strictEqual(pausedMain.elapsed, 150000);
assert.strictEqual(poiEnd - 530000, 45000);
console.log('✓ WSD POI 45s floor-pause verification passed');

console.log('ALL TESTS PASSED SUCCESSFULLY!');

