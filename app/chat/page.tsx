"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChatWindow } from "@/components/chat-window";
import { ChatInput } from "@/components/chat-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/lib/store";
import { sendChatMessage, getChatHistory } from "@/lib/api";
import { Upload, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { userId, sessionId, resumeId } = useCareerStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (!userId || !sessionId) {
        setIsLoadingHistory(false);
        return;
      }

      try {
        const result = await getChatHistory(sessionId, userId);
        const historyArray = result.history || [];
        
        if (Array.isArray(historyArray) && historyArray.length > 0) {
          const formattedHistory: Message[] = [];
          
          historyArray.forEach((msg: { message: string; response: string }, index: number) => {
            formattedHistory.push({
              id: `history-user-${index}`,
              role: "user",
              content: msg.message,
            });
            formattedHistory.push({
              id: `history-assistant-${index}`,
              role: "assistant",
              content: msg.response,
            });
          });
          
          setMessages(formattedHistory);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [userId, sessionId]);

  const handleSendMessage = async (content: string) => {
    if (!userId || !sessionId || !resumeId) {
      toast.error("Please analyze your resume first");
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userId, sessionId, content, resumeId);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.response || response.message || response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  // Empty state - no analysis
  if (!userId || !sessionId || !resumeId) {
    return (
      <DashboardLayout
        title="Career Assistant"
        description="AI-powered career guidance with full context of your resume"
      >
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50">
            <MessageSquare className="h-12 w-12 text-primary" />
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-bold">
            <span className="gradient-text">No Analysis Yet</span>
          </h2>
          <p className="mt-3 max-w-md text-center text-muted-foreground">
            Upload your resume to chat with your AI career assistant and get personalized guidance
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
      title="Career Assistant"
      description="Get personalized career advice based on your resume analysis"
    >
      <Card className="flex h-[calc(100vh-220px)] min-h-[500px] flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          disabled={isLoadingHistory}
        />
      </Card>
    </DashboardLayout>
  );
}
