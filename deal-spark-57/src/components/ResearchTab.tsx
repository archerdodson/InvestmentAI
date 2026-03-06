import { useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Play,
  RefreshCw,
  Clock,
  FileText,
  Square,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAgentRuns, useRefreshAgentData } from "@/hooks/useAgentData";

interface ResearchTabProps {
  sectorId: string;
}

const ResearchTab = ({ sectorId }: ResearchTabProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [thesis, setThesis] = useState("");
  const [threshold, setThreshold] = useState(0.7);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { data: runs = [] } = useAgentRuns();
  const refreshData = useRefreshAgentData();

  const sectorRuns = runs.filter((r) => r.sector_id === sectorId || !r.sector_id);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const handleRunAgent = async () => {
    setIsRunning(true);
    setTerminalOutput(["$ Starting Investment Radar agent...\n"]);

    const controller = new AbortController();
    abortRef.current = controller;

    const body: Record<string, string> = { sector: sectorId };
    if (date) body.date = format(date, "yyyy-MM-dd");
    if (threshold !== 0.7) body.threshold = String(threshold);
    if (thesis.trim()) body.thesis = thesis.trim();

    try {
      const res = await fetch("/api/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setTerminalOutput((prev) => [...prev, "ERROR: No response stream\n"]);
        setIsRunning(false);
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                setTerminalOutput((prev) => [
                  ...prev,
                  `\n--- Agent finished (exit code: ${data.exitCode}) ---\n`,
                ]);
                setIsRunning(false);
                refreshData();
                return;
              }
              if (data.text) {
                setTerminalOutput((prev) => [...prev, data.text]);
                setTimeout(scrollToBottom, 10);
              }
            } catch {
              // skip malformed events
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setTerminalOutput((prev) => [...prev, `\nERROR: ${err.message}\n`]);
      }
    }

    setIsRunning(false);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsRunning(false);
    setTerminalOutput((prev) => [...prev, "\n--- Stopped by user ---\n"]);
  };

  return (
    <div className="space-y-6">
      {/* Search Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Play className="h-5 w-5 text-primary" />
            Run Research Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Date Picker */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Search Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : "Select date (defaults to today)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Threshold */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Score Threshold:{" "}
                <span className="font-mono text-primary">{threshold.toFixed(2)}</span>
              </label>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-muted-foreground">0.5</span>
                <Slider
                  value={[threshold]}
                  onValueChange={([v]) => setThreshold(v)}
                  min={0.5}
                  max={0.95}
                  step={0.05}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">0.95</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Deals scoring above this get deep research + briefs.
              </p>
            </div>
          </div>

          {/* Thesis Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Investment Thesis
            </label>
            <Textarea
              placeholder="Enter your investment thesis or search focus... (leave blank for default M&A framework)"
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              rows={3}
              className="resize-y"
            />
          </div>

          {/* Run / Stop Button */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleRunAgent} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Run Search
              </Button>
            ) : (
              <Button onClick={handleStop} variant="destructive" className="flex-1">
                <Square className="mr-2 h-4 w-4" />
                Stop Agent
              </Button>
            )}
            <Button onClick={refreshData} variant="outline" size="icon" title="Refresh data">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Terminal Output */}
      {terminalOutput.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              Agent Output
              {isRunning && (
                <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-chart-up animate-pulse" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={terminalRef}
              className="max-h-96 overflow-y-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap"
            >
              {terminalOutput.join("")}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Runs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Past Research Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sectorRuns.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No research runs yet. Hit "Run Search" above to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {[...sectorRuns].reverse().map((run) => (
                <div
                  key={run.run_id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(run.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      {run.date_range_start && (
                        <p className="text-xs text-muted-foreground">
                          Date: {run.date_range_start}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {run.deals_found} deals
                    </Badge>
                    {run.briefs_generated > 0 && (
                      <Badge className="bg-primary/10 text-primary border-0 font-mono text-xs">
                        {run.briefs_generated} briefs
                      </Badge>
                    )}
                    <Badge
                      className={cn(
                        "border-0 text-xs",
                        run.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      )}
                    >
                      {run.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchTab;
