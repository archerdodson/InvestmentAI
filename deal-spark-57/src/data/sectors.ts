import { Heart, Cpu, Zap, Factory, Landmark, ShoppingCart, Rocket, Shield, Wheat, Radio } from "lucide-react";

export interface Sector {
  id: string;
  name: string;
  description: string;
  views: string;
  trending: boolean;
  companyCount: number;
  updatedAt: string;
  icon: typeof Heart;
  change: number;
}

export const sectors: Sector[] = [
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    description: "Pharma, biotech, medtech, and digital health companies transforming patient outcomes through innovation in therapeutics, diagnostics, and care delivery.",
    views: "4.2k",
    trending: true,
    companyCount: 245,
    updatedAt: "February 28, 2026 3:30 PM",
    icon: Heart,
    change: 12.4,
  },
  {
    id: "semiconductors",
    name: "Semiconductors & Chips",
    description: "Companies designing, manufacturing, or enabling advanced semiconductor technologies including AI accelerators, power chips, and foundry services.",
    views: "5.8k",
    trending: true,
    companyCount: 132,
    updatedAt: "February 27, 2026 9:15 AM",
    icon: Cpu,
    change: 18.2,
  },
  {
    id: "clean-energy",
    name: "Clean Energy & Storage",
    description: "Companies developing renewable energy solutions, battery storage systems, grid infrastructure, and carbon capture technologies.",
    views: "2.9k",
    trending: true,
    companyCount: 98,
    updatedAt: "February 26, 2026 11:00 AM",
    icon: Zap,
    change: 8.7,
  },
  {
    id: "industrials",
    name: "Advanced Manufacturing",
    description: "Industrial automation, robotics, additive manufacturing, and smart factory solutions driving the next wave of industrial productivity.",
    views: "1.8k",
    trending: false,
    companyCount: 76,
    updatedAt: "February 25, 2026 4:45 PM",
    icon: Factory,
    change: -2.1,
  },
  {
    id: "fintech",
    name: "Financial Technology",
    description: "Companies building infrastructure for payments, lending, insurance, wealth management, and blockchain-based financial services.",
    views: "3.5k",
    trending: true,
    companyCount: 189,
    updatedAt: "February 28, 2026 1:00 PM",
    icon: Landmark,
    change: 5.3,
  },
  {
    id: "consumer",
    name: "Consumer & Retail Tech",
    description: "E-commerce platforms, D2C brands, retail analytics, and consumer engagement technologies reshaping how people shop and interact with brands.",
    views: "1.4k",
    trending: false,
    companyCount: 112,
    updatedAt: "February 24, 2026 6:20 PM",
    icon: ShoppingCart,
    change: -0.8,
  },
  {
    id: "aerospace",
    name: "Aerospace & Defense",
    description: "Space technology, satellite communications, UAV systems, and defense contractors advancing national security and space exploration.",
    views: "2.1k",
    trending: false,
    companyCount: 54,
    updatedAt: "February 23, 2026 10:30 AM",
    icon: Rocket,
    change: 3.2,
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Companies providing threat detection, identity management, cloud security, and data protection solutions for enterprises and governments.",
    views: "3.1k",
    trending: true,
    companyCount: 87,
    updatedAt: "February 27, 2026 2:15 PM",
    icon: Shield,
    change: 15.6,
  },
  {
    id: "agritech",
    name: "Agriculture Technology",
    description: "Precision farming, smart irrigation, crop analytics, and sustainable agriculture solutions optimizing food production globally.",
    views: "1.3k",
    trending: false,
    companyCount: 45,
    updatedAt: "February 25, 2026 7:20 PM",
    icon: Wheat,
    change: 1.9,
  },
];

export interface Company {
  name: string;
  ticker?: string;
  marketCap: string;
  change24h: number;
  change7d: number;
  volume: string;
  sector: string;
  sparkline: number[];
}

