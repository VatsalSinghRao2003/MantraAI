import { useState } from "react";
import { comparePrompts } from "../services/api";
import { GitCompare, Trophy, AlertCircle, ArrowRight } from "lucide-react";
import ScoreBadge from "../components/ScoreBadge";

export default function ComparePage() {
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!prompt1.trim() || !prompt2.trim()) {
      setError("Please enter both prompts to compare.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await comparePrompts(prompt1, prompt2);
      setResult(data);
    } catch {
      setError("Comparison failed. Check backend connection.");
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
          <div className="stat-icon cyan" style={{ width: 40, height: 40 }}>
            <GitCompare size={18} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Compare Prompts</h1>
            <p className="page-subtitle">Side-by-side quality scoring and winner analysis</p>
          </div>
        </div>
      </div>

      {/* Input Grid */}
      <div className="compare-grid mb-4">
        <div className={`card${winner1 && result ? " compare-winner" : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  background: "rgba(99,102,241,0.2)",
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#818cf8",
                }}
              >
                1
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Prompt A</span>
            </div>
            {result && <ScoreBadge score={result.score1} />}
          </div>
          <textarea
            className="input textarea"
            style={{ minHeight: 160, fontFamily: "inherit" }}
            value={prompt1}
            onChange={(e) => setPrompt1(e.target.value)}
            placeholder="Enter your first prompt here..."
          />
          {winner1 && result && (
            <div className="winner-badge mt-3">
              <Trophy size={12} />
              Winner!
            </div>
          )}
        </div>

        <div className={`card${winner2 && result ? " compare-winner" : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  background: "rgba(139,92,246,0.2)",
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#a78bfa",
                }}
              >
                2
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Prompt B</span>
            </div>
            {result && <ScoreBadge score={result.score2} />}
          </div>
          <textarea
            className="input textarea"
            style={{ minHeight: 160, fontFamily: "inherit" }}
            value={prompt2}
            onChange={(e) => setPrompt2(e.target.value)}
            placeholder="Enter your second prompt here..."
          />
          {winner2 && result && (
            <div className="winner-badge mt-3">
              <Trophy size={12} />
              Winner!
            </div>
          )}
        </div>
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

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16 }} />
              Comparing...
            </>
          ) : (
            <>
              <GitCompare size={16} />
              Compare Prompts
            </>
          )}
        </button>
      </div>

      {/* Result Summary */}
      {result && (
        <div
          className="card animate-slide-up mt-6"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(6,182,212,0.03))",
            borderColor: "rgba(16,185,129,0.2)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Comparison Result
            </div>
            <div className="winner-badge" style={{ display: "inline-flex", marginBottom: 16 }}>
              <Trophy size={14} />
              {result.winner === "prompt1" ? "Prompt A" : "Prompt B"} Wins!
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Prompt A Score</div>
                <ScoreBadge score={result.score1} size="lg" />
              </div>
              <ArrowRight size={20} style={{ color: "var(--text-muted)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Prompt B Score</div>
                <ScoreBadge score={result.score2} size="lg" />
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>
              Score difference:{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {Math.abs(result.score1 - result.score2)} points
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
