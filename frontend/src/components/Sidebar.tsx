import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { useTheme } from "../context/ThemeContext";
import logoImg from "../assets/logo.png";
import {
  LayoutDashboard,
  Wand2,
  History,
  BarChart3,
  GitCompare,
  Trophy,
  BookTemplate,
  MessageSquare,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Star,
  Layers,
  FolderHeart,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/models", icon: Cpu, label: "Models" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { to: "/optimize", icon: Wand2, label: "Optimize" },
      { to: "/multi-model", icon: Layers, label: "Multi-Model" },
      { to: "/feedback", icon: MessageSquare, label: "Feedback" },
      { to: "/compare", icon: GitCompare, label: "Compare" },
      { to: "/benchmark", icon: Trophy, label: "Benchmark" },
    ],
  },
  {
    label: "Workspace & Data",
    items: [
      { to: "/collections", icon: FolderHeart, label: "Collections" },
      { to: "/library", icon: BookTemplate, label: "Library" },
      { to: "/workspaces", icon: Layers, label: "Workspaces" },
      { to: "/history", icon: History, label: "History" },
      { to: "/favorites", icon: Star, label: "Favorites" },
      { to: "/analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspace();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src={logoImg} alt="Mantra AI Logo" style={{ width: 44, height: 44, borderRadius: 8 }} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="brand-name">Mantra AI</span>
            <span className="brand-tagline">Prompt Intelligence</span>
          </div>
        )}
      </div>

      {/* Workspace Switcher */}
      {!collapsed && workspaces.length > 0 && (
        <div className="px-4 py-2.5 mb-4 bg-slate-800/10 border border-white/5 rounded-xl mx-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Active Space</div>
          <select
            value={activeWorkspace?.id || ""}
            onChange={(e) => {
              const found = workspaces.find((w) => w.id === Number(e.target.value));
              if (found) setActiveWorkspace(found);
            }}
            className="w-full bg-[#0d1117] border border-white/10 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none cursor-pointer focus:border-indigo-500 transition"
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: "8px" }}>
            {!collapsed && (
              <div className="sidebar-section-label">{section.label}</div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`sidebar-item${isActive ? " active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="sidebar-item-icon" size={18} />
                  {!collapsed && (
                    <span className="sidebar-item-text">{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Session Profile widget & Toggle */}
      <div className="sidebar-footer" style={{ borderTop: "1px solid var(--border)", padding: "16px 12px" }}>
        {!collapsed && user ? (
          <div className="card-sm mb-3" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0" style={{ background: "var(--brand-gradient)" }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="truncate flex-1">
                <div className="font-bold text-sm truncate" style={{ color: "var(--text-primary)" }}>{user.username}</div>
                <div className="text-[11px] font-semibold capitalize tracking-wide mt-0.5" style={{ color: "var(--brand-primary)" }}>{user.role}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={toggleTheme} 
                className="btn btn-secondary"
                style={{ flex: 1, padding: "8px", fontSize: "12px", justifyContent: "center" }}
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              <button 
                onClick={logout} 
                className="btn btn-danger"
                style={{ flex: 1, padding: "8px", fontSize: "12px", justifyContent: "center" }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        ) : collapsed && (
          <div className="flex flex-col gap-2 mb-2">
            <button
              onClick={toggleTheme}
              className="sidebar-toggle justify-center"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {user && (
              <button
                onClick={logout}
                className="sidebar-toggle justify-center text-red-500 hover:text-red-400"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        )}

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
