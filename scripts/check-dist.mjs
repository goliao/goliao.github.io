import { existsSync } from 'node:fs';

const REQUIRED_ASSETS = [
  'GordonLiaoCV.pdf', 'google149ed543bf9df5bc.html', 'CNAME',
  'data/spx_disaster_prob_march2021update.csv',
  'papers/CLVProject_WP_v5.pdf', 'papers/CLVProject_WP_v8.pdf',
  'papers/CreditCIP_JFE.pdf', 'papers/HedgingChannelofExchangeRate_Latest.pdf',
  'papers/Liao_OCC_Tokenization_Confernece.pdf', 'papers/On-Chain_FX_BOC_JUN23.pdf',
  'papers/US_Banks_Global_Liquidity.pdf',
  'papers/arc_litepaper_2025.pdf', 'papers/circle_quantum_roadmap.pdf',
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

let missing = [];
for (const p of [...REQUIRED_ASSETS, ...REQUIRED_PAGES]) {
  if (!existsSync(new URL(`../dist/${p}`, import.meta.url))) missing.push(p);
}
if (missing.length) {
  console.error('MISSING from dist/:\n' + missing.join('\n'));
  process.exit(1);
}
console.log(`parity OK: ${REQUIRED_ASSETS.length + REQUIRED_PAGES.length} paths present`);
