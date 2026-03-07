/**
 * Sector-specific mock data for all sectors.
 * Each sector has: movers, news, top20, directorBriefing.
 */

import type { Company, NewsItem, TopCompany, DirectorBriefing } from "./sectors";
import {
  healthcareMovers,
  healthcareNews,
  healthcareTop20,
  healthcareDirectorBriefing,
} from "./sectors";

export interface SectorData {
  movers: Company[];
  news: NewsItem[];
  top20: TopCompany[];
  directorBriefing: DirectorBriefing;
}

// ── Semiconductors ──────────────────────────────────────────────────────

const semiMovers: Company[] = [
  { name: "NVIDIA", ticker: "NVDA", marketCap: "$2.8T", change24h: 4.12, change7d: 12.5, volume: "$18.2B", sector: "AI Chips", sparkline: [50, 55, 58, 62, 60, 65, 68, 72, 70, 75, 78, 82] },
  { name: "TSMC", ticker: "TSM", marketCap: "$890B", change24h: 1.87, change7d: 6.3, volume: "$4.5B", sector: "Foundry", sparkline: [60, 62, 58, 65, 67, 70, 68, 72, 74, 73, 76, 78] },
  { name: "Broadcom", ticker: "AVGO", marketCap: "$820B", change24h: 2.34, change7d: 8.1, volume: "$3.8B", sector: "Networking", sparkline: [45, 48, 50, 52, 55, 54, 58, 60, 62, 65, 63, 68] },
  { name: "AMD", ticker: "AMD", marketCap: "$280B", change24h: -1.56, change7d: 3.4, volume: "$6.1B", sector: "GPUs", sparkline: [55, 52, 50, 53, 56, 54, 58, 55, 60, 58, 62, 60] },
  { name: "Intel", ticker: "INTC", marketCap: "$105B", change24h: -3.21, change7d: -8.4, volume: "$5.2B", sector: "CPUs", sparkline: [50, 48, 45, 42, 44, 40, 38, 42, 39, 36, 38, 35] },
  { name: "Qualcomm", ticker: "QCOM", marketCap: "$195B", change24h: 0.89, change7d: 2.1, volume: "$2.8B", sector: "Mobile", sparkline: [40, 42, 41, 44, 43, 45, 44, 46, 48, 47, 49, 48] },
  { name: "Marvell Technology", ticker: "MRVL", marketCap: "$78B", change24h: 3.45, change7d: 14.2, volume: "$1.9B", sector: "Data Center", sparkline: [30, 33, 35, 38, 40, 42, 45, 43, 48, 50, 52, 55] },
  { name: "ASML", ticker: "ASML", marketCap: "$380B", change24h: 1.12, change7d: 4.7, volume: "$2.1B", sector: "Equipment", sparkline: [65, 67, 64, 68, 70, 72, 69, 73, 75, 74, 77, 78] },
];

const semiNews: NewsItem[] = [
  { id: "s1", title: "NVIDIA Acquires Run:ai for $700M to Bolster AI Orchestration", source: "Bloomberg", time: "2026-03-03", type: "ma", amount: "$700M", companies: ["NVIDIA", "Run:ai"], summary: "NVIDIA acquired Israeli AI infrastructure startup Run:ai, adding GPU orchestration capabilities to its data center portfolio." },
  { id: "s2", title: "Intel Foundry Services Secures $8.5B CHIPS Act Award", source: "Reuters", time: "2026-02-21", type: "deal", amount: "$8.5B", companies: ["Intel"], summary: "Intel received the largest CHIPS Act award to date for expanding domestic chip manufacturing in Arizona and Ohio." },
  { id: "s3", title: "Broadcom Completes VMware Integration, Eyes $40B Revenue", source: "CNBC", time: "2026-02-08", type: "deal", amount: "$40B", companies: ["Broadcom", "VMware"], summary: "Broadcom finalized the $61B VMware acquisition integration and projects annual revenue exceeding $40B." },
  { id: "s4", title: "Arm Holdings Raises $4.8B in Secondary Offering", source: "FT", time: "2026-01-18", type: "funding", amount: "$4.8B", companies: ["Arm Holdings"], summary: "SoftBank sold a portion of its Arm Holdings stake in a secondary offering valued at $4.8B." },
];

