"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RoleCardProps {
  role: string;
  matchScore: number;
  reason?: string;
  matchedSkills?: string[];
  missingCore?: string[];
}

export function RoleCard({ role, matchScore, reason, matchedSkills, missingCore }: RoleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-chart-3";
    return "text-muted-foreground";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-primary to-accent";
    if (score >= 60) return "from-chart-3 to-chart-4";
    return "from-muted to-muted-foreground";
  };

  return (
    <Card className="group relative overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-500 group-hover:from-primary group-hover:to-accent">
            <Briefcase className="h-6 w-6 text-primary transition-colors duration-500 group-hover:text-primary-foreground" />
          </div>
          <CardTitle className="text-base font-semibold text-foreground transition-all duration-300 group-hover:gradient-text">
            {role}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", getScoreColor(matchScore))} />
          <span className={cn("text-xl font-bold", getScoreColor(matchScore))}>
            {matchScore}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Custom progress bar with gradient */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out", getScoreGradient(matchScore))}
            style={{ width: `${matchScore}%` }}
          />
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </div>
        
        {reason && (
          <p className="mt-3 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80 line-clamp-2">
            {reason}
          </p>
        )}
        
        {/* Toggle details button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
        >
          <span>{isExpanded ? 'Hide details' : 'View details'}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
        </button>

        {/* Expanded section */}
        <div className={cn("grid transition-all duration-300 ease-in-out", isExpanded ? "grid-rows-[1fr] mt-4 opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div className="space-y-4 pt-2 border-t border-border/50">
              {matchedSkills && matchedSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Strong Matches
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {missingCore && missingCore.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                    <XCircle className="h-3.5 w-3.5 text-accent" /> Missing Core Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {missingCore.map(skill => (
                      <Badge key={skill} variant="outline" className="text-[10px] bg-accent/5 text-accent border-accent/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Bottom accent line */}
      <div className={cn("absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r transition-all duration-500 group-hover:w-full", getScoreGradient(matchScore))} />
    </Card>
  );
}
