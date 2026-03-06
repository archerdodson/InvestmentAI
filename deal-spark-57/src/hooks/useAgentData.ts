import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AgentDeal, AgentBrief, AgentRun } from "@/types/agent";

async function fetchJson<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(path);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export function useAgentDeals(sectorId?: string) {
  return useQuery({
    queryKey: ["agent-deals", sectorId],
    queryFn: async () => {
      const deals = await fetchJson<AgentDeal>("/data/deals.json");
      if (sectorId) return deals.filter((d) => d.sector_id === sectorId);
      return deals;
    },
    staleTime: 30_000,
  });
}

export function useAgentBriefs(sectorId?: string) {
  return useQuery({
    queryKey: ["agent-briefs", sectorId],
    queryFn: async () => {
      const briefs = await fetchJson<AgentBrief>("/data/briefs.json");
      if (sectorId) return briefs.filter((b) => b.sector === sectorId);
      return briefs;
    },
    staleTime: 30_000,
  });
}

export function useAgentBrief(briefId: string | null | undefined) {
  return useQuery({
    queryKey: ["agent-brief", briefId],
    queryFn: async () => {
      if (!briefId) return null;
      const briefs = await fetchJson<AgentBrief>("/data/briefs.json");
      return briefs.find((b) => b.brief_id === briefId) ?? null;
    },
    enabled: !!briefId,
    staleTime: 30_000,
  });
}

export function useAgentRuns() {
  return useQuery({
    queryKey: ["agent-runs"],
    queryFn: () => fetchJson<AgentRun>("/data/runs.json"),
    staleTime: 30_000,
  });
}

export function useRefreshAgentData() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["agent-deals"] });
    queryClient.invalidateQueries({ queryKey: ["agent-briefs"] });
    queryClient.invalidateQueries({ queryKey: ["agent-runs"] });
    queryClient.invalidateQueries({ queryKey: ["agent-brief"] });
  };
}
