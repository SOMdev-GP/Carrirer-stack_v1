"use client";

import { AppSidebar } from "./app-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-[100px] animate-[float_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-[100px] animate-[float_12s_ease-in-out_infinite_3s]" />
      </div>

      <AppSidebar />
      <main className="relative pl-64">
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl px-8 py-6">
          <h1 className="text-2xl font-bold animate-in fade-in slide-in-from-left-4 duration-500">
            <span className="gradient-text">{title}</span>
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
              {description}
            </p>
          )}
        </div>
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {children}
        </div>
      </main>
    </div>
  );
}