const semiTop20: TopCompany[] = [
  { rank: 1, name: "NVIDIA", ticker: "NVDA", marketCap: "$2.8T", revenue: "$96.3B", growth: 122.4, pe: 58.2, recentDeal: "Acquired Run:ai ($700M)", dealDate: "Feb 2026" },
  { rank: 2, name: "TSMC", ticker: "TSM", marketCap: "$890B", revenue: "$85.2B", growth: 28.3, pe: 24.1 },
  { rank: 3, name: "Broadcom", ticker: "AVGO", marketCap: "$820B", revenue: "$40.1B", growth: 44.2, pe: 35.8, recentDeal: "VMware integration complete", dealDate: "Jan 2026" },
  { rank: 4, name: "ASML", ticker: "ASML", marketCap: "$380B", revenue: "$28.4B", growth: 15.7, pe: 42.3 },
  { rank: 5, name: "AMD", ticker: "AMD", marketCap: "$280B", revenue: "$24.6B", growth: 18.9, pe: 38.7 },
  { rank: 6, name: "Qualcomm", ticker: "QCOM", marketCap: "$195B", revenue: "$38.9B", growth: 6.2, pe: 16.8 },
  { rank: 7, name: "Texas Instruments", ticker: "TXN", marketCap: "$178B", revenue: "$17.5B", growth: -8.3, pe: 28.4 },
  { rank: 8, name: "Applied Materials", ticker: "AMAT", marketCap: "$162B", revenue: "$26.5B", growth: 12.1, pe: 22.6 },
  { rank: 9, name: "Lam Research", ticker: "LRCX", marketCap: "$125B", revenue: "$15.8B", growth: 9.4, pe: 25.1 },
  { rank: 10, name: "Intel", ticker: "INTC", marketCap: "$105B", revenue: "$54.2B", growth: -12.1, pe: 18.3, recentDeal: "CHIPS Act $8.5B award", dealDate: "Feb 2026" },
  { rank: 11, name: "Marvell Technology", ticker: "MRVL", marketCap: "$78B", revenue: "$5.5B", growth: 22.8, pe: 45.2 },
  { rank: 12, name: "Arm Holdings", ticker: "ARM", marketCap: "$165B", revenue: "$3.2B", growth: 35.6, pe: 112.4 },
  { rank: 13, name: "Analog Devices", ticker: "ADI", marketCap: "$108B", revenue: "$12.3B", growth: -4.2, pe: 32.7 },
  { rank: 14, name: "Micron", ticker: "MU", marketCap: "$115B", revenue: "$25.1B", growth: 52.3, pe: 12.8 },
  { rank: 15, name: "KLA Corp", ticker: "KLAC", marketCap: "$95B", revenue: "$10.5B", growth: 8.7, pe: 28.9 },
  { rank: 16, name: "Synopsys", ticker: "SNPS", marketCap: "$82B", revenue: "$6.1B", growth: 14.3, pe: 52.1 },
  { rank: 17, name: "Cadence Design", ticker: "CDNS", marketCap: "$78B", revenue: "$4.1B", growth: 16.8, pe: 65.3 },
  { rank: 18, name: "ON Semiconductor", ticker: "ON", marketCap: "$35B", revenue: "$7.2B", growth: -5.6, pe: 15.4 },
  { rank: 19, name: "GlobalFoundries", ticker: "GFS", marketCap: "$28B", revenue: "$7.4B", growth: 2.1, pe: 18.9 },
  { rank: 20, name: "Lattice Semi", ticker: "LSCC", marketCap: "$8B", revenue: "$0.7B", growth: -12.4, pe: 42.8 },
];

const semiBriefing: DirectorBriefing = {
  sectorThesis: "Semiconductors are the foundational layer of the AI revolution. NVIDIA's dominance in GPU training infrastructure, TSMC's manufacturing monopoly on advanced nodes, and the $280B CHIPS Act-driven reshoring wave create a once-in-a-decade investment cycle. The sector is transitioning from cyclical to structural growth driven by AI, automotive, and edge computing.",
  metrics: { totalDealVolume: "$89.2B", avgRevenueGrowth: "22.4%", peRange: "12.8x – 112.4x", topMover: "Marvell (MRVL)", topMoverChange: 14.2, activeDeals: 8 },
  spotlightCompanies: [
    { name: "NVIDIA", ticker: "NVDA", signal: "Worth Exploring", marketCap: "$2.8T", growth: 122.4, pe: 58.2, rationale: "NVIDIA has achieved near-monopoly status in AI training infrastructure. Data center revenue grew 122% YoY as hyperscalers race to build GPU clusters. The CUDA ecosystem moat is deepening as software lock-in intensifies.", catalysts: ["Blackwell B200 ramp driving ASP uplift", "Sovereign AI spending from 30+ countries", "Run:ai acquisition strengthening software stack"], recentDeal: "Run:ai ($700M) — Feb 2026", risks: ["Customer concentration — top 4 hyperscalers represent 50%+ revenue", "AMD MI300X gaining traction in inference workloads", "Geopolitical export restrictions to China limiting TAM"] },
    { name: "Marvell Technology", ticker: "MRVL", signal: "Worth Exploring", marketCap: "$78B", growth: 22.8, pe: 45.2, rationale: "Marvell is emerging as the custom silicon partner of choice for hyperscalers building proprietary AI chips. Their 5nm platform and deep relationships with Amazon, Google, and Microsoft position them to capture the custom ASIC wave.", catalysts: ["Custom AI ASIC revenue doubling in 2026", "5nm platform wins with 3 of top 5 hyperscalers", "Electro-optics technology enabling 800G/1.6T data center connectivity"], risks: ["Heavy reliance on few large customers", "Broadcom competing aggressively in custom silicon", "Gross margin pressure from 5nm transition costs"] },
  ],
  tailwinds: ["AI infrastructure spending estimated at $300B+ through 2027", "CHIPS Act reshoring creating new US/EU fab capacity", "Automotive semiconductor content per vehicle growing 3x", "Edge AI inference driving new chip demand categories"],
  headwinds: ["China export restrictions limiting addressable market", "Cyclical inventory correction risk in non-AI segments", "Capital intensity of sub-3nm manufacturing", "ASML EUV bottleneck constraining foundry capacity expansion"],
};

// ── Fintech ─────────────────────────────────────────────────────────────

const fintechMovers: Company[] = [
  { name: "Visa", ticker: "V", marketCap: "$580B", change24h: 0.89, change7d: 2.3, volume: "$1.8B", sector: "Payments", sparkline: [60, 62, 61, 64, 63, 65, 66, 68, 67, 69, 70, 71] },
  { name: "Mastercard", ticker: "MA", marketCap: "$420B", change24h: 1.12, change7d: 3.1, volume: "$1.4B", sector: "Payments", sparkline: [55, 57, 56, 59, 58, 61, 62, 64, 63, 65, 67, 68] },
  { name: "PayPal", ticker: "PYPL", marketCap: "$78B", change24h: 3.45, change7d: 11.2, volume: "$2.9B", sector: "Digital Payments", sparkline: [30, 33, 35, 38, 36, 40, 42, 44, 43, 46, 48, 50] },
  { name: "Block (Square)", ticker: "SQ", marketCap: "$42B", change24h: -2.12, change7d: -4.5, volume: "$1.6B", sector: "Payments", sparkline: [45, 43, 40, 42, 38, 36, 38, 35, 37, 34, 36, 33] },
  { name: "Stripe", ticker: "STRIP", marketCap: "$91B", change24h: 1.56, change7d: 5.8, volume: "Private", sector: "Payments Infra", sparkline: [40, 42, 44, 46, 48, 50, 52, 54, 53, 56, 58, 60] },
  { name: "Adyen", ticker: "ADYEN", marketCap: "$52B", change24h: 2.78, change7d: 8.9, volume: "$890M", sector: "Payments", sparkline: [35, 38, 40, 42, 45, 48, 50, 52, 55, 54, 58, 60] },
  { name: "Robinhood", ticker: "HOOD", marketCap: "$28B", change24h: 5.67, change7d: 18.4, volume: "$3.2B", sector: "Brokerage", sparkline: [20, 22, 25, 28, 32, 35, 38, 40, 42, 45, 48, 52] },
  { name: "Marqeta", ticker: "MQ", marketCap: "$5.2B", change24h: -1.89, change7d: -3.2, volume: "$280M", sector: "Card Issuing", sparkline: [40, 38, 36, 38, 35, 33, 35, 32, 34, 31, 33, 30] },
];

