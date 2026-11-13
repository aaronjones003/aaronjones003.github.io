# Google link experiment

This independent static route uses no backend, credentials, storage, analytics,
external assets or service worker. Targets occur only in URL fragments; fragments
are not encrypted and remain visible to the sharing app and browser.

The interface is `#v1/{calendar|gmail}/{auto|manual}/{encoded-original-https-url}`.
Encoding is JavaScript `encodeURIComponent`, decoded exactly once. The original
URL is retained without normalization. Only the explicitly validated formats in
`links.mjs` are supported. Calendar accepts `calendar.google.com/calendar/event`
and `www.google.com/calendar/event` with `eid`, optional `authuser` and `ctz`.
Gmail accepts qualified thread-shaped web links but has no enabled native route.

Calendar uses its fixed Android package with an internally generated browser
fallback to this route in manual mode. Manual mode never automatically launches.
No timer, visibility or history-return retry is installed. Google web navigation
requires an explicit click. A navigation attempt never establishes success.

Build with `npm run build`, serve `dist` on port 4178, then run
`node scripts/test-open.mjs`. Set `OPEN_TEST_ORIGIN` to test another origin.
Phone acceptance separately requires the owner's exact event/account observation
from Telegram, including a repeat. Two taps are partial, not one-tap success.

Source publication uses the existing main-to-gh-pages workflow. Preserve the
previous gh-pages artifact before rollout. Revert scoped source changes to roll
back a new implementation, but retain this route once links have been issued.
Mochi activation is separate and remains gated by per-service phone acceptance.
