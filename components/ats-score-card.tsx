"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ATSScoreCardProps {
  score: number;
  label?: string;
}

export function ATSScoreCard({ score, label = "ATS Score" }: ATSScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreGradient = (s: number) => {
    if (s >= 80) return "from-primary via-chart-4 to-primary";
    if (s >= 60) return "from-chart-3 via-chart-3 to-chart-3";
    return "from-destructive via-destructive to-destructive";
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-primary";
    if (s >= 60) return "text-chart-3";
    return "text-destructive";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    return "Needs Work";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <Card className="group relative overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pb-6">
        <div className="relative h-36 w-36">
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-30 transition-opacity duration-500 group-hover:opacity-50",
            score >= 80 ? "bg-primary" : score >= 60 ? "bg-chart-3" : "bg-destructive"
          )} />
          
          <svg className="h-full w-full -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary"
            />
            {/* Animated progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
              style={{
                stroke: `url(#gradient-${label.replace(/\s/g, '')})`,
              }}
            />
            <defs>
              <linearGradient id={`gradient-${label.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn(
              "text-4xl font-bold transition-all duration-300",
              getScoreColor(animatedScore)
            )}>
              {animatedScore}
            </span>
            <span className="text-xs text-muted-foreground">out of 100</span>
          </div>
        </div>
        
        <div
          className={cn(
            "mt-4 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300",
            score >= 80 
              ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary" 
              : score >= 60 
                ? "bg-chart-3/20 text-chart-3" 
                : "bg-destructive/20 text-destructive"
          )}
        >
          {getScoreLabel(score)}
        </div>
      </CardContent>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
    </Card>
  );
}
