import { useEffect, useState } from "react";
import { getLatestHistory } from "../services/api";

export default function RecentActivity() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getLatestHistory();
    setHistory(data);
  };

  return (
    <div>
      <h2>Recent Activity</h2>

      {history.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#1f2937",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <p>{item.originalPrompt}</p>
          <p>Score: {item.score}</p>
        </div>
      ))}
    </div>
  );
}
