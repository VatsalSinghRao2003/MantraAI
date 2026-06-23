import { useEffect, useState } from "react";
import { FolderHeart, Plus, Trash2, Folder, Calendar, BookOpen } from "lucide-react";
import { getCollections, createCollection, deleteCollection, getCollectionPrompts, type PromptCollection, type PromptHistory } from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";
import ScoreBadge from "../components/ScoreBadge";
import CategoryBadge from "../components/CategoryBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CopyButton from "../components/CopyButton";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<PromptCollection[]>([]);
  const [activeColId, setActiveColId] = useState<number | null>(null);
  const [prompts, setPrompts] = useState<PromptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  
  // Create Modal / Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { activeWorkspace } = useWorkspace();

  useEffect(() => {
    loadData();
  }, [activeWorkspace]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCollections(activeWorkspace?.id);
      setCollections(data);
      if (data.length > 0) {
        handleSelectCollection(data[0].id);
      } else {
        setActiveColId(null);
        setPrompts([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCollection = async (id: number) => {
    setActiveColId(id);
    setLoadingPrompts(true);
    try {
      const data = await getCollectionPrompts(id);
      setPrompts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrompts(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const created = await createCollection(name, description, activeWorkspace?.id || undefined);
      setCollections((prev) => [...prev, created]);
      setName("");
      setDescription("");
      setShowAddForm(false);
      handleSelectCollection(created.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCollection = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this collection? Prompts inside won't be deleted.")) return;
    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
      if (activeColId === id) {
        setActiveColId(null);
        setPrompts([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeCol = collections.find((c) => c.id === activeColId);

  return (
    <div className="page-wrapper animate-fade-in text-slate-100">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="stat-icon purple" style={{ width: 40, height: 40 }}>
            <FolderHeart size={18} />
          </div>
          <div>
            <h1 className="page-title mb-0">Collections</h1>
            <p className="page-subtitle">Group, organize and manage your prompt bundles</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={16} />
          New Collection
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-xl border border-white/5 bg-[#0f121d] p-6 animate-slide-down">
          <h3 className="text-md mb-4 font-bold text-white">Create New Collection</h3>
          <form onSubmit={handleCreateCollection} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Collection Name</label>
              <input
                type="text"
                className="input mt-1 w-full"
                placeholder="e.g. Chatbots, Code Generation, Marketing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
              <textarea
                className="input textarea mt-1 w-full"
                style={{ minHeight: 80 }}
                placeholder="Brief details about what prompts go in here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Collection</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading collections..." />
      ) : collections.length === 0 ? (
        <EmptyState
          title="No collections found"
          description="Create a prompt collection to organize your history and optimize workflow."
          icon={FolderHeart}
          action={
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Create Collection
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Collections Selector */}
          <div className="md:col-span-1 space-y-2 border-r border-white/5 pr-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">My Playlists</span>
            {collections.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectCollection(c.id)}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition ${
                  activeColId === c.id ? "bg-indigo-600/15 border border-indigo-500/20 text-indigo-300" : "bg-[#0f121d] hover:bg-[#141824] text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Folder size={16} className={activeColId === c.id ? "text-indigo-400" : "text-slate-500"} />
                  <div className="truncate">
                    <div className="text-sm font-semibold truncate">{c.name}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteCollection(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition p-1 text-slate-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Collection Detail & Prompts */}
          <div className="md:col-span-3 space-y-4">
            {activeCol && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FolderHeart className="text-indigo-400" size={20} />
                  {activeCol.name}
                </h2>
                {activeCol.description && <p className="text-sm text-slate-400 mt-1">{activeCol.description}</p>}
                <div className="flex gap-4 items-center text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><Calendar size={12} /> Created: {new Date(activeCol.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} /> {prompts.length} prompts</span>
                </div>
              </div>
            )}

            {loadingPrompts ? (
              <LoadingSpinner text="Loading prompts in collection..." />
            ) : prompts.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-[#0f121d] p-8 text-center text-slate-500 text-sm">
                No prompts in this collection yet. Add prompts from the History page.
              </div>
            ) : (
              <div className="space-y-4">
                {prompts.map((p) => (
                  <div key={p.id} className="rounded-xl border border-white/5 bg-[#0f121d] p-5 hover:border-white/10 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={p.category} />
                        <span className="text-xs text-slate-500">via {p.model || "llama"}</span>
                      </div>
                      <ScoreBadge score={p.score} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Original</div>
                        <div className="bg-[#141824] rounded-lg p-3 text-xs text-slate-300 max-h-24 overflow-y-auto font-mono whitespace-pre-wrap">{p.originalPrompt}</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Optimized</span>
                          <CopyButton text={p.optimizedPrompt} />
                        </div>
                        <div className="bg-[#141824]/50 border border-white/5 rounded-lg p-3 text-xs text-slate-100 max-h-24 overflow-y-auto font-mono whitespace-pre-wrap">{p.optimizedPrompt}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
