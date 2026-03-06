import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Building2, Newspaper, Presentation, Search } from "lucide-react";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import MoversTable from "@/components/MoversTable";
import NewsFeed from "@/components/NewsFeed";
import Top20Table from "@/components/Top20Table";
import DirectorBriefing from "@/components/DirectorBriefing";
import ResearchTab from "@/components/ResearchTab";
import { sectors } from "@/data/sectors";
import { getSectorData } from "@/data/sectorData";
import { useAgentDeals, useAgentBriefs } from "@/hooks/useAgentData";
import type { NewsItem } from "@/data/sectors";

const tabs = [
  { id: "movers", label: "Movers", icon: TrendingUp },
  { id: "news", label: "Fresh Deals & M&A", icon: Newspaper },
  { id: "top20", label: "Top 20 Companies", icon: Building2 },
  { id: "director", label: "Present to Director", icon: Presentation },
  { id: "research", label: "Research", icon: Search },
] as const;

type TabId = (typeof tabs)[number]["id"];

const SectorDetail = () => {
  const { sectorId } = useParams();
  const [activeTab, setActiveTab] = useState<TabId>("movers");

  const sector = sectors.find((s) => s.id === sectorId);
  const sectorData = useMemo(() => getSectorData(sectorId || ""), [sectorId]);

  // Load agent data for this sector
  const { data: agentDeals = [] } = useAgentDeals(sectorId);
  const { data: agentBriefs = [] } = useAgentBriefs(sectorId);

  // Merge agent deals with sector-specific mock data for the news feed
  const mergedNews: NewsItem[] = useMemo(() => [
    ...agentDeals.map((d) => ({
      id: d.id,
      title: d.title,
      source: d.source,
      time: d.time,
      type: d.type,
      amount: d.amount ?? undefined,
      companies: d.companies,
      summary: d.summary,
    })),
    ...sectorData.news,
  ], [agentDeals, sectorData.news]);

  if (!sector) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex flex-col items-center justify-center py-32">
          <h2 className="text-2xl font-bold text-foreground">Sector not found</h2>
          <Link to="/" className="mt-4 text-primary hover:underline">&larr; Back to Discovery</Link>
        </div>
      </div>
    );
  }

  const Icon = sector.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Breadcrumb */}
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Discovery
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{sector.name}</h1>
            <p className="mt-1 text-muted-foreground">{sector.description}</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">{sector.companyCount} companies tracked</span>
              <span className={`font-mono text-sm font-medium ${sector.change >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                {sector.change >= 0 ? "+" : ""}{sector.change}% this week
              </span>
              <span className="text-xs text-muted-foreground">Updated {sector.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-border bg-card p-1">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {activeTab === "movers" && <MoversTable companies={sectorData.movers} />}
          {activeTab === "news" && <NewsFeed news={mergedNews} />}
          {activeTab === "top20" && <Top20Table companies={sectorData.top20} />}
          {activeTab === "director" && (
            <DirectorBriefing briefing={sectorData.directorBriefing} agentBriefs={agentBriefs} />
          )}
          {activeTab === "research" && <ResearchTab sectorId={sectorId || ""} />}
        </div>
      </main>
    </div>
  );
};

export default SectorDetail;
