interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const cls =
    score >= 75 ? "badge-score-high" : score >= 50 ? "badge-score-mid" : "badge-score-low";

  if (size === "lg") {
    const ringCls = score >= 75 ? "high" : score >= 50 ? "mid" : "low";
    return <div className={`score-ring ${ringCls}`}>{score}</div>;
  }

  return <span className={`badge ${cls}`}>{score}</span>;
}
