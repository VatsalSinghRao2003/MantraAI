type Props = {
  history: string[];
};

function HistorySidebar({
  history,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4">
        Recent Prompts
      </h2>

      {history.length === 0 ? (
        <p className="text-slate-400">
          No prompts yet
        </p>
      ) : (
        <div className="space-y-3">
          {history.map(
            (item, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-lg p-3 text-slate-300"
              >
                {item}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default HistorySidebar;
