import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import OptimizePage from "./pages/Optimize";
import HistoryPage from "./pages/History";
import AnalyticsPage from "./pages/Analytics";
import ComparePage from "./pages/Compare";
import BenchmarkPage from "./pages/Benchmark";
import TemplatesPage from "./pages/Templates";
import FeedbackPage from "./pages/Feedback";
import ModelsPage from "./pages/Models";
import FavoritesPage from "./pages/Favorites";
import MultiModelPage from "./pages/MultiModel";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import CollectionsPage from "./pages/Collections";
import LibraryPage from "./pages/Library";
import WorkspacePage from "./pages/Workspace";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard — Mantra AI",
  "/optimize": "Optimize — Mantra AI",
  "/history": "History — Mantra AI",
  "/analytics": "Analytics — Mantra AI",
  "/compare": "Compare — Mantra AI",
  "/benchmark": "Benchmark — Mantra AI",
  "/templates": "Templates — Mantra AI",
  "/feedback": "Feedback — Mantra AI",
  "/models": "Models — Mantra AI",
  "/favorites": "Favorites — Mantra AI",
  "/multi-model": "Multi-Model — Mantra AI",
  "/collections": "Collections — Mantra AI",
  "/library": "Library — Mantra AI",
  "/workspaces": "Workspaces — Mantra AI",
  "/login": "Sign In — Mantra AI",
  "/register": "Sign Up — Mantra AI",
};

export default function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title =
      PAGE_TITLES[location.pathname] ?? "Mantra AI — Prompt Intelligence";
  }, [location.pathname]);

  // Auth pages don't render Sidebar layout
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/optimize" element={<OptimizePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/benchmark" element={<BenchmarkPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/multi-model" element={<MultiModelPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/workspaces" element={<WorkspacePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
