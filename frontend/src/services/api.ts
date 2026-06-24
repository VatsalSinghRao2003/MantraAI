import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  model: string;
  totalDuration: number;
  loadDuration: number;
  promptEvalCount: number;
  evalCount: number;
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

export interface PerformanceStats {
  avgResponseTimeMs: number;
  minResponseTimeMs: number;
  maxResponseTimeMs: number;
  avgTokenCount: number;
  totalTokenCount: number;
  totalPrompts: number;
}

export interface ModelUsageStat {
  model: string;
  count: number;
  avgResponseTimeMs?: number;
}

export interface DailyVolume {
  date: string;
  count: number;
}

export interface ScoreDistribution {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}

// ─── Axios Instances ─────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const API = axios.create({
  baseURL: `${BASE}/api/prompts`,
  headers: { "Content-Type": "application/json" },
});

const ANALYTICS_API = axios.create({
  baseURL: `${BASE}/api/analytics`,
  headers: { "Content-Type": "application/json" },
});

// JWT Interceptors
const addAuthToken = (config: any) => {
  const token = localStorage.getItem("mantra_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axios.interceptors.request.use(addAuthToken);
API.interceptors.request.use(addAuthToken);
ANALYTICS_API.interceptors.request.use(addAuthToken);

// ─── Prompt Operations ───────────────────────────────────────────────────────

export const optimizePrompt = async (prompt: string): Promise<PromptResult> => {
  const r = await API.post("/optimize", { prompt });
  return r.data;
};

export const getFeedback = async (prompt: string): Promise<FeedbackResponse> => {
  const r = await API.post("/feedback", { prompt });
  return r.data;
};

export const comparePrompts = async (
  prompt1: string,
  prompt2: string
): Promise<CompareResponse> => {
  const r = await API.post("/compare", { prompt1, prompt2 });
  return r.data;
};

export const benchmarkPrompts = async (prompt1: string, prompt2: string) => {
  const r = await axios.post(`${BASE}/api/prompts/benchmark`, { prompt1, prompt2 });
  return r.data;
};

// ─── History ─────────────────────────────────────────────────────────────────

export const getHistory = async (): Promise<PromptHistory[]> => {
  const r = await API.get("/history");
  return r.data;
};

export const getLatestHistory = async (): Promise<PromptHistory[]> => {
  const r = await API.get("/history/latest");
  return r.data;
};

export const searchHistory = async (query: string) => {
  const r = await axios.get(`${BASE}/api/prompts/history/search?q=${encodeURIComponent(query)}`);
  return r.data;
};

export const deleteHistory = async (id: number) => {
  const r = await axios.delete(`${BASE}/api/prompts/history/${id}`);
  return r.data;
};

export const exportHistory = async (): Promise<Blob> => {
  const r = await API.get("/export", { responseType: "blob" });
  return r.data;
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const getStats = async (): Promise<StatsResponse> => {
  const r = await API.get("/stats");
  return r.data;
};

export const getCategories = async (): Promise<Record<string, number>> => {
  const r = await API.get("/categories");
  return r.data;
};

// ─── Templates ───────────────────────────────────────────────────────────────

export const getTemplates = async (): Promise<PromptTemplate[]> => {
  const r = await API.get("/templates");
  return r.data;
};

// ─── AI Health ───────────────────────────────────────────────────────────────

export const getAIHealth = async () => {
  const r = await axios.get(`${BASE}/api/health/ai`);
  return r.data;
};

// ─── Models ──────────────────────────────────────────────────────────────────

export const getModels = async () => {
  const r = await axios.get(`${BASE}/api/models`);
  return r.data;
};

// ─── Analytics (V3) ──────────────────────────────────────────────────────────

export const getPerformanceStats = async (): Promise<PerformanceStats> => {
  const r = await ANALYTICS_API.get("/performance");
  return r.data;
};

export const getModelUsageStats = async (): Promise<ModelUsageStat[]> => {
  const r = await ANALYTICS_API.get("/models");
  return r.data;
};

export const getDailyVolume = async (): Promise<DailyVolume[]> => {
  const r = await ANALYTICS_API.get("/volume");
  return r.data;
};

export const getScoreDistribution = async (): Promise<ScoreDistribution> => {
  const r = await ANALYTICS_API.get("/scores");
  return r.data;
};

// ─── V4 — Favorites & Tags ───────────────────────────────────────────────────

export const getFavorites = async (): Promise<PromptHistory[]> => {
  const r = await API.get("/favorites");
  return r.data;
};

export const toggleFavorite = async (id: number): Promise<{ id: number; favorite: boolean }> => {
  const r = await API.post(`/${id}/favorite`);
  return r.data;
};

export const getAllTags = async (): Promise<string[]> => {
  const r = await API.get("/tags");
  return r.data;
};

export const setPromptTags = async (id: number, tags: string): Promise<void> => {
  await API.post(`/${id}/tags`, { tags });
};

export const getByTag = async (tag: string): Promise<PromptHistory[]> => {
  const r = await API.get(`/by-tag?tag=${encodeURIComponent(tag)}`);
  return r.data;
};

// ─── V5 — Multi-Model ────────────────────────────────────────────────

export const compareModels = async (prompt: string, models: string[]) => {
  const r = await axios.post(`${BASE}/api/models/compare`, { prompt, models });
  return r.data;
};

// ─── V6 — JWT Authentication & User Accounts ──────────────────────────────

export const registerUser = async (username: string, password: string) => {
  const r = await axios.post(`${BASE}/api/auth/register`, { username, password });
  return r.data; // returns { token, username, role }
};

export const loginUser = async (username: string, password: string) => {
  const r = await axios.post(`${BASE}/api/auth/login`, { username, password });
  return r.data; // returns { token, username, role }
};

// ─── V4 / V7 — Collections ──────────────────────────────────────────────────

export interface PromptCollection {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  userId?: number;
  workspaceId?: number;
}

export const createCollection = async (name: string, description: string, workspaceId?: number): Promise<PromptCollection> => {
  const r = await axios.post(`${BASE}/api/collections`, { name, description, workspaceId });
  return r.data;
};

export const getCollections = async (workspaceId?: number): Promise<PromptCollection[]> => {
  const url = workspaceId ? `${BASE}/api/collections?workspaceId=${workspaceId}` : `${BASE}/api/collections`;
  const r = await axios.get(url);
  return r.data;
};

export const addPromptToCollection = async (collectionId: number, promptId: number): Promise<PromptCollection> => {
  const r = await axios.post(`${BASE}/api/collections/${collectionId}/prompts`, { promptId });
  return r.data;
};

export const getCollectionPrompts = async (collectionId: number): Promise<PromptHistory[]> => {
  const r = await axios.get(`${BASE}/api/collections/${collectionId}/prompts`);
  return r.data;
};

export const deleteCollection = async (collectionId: number): Promise<void> => {
  await axios.delete(`${BASE}/api/collections/${collectionId}`);
};

// ─── V7 — Workspaces ────────────────────────────────────────────────────────

export interface Workspace {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  ownerId?: number;
}

export const createWorkspace = async (name: string, description: string): Promise<Workspace> => {
  const r = await axios.post(`${BASE}/api/workspaces`, { name, description });
  return r.data;
};

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const r = await axios.get(`${BASE}/api/workspaces`);
  return r.data;
};

export const deleteWorkspace = async (id: number): Promise<void> => {
  await axios.delete(`${BASE}/api/workspaces/${id}`);
};

// ─── V7 — Prompt Library / Marketplace ──────────────────────────────────────

export interface PromptLibraryItem {
  id: number;
  name: string;
  description: string;
  promptText: string;
  category: string;
  isPublic: boolean;
  workspaceId?: number;
  authorId?: number;
  createdAt: string;
}

export const createLibraryPrompt = async (
  name: string,
  description: string,
  promptText: string,
  category: string,
  isPublic: boolean,
  workspaceId?: number
): Promise<PromptLibraryItem> => {
  const r = await axios.post(`${BASE}/api/library`, {
    name,
    description,
    promptText,
    category,
    isPublic,
    workspaceId,
  });
  return r.data;
};

export const getLibraryPrompts = async (workspaceId?: number): Promise<PromptLibraryItem[]> => {
  const url = workspaceId ? `${BASE}/api/library?workspaceId=${workspaceId}` : `${BASE}/api/library`;
  const r = await axios.get(url);
  return r.data;
};

export const getPublicLibraryPrompts = async (): Promise<PromptLibraryItem[]> => {
  const r = await axios.get(`${BASE}/api/library/public`);
  return r.data;
};

export const cloneLibraryPrompt = async (id: number, workspaceId?: number): Promise<PromptHistory> => {
  const url = workspaceId ? `${BASE}/api/library/${id}/clone?workspaceId=${workspaceId}` : `${BASE}/api/library/${id}/clone`;
  const r = await axios.post(url);
  return r.data;
};

// ─── V7 — Export PDF / DOCX ───────────────────────────────────────────────

export const downloadPdf = async (id: number, filename?: string) => {
  const r = await axios.get(`${BASE}/api/export/pdf/${id}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([r.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename || `prompt-export-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadDocx = async (id: number, filename?: string) => {
  const r = await axios.get(`${BASE}/api/export/docx/${id}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([r.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename || `prompt-export-${id}.docx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};