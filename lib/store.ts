import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AnalysisResult {
  user_id: string;
  analysis_id: number;
  resume_id: number;
  session_id: string;
  role: string;
  ats_score: number;
  match_score: number;
  user_skills: string[];
  skill_gaps: string[];
  recommendations: string[];
  created_at?: string;
}

interface CareerStore {
  // User identification
  userId: string | null;
  sessionId: string | null;
  analysisId: number | null;
  resumeId: number | null;

  // Analysis data
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  roadmap: any[];

  // Actions
  setUserId: (id: string) => void;
  setSessionId: (id: string) => void;
  setAnalysisId: (id: number) => void;
  setResumeId: (id: number) => void;
  setCurrentAnalysis: (analysis: AnalysisResult) => void;
  setAnalysisHistory: (history: AnalysisResult[]) => void;
  setRoadmap: (roadmap: any[]) => void;
  clearStore: () => void;
}

export const useCareerStore = create<CareerStore>()(
  persist(
    (set) => ({
      userId: null,
      sessionId: null,
      analysisId: null,
      resumeId: null,
      currentAnalysis: null,
      analysisHistory: [],
      roadmap: [],

      setUserId: (id) => set({ userId: id }),
      setSessionId: (id) => set({ sessionId: id }),
      setAnalysisId: (id) => set({ analysisId: id }),
      setResumeId: (id) => set({ resumeId: id }),
      setCurrentAnalysis: (analysis) =>
        set({
          currentAnalysis: analysis,
          userId: analysis.user_id,
          sessionId: analysis.session_id,
          analysisId: analysis.analysis_id,
          resumeId: analysis.resume_id,
        }),
      setAnalysisHistory: (history) => set({ analysisHistory: history }),
      setRoadmap: (roadmap) => set({ roadmap }),
      clearStore: () =>
        set({
          userId: null,
          sessionId: null,
          analysisId: null,
          resumeId: null,
          currentAnalysis: null,
          analysisHistory: [],
          roadmap: [],
        }),
    }),
    {
      name: "careerstack-storage",
    }
  )
);
