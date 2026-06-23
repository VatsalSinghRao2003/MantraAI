import { useEffect, useState } from "react";
import { Star, Search, Trash2, ChevronLeft, ChevronRight, Download, X } from "lucide-react";

import {
  getHistory,
  searchHistory,
  deleteHistory,
  exportHistory,
  toggleFavorite as apiFavorite,
  setPromptTags,
  getCollections,
  addPromptToCollection,
  downloadPdf,
  downloadDocx,
  type PromptCollection,
} from "../services/api";
import ScoreBadge from "../components/ScoreBadge";
import CategoryBadge from "../components/CategoryBadge";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import CopyButton from "../components/CopyButton";

const PAGE_SIZE = 10;

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



export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [editingTags, setEditingTags] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [collections, setCollections] = useState<PromptCollection[]>([]);

  useEffect(() => {
    loadHistory();
    getCollections().then(setCollections).catch(console.error);
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!query.trim()) { loadHistory(); return; }
    setLoading(true);
    try {
      setHistory(await searchHistory(query));
      setPage(0);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteHistory(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
      if (expanded === id) setExpanded(null);
    } catch { /* silent */ }
    finally { setDeleting(null); }
  };

  const handleFavorite = async (id: number) => {
    try {
      const res = await apiFavorite(id);
      setHistory((prev) => prev.map((h) => h.id === id ? { ...h, favorite: res.favorite } : h));
    } catch { /* silent */ }
  };

  const handleAddToCollection = async (collectionId: number, promptId: number) => {
    try {
      await addPromptToCollection(collectionId, promptId);
      alert("Added prompt to collection successfully!");
    } catch {
      alert("Failed to add to collection.");
    }
  };

  const handleSaveTags = async (id: number) => {
    try {
      await setPromptTags(id, tagInput);
      setHistory((prev) => prev.map((h) => h.id === id ? { ...h, tags: tagInput } : h));
      setEditingTags(null);
    } catch { /* silent */ }
  };

  const handleExport = async () => {
    try {
      const blob = await exportHistory();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "prompt-history.csv";
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch { /* silent */ }
  };

  // Filtering
  const categories = [...new Set(history.map(h => h.category).filter(Boolean))];
  let filtered = history;
  if (filterFavorites) filtered = filtered.filter(h => h.favorite);
  if (filterCategory) filtered = filtered.filter(h => h.category === filterCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="stat-icon purple" style={{ width: 40, height: 40 }}>
              <Star size={18} />
            </div>
            <div>
              <h1 className="page-title" style={{ marginBottom: 0 }}>Prompt History</h1>
              <p className="page-subtitle">{history.length} prompts · {history.filter(h => h.favorite).length} favorites</p>
            </div>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleExport}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4" style={{ padding: "14px 16px" }}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {query && (
              <button style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer", color: "var(--text-muted)" }}
                onClick={() => { setQuery(""); loadHistory(); }}>
                <X size={12} />
              </button>
            )}
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>Search</button>

          {/* Category filter */}
          <select
            className="input"
            style={{ width: "auto", padding: "8px 36px 8px 12px", fontSize: 13 }}
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Favorites toggle */}
          <button
            className={`btn btn-sm ${filterFavorites ? "btn-primary" : "btn-secondary"}`}
            onClick={() => { setFilterFavorites(!filterFavorites); setPage(0); }}
          >
            <Star size={13} />
            {filterFavorites ? "Showing Favorites" : "Show Favorites"}
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading history..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Star} title="No prompts found" description="Optimize your first prompt to get started." />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 32 }}></th>
                  <th>Prompt</th>
                  <th>Tags</th>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item) => (
                  <>
                    <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                      {/* Favorite star */}
                      <td onClick={(e) => { e.stopPropagation(); handleFavorite(item.id); }}>
                        <Star
                          size={16}
                          fill={item.favorite ? "#f59e0b" : "none"}
                          stroke={item.favorite ? "#f59e0b" : "var(--text-muted)"}
                          style={{ cursor: "pointer", transition: "all 0.2s" }}
                        />
                      </td>
                      <td>
                        <div style={{ maxWidth: 360, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500, color: "var(--text-primary)" }}>
                          {item.originalPrompt}
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {editingTags === item.id ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input
                              className="input"
                              style={{ padding: "3px 8px", fontSize: 11, width: 140 }}
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              placeholder="java,spring"
                              autoFocus
                            />
                            <button className="btn btn-primary btn-sm" style={{ padding: "3px 8px", fontSize: 11 }} onClick={() => handleSaveTags(item.id)}>✓</button>
                            <button className="btn btn-secondary btn-sm" style={{ padding: "3px 8px", fontSize: 11 }} onClick={() => setEditingTags(null)}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {item.tags ? item.tags.split(",").map((t: string) => (
                              <span key={t} className="badge badge-info" style={{ fontSize: 10 }}>{t.trim()}</span>
                            )) : null}
                            <button
                              className="btn btn-sm"
                              style={{ padding: "1px 6px", fontSize: 10, background: "transparent", border: "1px dashed var(--border)", color: "var(--text-muted)" }}
                              onClick={() => { setEditingTags(item.id); setTagInput(item.tags || ""); }}
                            >+tag</button>
                          </div>
                        )}
                      </td>
                      <td><CategoryBadge category={item.category} /></td>
                      <td><ScoreBadge score={item.score} /></td>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{timeAgo(item.createdAt)}</td>
                      <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                        >
                          {deleting === item.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <Trash2 size={12} />}
                        </button>
                      </td>
                    </tr>

                    {expanded === item.id && (
                      <tr key={`exp-${item.id}`}>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <div className="animate-slide-up" style={{ padding: "16px 20px", background: "rgba(99,102,241,0.04)", borderTop: "1px solid var(--border)" }}>
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
                                {item.model && (
                                  <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>
                                    Model: <span className="badge badge-model" style={{ fontSize: 10 }}>{item.model}</span>
                                    {item.totalDuration && <span style={{ marginLeft: 8 }}>· {Math.round(item.totalDuration / 1e6)}ms</span>}
                                    {item.evalCount && <span style={{ marginLeft: 8 }}>· {item.evalCount} tokens</span>}
                                  </div>
                                )}

                                {/* V7 Actions (Export PDF/DOCX & Add to Collection) */}
                                <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                  <button onClick={() => downloadPdf(item.id)} className="btn btn-secondary btn-sm" style={{ fontSize: 11, padding: "4px 8px" }}>
                                    Export PDF
                                  </button>
                                  <button onClick={() => downloadDocx(item.id)} className="btn btn-secondary btn-sm" style={{ fontSize: 11, padding: "4px 8px" }}>
                                    Export Word (DOCX)
                                  </button>

                                  {collections.length > 0 && (
                                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Add to Collection:</span>
                                      <select
                                        defaultValue=""
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            handleAddToCollection(Number(e.target.value), item.id);
                                            e.target.value = "";
                                          }
                                        }}
                                        style={{ background: "#1f2937", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 6px", fontSize: 11, color: "var(--text-primary)" }}
                                      >
                                        <option value="" disabled>Select...</option>
                                        {collections.map((col) => (
                                          <option key={col.id} value={col.id}>{col.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4" style={{ fontSize: 13, color: "var(--text-muted)" }}>
              <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="flex items-center gap-2">
                <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                  <ChevronLeft size={14} />
                </button>
                <span style={{ padding: "0 8px" }}>{page + 1} / {totalPages}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}