export const healthcareMovers: Company[] = [
  { name: "Novo Nordisk", ticker: "NVO", marketCap: "$582B", change24h: 3.42, change7d: 8.91, volume: "$2.1B", sector: "Pharma", sparkline: [40, 42, 38, 45, 47, 50, 52, 48, 55, 58, 56, 62] },
  { name: "Eli Lilly", ticker: "LLY", marketCap: "$748B", change24h: 2.18, change7d: 5.67, volume: "$3.4B", sector: "Pharma", sparkline: [60, 58, 62, 65, 63, 68, 70, 72, 69, 74, 76, 78] },
  { name: "Intuitive Surgical", ticker: "ISRG", marketCap: "$178B", change24h: -1.23, change7d: 2.34, volume: "$890M", sector: "MedTech", sparkline: [50, 52, 48, 46, 49, 51, 47, 50, 53, 51, 48, 50] },
  { name: "Danaher Corp", ticker: "DHR", marketCap: "$186B", change24h: 1.56, change7d: -0.89, volume: "$1.2B", sector: "Diagnostics", sparkline: [45, 43, 46, 48, 44, 47, 49, 46, 48, 50, 47, 49] },
  { name: "Vertex Pharma", ticker: "VRTX", marketCap: "$121B", change24h: 4.78, change7d: 12.3, volume: "$1.8B", sector: "Biotech", sparkline: [30, 32, 35, 38, 42, 40, 45, 48, 52, 55, 58, 62] },
  { name: "Moderna", ticker: "MRNA", marketCap: "$45B", change24h: -2.89, change7d: -5.12, volume: "$2.3B", sector: "Biotech", sparkline: [55, 52, 48, 50, 46, 43, 45, 40, 38, 42, 36, 34] },
  { name: "Edwards Lifesciences", ticker: "EW", marketCap: "$42B", change24h: 0.67, change7d: 1.23, volume: "$450M", sector: "MedTech", sparkline: [40, 41, 39, 42, 40, 43, 41, 44, 42, 43, 45, 44] },
  { name: "BioNTech", ticker: "BNTX", marketCap: "$28B", change24h: 5.23, change7d: 15.8, volume: "$980M", sector: "Biotech", sparkline: [25, 28, 30, 27, 32, 35, 38, 36, 40, 42, 45, 48] },
];

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  type: "deal" | "ma" | "ipo" | "funding";
  amount?: string;
  companies: string[];
  summary: string;
}

export const healthcareNews: NewsItem[] = [
  { id: "1", title: "Pfizer Acquires Seagen in $43B Cancer Drug Deal", source: "Bloomberg", time: "2026-03-04", type: "ma", amount: "$43B", companies: ["Pfizer", "Seagen"], summary: "Pfizer completed its acquisition of cancer biotech Seagen, marking the largest pharma deal of 2026 and expanding its oncology pipeline significantly." },
  { id: "2", title: "Tempus AI Raises $500M Series G at $8.1B Valuation", source: "TechCrunch", time: "2026-02-25", type: "funding", amount: "$500M", companies: ["Tempus AI"], summary: "Precision medicine company Tempus AI closed a $500M Series G round led by SoftBank Vision Fund, bringing total funding to $1.8B." },
  { id: "3", title: "Johnson & Johnson Spins Off Consumer Health Division", source: "Reuters", time: "2026-02-14", type: "deal", amount: "$40B", companies: ["J&J", "Kenvue"], summary: "J&J completed the spin-off of its consumer health business Kenvue, creating a focused pharmaceutical and medtech company." },
  { id: "4", title: "Recursion Pharma Merges with Exscientia in AI Drug Discovery", source: "FierceBiotech", time: "2026-02-03", type: "ma", amount: "$3.2B", companies: ["Recursion", "Exscientia"], summary: "Two AI-driven drug discovery leaders combine forces to create the largest computational biology platform in biopharma." },
  { id: "5", title: "Medtronic Launches $2B Surgical Robotics Fund", source: "MedTech Dive", time: "2026-01-22", type: "deal", amount: "$2B", companies: ["Medtronic"], summary: "Medtronic announces a dedicated $2B venture fund focused on next-generation surgical robotics and AI-assisted procedures." },
  { id: "6", title: "CureVac IPO Raises $1.2B on Nasdaq", source: "CNBC", time: "2026-01-10", type: "ipo", amount: "$1.2B", companies: ["CureVac"], summary: "German mRNA therapeutics company CureVac priced its IPO at $28 per share, raising $1.2B in the largest biotech IPO of Q1 2026." },
];

export interface TopCompany {
  rank: number;
  name: string;
  ticker: string;
  marketCap: string;
  revenue: string;
  growth: number;
  pe: number;
  recentDeal?: string;
  dealDate?: string;
}

