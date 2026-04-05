"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Users,
  BarChart3,
  Route,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Upload Resume", href: "/", icon: Upload },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Role Matches", href: "/roles", icon: Users },
  { name: "Skills Analysis", href: "/skills", icon: BarChart3 },
  { name: "Learning Roadmap", href: "/roadmap", icon: Route },
  { name: "Career Assistant", href: "/chat", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent animate-[pulse-glow_3s_ease-in-out_infinite]">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold gradient-text">
            CareerStack AI
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-accent/10 text-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-accent" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "text-primary" : "group-hover:text-primary group-hover:scale-110"
                )} />
                <span className={cn(
                  isActive && "gradient-text font-semibold"
                )}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-3 border border-border/30">
            <p className="text-xs text-sidebar-foreground/70">
              Powered by AI for your career growth
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
