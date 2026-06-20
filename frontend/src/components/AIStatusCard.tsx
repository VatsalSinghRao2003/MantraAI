import { useEffect, useState } from "react";
import { getAIHealth } from "../services/api";

export default function AIStatusCard() {

  const [health, setHealth] =
    useState<any>(null);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {

    const data =
      await getAIHealth();

    setHealth(data);
  };

  if (!health) {
    return <p>Loading AI...</p>;
  }

  return (
    <div
      style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      <h2>
        {health.status === "UP"
          ? "🟢 AI Connected"
          : "🔴 AI Offline"}
      </h2>

      <p>
        Provider: {health.provider}
      </p>

      <p>
        Model: {health.model}
      </p>

      <p>
        Status: {health.status}
      </p>
    </div>
  );
}
