import { useState } from "react";
import PromptInput from "../components/PromptInput";
import PromptOutput from "../components/PromptOutput";
import { optimizePrompt, type PromptResult } from "../services/api";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<PromptResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async () => {
    if (!prompt.trim() || isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const data = await optimizePrompt(prompt);
      setResult(data);
    } catch {
      setError("Unable to optimize the prompt. Make sure the API is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Mantra</h1>

      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        onOptimize={handleOptimize}
        isLoading={isLoading}
      />

      {error && (
        <p style={{ color: "#dc2626", marginTop: "16px", textAlign: "left" }}>
          {error}
        </p>
      )}

      <PromptOutput result={result} />
    </div>
  );
}

export default Home;
