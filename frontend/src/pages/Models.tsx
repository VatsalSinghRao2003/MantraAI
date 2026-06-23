import { useEffect, useState } from "react";
import { getModels } from "../services/api";
import { Cpu, HardDrive, Calendar, Search } from "lucide-react";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

function formatSize(bytes: number) {
  if (!bytes) return "Unknown";
  const gb = bytes / 1e9;
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1e6).toFixed(0)} MB`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getModels()
      .then(setModels)
      .catch(() => setError("Failed to fetch models from AI provider."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = models.filter((m) =>
    m.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="stat-icon cyan" style={{ width: 40, height: 40 }}>
              <Cpu size={18} />
            </div>
            <div>
              <h1 className="page-title" style={{ marginBottom: 0 }}>
                Available Models
              </h1>
              <p className="page-subtitle">{models.length} model{models.length !== 1 ? "s" : ""} connected via AI Provider</p>
            </div>
          </div>
        </div>
        <div className="search-bar" style={{ width: 260 }}>
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Filter models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "var(--radius-md)",
            color: "#ef4444",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Models Grid */}
      {loading ? (
        <LoadingSpinner text="Loading models..." size="lg" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No models found"
          description={
            models.length === 0
              ? "No models available from AI provider."
              : "No models match your search."
          }
        />
      ) : (
        <div className="grid-3" style={{ gap: 16 }}>
          {filtered.map((model, i) => (
            <div key={i} className="model-card animate-scale-in" style={{ paddingBottom: "16px" }}>
              {/* Model Header */}
              <div className="flex items-center gap-12" style={{ gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                    flexShrink: 0,
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <Cpu size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {model.name}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: 10, marginTop: 4 }}>
                    Ready
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}