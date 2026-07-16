import { useState } from "react";
import { optimizePrompt } from "../services/api";
import { Wand2, CheckCircle, AlertCircle, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import CopyButton from "../components/CopyButton";
import ScoreBadge from "../components/ScoreBadge";
import CategoryBadge from "../components/CategoryBadge";

export default function OptimizePage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to optimize.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await optimizePrompt(prompt);
      setResult(data);
    } catch {
      setError("Failed to connect to AI backend. Make sure the backend is running and the Groq API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = prompt.length;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="stat-icon indigo" style={{ width: 40, height: 40 }}>
            <Wand2 size={18} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Prompt Optimizer</h1>
            <p className="page-subtitle">Transform vague prompts into precise, high-quality instructions</p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <label style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            Your Prompt
          </label>
          <span style={{ fontSize: 12, color: charCount > 2000 ? "var(--danger)" : "var(--text-muted)" }}>
            {charCount} / 2000
          </span>
        </div>
        <textarea
          className="input textarea"
          style={{ minHeight: 180, fontFamily: "inherit", fontSize: 14 }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Write me a Spring Boot REST API for user management with JWT authentication..."
          maxLength={2000}
        />
        {error && (
          <div
            className="flex items-center gap-2 mt-3"
            style={{ color: "var(--danger)", fontSize: 13, padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <Sparkles size={12} style={{ display: "inline", marginRight: 4 }} />
            Powered by Groq Cloud
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleOptimize}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Optimizing...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Optimize Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="result-panel animate-slide-up">
          {/* Result Header */}
          <div className="result-header">
            <div className="flex items-center gap-3">
              <CheckCircle size={16} style={{ color: "var(--success)" }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Optimization Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <ScoreBadge score={result.score} />
              <CategoryBadge category={result.category} />
            </div>
          </div>

          {/* Optimized Prompt */}
          <div className="result-body">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                Optimized Prompt
              </span>
              <CopyButton text={result.optimizedPrompt} label="Copy Prompt" />
            </div>
            <div className="prompt-text">{result.optimizedPrompt}</div>

            {/* Score visual */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 20,
              }}
            >
              {/* Score */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: 16,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Quality Score</div>
                <ScoreBadge score={result.score} size="lg" />
                <div className="progress-bar mt-3">
                  <div className="progress-fill" style={{ width: `${result.score}%` }} />
                </div>
              </div>

              {/* Category */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Category</div>
                <CategoryBadge category={result.category} />

                {result.strengths?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Strengths:</div>
                    <div className="analysis-list">
                      {result.strengths.slice(0, 2).map((s: string, i: number) => (
                        <div key={i} className="analysis-item strength" style={{ padding: "6px 10px", fontSize: 12 }}>
                          <CheckCircle size={11} />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Details */}
            {(result.strengths?.length > 0 || result.missingElements?.length > 0) && (
              <div style={{ marginTop: 20 }}>
                <div className="grid-2" style={{ gap: 16 }}>
                  {result.strengths?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle size={14} style={{ color: "var(--success)" }} />
                        Strengths
                      </div>
                      <div className="analysis-list">
                        {result.strengths.map((s: string, i: number) => (
                          <div key={i} className="analysis-item strength">
                            <CheckCircle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.missingElements?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <AlertCircle size={14} style={{ color: "var(--warning)" }} />
                        Missing Elements
                      </div>
                      <div className="analysis-list">
                        {result.missingElements.map((m: string, i: number) => (
                          <div key={i} className="analysis-item missing">
                            <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Original Prompt Toggle */}
            <div style={{ marginTop: 16 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowOriginal(!showOriginal)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {showOriginal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showOriginal ? "Hide" : "Show"} Original
              </button>
              {showOriginal && (
                <div className="prompt-text mt-3" style={{ opacity: 0.7, fontSize: 12 }}>
                  {result.originalPrompt}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