const fintechNews: NewsItem[] = [
  { id: "f1", title: "Stripe Acquires Bridge for $1.1B to Enter Stablecoin Infrastructure", source: "TechCrunch", time: "2026-03-05", type: "ma", amount: "$1.1B", companies: ["Stripe", "Bridge"], summary: "Stripe's largest acquisition ever brings stablecoin orchestration capabilities, positioning the company for the crypto-native payments market." },
  { id: "f2", title: "Visa Partners with Circle for USDC Settlement Layer", source: "Bloomberg", time: "2026-02-24", type: "deal", companies: ["Visa", "Circle"], summary: "Visa will begin settling select cross-border transactions using USDC stablecoin on the Solana and Ethereum networks." },
  { id: "f3", title: "Plaid Raises $425M Series E at $15B Valuation", source: "Reuters", time: "2026-02-11", type: "funding", amount: "$425M", companies: ["Plaid"], summary: "Open banking infrastructure provider Plaid raised its Series E as banks increasingly adopt API-based data sharing." },
  { id: "f4", title: "FIS Spins Off Worldpay in $18.5B Deal", source: "WSJ", time: "2026-01-28", type: "deal", amount: "$18.5B", companies: ["FIS", "Worldpay"], summary: "Financial technology conglomerate FIS completes the separation of its merchant acquiring business Worldpay." },
];

const fintechTop20: TopCompany[] = [
  { rank: 1, name: "Visa", ticker: "V", marketCap: "$580B", revenue: "$35.9B", growth: 10.2, pe: 32.4 },
  { rank: 2, name: "Mastercard", ticker: "MA", marketCap: "$420B", revenue: "$26.4B", growth: 12.8, pe: 35.1 },
  { rank: 3, name: "Stripe", ticker: "STRIP", marketCap: "$91B", revenue: "$18.5B", growth: 28.4, pe: 0, recentDeal: "Bridge ($1.1B)", dealDate: "Feb 2026" },
  { rank: 4, name: "PayPal", ticker: "PYPL", marketCap: "$78B", revenue: "$31.4B", growth: 8.7, pe: 18.2 },
  { rank: 5, name: "Intuit", ticker: "INTU", marketCap: "$185B", revenue: "$16.3B", growth: 13.5, pe: 42.1 },
  { rank: 6, name: "Fiserv", ticker: "FI", marketCap: "$92B", revenue: "$19.8B", growth: 7.4, pe: 22.8 },
  { rank: 7, name: "Adyen", ticker: "ADYEN", marketCap: "$52B", revenue: "$2.1B", growth: 22.1, pe: 58.3 },
  { rank: 8, name: "Block", ticker: "SQ", marketCap: "$42B", revenue: "$22.1B", growth: 15.2, pe: 35.6 },
  { rank: 9, name: "Coinbase", ticker: "COIN", marketCap: "$48B", revenue: "$5.6B", growth: 85.2, pe: 28.4 },
  { rank: 10, name: "Robinhood", ticker: "HOOD", marketCap: "$28B", revenue: "$2.4B", growth: 42.3, pe: 32.1 },
  { rank: 11, name: "Plaid", ticker: "PLAID", marketCap: "$15B", revenue: "$0.8B", growth: 35.4, pe: 0 },
  { rank: 12, name: "Affirm", ticker: "AFRM", marketCap: "$18B", revenue: "$2.3B", growth: 28.9, pe: 0 },
  { rank: 13, name: "Marqeta", ticker: "MQ", marketCap: "$5.2B", revenue: "$0.7B", growth: 18.4, pe: 0 },
  { rank: 14, name: "Toast", ticker: "TOST", marketCap: "$15B", revenue: "$4.2B", growth: 31.2, pe: 85.3 },
  { rank: 15, name: "Worldpay", ticker: "WP", marketCap: "$18.5B", revenue: "$4.8B", growth: 5.1, pe: 14.2 },
  { rank: 16, name: "SoFi Technologies", ticker: "SOFI", marketCap: "$12B", revenue: "$2.5B", growth: 34.8, pe: 45.2 },
  { rank: 17, name: "Wise", ticker: "WISE", marketCap: "$10B", revenue: "$1.2B", growth: 25.3, pe: 42.8 },
  { rank: 18, name: "Nuvei", ticker: "NVEI", marketCap: "$6.8B", revenue: "$1.1B", growth: 18.2, pe: 22.4 },
  { rank: 19, name: "Checkout.com", ticker: "CHKT", marketCap: "$11B", revenue: "$0.6B", growth: 32.1, pe: 0 },
  { rank: 20, name: "dLocal", ticker: "DLO", marketCap: "$4.5B", revenue: "$0.7B", growth: 42.1, pe: 28.9 },
];