export const healthcareTop20: TopCompany[] = [
  { rank: 1, name: "Eli Lilly", ticker: "LLY", marketCap: "$748B", revenue: "$42.3B", growth: 28.4, pe: 62.1, recentDeal: "Acquired Morphic Holding ($3.2B)", dealDate: "Feb 2026" },
  { rank: 2, name: "UnitedHealth Group", ticker: "UNH", marketCap: "$532B", revenue: "$392B", growth: 12.1, pe: 23.4, recentDeal: "Acquired Amedisys ($3.3B)", dealDate: "Jan 2026" },
  { rank: 3, name: "Novo Nordisk", ticker: "NVO", marketCap: "$582B", revenue: "$38.9B", growth: 35.2, pe: 48.7, recentDeal: "Catalent acquisition ($16.5B)", dealDate: "Feb 2026" },
  { rank: 4, name: "Johnson & Johnson", ticker: "JNJ", marketCap: "$398B", revenue: "$54.8B", growth: 5.8, pe: 15.2, recentDeal: "Kenvue spin-off complete", dealDate: "Feb 2026" },
  { rank: 5, name: "AbbVie", ticker: "ABBV", marketCap: "$312B", revenue: "$56.2B", growth: 4.2, pe: 18.9 },
  { rank: 6, name: "Merck & Co", ticker: "MRK", marketCap: "$298B", revenue: "$60.1B", growth: 8.7, pe: 16.3, recentDeal: "Prometheus Bio ($10.8B)", dealDate: "Jan 2026" },
  { rank: 7, name: "Pfizer", ticker: "PFE", marketCap: "$165B", revenue: "$58.5B", growth: -15.2, pe: 11.8, recentDeal: "Seagen ($43B)", dealDate: "Feb 2026" },
  { rank: 8, name: "Amgen", ticker: "AMGN", marketCap: "$152B", revenue: "$28.2B", growth: 7.1, pe: 21.5 },
  { rank: 9, name: "Thermo Fisher", ticker: "TMO", marketCap: "$215B", revenue: "$42.9B", growth: 3.4, pe: 32.1 },
  { rank: 10, name: "Danaher Corp", ticker: "DHR", marketCap: "$186B", revenue: "$24.7B", growth: -2.1, pe: 28.4 },
  { rank: 11, name: "Intuitive Surgical", ticker: "ISRG", marketCap: "$178B", revenue: "$7.1B", growth: 18.9, pe: 72.3, recentDeal: "Ion Endoluminal launch", dealDate: "Feb 2026" },
  { rank: 12, name: "Abbott Labs", ticker: "ABT", marketCap: "$198B", revenue: "$40.1B", growth: 6.8, pe: 24.7 },
  { rank: 13, name: "Vertex Pharma", ticker: "VRTX", marketCap: "$121B", revenue: "$9.8B", growth: 22.1, pe: 35.6, recentDeal: "Casgevy gene therapy approval", dealDate: "Jan 2026" },
  { rank: 14, name: "Regeneron", ticker: "REGN", marketCap: "$112B", revenue: "$13.1B", growth: 9.4, pe: 22.8 },
  { rank: 15, name: "Stryker Corp", ticker: "SYK", marketCap: "$135B", revenue: "$20.5B", growth: 11.2, pe: 38.9 },
  { rank: 16, name: "Boston Scientific", ticker: "BSX", marketCap: "$98B", revenue: "$14.2B", growth: 13.7, pe: 42.1 },
  { rank: 17, name: "Moderna", ticker: "MRNA", marketCap: "$45B", revenue: "$6.7B", growth: -42.3, pe: 8.9 },
  { rank: 18, name: "BioNTech", ticker: "BNTX", marketCap: "$28B", revenue: "$3.8B", growth: -38.1, pe: 7.2 },
  { rank: 19, name: "Gilead Sciences", ticker: "GILD", marketCap: "$102B", revenue: "$27.1B", growth: 5.6, pe: 14.3 },
  { rank: 20, name: "Edwards Lifesciences", ticker: "EW", marketCap: "$42B", revenue: "$5.6B", growth: 8.3, pe: 29.7, recentDeal: "SAPIEN M3 launch", dealDate: "Feb 2026" },
];

// Director Briefing types and data

export type SignalRating = "Worth Exploring" | "Monitor Closely" | "On Our Radar";

export interface SpotlightCompany {
  name: string;
  ticker: string;
  signal: SignalRating;
  marketCap: string;
  growth: number;
  pe: number;
  rationale: string;
  catalysts: string[];
  recentDeal?: string;
  risks: string[];
}

export interface DirectorBriefing {
  sectorThesis: string;
  metrics: {
    totalDealVolume: string;
    avgRevenueGrowth: string;
    peRange: string;
    topMover: string;
    topMoverChange: number;
    activeDeals: number;
  };
  spotlightCompanies: SpotlightCompany[];
  tailwinds: string[];
  headwinds: string[];
}

