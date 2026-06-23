import { useEffect, useState } from "react";
import { getLatestHistory } from "../services/api";
import { Clock, ChevronRight, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import ScoreBadge from "./ScoreBadge";
import CategoryBadge from "./CategoryBadge";

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

export default function RecentActivity() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestHistory()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="section-title" style={{ marginBottom: 0, flex: 1 }}>
          <Clock size={16} />
          Recent Activity
        </div>
        <Link
          to="/history"
          className="btn btn-sm btn-secondary"
          style={{ gap: 4, fontSize: 12 }}
        >
          View All <ChevronRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 44 }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 16px",
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          <Wand2 size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
          <div>No prompts optimized yet.</div>
          <Link to="/optimize" className="btn btn-sm btn-primary" style={{ marginTop: 12 }}>
            Optimize a Prompt
          </Link>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className="activity-item">
              <div className="activity-dot" />
              <div className="activity-content">
                <div className="activity-prompt">{item.originalPrompt}</div>
                <div className="activity-meta">
                  <ScoreBadge score={item.score} size="sm" />
                  <CategoryBadge category={item.category} />
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