const fintechBriefing: DirectorBriefing = {
  sectorThesis: "Financial Technology is entering its consolidation phase after a decade of disruption. Payment rails are being rebuilt around real-time infrastructure, embedded finance is collapsing distribution costs, and stablecoin-based settlement is emerging as a legitimate institutional layer. The winners will own regulated infrastructure, not just consumer apps.",
  metrics: { totalDealVolume: "$62.3B", avgRevenueGrowth: "18.5%", peRange: "14.2x – 85.3x", topMover: "Robinhood (HOOD)", topMoverChange: 18.4, activeDeals: 11 },
  spotlightCompanies: [
    { name: "Stripe", ticker: "STRIP", signal: "Worth Exploring", marketCap: "$91B", growth: 28.4, pe: 0, rationale: "Stripe's Bridge acquisition signals a strategic pivot toward stablecoin infrastructure. With $18.5B in revenue growing 28%, Stripe is building the financial operating system for internet businesses while expanding into crypto-native payment rails.", catalysts: ["Bridge acquisition enabling stablecoin payment flows", "Revenue approaching $20B run rate with improving margins", "Potential IPO in 2026 H2 would unlock significant value"], recentDeal: "Bridge ($1.1B) — Feb 2026", risks: ["IPO timing uncertainty in volatile markets", "Intense competition from Adyen and emerging players", "Regulatory complexity across 40+ countries"] },
    { name: "Robinhood", ticker: "HOOD", signal: "Monitor Closely", marketCap: "$28B", growth: 42.3, pe: 32.1, rationale: "Robinhood has transformed from a meme-stock platform into a legitimate financial services company. Revenue growing 42% with expanding margins as Gold subscriptions and crypto trading drive diversification beyond equity commissions.", catalysts: ["Gold subscription base exceeding 2M users", "UK and EU launch expanding TAM significantly", "Crypto revenue surging with institutional features"], risks: ["Regulatory scrutiny on payment for order flow", "Revenue concentration in volatile asset classes", "Competition from established brokerages adding mobile features"] },
  ],
  tailwinds: ["Real-time payment infrastructure adoption accelerating globally", "Stablecoin settlement gaining institutional credibility", "Embedded finance TAM expanding to $7T by 2030", "Open banking regulation driving API-first architecture"],
  headwinds: ["Regulatory fragmentation across jurisdictions", "Credit risk rising in BNPL and consumer lending", "Big tech (Apple Pay, Google) competing in payments", "Venture funding contraction pressuring pre-profit companies"],
};

// ── Clean Energy ────────────────────────────────────────────────────────

const cleanEnergyMovers: Company[] = [
  { name: "NextEra Energy", ticker: "NEE", marketCap: "$158B", change24h: 1.23, change7d: 4.5, volume: "$2.1B", sector: "Renewables", sparkline: [50, 52, 54, 56, 55, 58, 60, 62, 61, 64, 63, 65] },
  { name: "Enphase Energy", ticker: "ENPH", marketCap: "$28B", change24h: -3.45, change7d: -7.8, volume: "$1.8B", sector: "Solar", sparkline: [60, 55, 52, 50, 48, 45, 48, 44, 42, 40, 43, 38] },
  { name: "First Solar", ticker: "FSLR", marketCap: "$22B", change24h: 2.89, change7d: 9.2, volume: "$1.2B", sector: "Solar Panels", sparkline: [35, 38, 40, 42, 45, 48, 50, 52, 55, 54, 58, 60] },
  { name: "QuantumScape", ticker: "QS", marketCap: "$5.8B", change24h: 8.12, change7d: 22.4, volume: "$890M", sector: "Batteries", sparkline: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 42, 45] },
  { name: "Rivian", ticker: "RIVN", marketCap: "$18B", change24h: -2.34, change7d: -5.1, volume: "$2.4B", sector: "EV", sparkline: [40, 38, 35, 37, 34, 32, 35, 30, 28, 32, 29, 27] },
  { name: "Plug Power", ticker: "PLUG", marketCap: "$3.2B", change24h: 4.56, change7d: 12.3, volume: "$560M", sector: "Hydrogen", sparkline: [20, 22, 25, 28, 26, 30, 32, 35, 34, 38, 40, 42] },
];

const cleanEnergyNews: NewsItem[] = [
  { id: "ce1", title: "TotalEnergies Acquires SunPower Assets for $3.2B", source: "Reuters", time: "2026-03-01", type: "ma", amount: "$3.2B", companies: ["TotalEnergies", "SunPower"], summary: "French energy giant TotalEnergies acquired SunPower's residential solar and storage business, expanding its US clean energy footprint." },
  { id: "ce2", title: "QuantumScape Secures $500M DOE Loan for Solid-State Battery Gigafactory", source: "Bloomberg", time: "2026-02-16", type: "funding", amount: "$500M", companies: ["QuantumScape"], summary: "QuantumScape received a Department of Energy loan guarantee to build its first commercial-scale solid-state battery production facility in California." },
  { id: "ce3", title: "NextEra Energy Partners Acquires 2.5GW Wind Portfolio", source: "CNBC", time: "2026-01-30", type: "deal", amount: "$4.1B", companies: ["NextEra Energy"], summary: "NextEra Energy Partners closed its largest clean energy acquisition, adding 2.5 gigawatts of operating wind farms across the Midwest." },
];

