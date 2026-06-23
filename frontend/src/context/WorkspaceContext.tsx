import React, { createContext, useContext, useState, useEffect } from "react";
import { getWorkspaces, type Workspace } from "../services/api";
import { useAuth } from "./AuthContext";

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (w: Workspace | null) => void;
  loadWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadWorkspaces();
    } else {
      setWorkspaces([]);
      setActiveWorkspaceState(null);
    }
  }, [isAuthenticated]);

  const loadWorkspaces = async () => {
    try {
      const list = await getWorkspaces();
      setWorkspaces(list);
      
      const savedId = localStorage.getItem("mantra_active_workspace_id");
      if (savedId) {
        const found = list.find((w) => w.id === Number(savedId));
        if (found) {
          setActiveWorkspaceState(found);
          return;
        }
      }
      
      if (list.length > 0) {
        setActiveWorkspaceState(list[0]);
      } else {
        setActiveWorkspaceState(null);
      }
    } catch {
      setWorkspaces([]);
      setActiveWorkspaceState(null);
    }
  };

  const setActiveWorkspace = (w: Workspace | null) => {
    if (w) {
      localStorage.setItem("mantra_active_workspace_id", String(w.id));
    } else {
      localStorage.removeItem("mantra_active_workspace_id");
    }
    setActiveWorkspaceState(w);
  };

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, setActiveWorkspace, loadWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
