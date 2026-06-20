import axios from "axios";

export interface PromptResult {
  originalPrompt: string;
  optimizedPrompt: string;
  score: number;
  category: string;
  strengths: string[];
  missingElements: string[];
}

export interface StatsResponse {
  totalPrompts: number;
  averageScore: number;
}

export interface PromptHistory {
  id: number;
  originalPrompt: string;
  optimizedPrompt: string;
  score: number;
  category: string;
  createdAt: string;
}

export interface PromptTemplate {
  category: string;
  template: string;
}

export interface CompareResponse {
  score1: number;
  score2: number;
  winner: string;
}

export interface FeedbackResponse {
  feedback: string;
}

const API = axios.create({
  baseURL: "http://localhost:8080/api/prompts",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optimize Prompt
export const optimizePrompt = async (
  prompt: string
): Promise<PromptResult> => {
  const response = await API.post("/optimize", {
    prompt,
  });

  return response.data;
};

// History
export const getHistory = async (): Promise<PromptHistory[]> => {
  const response = await API.get("/history");
  return response.data;
};

export const getLatestHistory = async (): Promise<PromptHistory[]> => {
  const response = await API.get("/history/latest");
  return response.data;
};

export const searchHistory = async (
  query: string
) => {
  const response = await axios.get(
    `http://localhost:8080/api/prompts/history/search?q=${query}`
  );

  return response.data;
};

export const deleteHistory = async (
  id: number
) => {
  const response = await axios.delete(
    `http://localhost:8080/api/prompts/history/${id}`
  );

  return response.data;
};

export const exportHistory = async (): Promise<Blob> => {
  const response = await API.get("/export", {
    responseType: "blob",
  });

  return response.data;
};

// Analytics
export const getStats = async (): Promise<StatsResponse> => {
  const response = await API.get("/stats");
  return response.data;
};

export const getCategories = async (): Promise<Record<string, number>> => {
  const response = await API.get("/categories");
  return response.data;
};

// Templates
export const getTemplates = async (): Promise<PromptTemplate[]> => {
  const response = await API.get("/templates");
  return response.data;
};

// Compare
export const comparePrompts = async (
  prompt1: string,
  prompt2: string
): Promise<CompareResponse> => {
  const response = await API.post("/compare", {
    prompt1,
    prompt2,
  });

  return response.data;
};

// Benchmark
export const benchmarkPrompts = async (
  prompt1: string,
  prompt2: string
) => {
  const response = await axios.post(
    "http://localhost:8080/api/prompts/benchmark",
    {
      prompt1,
      prompt2,
    }
  );

  return response.data;
};

// AI Feedback
export const getFeedback = async (
  prompt: string
): Promise<FeedbackResponse> => {
  const response = await API.post("/feedback", {
    prompt,
  });

  return response.data;
};

// AI Health
export const getAIHealth = async () => {
  const response = await axios.get(
    "http://localhost:8080/api/health/ai"
  );

  return response.data;
};

// Models
export const getModels = async () => {
  const response = await axios.get(
    "http://localhost:8080/api/models"
  );

  return response.data;
};