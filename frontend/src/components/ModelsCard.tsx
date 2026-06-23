import { useEffect, useState } from "react";
import { getModels } from "../services/api";
import { Cpu, HardDrive, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function formatSize(bytes: number) {
  if (!bytes) return "—";
  const gb = bytes / 1e9;
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1e6).toFixed(0)} MB`;
}

export default function ModelsCard() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels()
      .then(setModels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="section-title" style={{ marginBottom: 0, flex: 1 }}>
          <Cpu size={16} />
          Installed Models
        </div>
        <Link
          to="/models"
          className="btn btn-sm btn-secondary"
          style={{ gap: 4, fontSize: 12 }}
        >
          View All <ChevronRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />
          ))}
        </div>
      ) : models.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: 13 }}>
          No models available from AI provider.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "360px", overflowY: "auto", paddingRight: 4 }}>
          {models.map((model, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(99,102,241,0.12)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818cf8",
                  flexShrink: 0,
                }}
              >
                <Cpu size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {model.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 10, marginTop: 2 }}>
                  {model.size != null && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <HardDrive size={10} /> {formatSize(model.size)}
                    </span>
                  )}
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: 10 }}>Ready</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