const cleanEnergyTop20: TopCompany[] = [
  { rank: 1, name: "NextEra Energy", ticker: "NEE", marketCap: "$158B", revenue: "$28.1B", growth: 8.2, pe: 22.4, recentDeal: "2.5GW wind portfolio ($4.1B)", dealDate: "Feb 2026" },
  { rank: 2, name: "Enel", ticker: "ENEL", marketCap: "$72B", revenue: "$92.3B", growth: 3.1, pe: 8.5 },
  { rank: 3, name: "First Solar", ticker: "FSLR", marketCap: "$22B", revenue: "$3.5B", growth: 28.4, pe: 18.2 },
  { rank: 4, name: "Enphase Energy", ticker: "ENPH", marketCap: "$28B", revenue: "$2.3B", growth: -15.2, pe: 42.1 },
  { rank: 5, name: "SolarEdge", ticker: "SEDG", marketCap: "$4.5B", revenue: "$1.8B", growth: -32.1, pe: 0 },
  { rank: 6, name: "Rivian", ticker: "RIVN", marketCap: "$18B", revenue: "$4.8B", growth: 65.2, pe: 0 },
  { rank: 7, name: "Lucid Group", ticker: "LCID", marketCap: "$7.2B", revenue: "$0.8B", growth: 45.3, pe: 0 },
  { rank: 8, name: "QuantumScape", ticker: "QS", marketCap: "$5.8B", revenue: "$0.01B", growth: 0, pe: 0, recentDeal: "DOE loan ($500M)", dealDate: "Feb 2026" },
  { rank: 9, name: "Plug Power", ticker: "PLUG", marketCap: "$3.2B", revenue: "$0.9B", growth: 12.4, pe: 0 },
  { rank: 10, name: "Bloom Energy", ticker: "BE", marketCap: "$4.8B", revenue: "$1.3B", growth: 18.9, pe: 0 },
  { rank: 11, name: "ChargePoint", ticker: "CHPT", marketCap: "$2.1B", revenue: "$0.5B", growth: 22.1, pe: 0 },
  { rank: 12, name: "Sunrun", ticker: "RUN", marketCap: "$3.8B", revenue: "$2.2B", growth: 8.4, pe: 15.2 },
  { rank: 13, name: "Canadian Solar", ticker: "CSIQ", marketCap: "$2.4B", revenue: "$8.4B", growth: -5.2, pe: 5.8 },
  { rank: 14, name: "Array Technologies", ticker: "ARRY", marketCap: "$2.8B", revenue: "$1.6B", growth: 32.1, pe: 22.4 },
  { rank: 15, name: "Stem Inc", ticker: "STEM", marketCap: "$0.8B", revenue: "$0.4B", growth: -18.2, pe: 0 },
  { rank: 16, name: "TPI Composites", ticker: "TPIC", marketCap: "$0.5B", revenue: "$1.5B", growth: 5.2, pe: 0 },
  { rank: 17, name: "Shoals Technologies", ticker: "SHLS", marketCap: "$2.2B", revenue: "$0.5B", growth: 15.8, pe: 28.4 },
  { rank: 18, name: "Fluence Energy", ticker: "FLNC", marketCap: "$3.5B", revenue: "$2.7B", growth: 42.3, pe: 0 },
  { rank: 19, name: "Maxeon Solar", ticker: "MAXN", marketCap: "$0.3B", revenue: "$1.1B", growth: -22.4, pe: 0 },
  { rank: 20, name: "EnerSys", ticker: "ENS", marketCap: "$4.2B", revenue: "$3.5B", growth: 6.8, pe: 14.2 },
];

const cleanEnergyBriefing: DirectorBriefing = {
  sectorThesis: "Clean energy is transitioning from policy-dependent growth to economic-driven deployment. Solar and wind are now the cheapest sources of new electricity generation globally. The next value creation wave centers on energy storage, grid modernization, and green hydrogen — the infrastructure layer that makes intermittent renewables reliable at scale.",
  metrics: { totalDealVolume: "$42.8B", avgRevenueGrowth: "14.2%", peRange: "5.8x – 42.1x", topMover: "QuantumScape (QS)", topMoverChange: 22.4, activeDeals: 6 },
  spotlightCompanies: [
    { name: "First Solar", ticker: "FSLR", signal: "Worth Exploring", marketCap: "$22B", growth: 28.4, pe: 18.2, rationale: "First Solar is the only US-based large-scale solar panel manufacturer, giving it unique tariff protection and IRA subsidy advantages. Their CdTe thin-film technology avoids the polysilicon supply chain controlled by China.", catalysts: ["IRA manufacturing credits adding $0.17/watt margin uplift", "Backlog extending through 2028 with 70GW contracted", "Series 7 panel efficiency gains closing gap with crystalline silicon"], risks: ["Technology risk if perovskite solar achieves commercial scale", "Customer concentration in large utility-scale developers", "Trade policy reversal risk under changing administrations"] },
  ],
  tailwinds: ["IRA providing $370B in clean energy incentives through 2032", "Battery costs declining 15% annually enabling grid-scale storage", "Corporate net-zero commitments driving long-term PPA demand", "EV adoption creating parallel demand for charging infrastructure"],
  headwinds: ["Interest rate sensitivity for capital-intensive project finance", "Grid interconnection queues exceeding 5 years in some regions", "China overcapacity depressing global solar module prices", "Permitting and siting challenges for wind and transmission projects"],
};

// ── Cybersecurity ───────────────────────────────────────────────────────

const cyberMovers: Company[] = [
  { name: "Palo Alto Networks", ticker: "PANW", marketCap: "$120B", change24h: 2.34, change7d: 8.9, volume: "$2.8B", sector: "Network Security", sparkline: [50, 52, 55, 58, 56, 60, 62, 65, 63, 68, 70, 72] },
  { name: "CrowdStrike", ticker: "CRWD", marketCap: "$78B", change24h: 3.12, change7d: 12.4, volume: "$2.1B", sector: "Endpoint", sparkline: [40, 43, 46, 48, 52, 50, 55, 58, 56, 62, 64, 68] },
  { name: "Fortinet", ticker: "FTNT", marketCap: "$62B", change24h: 1.89, change7d: 5.6, volume: "$1.4B", sector: "Firewall", sparkline: [45, 47, 46, 49, 51, 53, 52, 55, 57, 56, 59, 60] },
  { name: "Zscaler", ticker: "ZS", marketCap: "$32B", change24h: -1.23, change7d: 3.2, volume: "$890M", sector: "Zero Trust", sparkline: [50, 48, 52, 50, 54, 52, 56, 54, 58, 56, 58, 60] },
  { name: "SentinelOne", ticker: "S", marketCap: "$8.5B", change24h: 4.56, change7d: 15.8, volume: "$680M", sector: "AI Security", sparkline: [25, 28, 30, 33, 35, 38, 40, 42, 45, 48, 50, 52] },
  { name: "Wiz", ticker: "WIZ", marketCap: "$12B", change24h: 2.1, change7d: 7.4, volume: "Private", sector: "Cloud Security", sparkline: [35, 38, 40, 43, 45, 48, 50, 52, 55, 58, 60, 62] },
];

