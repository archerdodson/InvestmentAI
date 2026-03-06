import { ArrowUpRight } from "lucide-react";
import type { TopCompany } from "@/data/sectors";

const Top20Table = ({ companies }: { companies: TopCompany[] }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market Cap</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Growth</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">P/E</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Deal</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, idx) => (
            <tr
              key={company.ticker}
              className="border-b border-border transition-colors hover:bg-accent/50 animate-fade-in"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <td className="px-4 py-3.5 font-mono text-sm text-muted-foreground">{company.rank}</td>
              <td className="px-4 py-3.5">
                <div>
                  <span className="font-semibold text-card-foreground">{company.name}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{company.ticker}</span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-sm text-card-foreground">{company.marketCap}</td>
              <td className="px-4 py-3.5 text-right font-mono text-sm text-card-foreground">{company.revenue}</td>
              <td className="px-4 py-3.5 text-right">
                <span className={`font-mono text-sm font-medium ${company.growth >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                  {company.growth >= 0 ? "+" : ""}{company.growth}%
                </span>
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-sm text-muted-foreground">{company.pe}x</td>
              <td className="px-4 py-3.5">
                {company.recentDeal ? (
                  <div className="flex items-center gap-1.5">
                    <ArrowUpRight className="h-3 w-3 text-primary" />
                    <div>
                      <span className="text-sm text-card-foreground">{company.recentDeal}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{company.dealDate}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Top20Table;
