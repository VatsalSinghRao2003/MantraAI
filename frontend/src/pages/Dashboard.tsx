import AIStatusCard from "../components/AIStatusCard";
import StatsCards from "../components/StatsCards";
import ModelsCard from "../components/ModelsCard";
import CategoryPieChart from "../components/CategoryPieChart";
import RecentActivity from "../components/RecentActivity";
import { Sparkles, Wand2, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import heroBannerImg from "../assets/hero_banner.png";

export default function Dashboard() {
  return (
    <div className="page-wrapper animate-fade-in">
      {/* Hero Header */}
      <div
        className="card mb-6"
        style={{
          padding: "24px 32px",
          borderColor: "var(--border)",
          background: "var(--bg-surface)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Sparkles size={20} style={{ color: "#818cf8" }} />
            <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Mantra AI Platform
            </span>
          </div>
          <h1 className="page-title" style={{ fontSize: 26, marginBottom: 8 }}>
            Welcome back 👋
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13.5, maxWidth: 480, marginBottom: 20 }}>
            Your AI-powered prompt optimization platform. Transform vague prompts into precise,
            high-performing instructions.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/optimize" className="btn btn-primary">
              <Wand2 size={16} />
              Optimize a Prompt
            </Link>
            <Link to="/analytics" className="btn btn-secondary">
              <BarChart3 size={16} />
              View Analytics
            </Link>
          </div>
        </div>

        {/* Banner Graphic on the Right */}
        <div className="hidden md:block" style={{ width: 240, height: 140, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
          <img src={heroBannerImg} alt="Mantra AI Engine" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* AI Status */}
      <AIStatusCard />

      {/* KPI Stats */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid-cols-2-1" style={{ gap: 20 }}>
        {/* Left: Charts & Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <CategoryPieChart />
          <RecentActivity />
        </div>

        {/* Right: Models */}
        <div>
          <ModelsCard />

          {/* Quick Actions */}
          <div className="card">
            <div className="section-title">Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { to: "/optimize", label: "Optimize Prompt", icon: "⚡", desc: "Transform your prompt with AI" },
                { to: "/compare", label: "Compare Prompts", icon: "⚖️", desc: "Side-by-side quality analysis" },
                { to: "/benchmark", label: "Run Benchmark", icon: "🏆", desc: "Score and rank your prompts" },
                { to: "/templates", label: "Use a Template", icon: "📋", desc: "Start from proven templates" },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <span style={{ fontSize: 20 }}>{action.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      {action.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{action.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
