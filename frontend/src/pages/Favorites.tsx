import { useEffect, useState } from "react";
import { Star, Wand2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getFavorites, toggleFavorite } from "../services/api";
import ScoreBadge from "../components/ScoreBadge";
import CategoryBadge from "../components/CategoryBadge";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import CopyButton from "../components/CopyButton";

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnfavorite = async (id: number) => {
    try {
      await toggleFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch {
      console.error("Failed to unfavorite");
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="stat-icon amber" style={{ width: 40, height: 40 }}>
              <Star size={18} />
            </div>
            <div>
              <h1 className="page-title" style={{ marginBottom: 0 }}>Favorites</h1>
              <p className="page-subtitle">{favorites.length} saved prompt{favorites.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
        <Link to="/history" className="btn btn-secondary">
          View All History <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading favorites..." />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          description="Star any prompt in your history to save it here."
          action={
            <Link to="/history" className="btn btn-primary">
              <Wand2 size={14} /> View History
            </Link>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {favorites.map((item) => (
            <div key={item.id}>
              <div
                className="card"
                style={{
                  cursor: "pointer",
                  borderColor: expanded === item.id ? "rgba(99,102,241,0.4)" : undefined,
                  background: expanded === item.id ? "rgba(99,102,241,0.04)" : undefined,
                }}
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.originalPrompt}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <ScoreBadge score={item.score} />
                      <CategoryBadge category={item.category} />
                      {item.tags && item.tags.split(",").map((t: string) => (
                        <span key={t} className="badge badge-info" style={{ fontSize: 10 }}>{t.trim()}</span>
                      ))}
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{timeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <CopyButton text={item.optimizedPrompt} label="Copy Optimized" />
                    <button
                      className="btn btn-sm"
                      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b" }}
                      onClick={() => handleUnfavorite(item.id)}
                      title="Remove from favorites"
                    >
                      <Star size={13} fill="#f59e0b" />
                    </button>
                  </div>
                </div>

                {expanded === item.id && (
                  <div className="animate-slide-up" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    <div className="grid-2" style={{ gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Original</div>
                        <div className="prompt-text" style={{ fontSize: 12, opacity: 0.8 }}>{item.originalPrompt}</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Optimized</span>
                          <CopyButton text={item.optimizedPrompt} />
                        </div>
                        <div className="prompt-text" style={{ fontSize: 12 }}>{item.optimizedPrompt}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
