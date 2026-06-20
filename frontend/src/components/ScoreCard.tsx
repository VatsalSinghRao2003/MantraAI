type Props = {
  score: number;
};

function ScoreCard({ score }: Props) {
  const color =
    score >= 80
      ? "text-green-400"
      : score >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
      <p className="text-slate-400">
        Prompt Score
      </p>

      <h1
        className={`text-6xl font-bold ${color}`}
      >
        {score}
      </h1>

      <p className="text-slate-500 mt-2">
        Higher is better
      </p>
    </div>
  );
}

export default ScoreCard;
