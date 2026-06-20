import CopyButton from "./CopyButton";
import ScoreCard from "./ScoreCard";

type Props = {
  result: any;
};

function PromptOutput({
  result,
}: Props) {
  if (!result) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400">
        Optimize a prompt to see results
      </div>
    );
  }

  return (
    <>
      <ScoreCard
        score={result.score}
      />

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">
            Optimized Prompt
          </h2>

          <CopyButton
            text={
              result.optimizedPrompt
            }
          />
        </div>

        <div className="text-slate-300 mb-4">
          Category:
          {" "}
          {result.category}
        </div>

        <pre className="whitespace-pre-wrap text-slate-300">
          {result.optimizedPrompt}
        </pre>
      </div>
    </>
  );
}

export default PromptOutput;
