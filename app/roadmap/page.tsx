"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { RoadmapTimeline } from "@/components/roadmap-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useCareerStore } from "@/lib/store";
import { generateRoadmap } from "@/lib/api";
import { Upload, Route, RefreshCw, Calendar, Target, Sparkles, Zap, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface WeekTask {
  week: number;
  topic: string;
  description?: string;
  resources?: string[];
  tasks?: string[];
}

export default function RoadmapPage() {
  const router = useRouter();
  const { userId, analysisId, currentAnalysis, roadmap, setRoadmap } = useCareerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // If roadmap is already populated from the store, set hasGenerated true on mount
  useEffect(() => {
    if (roadmap && roadmap.length > 0) {
      setHasGenerated(true);
    }
  }, [roadmap]);

  const handleGenerateRoadmap = async () => {
    if (!userId || !analysisId) {
      toast.error("Please analyze your resume first");
      return;
    }

    setIsLoading(true);

    try {
      const result = await generateRoadmap(analysisId, userId);
      // The backend returns { roadmap: { role: "...", weeks: [] } }
      const weeksData = result.roadmap?.weeks || result.weeks || [];
      setRoadmap(Array.isArray(weeksData) ? weeksData : []);
      setHasGenerated(true);
      toast.success("Learning roadmap generated!");
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
      toast.error("Failed to generate roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  // Empty state - no analysis
  if (!userId || !analysisId) {
    return (
      <DashboardLayout
        title="Learning Roadmap"
        description="Your personalized 12-week learning plan"
      >
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50">
            <Route className="h-12 w-12 text-primary" />
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-bold">
            <span className="gradient-text">No Analysis Yet</span>
          </h2>
          <p className="mt-3 max-w-md text-center text-muted-foreground">
            Upload your resume to get a personalized learning roadmap tailored to your goals
          </p>
          <Button 
            onClick={() => router.push("/")} 
            className="mt-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Learning Roadmap"
      description={`Your personalized path to becoming a ${currentAnalysis?.role || "professional"}`}
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent transition-transform duration-500 group-hover:scale-110">
                <Route className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  AI-Generated Learning Plan
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on your skill gaps for <span className="text-primary font-medium">{currentAnalysis?.role}</span>
                </p>
              </div>
            </div>
            <Button
              onClick={handleGenerateRoadmap}
              disabled={isLoading}
              className="shrink-0 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : hasGenerated ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
        </Card>

        {/* Stats */}
        {hasGenerated && roadmap.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Duration
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 transition-transform duration-300 group-hover:scale-110">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {roadmap.length} Weeks
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Structured learning path</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
            </Card>
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Skills to Learn
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-chart-3/20 transition-transform duration-300 group-hover:scale-110">
                  <Target className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {currentAnalysis?.skill_gaps?.length || 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Gap skills covered</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-accent to-chart-3 transition-all duration-500 group-hover:w-full" />
            </Card>
          </div>
        )}

        {/* Roadmap Timeline */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-32 flex-1" />
              </div>
            ))}
          </div>
        ) : roadmap.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <RoadmapTimeline weeks={roadmap} />
          </div>
        ) : (
          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary border border-border/50">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                No Roadmap Yet
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                Click the button above to generate your personalized AI-powered learning plan
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
