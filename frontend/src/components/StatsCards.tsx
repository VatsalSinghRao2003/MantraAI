import { useEffect, useState } from "react";
import { getStats } from "../services/api";

export default function StatsCards() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>Total Prompts</h3>
        <h1>{stats.totalPrompts}</h1>
      </div>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>Average Score</h3>
        <h1>{stats.averageScore}</h1>
      </div>
    </div>
  );
}
