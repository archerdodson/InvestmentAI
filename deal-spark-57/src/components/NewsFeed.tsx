import { ArrowUpRight, Clock } from "lucide-react";
import type { NewsItem } from "@/data/sectors";

const typeStyles: Record<string, { label: string; className: string }> = {
  ma: { label: "M&A", className: "bg-primary/10 text-primary" },
  deal: { label: "Deal", className: "bg-success/10 text-success" },
  funding: { label: "Funding", className: "bg-warning/10 text-warning" },
  ipo: { label: "IPO", className: "bg-chart-neutral/10 text-chart-neutral" },
};

const NewsFeed = ({ news }: { news: NewsItem[] }) => {
  return (
    <div className="space-y-3">
      {news.map((item, idx) => {
        const style = typeStyles[item.type];
        return (
          <div
            key={item.id}
            className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-md animate-fade-in"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${style.className}`}>
                    {style.label}
                  </span>
                  {item.amount && (
                    <span className="font-mono text-sm font-bold text-card-foreground">{item.amount}</span>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{item.time}</span>
                  </div>
                </div>
                <h4 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.companies.map((c) => (
                    <span key={c} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {c}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground">via {item.source}</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsFeed;
