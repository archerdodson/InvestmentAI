import { useState } from "react";
import { DirectorBriefing as DirectorBriefingType, SignalRating, SpotlightCompany } from "@/data/sectors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BriefDialog from "@/components/BriefDialog";
import type { AgentBrief } from "@/types/agent";
import {
  Lightbulb,
  Eye,
  Radar,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Zap,
  AlertTriangle,
  Wind,
  CloudRain,
  FileText,
} from "lucide-react";

const signalConfig: Record<SignalRating, { color: string; bg: string; border: string; icon: typeof Lightbulb }> = {
  "Worth Exploring": {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    icon: Lightbulb,
  },
  "Monitor Closely": {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    icon: Eye,
  },
  "On Our Radar": {
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-border",
    icon: Radar,
  },
};

function verdictToSignal(verdict: string): SignalRating {
  if (verdict === "Strong") return "Worth Exploring";
  if (verdict === "Moderate") return "Monitor Closely";
  return "On Our Radar";
}

function briefToSpotlight(brief: AgentBrief): SpotlightCompany {
  const riskLines = brief.risk_factors
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  const catalysts: string[] = [];
  if (brief.research?.key_customers?.length) {
    catalysts.push(`Key customers: ${brief.research.key_customers.slice(0, 3).join(", ")}`);
  }
  if (brief.research?.market_size) {
    catalysts.push(`Market size: ${brief.research.market_size}`);
  }
  if (brief.research?.competitors?.length) {
    catalysts.push(`Competitors: ${brief.research.competitors.slice(0, 3).join(", ")}`);
  }

  return {
    name: brief.target_company,
    ticker: "",
    signal: verdictToSignal(brief.verdict),
    marketCap: brief.deal_value,
    growth: 0,
    pe: 0,
    rationale: brief.thesis_alignment || brief.deal_overview,
    catalysts: catalysts.length > 0 ? catalysts : ["See full brief for details"],
    recentDeal: `${brief.acquirer_company} → ${brief.target_company} (${brief.deal_value})`,
    risks: riskLines.length > 0 ? riskLines : ["See full brief for risk analysis"],
  };
}

interface DirectorBriefingProps {
  briefing: DirectorBriefingType;
  agentBriefs?: AgentBrief[];
}

const DirectorBriefing = ({ briefing, agentBriefs = [] }: DirectorBriefingProps) => {
  const [selectedBrief, setSelectedBrief] = useState<AgentBrief | null>(null);
  const [briefDialogOpen, setBriefDialogOpen] = useState(false);

  // Convert agent briefs to spotlight companies and combine with static data
  const agentSpotlights = agentBriefs.map(briefToSpotlight);
  const allSpotlights = [...agentSpotlights, ...briefing.spotlightCompanies];

  return (
    <div className="space-y-8">
      {/* Sector Thesis */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Sector Thesis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-foreground/90">{briefing.sectorThesis}</p>
        </CardContent>
      </Card>

      {/* At a Glance Metrics */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">At a Glance</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard icon={DollarSign} label="Total Deal Volume" value={briefing.metrics.totalDealVolume} />
          <MetricCard icon={TrendingUp} label="Avg Revenue Growth" value={briefing.metrics.avgRevenueGrowth} />
          <MetricCard icon={BarChart3} label="P/E Range" value={briefing.metrics.peRange} />
          <MetricCard
            icon={Zap}
            label="Top Mover (7d)"
            value={briefing.metrics.topMover}
            sub={`+${briefing.metrics.topMoverChange}%`}
          />
          <MetricCard icon={Activity} label="Active Deals" value={String(briefing.metrics.activeDeals)} />
        </div>
      </div>

      {/* Spotlight Companies */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Spotlight Companies
        </h3>
        <div className="space-y-4">
          {allSpotlights.map((company, idx) => {
            const config = signalConfig[company.signal];
            const SignalIcon = config.icon;
            // Check if this spotlight has a corresponding agent brief
            const matchingBrief = agentBriefs.find(
              (b) => b.target_company === company.name || b.acquirer_company === company.name
            );
            return (
              <Card key={`${company.ticker || company.name}-${idx}`} className={`${config.border} border`}>
                <CardContent className="p-5">
                  {/* Header row */}
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-foreground">{company.name}</h4>
                        {company.ticker && (
                          <span className="font-mono text-sm text-muted-foreground">{company.ticker}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge className={`${config.bg} ${config.color} border-0`}>
                          <SignalIcon className="mr-1 h-3 w-3" />
                          {company.signal}
                        </Badge>
                        {matchingBrief && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs gap-1"
                            onClick={() => {
                              setSelectedBrief(matchingBrief);
                              setBriefDialogOpen(true);
                            }}
                          >
                            <FileText className="h-3 w-3" />
                            View Full Brief
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Market Cap</p>
                        <p className="font-mono text-sm font-semibold text-foreground">{company.marketCap}</p>
                      </div>
                      {company.growth !== 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground">Growth</p>
                          <p
                            className={`font-mono text-sm font-semibold ${company.growth >= 0 ? "text-chart-up" : "text-chart-down"}`}
                          >
                            {company.growth >= 0 ? "+" : ""}
                            {company.growth}%
                          </p>
                        </div>
                      )}
                      {company.pe !== 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground">P/E</p>
                          <p className="font-mono text-sm font-semibold text-foreground">{company.pe}x</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rationale */}
                  <p className="mb-4 text-sm leading-relaxed text-foreground/80">{company.rationale}</p>

                  {/* Catalysts & Risks */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-chart-up">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Catalysts
                      </p>
                      <ul className="space-y-1.5">
                        {company.catalysts.map((c, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-up" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-chart-down">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Risk Factors
                      </p>
                      <ul className="space-y-1.5">
                        {company.risks.map((r, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-down" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recent deal */}
                  {company.recentDeal && (
                    <div className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/70">Recent Deal:</span> {company.recentDeal}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tailwinds & Headwinds */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tailwinds & Headwinds
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-chart-up/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-chart-up">
                <Wind className="h-4 w-4" />
                Tailwinds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {briefing.tailwinds.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-up" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-chart-down/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-chart-down">
                <CloudRain className="h-4 w-4" />
                Headwinds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {briefing.headwinds.map((h, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-down" />
                    {h}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="border-t border-border pt-4 text-center text-xs italic text-muted-foreground">
        This briefing is for informational purposes only and does not constitute investment advice.
      </p>

      {/* Brief Dialog */}
      <BriefDialog
        brief={selectedBrief}
        open={briefDialogOpen}
        onOpenChange={setBriefDialogOpen}
      />
    </div>
  );
};

/* Small metric card helper */
function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span className="text-xs">{label}</span>
        </div>
        <p className="font-mono text-lg font-bold text-foreground">{value}</p>
        {sub && <span className="font-mono text-xs font-semibold text-chart-up">{sub}</span>}
      </CardContent>
    </Card>
  );
}

export default DirectorBriefing;
