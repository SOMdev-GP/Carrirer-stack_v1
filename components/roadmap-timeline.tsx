"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Sparkles, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekTask {
  week: number;
  topic: string;
  description?: string;
  resources?: string[];
  tasks?: string[];
}

interface RoadmapTimelineProps {
  weeks: WeekTask[];
}

export function RoadmapTimeline({ weeks }: RoadmapTimelineProps) {
  return (
    <div className="relative space-y-0">
      {/* Timeline line with gradient */}
      <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-chart-5" />

      {weeks.map((week, index) => {
        const isFirst = index === 0;
        const delay = index * 100;

        return (
          <div 
            key={week.week} 
            className="relative flex gap-6 pb-8 last:pb-0 animate-in fade-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: `${delay}ms` }}
          >
            {/* Timeline dot */}
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center">
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500",
                  isFirst
                    ? "border-primary bg-gradient-to-br from-primary to-accent animate-[pulse-glow_3s_ease-in-out_infinite]"
                    : "border-border bg-card hover:border-primary hover:scale-110"
                )}
              >
                {isFirst ? (
                  <Clock className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Content */}
            <Card className="group flex-1 overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-primary/50 transition-all duration-300",
                      isFirst ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary" : "text-primary"
                    )}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Week {week.week}
                  </Badge>
                  {isFirst && (
                    <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                      Current
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-foreground transition-all duration-300 group-hover:gradient-text">
                  {week.topic}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {week.description && (
                  <p className="text-sm text-muted-foreground">
                    {week.description}
                  </p>
                )}

                {week.tasks && week.tasks.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Target className="h-3 w-3 text-primary" />
                      Tasks
                    </div>
                    <ul className="mt-2 space-y-2">
                      {week.tasks.map((task, taskIndex) => (
                        <li
                          key={taskIndex}
                          className="group/task flex items-start gap-2 rounded-lg bg-secondary/30 p-2.5 text-sm text-foreground transition-all duration-300 hover:bg-secondary/50"
                        >
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover/task:scale-110" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {week.resources && week.resources.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <BookOpen className="h-3 w-3 text-accent" />
                      Resources
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {week.resources.map((resource, resourceIndex) => (
                        <Badge
                          key={resourceIndex}
                          variant="secondary"
                          className="text-xs transition-all duration-300 hover:bg-primary/20 hover:text-primary cursor-pointer"
                        >
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              {/* Bottom gradient accent */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
            </Card>
          </div>
        );
      })}
    </div>
  );
}
