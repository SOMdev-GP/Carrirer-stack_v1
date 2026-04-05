import axios from "axios";

let defaultApiUrl = "http://localhost:8000";
if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
  // Automatically route backend traffic to the same local IP you are accessing from (e.g. 172.31.x.x)
  defaultApiUrl = `http://${window.location.hostname}:8000`;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Analysis API
export const analyzeResume = async (file: File, role: string, userId?: string | null) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("role", role);
  if (userId) {
    formData.append("user_id", userId);
  }

  const res = await api.post("/analyze-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Dashboard API
export const getDashboardHistory = async (userId: string) => {
  const res = await api.get(`/dashboard/${userId}`);
  return res.data;
};

// Job Market API
export const getJobMarket = async (role: string, location: string = "India") => {
  const res = await api.get("/job-market", {
    params: { role, location },
  });
  return res.data;
};

// Role Match API
export const getRoleMatch = async (userSkills: string[], userId: string) => {
  const res = await api.post("/role-match", {
    user_skills: userSkills,
    user_id: userId,
  });
  return res.data;
};

// Roadmap API
export const generateRoadmap = async (analysisId: number, userId: string) => {
  const res = await api.post("/generate-roadmap", {
    analysis_id: analysisId,
    user_id: userId,
  });
  return res.data;
};

// Chat API
export const sendChatMessage = async (
  userId: string,
  sessionId: string,
  message: string,
  resumeId: number
) => {
  const res = await api.post("/career-chat", {
    user_id: userId,
    session_id: sessionId,
    message,
    resume_id: resumeId,
  });
  return res.data;
};

// Chat History API
export const getChatHistory = async (sessionId: string, userId: string) => {
  const res = await api.get(`/chat-history/${sessionId}`, {
    params: { user_id: userId },
  });
  return res.data;
};

export default api;
