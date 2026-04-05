"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cell,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useCareerStore } from "@/lib/store";
import { getJobMarket } from "@/lib/api";
import { Upload, TrendingUp, CheckCircle, XCircle, BarChart3, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

interface MarketSkill {
  skill: string;
  demand: number;
}

export default function SkillsPage() {
  const router = useRouter();
  const { userId, currentAnalysis } = useCareerStore();

  const [marketData, setMarketData] = useState<MarketSkill[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!currentAnalysis?.role) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getJobMarket(currentAnalysis.role);
        
        // Convert top_skills dictionary {"Skill": 0.45} to MarketSkill array
        const topSkills = result.top_skills || {};
        const formattedSkills = Object.entries(topSkills).map(([skill, demand]) => ({
          skill,
          demand: Math.round((demand as number) * 100),
        }));
        
        setMarketData(formattedSkills);
        setTotalJobs(result.total_jobs || 0);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        toast.error("Failed to load market analysis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [currentAnalysis?.role]);

  // Empty state
  if (!userId && !isLoading) {
    return (
      <DashboardLayout
        title="Skills & Market Analysis"
        description="Understand your skill gaps and market demand"
      >
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50">
            <BarChart3 className="h-12 w-12 text-primary" />
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-bold">
            <span className="gradient-text">No Analysis Yet</span>
          </h2>
          <p className="mt-3 max-w-md text-center text-muted-foreground">
            Upload your resume to see detailed skills analysis and market demand insights
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
      title="Skills & Market Analysis"
      description={`Current market demand for ${currentAnalysis?.role || "your target role"}`}
    >
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-80" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Skills
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-300 group-hover:scale-110">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold gradient-text">
                  {currentAnalysis?.user_skills?.length || 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  skills identified in your resume
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
            </Card>

            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Skill Gaps
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-chart-3/20 transition-all duration-300 group-hover:scale-110">
                  <XCircle className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-accent">
                  {currentAnalysis?.skill_gaps?.length || 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  skills to learn for your target role
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-accent to-chart-3 transition-all duration-500 group-hover:w-full" />
            </Card>

            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-chart-3/50 hover:shadow-xl hover:shadow-chart-3/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Jobs Analyzed
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-chart-3/20 to-chart-4/20 transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-3">
                  {totalJobs.toLocaleString()}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  job postings in market analysis
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-chart-3 to-chart-4 transition-all duration-500 group-hover:w-full" />
            </Card>
          </div>

          {/* Skills Visualization */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Skills */}
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="gradient-text">Your Current Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis?.user_skills?.length ? (
                    currentAnalysis.user_skills.map((skill, index) => (
                      <Badge
                        key={skill}
                        className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in-95 duration-300"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No skills detected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skill Gaps */}
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-accent/50 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-chart-3">
                    <Zap className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <span className="text-accent">Skills to Develop</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis?.skill_gaps?.length ? (
                    currentAnalysis.skill_gaps.map((skill, index) => (
                      <Badge
                        key={skill}
                        className="bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in-95 duration-300"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No skill gaps detected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Demand Chart */}
          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base w-full">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-5">
                    <BarChart3 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span>Core Skills Radar for <span className="gradient-text">{currentAnalysis?.role}</span></span>
                </div>
                <div className="flex gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#8b5cf6] opacity-40 border border-[#8b5cf6]"></div> Market Expected</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#10b981] opacity-70 border border-[#10b981]"></div> Your Coverage</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {marketData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      cx="50%" 
                      cy="50%" 
                      outerRadius="65%" 
                      data={marketData.slice(0, 8).map((entry) => ({
                        skill: entry.skill,
                        demand: entry.demand,
                        you: currentAnalysis?.user_skills?.includes(entry.skill) ? entry.demand : 0,
                      }))}
                    >
                      <defs>
                        <linearGradient id="radarMarket" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="radarYou" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="hsla(var(--foreground), 0.15)" />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ fill: "#e2e8f0", fontSize: 13, fontWeight: 500 }} 
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        tick={false} 
                        axisLine={false}
                      />
                      <Radar
                        name="Market Demand"
                        dataKey="demand"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="url(#radarMarket)"
                        fillOpacity={1}
                      />
                      <Radar
                        name="Your Skills"
                        dataKey="you"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#radarYou)"
                        fillOpacity={1}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold", marginBottom: "4px" }}
                        formatter={(value: number, name: string) => [`${value}%`, name === 'you' ? 'Your Asset' : 'Market Expected']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-80 flex-col items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    No market data available for this role
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
