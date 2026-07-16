import { useEffect, useState } from "react";
import { getStats } from "../services/api";
import { Zap, Star, TrendingUp, Hash } from "lucide-react";

export default function StatsCards() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Prompts",
      value: stats?.totalPrompts ?? 0,
      icon: Hash,
      color: "indigo",
      sub: "Optimizations run",
    },
    {
      label: "Average Score",
      value: stats?.averageScore != null ? `${Math.round(stats.averageScore)}` : "—",
      icon: Star,
      color: "amber",
      sub: "Quality rating / 100",
    },
    {
      label: "AI Sessions",
      value: stats?.totalPrompts ?? 0,
      icon: Zap,
      color: "cyan",
      sub: "Groq API calls",
    },
    {
      label: "Improvement Rate",
      value: stats?.averageScore != null ? `${Math.round(stats.averageScore)}%` : "—",
      icon: TrendingUp,
      color: "green",
      sub: "Avg prompt quality",
    },
  ];

  return (
    <div className="grid-kpi mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="stat-card animate-slide-up">
            <div className={`stat-icon ${card.color}`}>
              <Icon size={20} />
            </div>
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              {loading ? (
                <div className="skeleton" style={{ height: 32, width: 60, marginBottom: 4 }} />
              ) : (
                <div className="stat-value">{card.value}</div>
              )}
              <div className="stat-sub">{card.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
