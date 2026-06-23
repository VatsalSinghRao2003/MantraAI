import { useEffect, useState } from "react";
import { getAIHealth } from "../services/api";
import { Activity, Server, Cpu, Wifi, WifiOff } from "lucide-react";

export default function AIStatusCard() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getAIHealth();
        setHealth(data);
      } catch {
        setHealth({ status: "DOWN", provider: "Ollama", model: "unknown" });
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = health?.status === "UP";

  return (
    <div className="card animate-fade-in" style={{ marginBottom: "16px" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="stat-icon"
            style={{
              width: 48,
              height: 48,
              background: isOnline
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
              color: isOnline ? "#10b981" : "#ef4444",
            }}
          >
            {isOnline ? <Activity size={22} /> : <WifiOff size={22} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              {loading ? (
                <div
                  className="skeleton"
                  style={{ width: 60, height: 8 }}
                />
              ) : (
                <div
                  className={`status-dot ${loading ? "loading" : isOnline ? "online" : "offline"}`}
                />
              )}
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: isOnline ? "#10b981" : "var(--text-muted)",
                }}
              >
                {loading ? "Checking..." : isOnline ? "AI Connected" : "AI Offline"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {health && (
                <>
                  <span className="badge badge-model">
                    <Cpu size={10} />
                    {health.model}
                  </span>
                  <span className="badge badge-category">
                    <Server size={10} />
                    {health.provider}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "right",
          }}
        >
          <div>Auto-refresh: 30s</div>
          <div className="flex items-center gap-1 mt-2" style={{ justifyContent: "flex-end" }}>
            <Wifi size={12} />
            <span>Ollama via ngrok</span>
          </div>
        </div>
      </div>
    </div>
  );
}