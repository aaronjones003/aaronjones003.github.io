import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {validate, launcher, parseFragment, intent, controller} from '../public/open/links.mjs';
const calendar = 'https://www.google.com/calendar/event?eid=c3ludGhldGlj&authuser=person%40example.test&ctz=America%2FNew_York';
const gmail = 'https://mail.google.com/mail/u/1/?authuser=person%40example.test#all/synthetic12345678';
for (const [service, original] of [['calendar', calendar], ['gmail', gmail]]) {
  for (const manual of [false, true]) {
    assert.deepEqual(parseFragment(new URL(launcher(service, original, manual)).hash), {service, original, manual});
  }
}
for (const value of [calendar.replace('www.google.com', 'www.google.com.evil.test'),
  calendar.replace('https:', 'javascript:'), calendar.replace('www.google.com', 'user@www.google.com'),
  calendar.replace('/calendar/', '/x/../calendar/'), calendar + '&redirect=https://evil.test',
  calendar + '&eid=duplicate', calendar + '#Intent;package=bad;end', calendar + '&authuser=2',
  calendar.replace('www.google.com', 'www.google.com:443'), calendar.replace('eid=', 'eid=%zz'),
  calendar.replace('calendar/event', 'calendar/render'), calendar + '\n']) {
  assert.throws(() => validate('calendar', value), value);
}
for (const hash of ['#v2/calendar/auto/x', '#v1/calendar/retry/x', '#v1/calendar/manual/%', '#v1/bad/auto/x']) {
  assert.throws(() => parseFragment(hash));
}
assert.equal(intent({service:'gmail', original:gmail}), null);
const target = {service:'calendar', original:calendar, manual:false};
const destination = intent(target);
assert.ok(destination.startsWith('intent:' + calendar.slice(6) + '#Intent;'));
assert.ok(destination.includes(';package=com.google.android.calendar;'));
const fallback = decodeURIComponent(destination.match(/S.browser_fallback_url=([^;]+)/)[1]);
assert.deepEqual(parseFragment(new URL(fallback).hash), {...target, manual:true});
let attempts = 0;
const actions = controller(target, () => attempts++);
actions.automatic(); actions.automatic(); assert.equal(attempts, 1);
controller({...target, manual:true}, () => attempts++).automatic(); assert.equal(attempts, 1);
actions.manual(); assert.equal(attempts, 2);

const browser = await chromium.launch({headless:true, ...(process.env.OPEN_CHROME ? {executablePath:process.env.OPEN_CHROME} : {})});
try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const requests = [], errors = [], blockedByCsp = new Set(), responses = [];
  page.on('request', r => requests.push(r.url()));
  page.on('requestfailed', r => { if (r.failure()?.errorText === 'csp') blockedByCsp.add(r.url()); });
  page.on('response', r => responses.push(r.url()));
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {value:{writeText:async()=>{throw Error('Denied');}}}));
  const origin = process.env.OPEN_TEST_ORIGIN || 'http://127.0.0.1:4178';
  await page.goto(origin + '/open/' + new URL(fallback).hash);
  assert.match(await page.locator('#status').innerText(), /Automatic opening stopped/);
  assert.equal(await page.locator('#web').getAttribute('href'), calendar);
  await page.locator('#copy').click();
  assert.match(await page.locator('#copy-status').innerText(), /Copy is unavailable/);
  await page.evaluate(() => {window.dispatchEvent(new Event('pageshow')); document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(page.url(), origin + '/open/' + new URL(fallback).hash);
  await page.screenshot({path:process.env.OPEN_SCREENSHOT || '/tmp/open-launcher.png',fullPage:true});
  await page.goto(origin + '/open/#v1/calendar/manual/invalid');
  await page.waitForFunction(() => document.getElementById('status').textContent.startsWith('Invalid'));
  assert.match(await page.locator('#status').innerText(), /Invalid launcher/);
  assert.equal(await page.locator('#controls').isVisible(), false);
  await page.locator('#target').fill(calendar);
  await page.locator('#create').click();
  assert.equal(await page.locator('#share').inputValue(), launcher('calendar', calendar));
  assert.equal(await page.locator('#target').inputValue(), '');
  await page.goto(origin + '/open/' + new URL(launcher('gmail',gmail)).hash);
  await page.waitForFunction(() => document.getElementById('app').disabled);
  assert.equal(await page.locator('#app').isDisabled(), true);
  assert.equal(await page.locator('#web').getAttribute('href'), gmail);
  // Desktop Chromium cannot launch the Android intent. Controls must remain usable.
  await page.goto(origin + '/open/' + new URL(launcher('calendar',calendar)).hash);
  await page.reload({waitUntil:'commit'});
  await page.locator('#controls').waitFor({state:'visible'});
  assert.equal(await page.locator('#web').isVisible(), true);
  assert.equal(await page.locator('#copy').isVisible(), true);
  assert.equal(await page.title(), 'Open a Google link');
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  assert.equal(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length), 0);
  assert.deepEqual(errors, []);
  const navigations = requests.filter(url => url.startsWith('intent:'));
  assert.equal(navigations.length, 1);
  // The hosting edge may inject analytics. CSP must block it before any network response.
  const network = requests.filter(url => !url.startsWith('intent:') && !blockedByCsp.has(url));
  assert.ok(responses.every(url => url.startsWith(origin + '/open/')));
  assert.ok(network.every(url => url.startsWith(origin + '/open/')), network.join('\n'));
  assert.ok(network.every(url => !url.includes('eid=') && !url.includes('authuser=')));
  console.log('PASS: validation, lossless fragments, manual-only fallback, one automatic attempt, clipboard failure, blocked launch, private requests, mobile controls.');
} finally { await browser.close(); }
