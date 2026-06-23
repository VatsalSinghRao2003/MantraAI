import { useEffect, useState } from "react";
import { BookTemplate, Search, Plus, Globe, Shield, RefreshCw, Check, Star } from "lucide-react";
import { getLibraryPrompts, getPublicLibraryPrompts, createLibraryPrompt, cloneLibraryPrompt, type PromptLibraryItem } from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";
import CategoryBadge from "../components/CategoryBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CopyButton from "../components/CopyButton";

export default function LibraryPage() {
  const [items, setItems] = useState<PromptLibraryItem[]>([]);
  const [tab, setTab] = useState<"public" | "workspace">("public");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  
  // Create state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("writing");
  const [isPublic, setIsPublic] = useState(false);
  const [cloningId, setCloningId] = useState<number | null>(null);
  const [clonedSuccess, setClonedSuccess] = useState<number | null>(null);

  const { activeWorkspace } = useWorkspace();

  useEffect(() => {
    loadData();
  }, [tab, activeWorkspace]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "public") {
        const data = await getPublicLibraryPrompts();
        setItems(data);
      } else {
        const data = await getLibraryPrompts(activeWorkspace?.id);
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !promptText.trim()) return;
    try {
      const created = await createLibraryPrompt(
        name,
        description,
        promptText,
        category,
        isPublic,
        activeWorkspace?.id || undefined
      );
      if ((isPublic && tab === "public") || (!isPublic && tab === "workspace")) {
        setItems((prev) => [created, ...prev]);
      }
      setName("");
      setDescription("");
      setPromptText("");
      setCategory("writing");
      setIsPublic(false);
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClonePrompt = async (id: number) => {
    setCloningId(id);
    try {
      await cloneLibraryPrompt(id, activeWorkspace?.id || undefined);
      setClonedSuccess(id);
      setTimeout(() => setClonedSuccess(null), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setCloningId(null);
    }
  };

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in text-slate-100">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="stat-icon cyan" style={{ width: 40, height: 40 }}>
            <BookTemplate size={18} />
          </div>
          <div>
            <h1 className="page-title mb-0">Prompt Library</h1>
            <p className="page-subtitle">Discover, clone, and manage pre-built expert prompt templates</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={16} />
          Add Template
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-xl border border-white/5 bg-[#0f121d] p-6 animate-slide-down">
          <h3 className="text-md mb-4 font-bold text-white">Create New Prompt Template</h3>
          <form onSubmit={handleCreatePrompt} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Template Name</label>
                <input
                  type="text"
                  className="input mt-1 w-full"
                  placeholder="e.g. SEO Content Writer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
                <select
                  className="input mt-1 w-full bg-[#141824]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="coding">Coding & Dev</option>
                  <option value="writing">Creative Writing</option>
                  <option value="marketing">Marketing & SEO</option>
                  <option value="analysis">Data Analysis</option>
                  <option value="general">General Utility</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
              <input
                type="text"
                className="input mt-1 w-full"
                placeholder="What this template is used for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Prompt Text</label>
              <textarea
                className="input textarea mt-1 w-full"
                style={{ minHeight: 120, fontFamily: "monospace" }}
                placeholder="Write the template text. Use placeholders like [topic] or [language]..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label htmlFor="isPublic" className="text-sm text-slate-300 select-none cursor-pointer">
                Publish to Community Marketplace (Public)
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Template</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setTab("public")}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold tracking-wide transition relative ${
              tab === "public" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe size={14} />
            Marketplace
          </button>
          <button
            onClick={() => setTab("workspace")}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold tracking-wide transition relative ${
              tab === "workspace" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-white"
            }`}
          >
            <Shield size={14} />
            Workspace Library
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            className="input w-full pl-9 pr-4 py-1 text-xs"
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading library..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No templates found"
          description="Create a custom template or explore public workspace templates."
          icon={BookTemplate}
          action={
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Add Template
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/5 bg-[#0f121d] p-5 hover:border-indigo-500/20 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <CategoryBadge category={item.category} />
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    {item.isPublic ? <Globe size={10} className="text-emerald-400" /> : <Shield size={10} className="text-indigo-400" />}
                    {item.isPublic ? "Marketplace" : "Private"}
                  </span>
                </div>
                <h3 className="text-md font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 min-h-[32px]">{item.description || "No description provided."}</p>
                
                <div className="bg-[#141824]/50 border border-white/5 rounded-lg p-3 text-xs text-slate-300 font-mono mb-4 max-h-32 overflow-y-auto whitespace-pre-wrap select-all">
                  {item.promptText}
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <div style={{ flex: 1 }}>
                  <CopyButton text={item.promptText} label="Copy" />
                </div>
                <button
                  onClick={() => handleClonePrompt(item.id)}
                  disabled={cloningId === item.id || clonedSuccess === item.id}
                  className={`btn w-full justify-center text-xs flex items-center gap-1.5 ${
                    clonedSuccess === item.id ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "btn-primary"
                  }`}
                >
                  {cloningId === item.id ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : clonedSuccess === item.id ? (
                    <>
                      <Check size={13} /> Cloned!
                    </>
                  ) : (
                    <>
                      <Star size={13} /> Add to Workspace
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