const cyberNews: NewsItem[] = [
  { id: "cy1", title: "Palo Alto Networks Acquires Talon Cyber Security for $625M", source: "Bloomberg", time: "2026-03-02", type: "ma", amount: "$625M", companies: ["Palo Alto Networks", "Talon"], summary: "Palo Alto Networks acquired enterprise browser security startup Talon to strengthen its SASE and zero-trust platform." },
  { id: "cy2", title: "CrowdStrike Expands Charlotte AI Platform with $200M R&D Investment", source: "TechCrunch", time: "2026-02-19", type: "deal", amount: "$200M", companies: ["CrowdStrike"], summary: "CrowdStrike is investing $200M to expand its generative AI-powered cybersecurity analyst Charlotte AI across its Falcon platform." },
  { id: "cy3", title: "Wiz Raises $1B at $12B Valuation After Turning Down Google Acquisition", source: "Reuters", time: "2026-01-25", type: "funding", amount: "$1B", companies: ["Wiz"], summary: "Cloud security unicorn Wiz raised $1B in new funding after walking away from Google's $23B acquisition offer." },
];

const cyberTop20: TopCompany[] = [
  { rank: 1, name: "Palo Alto Networks", ticker: "PANW", marketCap: "$120B", revenue: "$8.2B", growth: 18.4, pe: 52.3, recentDeal: "Talon Cyber Security ($625M)", dealDate: "Feb 2026" },
  { rank: 2, name: "CrowdStrike", ticker: "CRWD", marketCap: "$78B", revenue: "$3.8B", growth: 32.1, pe: 68.4 },
  { rank: 3, name: "Fortinet", ticker: "FTNT", marketCap: "$62B", revenue: "$5.8B", growth: 12.8, pe: 38.2 },
  { rank: 4, name: "Zscaler", ticker: "ZS", marketCap: "$32B", revenue: "$2.2B", growth: 28.4, pe: 85.1 },
  { rank: 5, name: "Cloudflare", ticker: "NET", marketCap: "$35B", revenue: "$1.7B", growth: 30.2, pe: 0 },
  { rank: 6, name: "Wiz", ticker: "WIZ", marketCap: "$12B", revenue: "$0.5B", growth: 100.2, pe: 0 },
  { rank: 7, name: "Datadog", ticker: "DDOG", marketCap: "$42B", revenue: "$2.5B", growth: 25.8, pe: 72.3 },
  { rank: 8, name: "Okta", ticker: "OKTA", marketCap: "$15B", revenue: "$2.4B", growth: 15.2, pe: 45.8 },
  { rank: 9, name: "SentinelOne", ticker: "S", marketCap: "$8.5B", revenue: "$0.6B", growth: 38.4, pe: 0 },
  { rank: 10, name: "CyberArk", ticker: "CYBR", marketCap: "$12B", revenue: "$0.8B", growth: 22.4, pe: 82.1 },
  { rank: 11, name: "Varonis Systems", ticker: "VRNS", marketCap: "$5.2B", revenue: "$0.5B", growth: 18.9, pe: 0 },
  { rank: 12, name: "Tenable", ticker: "TENB", marketCap: "$5.8B", revenue: "$0.8B", growth: 14.2, pe: 42.3 },
  { rank: 13, name: "Qualys", ticker: "QLYS", marketCap: "$5.5B", revenue: "$0.6B", growth: 10.8, pe: 35.2 },
  { rank: 14, name: "Rapid7", ticker: "RPD", marketCap: "$3.2B", revenue: "$0.8B", growth: 8.4, pe: 0 },
  { rank: 15, name: "Proofpoint", ticker: "PFPT", marketCap: "$12.3B", revenue: "$1.3B", growth: 12.1, pe: 28.4 },
  { rank: 16, name: "Rubrik", ticker: "RBRK", marketCap: "$8.5B", revenue: "$0.7B", growth: 45.2, pe: 0 },
  { rank: 17, name: "Snyk", ticker: "SNYK", marketCap: "$7.4B", revenue: "$0.3B", growth: 55.8, pe: 0 },
  { rank: 18, name: "Abnormal Security", ticker: "ABNL", marketCap: "$5.1B", revenue: "$0.2B", growth: 85.2, pe: 0 },
  { rank: 19, name: "1Password", ticker: "1PWD", marketCap: "$6.8B", revenue: "$0.3B", growth: 42.1, pe: 0 },
  { rank: 20, name: "Arctic Wolf", ticker: "AWLF", marketCap: "$4.3B", revenue: "$0.4B", growth: 48.9, pe: 0 },
];

