import { useState } from "react";

import Hero from "../components/Hero";
import PromptCard from "../components/PromptCard";
import HistorySidebar from "../components/HistorySidebar";
import OutputCard from "../components/OutputCard";

import { optimizePrompt } from "../services/api";
import { usePromptHistory } from "../hooks/usePromptHistory";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { history, addPrompt } =
    usePromptHistory();

  const handleOptimize = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    try {
      const data =
        await optimizePrompt(prompt);

      setResult(data);

      addPrompt(prompt);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Hero />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PromptCard
            prompt={prompt}
            setPrompt={setPrompt}
            onOptimize={handleOptimize}
            isLoading={isLoading}
          />

          <OutputCard
            result={result}
          />
        </div>

        <HistorySidebar
          history={history}
        />
      </div>
    </div>
  );
}

export default Home;
