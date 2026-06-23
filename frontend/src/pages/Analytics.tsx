import { useEffect, useState } from "react";
import {
  getStats,
  getCategories,
  getPerformanceStats,
  getModelUsageStats,
  getDailyVolume,
  getScoreDistribution,
  type PerformanceStats,
  type ModelUsageStat,
  type DailyVolume,
  type ScoreDistribution,
} from "../services/api";
import {
  BarChart3, Clock, Zap, Hash, Star, PieChart,
  Cpu, TrendingUp, Activity
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import CategoryPieChart from "../components/CategoryPieChart";
import LoadingSpinner from "../components/LoadingSpinner";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", fontSize: 12 }}>
      {label && <div style={{ color: "#9ca3af", marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || "#f9fafb", fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [perf, setPerf] = useState<PerformanceStats | null>(null);
  const [modelUsage, setModelUsage] = useState<ModelUsageStat[]>([]);
  const [volume, setVolume] = useState<DailyVolume[]>([]);
  const [scoreDist, setScoreDist] = useState<ScoreDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStats(),
      getCategories(),
      getPerformanceStats().catch(() => null),
      getModelUsageStats().catch(() => []),
      getDailyVolume().catch(() => []),
      getScoreDistribution().catch(() => null),
    ]).then(([s, c, p, mu, vol, sd]) => {
      setStats(s);
      setCategories(c);
      setPerf(p);
      setModelUsage(mu);
      setVolume(vol);
      setScoreDist(sd);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scoreDistData = scoreDist
    ? [
        { name: "Excellent (90+)", value: scoreDist.excellent, color: "#10b981" },
        { name: "Good (70-89)", value: scoreDist.good, color: "#6366f1" },
        { name: "Fair (50-69)", value: scoreDist.fair, color: "#f59e0b" },
        { name: "Poor (<50)", value: scoreDist.poor, color: "#ef4444" },
      ]
    : [];

  const topCategory = Object.entries(categories).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="stat-icon indigo" style={{ width: 40, height: 40 }}>
            <BarChart3 size={18} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Analytics</h1>
            <p className="page-subtitle">Performance insights and prompt quality trends</p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading analytics..." size="lg" />
      ) : (
        <>
          {/* KPI Row 1 — Basic Stats */}
          <div className="grid-4 mb-4">
            {[
              { label: "Total Prompts", value: stats?.totalPrompts ?? 0, icon: Hash, color: "indigo", sub: "All time" },
              { label: "Average Score", value: stats?.averageScore != null ? Math.round(stats.averageScore) : "—", icon: Star, color: "amber", sub: "Quality / 100" },
              { label: "Top Category", value: topCategory ? topCategory[0] : "—", icon: PieChart, color: "cyan", sub: topCategory ? `${topCategory[1]} prompts` : "" },
              { label: "Categories", value: Object.keys(categories).length, icon: BarChart3, color: "green", sub: "Distinct types" },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="stat-card">
                  <div className={`stat-icon ${kpi.color}`}><Icon size={20} /></div>
                  <div className="stat-info">
                    <div className="stat-label">{kpi.label}</div>
                    <div className="stat-value">{kpi.value}</div>
                    <div className="stat-sub">{kpi.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* KPI Row 2 — Performance Metrics */}
          {perf && (
            <div className="grid-4 mb-6">
              {[
                { label: "Avg Response", value: perf.avgResponseTimeMs > 0 ? `${perf.avgResponseTimeMs.toLocaleString()}ms` : "—", icon: Clock, color: "purple", sub: "Per optimization" },
                { label: "Fastest", value: perf.minResponseTimeMs > 0 ? `${perf.minResponseTimeMs.toLocaleString()}ms` : "—", icon: Zap, color: "green", sub: "Best time" },
                { label: "Slowest", value: perf.maxResponseTimeMs > 0 ? `${perf.maxResponseTimeMs.toLocaleString()}ms` : "—", icon: Activity, color: "amber", sub: "Worst time" },
                { label: "Avg Tokens", value: perf.avgTokenCount > 0 ? Math.round(perf.avgTokenCount) : "—", icon: TrendingUp, color: "cyan", sub: `${perf.totalTokenCount.toLocaleString()} total` },
              ].map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="stat-card">
                    <div className={`stat-icon ${kpi.color}`}><Icon size={20} /></div>
                    <div className="stat-info">
                      <div className="stat-label">{kpi.label}</div>
                      <div className="stat-value" style={{ fontSize: 20 }}>{kpi.value}</div>
                      <div className="stat-sub">{kpi.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Charts Row 1: Volume Trend + Category Pie */}
          <div className="grid-cols-2-1 mb-4">
            {/* Volume Trend */}
            <div className="chart-container">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} style={{ color: "var(--brand-primary)" }} />
                <span className="chart-title" style={{ marginBottom: 0 }}>Daily Prompt Volume</span>
              </div>
              {volume.length === 0 ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No volume data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={volume}>
                    <defs>
                      <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#volumeGrad)" strokeWidth={2} name="Prompts" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Pie */}
            <CategoryPieChart />
          </div>

          {/* Charts Row 2: Score Distribution + Model Usage */}
          <div className="grid-2 mb-4">
            {/* Score Distribution */}
            <div className="chart-container">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} style={{ color: "#f59e0b" }} />
                <span className="chart-title" style={{ marginBottom: 0 }}>Score Distribution</span>
              </div>
              {scoreDistData.every(d => d.value === 0) ? (
                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No score data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={scoreDistData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                      {scoreDistData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Model Usage */}
            <div className="chart-container">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={16} style={{ color: "#06b6d4" }} />
                <span className="chart-title" style={{ marginBottom: 0 }}>Model Usage</span>
              </div>
              {modelUsage.length === 0 ? (
                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No model data yet — optimize some prompts first
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
                  {modelUsage.map((m, i) => {
                    const max = Math.max(...modelUsage.map(x => x.count));
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1" style={{ fontSize: 12 }}>
                          <span className="badge badge-model">{m.model || "unknown"}</span>
                          <span style={{ color: "var(--text-muted)" }}>
                            {m.count} calls
                            {m.avgResponseTimeMs != null && ` · ${m.avgResponseTimeMs}ms avg`}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(m.count / max) * 100}%`, background: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="card">
            <div className="section-title">
              <BarChart3 size={16} />
              Category Breakdown
            </div>
            {Object.keys(categories).length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: 13 }}>
                Optimize prompts to see category breakdown
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(categories)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, count]) => {
                    const max = Math.max(...Object.values(categories));
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1" style={{ fontSize: 13 }}>
                          <span style={{ color: "var(--text-primary)", textTransform: "capitalize", fontWeight: 500 }}>{cat}</span>
                          <span style={{ color: "var(--text-muted)" }}>{count} prompts</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
