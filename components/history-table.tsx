"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/store";

interface HistoryTableProps {
  history: AnalysisResult[];
  onSelect?: (analysis: AnalysisResult) => void;
}

export function HistoryTable({ history, onSelect }: HistoryTableProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-primary/10 text-primary border-primary/30";
    if (score >= 60) return "bg-chart-3/10 text-chart-3 border-chart-3/30";
    return "bg-destructive/10 text-destructive border-destructive/30";
  };

  if (history.length === 0) {
    return (
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/50 to-secondary">
            <History className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No analysis history yet. Upload a resume to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Analysis History
          </CardTitle>
          <p className="text-xs text-muted-foreground">{history.length} past analyses</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-secondary/30 hover:bg-secondary/30">
                <TableHead className="text-muted-foreground font-semibold">Role</TableHead>
                <TableHead className="text-muted-foreground font-semibold">ATS Score</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
                <TableHead className="text-muted-foreground font-semibold w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow
                  key={item.analysis_id}
                  className={cn(
                    "cursor-pointer border-border/50 transition-all duration-300 group/row animate-in fade-in slide-in-from-left-2 duration-300",
                    onSelect && "hover:bg-primary/5"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => onSelect?.(item)}
                >
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {item.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-mono border transition-all duration-300 group-hover/row:scale-105", getScoreColor(item.ats_score))}>
                      {item.ats_score}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover/row:opacity-100 group-hover/row:text-primary group-hover/row:translate-x-1" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
    </Card>
  );
}
