"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Sparkles } from "lucide-react";

interface SkillSummaryProps {
  skills: string[];
  gaps: string[];
}

export function SkillSummary({ skills, gaps }: SkillSummaryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Current Skills */}
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
            <CheckCircle className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Your Skills
          </CardTitle>
          <Badge className="ml-auto bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-0">
            {skills.length}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills detected yet
              </p>
            )}
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
      </Card>

      {/* Skill Gaps */}
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-chart-3/20">
            <XCircle className="h-4 w-4 text-accent" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Skill Gaps
          </CardTitle>
          <Badge className="ml-auto bg-gradient-to-r from-accent/20 to-chart-3/20 text-accent border-0">
            {gaps.length}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {gaps.length > 0 ? (
              gaps.map((gap, index) => (
                <Badge
                  key={gap}
                  variant="secondary"
                  className="bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-right-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {gap}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No skill gaps detected
              </p>
            )}
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent to-chart-3 transition-all duration-500 group-hover:w-full" />
      </Card>
    </div>
  );
}
