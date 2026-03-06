import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  BookOpen,
} from "lucide-react";
import type { AgentBrief } from "@/types/agent";

interface BriefDialogProps {
  brief: AgentBrief | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const verdictConfig: Record<string, { color: string; bg: string }> = {
  Strong: { color: "text-chart-up", bg: "bg-chart-up/10" },
  Moderate: { color: "text-warning", bg: "bg-warning/10" },
  Weak: { color: "text-chart-down", bg: "bg-chart-down/10" },
};

const BriefDialog = ({ brief, open, onOpenChange }: BriefDialogProps) => {
  if (!brief) return null;

  const verdict = verdictConfig[brief.verdict] ?? verdictConfig.Moderate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="text-lg">
              {brief.acquirer_company} &rarr; {brief.target_company}
            </DialogTitle>
            <Badge className={`${verdict.bg} ${verdict.color} border-0`}>
              {brief.verdict} ({(brief.score * 100).toFixed(0)}%)
            </Badge>
          </div>
          <div className="flex gap-3 text-sm text-muted-foreground mt-1">
            {brief.deal_value && (
              <span className="font-mono font-semibold text-foreground">
                {brief.deal_value}
              </span>
            )}
            {brief.sector && <span>{brief.sector}</span>}
            <span>
              {new Date(brief.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Deal Overview */}
          {brief.deal_overview && (
            <BriefSection icon={FileText} title="Deal Overview" color="text-primary">
              {brief.deal_overview}
            </BriefSection>
          )}

          {/* Thesis Alignment */}
          {brief.thesis_alignment && (
            <BriefSection icon={Target} title="Thesis Alignment" color="text-chart-up">
              {brief.thesis_alignment}
            </BriefSection>
          )}

          {/* Research Data */}
          {brief.research && (
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Supplementary Research
                </p>
                {brief.research.competitors.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      <Users className="h-3 w-3" />
                      Competitors
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {brief.research.competitors.map((c) => (
                        <Badge key={c} variant="secondary" className="text-xs">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {brief.research.market_size && (
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      <BarChart3 className="h-3 w-3" />
                      Market Size
                    </p>
                    <p className="text-sm text-foreground/80">
                      {brief.research.market_size}
                    </p>
                  </div>
                )}
                {brief.research.key_customers.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Key Customers
                    </p>
                    <p className="text-sm text-foreground/80">
                      {brief.research.key_customers.join(", ")}
                    </p>
                  </div>
                )}
                {brief.research.funding_history && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Funding History
                    </p>
                    <p className="text-sm text-foreground/80">
                      {brief.research.funding_history}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          {brief.risk_factors && (
            <BriefSection icon={AlertTriangle} title="Risk Factors" color="text-chart-down">
              {brief.risk_factors}
            </BriefSection>
          )}

          {/* Recommended Action */}
          {brief.recommended_action && (
            <BriefSection icon={CheckCircle} title="Recommended Action" color="text-primary">
              {brief.recommended_action}
            </BriefSection>
          )}

          {/* Disclaimer */}
          <p className="border-t border-border pt-3 text-xs italic text-muted-foreground">
            {brief.disclaimer}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function BriefSection({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: typeof FileText;
  title: string;
  color: string;
  children: string;
}) {
  return (
    <div>
      <p className={`flex items-center gap-2 text-sm font-semibold mb-2 ${color}`}>
        <Icon className="h-4 w-4" />
        {title}
      </p>
      <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
        {children}
      </div>
    </div>
  );
}

export default BriefDialog;
