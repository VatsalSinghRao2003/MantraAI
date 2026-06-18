import axios from "axios";

export type PromptResult = {
originalPrompt: string;
optimizedPrompt: string;
score: number;
category: string;
};

const API = axios.create({
baseURL: "http://localhost:8080",
});

export const optimizePrompt = async (
prompt: string
): Promise<PromptResult> => {
const response = await API.post("/api/prompts/optimize", {
prompt,
});

return response.data;
};
