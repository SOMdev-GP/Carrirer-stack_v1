"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { User, Sparkles, MessageSquare, Zap, Target, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

const suggestions = [
  { text: "Why is my ATS score low?", icon: Target },
  { text: "How can I improve my resume?", icon: TrendingUp },
  { text: "What skills should I learn?", icon: Zap },
];

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-8">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent animate-[pulse-glow_3s_ease-in-out_infinite]">
          <Sparkles className="h-10 w-10 text-primary-foreground" />
        </div>
        <h3 className="mt-6 text-xl font-bold">
          <span className="gradient-text">Career Assistant</span>
        </h3>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Ask me anything about your resume, career advice, interview tips, or how
          to improve your skills. I have full context of your analysis.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.text}
              className="group flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2.5 text-sm text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <suggestion.icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {message.role === "assistant" && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm transition-all duration-300",
              message.role === "user"
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary/50 text-foreground border border-border/50 backdrop-blur-sm"
            )}
          >
            {message.content}
          </div>
          {message.role === "user" && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border/50">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl bg-secondary/50 border border-border/50 px-5 py-4 backdrop-blur-sm">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-chart-5" />
          </div>
        </div>
      )}
    </div>
  );
}
