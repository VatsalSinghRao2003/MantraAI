import { useEffect, useState } from "react";
import { getCategories } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#1f2937",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
        }}
      >
        <div style={{ color: "#f9fafb", fontWeight: 600 }}>{payload[0].name}</div>
        <div style={{ color: "#9ca3af" }}>
          {payload[0].value} prompt{payload[0].value !== 1 ? "s" : ""}
        </div>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        const arr = Object.entries(cats).map(([name, value]) => ({
          name,
          value,
        }));
        setData(arr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="chart-container">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon size={16} style={{ color: "var(--brand-primary)" }} />
        <span className="chart-title" style={{ marginBottom: 0 }}>
          Category Distribution
        </span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 220 }} />
      ) : data.length === 0 ? (
        <div
          style={{
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          No data yet — optimize some prompts!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}