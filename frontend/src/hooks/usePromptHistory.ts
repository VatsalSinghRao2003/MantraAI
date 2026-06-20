import { useEffect, useState } from "react";

export function usePromptHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("mantra-history");

    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const addPrompt = (prompt: string) => {
    const updated = [prompt, ...history.slice(0, 9)];

    setHistory(updated);

    localStorage.setItem(
      "mantra-history",
      JSON.stringify(updated)
    );
  };

  return {
    history,
    addPrompt,
  };
}
