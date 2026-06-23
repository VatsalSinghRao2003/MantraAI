import { useState } from "react";
import { getFeedback } from "../services/api";
import { MessageSquare, AlertCircle, Sparkles, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import CopyButton from "../components/CopyButton";

function parseSection(text: string, keyword: string): string[] {
  const lines = text.split("\n");
  const results: string[] = [];
  let inSection = false;
  for (const line of lines) {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      inSection = true;
      continue;
    }
    if (inSection) {
      const trimmed = line.trim().replace(/^[-•*]\s*/, "");
      if (trimmed.length > 0 && !trimmed.endsWith(":")) {
        results.push(trimmed);
      }
      // Stop at next section header (ends with colon or empty line followed by a header-like line)
      if (!trimmed && results.length > 0) break;
    }
  }
  return results;
}

export default function FeedbackPage() {
  const [prompt, setPrompt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFeedback = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to analyze.");
      return;
    }
    setError("");
    setLoading(true);
    setFeedback("");
    try {
      const data = await getFeedback(prompt);
      setFeedback(data.feedback);
    } catch {
      setError("Failed to get AI feedback. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const strengths = feedback ? parseSection(feedback, "Strength") : [];
  const weaknesses = feedback ? parseSection(feedback, "Weakness") : [];
  const suggestions = feedback ? parseSection(feedback, "Suggestion") : [];

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="stat-icon green" style={{ width: 40, height: 40 }}>
            <MessageSquare size={18} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>AI Prompt Critic</h1>
            <p className="page-subtitle">Get expert feedback on your prompt's strengths, weaknesses, and improvements</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <label style={{ fontSize: 14, fontWeight: 600 }}>Your Prompt</label>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{prompt.length} chars</span>
        </div>
        <textarea
          className="input textarea"
          style={{ minHeight: 160, fontFamily: "inherit" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Tell me about machine learning..."
        />
        {error && (
          <div
            className="flex items-center gap-2 mt-3"
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
        <div className="flex items-center justify-between mt-4">
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <Sparkles size={12} style={{ display: "inline", marginRight: 4 }} />
            Deep analysis powered by Ollama
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleFeedback}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Analyzing...
              </>
            ) : (
              <>
                <MessageSquare size={16} />
                Analyze Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Result */}
      {feedback && (
        <div className="animate-slide-up">
          {(strengths.length > 0 || weaknesses.length > 0 || suggestions.length > 0) ? (
            <div className="grid-3" style={{ gap: 16 }}>
              {/* Strengths */}
              {strengths.length > 0 && (
                <div className="card" style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.04)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#10b981",
                    }}
                  >
                    <CheckCircle size={16} />
                    Strengths
                  </div>
                  <div className="analysis-list">
                    {strengths.map((s, i) => (
                      <div key={i} className="analysis-item strength">
                        <CheckCircle size={12} style={{ flexShrink: 0 }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses */}
              {weaknesses.length > 0 && (
                <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#ef4444",
                    }}
                  >
                    <XCircle size={16} />
                    Weaknesses
                  </div>
                  <div className="analysis-list">
                    {weaknesses.map((w, i) => (
                      <div key={i} className="analysis-item missing">
                        <XCircle size={12} style={{ flexShrink: 0 }} />
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="card" style={{ borderColor: "rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.04)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#818cf8",
                    }}
                  >
                    <Lightbulb size={16} />
                    Suggestions
                  </div>
                  <div className="analysis-list">
                    {suggestions.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(99,102,241,0.08)",
                          border: "1px solid rgba(99,102,241,0.15)",
                          color: "#a5b4fc",
                          fontSize: 12,
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <Lightbulb size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Fallback: raw feedback text */
            <div className="result-panel">
              <div className="result-header">
                <span style={{ fontSize: 14, fontWeight: 600 }}>AI Analysis</span>
                <CopyButton text={feedback} label="Copy Feedback" />
              </div>
              <div className="result-body">
                <div className="prompt-text" style={{ fontSize: 13 }}>{feedback}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
