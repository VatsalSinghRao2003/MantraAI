import { useState, useEffect } from "react";
import { getModels, compareModels } from "../services/api";
import { Layers, Wand2, Trophy, Clock, Zap, AlertCircle, CheckCircle } from "lucide-react";
import ScoreBadge from "../components/ScoreBadge";
import CopyButton from "../components/CopyButton";

const DEFAULT_MODELS = ["openai/gpt-oss-20b", "llama-3.1-8b-instant", "groq/compound"];

export default function MultiModelPage() {
  const [prompt, setPrompt] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getModels()
      .then((models) => {
        const names = models.map((m: any) => m.name).filter(Boolean);
        setAvailableModels(names.length > 0 ? names : DEFAULT_MODELS);
        setSelectedModels(names.slice(0, Math.min(2, names.length)));
      })
      .catch(() => {
        setAvailableModels(DEFAULT_MODELS);
        setSelectedModels([DEFAULT_MODELS[0]]);
      });
  }, []);

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleCompare = async () => {
    if (!prompt.trim()) { setError("Please enter a prompt."); return; }
    if (selectedModels.length === 0) { setError("Select at least one model."); return; }
    setError("");
    setLoading(true);
    setResults([]);
    try {
      const data = await compareModels(prompt, selectedModels);
      setResults(data);
    } catch {
      setError("Comparison failed. Ensure all selected models are available.");
    } finally {
      setLoading(false);
    }
  };

  const winner = results.filter(r => r.success).sort((a, b) => b.score - a.score)[0];

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="stat-icon purple" style={{ width: 40, height: 40 }}>
            <Layers size={18} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Multi-Model Compare</h1>
            <p className="page-subtitle">Run one prompt across multiple models simultaneously</p>
          </div>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <label style={{ fontSize: 14, fontWeight: 600 }}>Prompt to Test</label>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{prompt.length} chars</span>
        </div>
        <textarea
          className="input textarea"
          style={{ minHeight: 140, fontFamily: "inherit" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to compare across multiple models..."
        />
      </div>

      {/* Model Selection */}
      <div className="card mb-4">
        <div className="section-title">
          <Layers size={16} />
          Select Models to Compare
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {availableModels.map((model) => {
            const selected = selectedModels.includes(model);
            return (
              <button
                key={model}
                onClick={() => toggleModel(model)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${selected ? "rgba(99,102,241,0.5)" : "var(--border)"}`,
                  background: selected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                  color: selected ? "#818cf8" : "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: selected ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {selected && <CheckCircle size={13} />}
                {model}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
          {selectedModels.length} model{selectedModels.length !== 1 ? "s" : ""} selected
          {selectedModels.length > 2 && " — larger selections take longer"}
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 mb-4"
          style={{ color: "var(--danger)", fontSize: 13, padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleCompare}
          disabled={loading || !prompt.trim() || selectedModels.length === 0}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16 }} />
              Running on {selectedModels.length} model{selectedModels.length !== 1 ? "s" : ""}...
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Compare Models
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="animate-slide-up">
          {/* Winner Banner */}
          {winner && (
            <div
              className="card mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04))",
                borderColor: "rgba(16,185,129,0.25)",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <div className="winner-badge" style={{ display: "inline-flex", marginBottom: 8 }}>
                <Trophy size={14} />
                Best Result: {winner.model}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Score: <strong style={{ color: "var(--text-primary)" }}>{winner.score}</strong>
                {" · "}
                Time: <strong style={{ color: "var(--text-primary)" }}>{winner.responseTimeMs.toLocaleString()}ms</strong>
                {winner.tokenCount && <> · Tokens: <strong style={{ color: "var(--text-primary)" }}>{winner.tokenCount}</strong></>}
              </div>
            </div>
          )}

          {/* Result Cards */}
          <div className={results.length === 2 ? "grid-2" : "grid-3"} style={{ gap: 16 }}>
            {results.map((r, i) => {
              const isWinner = winner && r.model === winner.model && r.success;
              return (
                <div
                  key={i}
                  className="card"
                  style={{
                    borderColor: isWinner ? "rgba(16,185,129,0.3)" : undefined,
                    background: isWinner ? "rgba(16,185,129,0.04)" : undefined,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isWinner && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0,
                        height: 2,
                        background: "linear-gradient(90deg, #10b981, #06b6d4)",
                      }}
                    />
                  )}

                  {/* Model Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="badge badge-model">{r.model}</span>
                      {isWinner && <span className="winner-badge" style={{ marginLeft: 8, fontSize: 10 }}><Trophy size={10} /> Winner</span>}
                    </div>
                    {r.success && <ScoreBadge score={r.score} />}
                  </div>

                  {/* Metrics */}
                  {r.success ? (
                    <>
                      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                          <Clock size={11} />
                          {r.responseTimeMs.toLocaleString()}ms
                        </div>
                        {r.tokenCount && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                            <Zap size={11} />
                            {r.tokenCount} tokens
                          </div>
                        )}
                      </div>

                      {/* Score bar */}
                      <div className="progress-bar mb-3">
                        <div className="progress-fill" style={{ width: `${r.score}%` }} />
                      </div>

                      {/* Optimized prompt */}
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Optimized Output</span>
                        <CopyButton text={r.optimizedPrompt} />
                      </div>
                      <div
                        className="prompt-text"
                        style={{
                          fontSize: 11,
                          maxHeight: 180,
                          overflow: "auto",
                        }}
                      >
                        {r.optimizedPrompt}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        padding: "16px",
                        background: "rgba(239,68,68,0.08)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(239,68,68,0.15)",
                        color: "#ef4444",
                        fontSize: 12,
                      }}
                    >
                      <AlertCircle size={14} style={{ marginRight: 6, display: "inline" }} />
                      {r.error || "Model unavailable"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
