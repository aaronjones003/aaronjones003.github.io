export const BASE = 'https://onigiri.zone/open/';
const packages = {calendar: 'com.google.android.calendar'};

export function validate(service, original) {
  if (!['calendar', 'gmail'].includes(service) || typeof original !== 'string' || original.length > 4096 ||
      /[^\x21-\x7e]|\\|;|%(?![\da-f]{2})/i.test(original)) throw Error('Unsupported Google link.');
  const url = new URL(original);
  if (url.protocol !== 'https:' || url.username || url.password || url.port) throw Error('Unsupported Google link.');
  const authority = original.match(/^https:\/\/([^/]+)\//)?.[1];
  if (authority !== url.hostname) throw Error('Unsupported Google link.');
  const keys = [...url.searchParams.keys()];
  if (new Set(keys).size !== keys.length) throw Error('Unsupported Google link.');
  for (const [key, value] of url.searchParams) {
    if (!['authuser', ...(service === 'calendar' ? ['eid', 'ctz'] : [])].includes(key)) throw Error('Unsupported Google link.');
    if (key === 'authuser' && !/^(?:\d{1,3}|[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+)$/.test(value)) throw Error('Unsupported account selector.');
    if (key === 'ctz' && !/^[A-Za-z_+-]+(?:\/[A-Za-z0-9_+-]+){0,2}$/.test(value)) throw Error('Unsupported timezone.');
  }
  if (service === 'calendar') {
    if (!['www.google.com', 'calendar.google.com'].includes(url.hostname) ||
        !/^https:\/\/[^/]+\/calendar\/event\?/.test(original) || url.pathname !== '/calendar/event' || url.hash ||
        !/^[A-Za-z0-9_-]{8,1024}={0,2}$/.test(url.searchParams.get('eid') || '')) throw Error('Unsupported Calendar event link.');
  } else if (url.hostname !== 'mail.google.com' ||
      !/^https:\/\/mail\.google\.com\/mail\/(?:u\/\d{1,3}\/)?(?:\?|#)/.test(original) ||
      !/^\/mail\/(?:u\/\d{1,3}\/)?$/.test(url.pathname) ||
      !/^#(?:all|inbox|sent|starred|important)\/[A-Za-z0-9_-]{8,256}$/.test(url.hash)) throw Error('Unsupported Gmail thread link.');
  return {service, original};
}

export function launcher(service, original, manual = false) {
  validate(service, original);
  return BASE + '#v1/' + service + '/' + (manual ? 'manual' : 'auto') + '/' + encodeURIComponent(original);
}

export function parseFragment(hash) {
  if (hash.length > 16384) throw Error('Invalid launcher link.');
  const match = /^#v1\/(calendar|gmail)\/(auto|manual)\/([^/]+)$/.exec(hash);
  if (!match) throw Error('Invalid launcher link.');
  return {...validate(match[1], decodeURIComponent(match[3])), manual: match[2] === 'manual'};
}

export function intent(target) {
  validate(target.service, target.original);
  if (!packages[target.service]) return null; // Gmail has no qualified browsable thread handler.
  const fallback = launcher(target.service, target.original, true);
  return 'intent:' + target.original.slice(6) + '#Intent;scheme=https;package=' + packages[target.service] +
    ';S.browser_fallback_url=' + encodeURIComponent(fallback) + ';end';
}

export function controller(target, navigate) {
  let attempted = false;
  return {
    automatic() {
      if (attempted || target.manual) return;
      attempted = true;
      const destination = intent(target);
      if (destination) navigate(destination);
    },
    manual() { const destination = intent(target); if (destination) navigate(destination); },
  };
}