export const healthcareDirectorBriefing: DirectorBriefing = {
  sectorThesis:
    "Healthcare & Life Sciences is experiencing a generational inflection driven by GLP-1 therapeutics, AI-powered drug discovery, and a record M&A cycle. Obesity and metabolic disease pipelines are reshaping revenue profiles across big pharma, while precision medicine platforms are compressing development timelines from a decade to under four years.",
  metrics: {
    totalDealVolume: "$124.7B",
    avgRevenueGrowth: "11.8%",
    peRange: "7.2x – 72.3x",
    topMover: "BioNTech (BNTX)",
    topMoverChange: 15.8,
    activeDeals: 14,
  },
  spotlightCompanies: [
    {
      name: "Novo Nordisk",
      ticker: "NVO",
      signal: "Worth Exploring",
      marketCap: "$582B",
      growth: 35.2,
      pe: 48.7,
      rationale:
        "Novo Nordisk sits at the epicenter of the GLP-1 revolution with Ozempic and Wegovy generating unprecedented demand. Their $16.5B Catalent acquisition secures manufacturing scale that competitors lack, creating a structural moat around supply capacity. Revenue growth of 35% YoY is remarkable for a company of this scale.",
      catalysts: [
        "Catalent acquisition closing expands fill-finish capacity by 3x",
        "Wegovy supply constraints easing in Q2 2026",
        "Phase 3 data for next-gen amycretin (oral GLP-1) expected mid-2026",
      ],
      recentDeal: "Catalent acquisition ($16.5B) — Feb 2026",
      risks: [
        "Regulatory pricing pressure in the U.S. and EU",
        "Eli Lilly's competing tirzepatide gaining formulary share",
        "Premium valuation at 48.7x P/E leaves limited margin for error",
      ],
    },
    {
      name: "Vertex Pharmaceuticals",
      ticker: "VRTX",
      signal: "Worth Exploring",
      marketCap: "$121B",
      growth: 22.1,
      pe: 35.6,
      rationale:
        "Vertex holds a near-monopoly in cystic fibrosis and is now pioneering gene therapy with Casgevy's approval for sickle cell disease. The pain pipeline (VX-548) represents a potential blockbuster in non-opioid analgesics — a massive unmet need. At 35.6x P/E with 22% growth, the risk-reward profile is compelling for a company with multiple shots on goal.",
      catalysts: [
        "Casgevy commercial ramp — first gene therapy for sickle cell",
        "VX-548 Phase 3 readout for acute pain expected Q3 2026",
        "CF franchise still growing at 12% despite maturity",
      ],
      recentDeal: "Casgevy gene therapy approval — Jan 2026",
      risks: [
        "Gene therapy reimbursement and patient access challenges",
        "VX-548 binary Phase 3 outcome risk",
        "CF patient pool approaching saturation in developed markets",
      ],
    },
    {
      name: "Intuitive Surgical",
      ticker: "ISRG",
      signal: "Monitor Closely",
      marketCap: "$178B",
      growth: 18.9,
      pe: 72.3,
      rationale:
        "Intuitive dominates robotic surgery with the da Vinci platform and is expanding into lung biopsy via Ion Endoluminal. Procedure volumes are growing 18% globally as hospitals standardize on robotic-assisted surgery. However, the premium 72x P/E demands perfect execution — any deceleration in system placements would be punished.",
      catalysts: [
        "Ion Endoluminal system commercial launch expanding TAM",
        "International procedure growth accelerating in Asia-Pacific",
        "da Vinci 5 next-gen platform early adoption cycle",
      ],
      risks: [
        "Elevated valuation (72.3x P/E) creates downside vulnerability",
        "Medtronic's Hugo surgical robot gaining regulatory clearances",
        "Hospital capital expenditure cycles could slow system placements",
      ],
    },
    {
      name: "BioNTech",
      ticker: "BNTX",
      signal: "On Our Radar",
      marketCap: "$28B",
      growth: -38.1,
      pe: 7.2,
      rationale:
        "BioNTech is transitioning from a COVID-era windfall to a diversified mRNA oncology platform. Revenue is declining sharply as vaccine demand normalizes, but the company holds $18B in cash and is advancing 20+ oncology programs. At 7.2x P/E, the market is pricing in almost no pipeline value — if even one oncology candidate succeeds, the re-rating could be significant.",
      catalysts: [
        "$18B cash war chest for acquisitions and pipeline investment",
        "Individualized neoantigen therapy (autogene cevumeran) in Phase 2",
        "Fixed-combination cancer vaccines entering late-stage trials",
      ],
      risks: [
        "Revenue decline of -38% creates negative momentum perception",
        "Oncology mRNA platform remains clinically unproven at scale",
        "Cash burn could accelerate if multiple programs advance simultaneously",
      ],
    },
  ],
  tailwinds: [
    "GLP-1 / obesity therapeutics creating a new $100B+ market by 2030",
    "AI-driven drug discovery compressing timelines and reducing failure rates",
    "Record M&A activity — $124.7B in deals this quarter alone",
    "Aging global demographics driving structural demand for healthcare",
    "Gene therapy and cell therapy reaching commercial inflection points",
  ],
  headwinds: [
    "U.S. drug pricing reform (IRA negotiation provisions expanding scope)",
    "Patent cliffs hitting major franchises — Humira, Keytruda biosimilar timelines",
    "Rising clinical trial costs and regulatory scrutiny in gene therapy",
    "China biotech sector deleveraging creating competitive uncertainty",
    "Interest rate environment pressuring small-cap biotech valuations",
  ],
};