const cyberBriefing: DirectorBriefing = {
  sectorThesis: "Cybersecurity spending is structurally non-discretionary. The convergence of AI-powered threats, expanding attack surfaces from cloud migration, and regulatory mandates (SEC cyber disclosure rules, EU NIS2) create a sector that grows regardless of macro conditions. Platform consolidation is accelerating as enterprises reduce vendor sprawl.",
  metrics: { totalDealVolume: "$28.4B", avgRevenueGrowth: "28.2%", peRange: "28.4x – 85.1x", topMover: "SentinelOne (S)", topMoverChange: 15.8, activeDeals: 7 },
  spotlightCompanies: [
    { name: "CrowdStrike", ticker: "CRWD", signal: "Worth Exploring", marketCap: "$78B", growth: 32.1, pe: 68.4, rationale: "CrowdStrike is emerging as the cybersecurity platform consolidator. Charlotte AI is transforming SOC operations by reducing mean time to investigate from hours to minutes. ARR growing 32% with best-in-class net retention above 120%.", catalysts: ["Charlotte AI driving upsell into existing 23K+ customers", "Cloud security module adoption accelerating", "Federal government contracts expanding post-CISA mandates"], risks: ["Premium valuation demands sustained 30%+ growth", "July 2024 outage reputational overhang", "Palo Alto Networks competing aggressively on platformization"] },
  ],
  tailwinds: ["AI-powered threat landscape forcing security spending increases", "SEC and EU NIS2 regulations mandating cyber disclosure and resilience", "Cloud security spending growing 25%+ annually", "Cyber insurance requirements driving platform adoption"],
  headwinds: ["Vendor consolidation creating winner-take-most dynamics", "AI-enabled attacks lowering cost of sophisticated campaigns", "Security talent shortage constraining enterprise adoption capacity", "Valuation compression risk if growth decelerates from elevated levels"],
};

// ── Placeholder data for remaining sectors ──────────────────────────────

function generatePlaceholderData(sectorId: string, sectorName: string, companies: Array<{ name: string; ticker: string; sub: string }>): SectorData {
  const movers: Company[] = companies.slice(0, 6).map((c, i) => ({
    name: c.name, ticker: c.ticker, marketCap: `$${(50 + i * 20)}B`,
    change24h: (Math.random() * 8 - 3), change7d: (Math.random() * 15 - 5),
    volume: `$${(0.5 + Math.random() * 2).toFixed(1)}B`, sector: c.sub,
    sparkline: Array.from({ length: 12 }, (_, j) => 30 + j * 2 + Math.floor(Math.random() * 10)),
  }));

  const news: NewsItem[] = [
    { id: `${sectorId}-1`, title: `Major ${sectorName} Consolidation Deal Announced`, source: "Bloomberg", time: "2026-02-28", type: "ma", amount: "$5.2B", companies: [companies[0].name, companies[1].name], summary: `Leading ${sectorName.toLowerCase()} players combine to create market-leading platform.` },
    { id: `${sectorId}-2`, title: `${companies[2].name} Raises Growth Capital Round`, source: "TechCrunch", time: "2026-02-12", type: "funding", amount: "$800M", companies: [companies[2].name], summary: `${companies[2].name} secures funding to accelerate international expansion.` },
    { id: `${sectorId}-3`, title: `${companies[3].name} Strategic Partnership with ${companies[4].name}`, source: "Reuters", time: "2026-01-20", type: "deal", companies: [companies[3].name, companies[4].name], summary: `Multi-year strategic partnership to develop next-generation solutions in ${sectorName.toLowerCase()}.` },
  ];

  const top20: TopCompany[] = companies.slice(0, 15).map((c, i) => ({
    rank: i + 1, name: c.name, ticker: c.ticker,
    marketCap: `$${(80 - i * 4)}B`, revenue: `$${(15 - i * 0.8).toFixed(1)}B`,
    growth: parseFloat((20 - i * 1.5 + Math.random() * 5).toFixed(1)),
    pe: parseFloat((25 + Math.random() * 20).toFixed(1)),
    ...(i < 3 ? { recentDeal: `Recent ${sectorName} deal`, dealDate: "Feb 2026" } : {}),
  }));

  const briefing: DirectorBriefing = {
    sectorThesis: `${sectorName} is experiencing significant structural shifts driven by technology adoption, regulatory changes, and evolving market dynamics. The sector presents compelling M&A opportunities as incumbents seek to acquire innovative capabilities.`,
    metrics: { totalDealVolume: "$35.2B", avgRevenueGrowth: "15.4%", peRange: "12x – 55x", topMover: `${companies[0].name} (${companies[0].ticker})`, topMoverChange: 12.5, activeDeals: 5 },
    spotlightCompanies: [
      { name: companies[0].name, ticker: companies[0].ticker, signal: "Worth Exploring", marketCap: `$${80}B`, growth: 22.4, pe: 35.2, rationale: `${companies[0].name} leads the ${sectorName.toLowerCase()} sector with strong fundamentals and strategic positioning for the next growth cycle.`, catalysts: ["Technology leadership in core segment", "Expanding into adjacent markets", "Strong balance sheet for M&A"], risks: ["Competitive intensity increasing", "Regulatory uncertainty", "Valuation premium relative to peers"] },
    ],
    tailwinds: [`Technology adoption accelerating across ${sectorName.toLowerCase()}`, "Favorable regulatory environment supporting growth", "Strong M&A pipeline indicating industry confidence", "Digital transformation creating new market opportunities"],
    headwinds: ["Macroeconomic uncertainty affecting capital allocation", "Supply chain constraints persisting", "Talent acquisition challenges in specialized roles", "Geopolitical tensions affecting international operations"],
  };

  return { movers, news, top20, directorBriefing: briefing };
}

const industrialsData = generatePlaceholderData("industrials", "Advanced Manufacturing", [
  { name: "Rockwell Automation", ticker: "ROK", sub: "Automation" },
  { name: "Emerson Electric", ticker: "EMR", sub: "Industrial Tech" },
  { name: "ABB Ltd", ticker: "ABB", sub: "Robotics" },
  { name: "Fanuc Corp", ticker: "FANUY", sub: "CNC/Robotics" },
  { name: "Siemens", ticker: "SIEGY", sub: "Digital Factory" },
  { name: "Honeywell", ticker: "HON", sub: "Automation" },
  { name: "Illinois Tool Works", ticker: "ITW", sub: "Industrial" },
  { name: "Parker Hannifin", ticker: "PH", sub: "Motion Control" },
  { name: "Roper Technologies", ticker: "ROP", sub: "Software" },
  { name: "Fortive", ticker: "FTV", sub: "Instrumentation" },
  { name: "Teledyne Technologies", ticker: "TDY", sub: "Imaging" },
  { name: "Ametek", ticker: "AME", sub: "Instruments" },
  { name: "Nordson", ticker: "NDSN", sub: "Dispensing" },
  { name: "Keyence", ticker: "KYCCF", sub: "Sensors" },
  { name: "Cognex", ticker: "CGNX", sub: "Machine Vision" },
]);

