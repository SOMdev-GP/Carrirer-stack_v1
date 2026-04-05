"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { RoleCard } from "@/components/role-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareerStore } from "@/lib/store";
import { getRoleMatch } from "@/lib/api";
import { Upload, Users, Sparkles, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface RoleMatch {
  role: string;
  match_score: number;
  reason?: string;
  matched_skills?: string[];
  missing_core?: string[];
}

export default function RolesPage() {
  const router = useRouter();
  const { userId, currentAnalysis } = useCareerStore();

  const [roles, setRoles] = useState<RoleMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!userId || !currentAnalysis?.user_skills?.length) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getRoleMatch(currentAnalysis.user_skills, userId);
        setRoles(result.recommendations || result.roles || []);
      } catch (error) {
        console.error("Failed to fetch role matches:", error);
        toast.error("Failed to load role recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [userId, currentAnalysis]);

  // Empty state
  if (!userId && !isLoading) {
    return (
      <DashboardLayout
        title="Role Recommendations"
        description="Discover careers that match your skills"
      >
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50">
            <Briefcase className="h-12 w-12 text-primary" />
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-bold">
            <span className="gradient-text">No Analysis Yet</span>
          </h2>
          <p className="mt-3 max-w-md text-center text-muted-foreground">
            Upload your resume to see matching career paths tailored to your unique skills
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
      title="Role Recommendations"
      description="Based on your skills, here are careers that could be a great fit"
    >
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : roles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => (
            <div 
              key={index} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RoleCard
                role={role.role}
                matchScore={role.match_score}
                reason={role.reason}
                matchedSkills={role.matched_skills}
                missingCore={role.missing_core}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary border border-border/50">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-8 text-2xl font-bold text-foreground">
            No Matching Roles Found
          </h2>
          <p className="mt-3 max-w-md text-center text-muted-foreground">
            Try analyzing your resume first to get personalized recommendations
          </p>
          <Button 
            onClick={() => router.push("/")} 
            className="mt-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze Resume
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
