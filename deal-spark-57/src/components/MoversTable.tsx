import { TrendingUp, TrendingDown } from "lucide-react";
import type { Company } from "@/data/sectors";
import MiniChart from "./MiniChart";

const MoversTable = ({ companies }: { companies: Company[] }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sector</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market Cap</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">24h</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">7d</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Volume</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">7d Chart</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, idx) => (
            <tr
              key={company.ticker}
              className="border-b border-border transition-colors hover:bg-accent/50"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <td className="px-4 py-3.5">
                <div>
                  <span className="font-semibold text-card-foreground">{company.name}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{company.ticker}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {company.sector}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-sm text-card-foreground">{company.marketCap}</td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  {company.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-chart-up" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-chart-down" />
                  )}
                  <span className={`font-mono text-sm font-medium ${company.change24h >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                    {company.change24h >= 0 ? "+" : ""}{company.change24h}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-right">
                <span className={`font-mono text-sm font-medium ${company.change7d >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                  {company.change7d >= 0 ? "+" : ""}{company.change7d}%
                </span>
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-sm text-muted-foreground">{company.volume}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end">
                  <MiniChart data={company.sparkline} positive={company.change7d >= 0} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MoversTable;
