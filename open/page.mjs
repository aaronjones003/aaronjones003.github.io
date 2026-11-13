import {validate, launcher, parseFragment, intent, controller} from './links.mjs';
const el = id => document.getElementById(id);
let current;
function show(target, automatic) {
  current = target;
  const actions = controller(target, destination => { window.location.href = destination; });
  el('controls').hidden = false;
  el('builder').open = false;
  el('web').href = target.original;
  el('share').value = launcher(target.service, target.original);
  el('app').disabled = !intent(target);
  el('app').onclick = () => actions.manual();
  el('status').textContent = target.service === 'gmail'
    ? 'Gmail thread opening is available on the web. Native app routing is not supported.'
    : target.manual ? 'Automatic opening stopped. Choose how to continue.'
    : 'Trying Calendar once. If it does not open, choose an option below.';
  if (automatic) actions.automatic();
}
el('create').onclick = () => {
  try {
    show({...validate(el('service').value, el('target').value), manual: true}, false);
    el('target').value = '';
  } catch { el('status').textContent = 'This link format is not supported. Use an original Google event or thread link.'; }
};
el('copy').onclick = async () => {
  if (!current) return;
  try {
    await navigator.clipboard.writeText(el('share').value);
    el('copy-status').textContent = 'Link copied.';
  } catch {
    el('share').focus(); el('share').select();
    el('copy-status').textContent = 'Copy is unavailable. Select and copy the link above.';
  }
};
function load(automatic) {
  current = undefined;
  el('controls').hidden = true;
  el('web').removeAttribute('href');
  el('share').value = '';
  el('copy-status').textContent = '';
  el('builder').open = true;
  if (!location.hash) return;
  try { show(parseFragment(location.hash), automatic); }
  catch { el('status').textContent = 'Invalid launcher link. Create a new link below.'; }
}
// Same-document fragment changes refresh controls, never trigger automatic navigation.
window.addEventListener('hashchange', () => load(false));
// No pageshow, visibility or timer retries.
load(true);
