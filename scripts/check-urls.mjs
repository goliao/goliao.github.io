// Usage: node scripts/check-urls.mjs src/data/*.yaml
// Extracts every http(s) URL from the given files, HEAD-requests each,
// and reports status. 200/301/302/303/307/308 pass; 401/403/405/429 are warnings
// (paywalls/bot-blockers commonly reject HEAD); anything else fails.
import { readFileSync } from 'node:fs';

const urls = new Set();
for (const f of process.argv.slice(2)) {
  for (const m of readFileSync(f, 'utf8').matchAll(/https?:\/\/[^\s"'\)\]]+/g)) {
    urls.add(m[0].replace(/[.,;]$/, ''));
  }
}
let fail = 0;
for (const u of urls) {
  try {
    const r = await fetch(u, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const ok = [200, 301, 302, 303, 307, 308].includes(r.status);
    const warn = [401, 403, 405, 429].includes(r.status);
    console.log(`${ok ? 'OK  ' : warn ? 'WARN' : 'FAIL'} ${r.status} ${u}`);
    if (!ok && !warn) fail++;
  } catch (e) {
    console.log(`FAIL ERR ${u} (${e.message})`);
    fail++;
  }
}
process.exit(fail ? 1 : 0);
