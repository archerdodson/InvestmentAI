/** Types matching the JSON files written by the Python agent. */

export interface AgentDeal {
  id: string;
  run_id: string;
  title: string;
  source: string;
  time: string;
  type: "deal" | "ma" | "ipo" | "funding";
  amount?: string | null;
  companies: string[];
  summary: string;
  sector_id: string;
  score: number;
  verdict: string;
  source_url: string;
  has_brief: boolean;
  brief_id?: string | null;
}

export interface AgentBriefResearch {
  competitors: string[];
  market_size: string;
  key_customers: string[];
  funding_history: string;
  additional_context: string;
}

export interface AgentBrief {
  brief_id: string;
  run_id: string;
  deal_id: string;
  target_company: string;
  acquirer_company: string;
  deal_value: string;
  sector: string;
  score: number;
  verdict: string;
  deal_overview: string;
  thesis_alignment: string;
  risk_factors: string;
  recommended_action: string;
  research: AgentBriefResearch | null;
  disclaimer: string;
  created_at: string;
}

export interface AgentRun {
  run_id: string;
  timestamp: string;
  sector_id: string;
  date_range_start: string;
  date_range_end: string;
  deals_found: number;
  briefs_generated: number;
  status: string;
}
