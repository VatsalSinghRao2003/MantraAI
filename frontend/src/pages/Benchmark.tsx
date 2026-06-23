import { useState } from "react";
import { benchmarkPrompts } from "../services/api";
import { Trophy, Zap, AlertCircle, ArrowRight, FileText } from "lucide-react";
import ScoreBadge from "../components/ScoreBadge";

export default function BenchmarkPage() {
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBenchmark = async () => {
    if (!prompt1.trim() || !prompt2.trim()) {
      setError("Both prompts are required for benchmarking.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await benchmarkPrompts(prompt1, prompt2);
      setResult(data);
    } catch {
      setError("Benchmark failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const winner1 = result?.winner === "prompt1";
  const winner2 = result?.winner === "prompt2";

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="stat-icon amber" style={{ width: 40, height: 40 }}>
            <Trophy size={18} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Prompt Benchmark</h1>
            <p className="page-subtitle">Deep quality analysis and head-to-head comparison</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="compare-grid mb-4">
        {[
          { label: "Prompt 1", value: prompt1, set: setPrompt1, color: "#6366f1", num: 1 },
          { label: "Prompt 2", value: prompt2, set: setPrompt2, color: "#8b5cf6", num: 2 },
        ].map(({ label, value, set, color, num }) => (
          <div
            key={num}
            className={`card${(num === 1 ? winner1 : winner2) && result ? " compare-winner" : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    background: `${color}22`,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color,
                    border: `1px solid ${color}44`,
                  }}
                >
                  {num}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
              </div>
              {result && (
                <ScoreBadge
                  score={num === 1 ? result.prompt1Score : result.prompt2Score}
                />
              )}
            </div>
            <textarea
              className="input textarea"
              style={{ minHeight: 180, fontFamily: "inherit" }}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
            {(num === 1 ? winner1 : winner2) && result && (
              <div className="winner-badge mt-3">
                <Trophy size={12} />
                Winner!
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div
          className="flex items-center gap-2 mb-4"
          style={{
            color: "var(--danger)",
            fontSize: 13,
            padding: "10px 14px",
            background: "rgba(239,68,68,0.08)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginBottom: result ? 32 : 0 }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleBenchmark}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16 }} />
              Benchmarking...
            </>
          ) : (
            <>
              <Zap size={16} />
              Run Benchmark
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="animate-slide-up">
          {/* Winner Banner */}
          <div
            className="card mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04))",
              borderColor: "rgba(16,185,129,0.25)",
              textAlign: "center",
              padding: "24px",
            }}
          >
            <div className="winner-badge" style={{ display: "inline-flex", marginBottom: 12 }}>
              <Trophy size={14} />
              {result.winner === "tie"
                ? "It's a Tie!"
                : `Prompt ${result.winner === "prompt1" ? "1" : "2"} Wins!`}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                marginTop: 8,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Score 1</div>
                <ScoreBadge score={result.prompt1Score} size="lg" />
              </div>
              <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Score 2</div>
                <ScoreBadge score={result.prompt2Score} size="lg" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid-4" style={{ gap: 12 }}>
            {[
              { label: "Prompt 1 Score", value: result.prompt1Score, color: "indigo", icon: "📊" },
              { label: "Prompt 2 Score", value: result.prompt2Score, color: "purple", icon: "📊" },
              { label: "Prompt 1 Length", value: `${result.prompt1Length} chars`, color: "cyan", icon: <FileText size={16} /> },
              { label: "Prompt 2 Length", value: `${result.prompt2Length} chars`, color: "green", icon: <FileText size={16} /> },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: 16 }}>
                <div className={`stat-icon ${s.color}`} style={{ width: 36, height: 36, fontSize: 16 }}>
                  {typeof s.icon === "string" ? s.icon : s.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-label" style={{ fontSize: 10 }}>{s.label}</div>
                  <div className="stat-value" style={{ fontSize: 20 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
