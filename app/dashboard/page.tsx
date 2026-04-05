"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ATSScoreCard } from "@/components/ats-score-card";
import { SkillSummary } from "@/components/skill-summary";
import { HistoryTable } from "@/components/history-table";
import { useCareerStore } from "@/lib/store";
import { getDashboardHistory } from "@/lib/api";
import { Upload, Lightbulb, Sparkles, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const {
    userId,
    currentAnalysis,
    analysisHistory,
    setAnalysisHistory,
    setCurrentAnalysis,
  } = useCareerStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getDashboardHistory(userId);
        // Extract the analyses array from the response, defaulting to an empty array
        const historyArray = data.analyses || [];
        setAnalysisHistory(historyArray);
      } catch (error) {
        console.error("[v0] Failed to fetch history:", error);
        toast.error("Failed to load analysis history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId, setAnalysisHistory]);

  // Show empty state if no user or analysis
  if (!userId && !isLoading) {
    return (
      <DashboardLayout
        title="Dashboard"
        description="View your resume analysis results"
      >
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-50 animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
              <Upload className="h-12 w-12 text-primary animate-bounce" />
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-bold gradient-text">
            No Analysis Yet
          </h2>
          <p className="mt-3 text-center text-muted-foreground max-w-sm">
            Upload your resume to get AI-powered career insights and recommendations
          </p>
          <Button 
            onClick={() => router.push("/")} 
            className="mt-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Upload Resume
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      description="View your resume analysis results and career insights"
    >
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Score Cards with staggered animation */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ATSScoreCard score={currentAnalysis?.ats_score ?? 0} label="ATS Score" />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <ATSScoreCard
                score={currentAnalysis?.match_score ?? 0}
                label="Role Match"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Card className="group relative overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Target Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative flex h-[calc(100%-3rem)] flex-col items-center justify-center">
                  <span className="text-2xl font-bold gradient-text">
                    {currentAnalysis?.role ?? "Not Set"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300"
                    onClick={() => router.push("/")}
                  >
                    Change Role
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Skills Summary */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <SkillSummary
              skills={currentAnalysis?.user_skills ?? []}
              gaps={currentAnalysis?.skill_gaps ?? []}
            />
          </div>

          {/* Recommendations */}
          {currentAnalysis?.recommendations &&
            currentAnalysis.recommendations.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                <Card className="relative overflow-hidden border-border bg-card/50 backdrop-blur-sm card-hover">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-4 to-accent" />
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-medium gradient-text">
                      AI Recommendations
                    </CardTitle>
                    <Zap className="h-4 w-4 text-accent ml-auto animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentAnalysis.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className={cn(
                            "group flex items-start gap-3 rounded-xl bg-gradient-to-r from-secondary/50 to-secondary/30 p-4 border border-transparent transition-all duration-300 hover:border-primary/30 hover:from-primary/10 hover:to-accent/5",
                            "animate-in fade-in slide-in-from-left-4 duration-500"
                          )}
                          style={{ animationDelay: `${500 + index * 100}ms` }}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30">
                            {index + 1}
                          </span>
                          <span className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors duration-300">
                            {rec}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

          {/* History Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <HistoryTable
              history={analysisHistory}
              onSelect={(analysis) => setCurrentAnalysis(analysis)}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
