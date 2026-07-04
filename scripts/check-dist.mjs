import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

const REQUIRED_ASSETS = [
  'GordonLiaoCV.pdf', 'google149ed543bf9df5bc.html', 'CNAME', 'robots.txt',
  'data/spx_disaster_prob_march2021update.csv',
  'papers/CLVProject_WP_v5.pdf', 'papers/CLVProject_WP_v8.pdf',
  'papers/CreditCIP_JFE.pdf', 'papers/HedgingChannelofExchangeRate_Latest.pdf',
  'papers/Liao_OCC_Tokenization_Confernece.pdf', 'papers/On-Chain_FX_BOC_JUN23.pdf',
  'papers/US_Banks_Global_Liquidity.pdf',
  'papers/arc_litepaper_2025.pdf', 'papers/circle_quantum_roadmap.pdf',
  'papers/HouseholdsTailRisk_WP.pdf',
  'discussion/AI_and_finance_PIFS_2024_June.pdf',
  'discussion/CooperativeAI_and_Decentralized_Trust.pdf',
  'discussion/Discussion_Stablecoins_Short_term_funding_paper.pdf',
  'discussion/Discussion_Terra_Luna_Crash.pdf',
  'discussion/Singleness_of_money.pdf',
  'img/gordon_headshot_1.jpg', 'img/gordon_headshot_2.jpg', 'img/gordon_liao_3.jpg',
  'img/headshot_GL_4ss.jpg', 'img/headshot.jpg',
];
const REQUIRED_PAGES = [
  'index.html', '404.html',
  'research/index.html', 'speaking/index.html', 'media/index.html',
  'writing/index.html', 'cv/index.html', 'tokenisation/index.html',
  'sitemap-index.xml',
];

let failures = [];
for (const p of [...REQUIRED_ASSETS, ...REQUIRED_PAGES]) {
  if (!existsSync(join(DIST, p))) failures.push(`missing: ${p}`);
}

// crawl internal links in every built HTML file
function* htmlFiles(dir) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) yield* htmlFiles(full);
    else if (e.endsWith('.html')) yield full;
  }
}
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = decodeURIComponent(m[1]);
    const candidates = [
      join(DIST, target),
      join(DIST, target, 'index.html'),
      join(DIST, target.replace(/\/$/, '') + '.html'),
    ];
    if (!candidates.some(c => existsSync(c))) {
      failures.push(`broken internal link ${target} in ${file.slice(DIST.length)}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('check-dist OK: parity + internal links');
