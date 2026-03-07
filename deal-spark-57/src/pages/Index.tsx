import { useMemo } from "react";
import { Search } from "lucide-react";
import SectorCard from "@/components/SectorCard";
import Navbar from "@/components/Navbar";
import { sectors } from "@/data/sectors";
import { useAgentDeals } from "@/hooks/useAgentData";

const Index = () => {
  const { data: allDeals = [] } = useAgentDeals();

  // Compute the latest deal date per sector
  const latestDealBySector = useMemo(() => {
    const map: Record<string, string> = {};
    for (const deal of allDeals) {
      const sid = deal.sector_id;
      if (!sid || !deal.time) continue;
      if (!map[sid] || deal.time > map[sid]) {
        map[sid] = deal.time;
      }
    }
    return map;
  }, [allDeals]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sector Discovery
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore investment themes across sectors. Aggregated from 10+ data sources.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by sector name or description..."
            className="flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Sector grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, idx) => (
            <div key={sector.id} className="animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
              <SectorCard sector={sector} latestDealDate={latestDealBySector[sector.id]} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
