"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border/50 bg-card/50 backdrop-blur-xl p-4">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about your career..."
            disabled={isLoading || disabled}
            className="min-h-[48px] max-h-[150px] resize-none border-border/50 bg-secondary/50 pr-4 transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70"
            rows={1}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading || disabled}
          size="icon"
          className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary animate-pulse" />
        <span>AI assistant has full context of your resume and analysis</span>
      </div>
    </div>
  );
}
