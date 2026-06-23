import { useEffect, useState } from "react";
import { getTemplates } from "../services/api";
import { BookTemplate, Search, Wand2 } from "lucide-react";
import CategoryBadge from "../components/CategoryBadge";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import CopyButton from "../components/CopyButton";
import { useNavigate } from "react-router-dom";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = templates.filter(
    (t) =>
      t.category?.toLowerCase().includes(query.toLowerCase()) ||
      t.template?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="stat-icon purple" style={{ width: 40, height: 40 }}>
              <BookTemplate size={18} />
            </div>
            <div>
              <h1 className="page-title" style={{ marginBottom: 0 }}>Prompt Templates</h1>
              <p className="page-subtitle">
                {templates.length} proven templates to get you started fast
              </p>
            </div>
          </div>
        </div>
        <div className="search-bar" style={{ width: 260 }}>
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading templates..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookTemplate}
          title="No templates found"
          description={query ? "Try a different search term." : "No templates available."}
        />
      ) : (
        <div className="grid-3" style={{ gap: 16 }}>
          {filtered.map((template, i) => (
            <div key={i} className="template-card animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <CategoryBadge category={template.category} />
                <div className="flex items-center gap-2">
                  <CopyButton text={template.template} />
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  marginBottom: 16,
                }}
              >
                {template.template}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-primary btn-sm w-full"
                  style={{ justifyContent: "center" }}
                  onClick={() => {
                    // Store template in sessionStorage to pass to optimize page
                    sessionStorage.setItem("templatePrompt", template.template);
                    navigate("/optimize");
                  }}
                >
                  <Wand2 size={13} />
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
