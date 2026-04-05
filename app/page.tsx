"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Briefcase, Target, TrendingUp, Zap, Brain, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { FileDropZone } from "@/components/file-drop-zone";
import { analyzeResume } from "@/lib/api";
import { useCareerStore } from "@/lib/store";
import { toast } from "sonner";

const popularRoles = [
  "Data Scientist",
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
  "ML Engineer",
];

const features = [
  {
    icon: Target,
    title: "ATS Score Analysis",
    description: "Get your resume scored against industry standards",
    color: "from-primary to-chart-5",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Detection",
    description: "Identify missing skills for your target role",
    color: "from-accent to-chart-4",
  },
  {
    icon: Briefcase,
    title: "Career Recommendations",
    description: "Discover matching career paths based on your skills",
    color: "from-chart-3 to-chart-2",
  },
];

const stats = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "95%", label: "Success Rate" },
  { value: "200+", label: "Career Paths" },
];

export default function UploadPage() {
  const router = useRouter();
  const setCurrentAnalysis = useCareerStore((state) => state.setCurrentAnalysis);
  const userId = useCareerStore((state) => state.userId);

  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!file || !role) {
      toast.error("Please upload a resume and select a target role");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeResume(file, role, userId);
      setCurrentAnalysis(result);
      toast.success("Resume analyzed successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-accent/20 blur-[100px] animate-[float_10s_ease-in-out_infinite_2s]" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-chart-5/20 blur-[100px] animate-[float_12s_ease-in-out_infinite_4s]" />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent animate-[pulse-glow_3s_ease-in-out_infinite]">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">
              CareerStack AI
            </span>
          </div>

          {/* Headline */}
          <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Supercharge your career with{" "}
              <span className="gradient-text">AI-powered</span> insights
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Upload your resume and get instant analysis, skill gap detection,
              personalized roadmaps, and career recommendations powered by advanced AI.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 flex justify-center gap-8 sm:gap-16 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center" style={{ animationDelay: `${300 + index * 100}ms` }}>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Upload Card */}
          <div className="mx-auto mt-12 max-w-2xl animate-in fade-in zoom-in-95 duration-700 delay-500">
            <div className="gradient-border glow-primary">
              <Card className="border-0 bg-card/80 backdrop-blur-xl">
                <CardContent className="p-6">
                  <FileDropZone
                    file={file}
                    onFileSelect={setFile}
                    onClear={() => setFile(null)}
                  />

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-foreground">
                      Target Role
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Data Scientist, Software Engineer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-2 bg-secondary/50 border-border/50 focus:border-primary transition-all duration-300"
                    />

                    {/* Popular roles */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {popularRoles.map((r, i) => (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className="rounded-full bg-secondary/50 px-3 py-1.5 text-xs font-medium text-secondary-foreground border border-border/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-primary-foreground hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                          style={{ animationDelay: `${600 + i * 50}ms` }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!file || !role || isAnalyzing}
                    className="mt-6 w-full bg-gradient-to-r from-primary via-chart-5 to-accent hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Analyze Resume
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-6 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-card/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ backgroundImage: `linear-gradient(to right, var(--primary), var(--accent))` }} />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center animate-in fade-in duration-700 delay-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/30 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
              <Brain className="h-4 w-4 text-primary animate-[bounce-subtle_2s_ease-in-out_infinite]" />
              Powered by advanced AI models
              <Rocket className="h-4 w-4 text-accent animate-[bounce-subtle_2s_ease-in-out_infinite_0.5s]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