const consumerData = generatePlaceholderData("consumer", "Consumer & Retail Tech", [
  { name: "Shopify", ticker: "SHOP", sub: "E-commerce" },
  { name: "MercadoLibre", ticker: "MELI", sub: "LatAm E-comm" },
  { name: "Sea Limited", ticker: "SE", sub: "Gaming/E-comm" },
  { name: "Coupang", ticker: "CPNG", sub: "E-commerce" },
  { name: "Chewy", ticker: "CHWY", sub: "Pet E-comm" },
  { name: "Etsy", ticker: "ETSY", sub: "Marketplace" },
  { name: "Wayfair", ticker: "W", sub: "Home E-comm" },
  { name: "ThredUp", ticker: "TDUP", sub: "Resale" },
  { name: "Poshmark", ticker: "POSH", sub: "Fashion" },
  { name: "Wish", ticker: "WISH", sub: "Discount" },
  { name: "Farfetch", ticker: "FTCH", sub: "Luxury" },
  { name: "Rent the Runway", ticker: "RENT", sub: "Rental" },
  { name: "Grove Collab", ticker: "GROV", sub: "Sustainable" },
  { name: "Warby Parker", ticker: "WRBY", sub: "DTC Eyewear" },
  { name: "Allbirds", ticker: "BIRD", sub: "DTC Footwear" },
]);

const aerospaceData = generatePlaceholderData("aerospace", "Aerospace & Defense", [
  { name: "SpaceX", ticker: "SPACEX", sub: "Launch/Satellite" },
  { name: "Lockheed Martin", ticker: "LMT", sub: "Defense" },
  { name: "RTX (Raytheon)", ticker: "RTX", sub: "Defense" },
  { name: "Northrop Grumman", ticker: "NOC", sub: "Defense" },
  { name: "L3Harris", ticker: "LHX", sub: "Defense Tech" },
  { name: "General Dynamics", ticker: "GD", sub: "Defense" },
  { name: "TransDigm", ticker: "TDG", sub: "Aero Parts" },
  { name: "Rocket Lab", ticker: "RKLB", sub: "Small Launch" },
  { name: "Kratos Defense", ticker: "KTOS", sub: "Drones" },
  { name: "Aerojet Rocketdyne", ticker: "AJRD", sub: "Propulsion" },
  { name: "BWX Technologies", ticker: "BWXT", sub: "Nuclear" },
  { name: "Curtiss-Wright", ticker: "CW", sub: "Defense Tech" },
  { name: "Mercury Systems", ticker: "MRCY", sub: "Electronics" },
  { name: "Heico Corp", ticker: "HEI", sub: "Aero Parts" },
  { name: "Howmet Aerospace", ticker: "HWM", sub: "Materials" },
]);

const agritechData = generatePlaceholderData("agritech", "Agriculture Technology", [
  { name: "Deere & Company", ticker: "DE", sub: "Precision Ag" },
  { name: "Trimble", ticker: "TRMB", sub: "GPS/Sensors" },
  { name: "AGCO Corporation", ticker: "AGCO", sub: "Equipment" },
  { name: "Corteva Agriscience", ticker: "CTVA", sub: "Crop Science" },
  { name: "FMC Corporation", ticker: "FMC", sub: "Crop Protection" },
  { name: "The Mosaic Company", ticker: "MOS", sub: "Fertilizers" },
  { name: "Nutrien", ticker: "NTR", sub: "Fertilizers" },
  { name: "Bayer CropScience", ticker: "BAYRY", sub: "Seeds/Biotech" },
  { name: "AppHarvest", ticker: "APPH", sub: "Indoor Farming" },
  { name: "Farmers Edge", ticker: "FDGE", sub: "Data Analytics" },
  { name: "Indigo Agriculture", ticker: "INDG", sub: "Biologicals" },
  { name: "Ginkgo Bioworks", ticker: "DNA", sub: "Synthetic Bio" },
  { name: "Benson Hill", ticker: "BHIL", sub: "Food Tech" },
  { name: "AeroFarms", ticker: "AERO", sub: "Vertical Farming" },
  { name: "Bowery Farming", ticker: "BWRY", sub: "Vertical Farming" },
]);

// ── Sector Data Lookup ──────────────────────────────────────────────────

const allSectorData: Record<string, SectorData> = {
  healthcare: {
    movers: healthcareMovers,
    news: healthcareNews,
    top20: healthcareTop20,
    directorBriefing: healthcareDirectorBriefing,
  },
  semiconductors: {
    movers: semiMovers,
    news: semiNews,
    top20: semiTop20,
    directorBriefing: semiBriefing,
  },
  fintech: {
    movers: fintechMovers,
    news: fintechNews,
    top20: fintechTop20,
    directorBriefing: fintechBriefing,
  },
  "clean-energy": {
    movers: cleanEnergyMovers,
    news: cleanEnergyNews,
    top20: cleanEnergyTop20,
    directorBriefing: cleanEnergyBriefing,
  },
  cybersecurity: {
    movers: cyberMovers,
    news: cyberNews,
    top20: cyberTop20,
    directorBriefing: cyberBriefing,
  },
  industrials: industrialsData,
  consumer: consumerData,
  aerospace: aerospaceData,
  agritech: agritechData,
};

/**
 * Get all data for a sector. Falls back to healthcare data if sector not found.
 */
export function getSectorData(sectorId: string): SectorData {
  return allSectorData[sectorId] ?? allSectorData.healthcare;
}
