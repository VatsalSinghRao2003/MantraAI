import { useState } from "react";
import { Layers, Plus, Trash2, Shield, Calendar, RefreshCw } from "lucide-react";
import { createWorkspace, deleteWorkspace } from "../services/api";
import { useWorkspace } from "../context/WorkspaceContext";
import EmptyState from "../components/EmptyState";

export default function WorkspacePage() {
  const { workspaces, activeWorkspace, setActiveWorkspace, loadWorkspaces } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createWorkspace(name, description);
      setName("");
      setDescription("");
      setShowAddForm(false);
      await loadWorkspaces();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (workspaces.length <= 1) {
      alert("You must keep at least one workspace active.");
      return;
    }
    if (!confirm("Are you sure you want to delete this workspace? All links to this workspace will be deleted.")) return;
    try {
      await deleteWorkspace(id);
      if (activeWorkspace?.id === id) {
        setActiveWorkspace(workspaces.find((w) => w.id !== id) || null);
      }
      await loadWorkspaces();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in text-slate-100">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="stat-icon indigo" style={{ width: 40, height: 40 }}>
            <Layers size={18} />
          </div>
          <div>
            <h1 className="page-title mb-0">Workspaces</h1>
            <p className="page-subtitle">Collaborate in shared workspace sandboxes and partition metrics</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={16} />
          New Workspace
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-xl border border-white/5 bg-[#0f121d] p-6 animate-slide-down">
          <h3 className="text-md mb-4 font-bold text-white">Create New Workspace</h3>
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace Name</label>
              <input
                type="text"
                className="input mt-1 w-full"
                placeholder="e.g. Engineering, Content Team, Personal Sand"
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
                placeholder="Describe the partition boundary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <RefreshCw className="animate-spin" size={14} /> : "Create Workspace"}
              </button>
            </div>
          </form>
        </div>
      )}

      {workspaces.length === 0 ? (
        <EmptyState
          title="No workspaces"
          description="Get started by creating a workspace to isolate prompts, templates, and teams."
          icon={Layers}
          action={
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Create Workspace
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workspaces.map((w) => {
            const isActive = activeWorkspace?.id === w.id;
            return (
              <div
                key={w.id}
                onClick={() => setActiveWorkspace(w)}
                className={`rounded-xl border p-6 cursor-pointer transition flex flex-col justify-between ${
                  isActive ? "bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-600/5" : "bg-[#0f121d] border-white/5 hover:border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
                      <Shield size={10} /> Workspace
                    </span>
                    {isActive && (
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-md font-bold text-white mb-1">{w.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">{w.description || "No description provided."}</p>
                </div>

                <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(w.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleDeleteWorkspace(w.id, e)}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                      title="Delete Workspace"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
