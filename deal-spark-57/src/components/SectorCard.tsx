import { Eye, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Sector } from "@/data/sectors";

const SectorCard = ({ sector }: { sector: Sector }) => {
  const Icon = sector.icon;

  return (
    <Link
      to={`/sector/${sector.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-badge-views px-2 py-1">
            <Eye className="h-3 w-3 text-badge-views-foreground" />
            <span className="text-xs font-medium text-badge-views-foreground">{sector.views} views</span>
          </div>
          {sector.trending && (
            <div className="flex items-center gap-1 rounded-md bg-trending px-2 py-1">
              <TrendingUp className="h-3 w-3 text-trending-foreground" />
              <span className="text-xs font-semibold text-trending-foreground">Trending</span>
            </div>
          )}
        </div>
        <button
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={(e) => { e.preventDefault(); }}
        >
          <Star className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {sector.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {sector.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-xs text-primary font-medium">Updated {sector.updatedAt}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-card-foreground">{sector.companyCount} companies</span>
            <span className={`text-xs font-mono font-medium ${sector.change >= 0 ? "text-chart-up" : "text-chart-down"}`}>
              {sector.change >= 0 ? "+" : ""}{sector.change}%
            </span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-5 right-5 translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <ArrowRight className="h-4 w-4 text-primary" />
      </div>
    </Link>
  );
};

export default SectorCard;
