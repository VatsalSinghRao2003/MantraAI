type Props = {
  prompt: string;
  setPrompt: (value: string) => void;
  onOptimize: () => void;
  isLoading?: boolean;
};

function PromptInput({
  prompt,
  setPrompt,
  onOptimize,
  isLoading = false,
}: Props) {
  return (
    <div>
      <textarea
        rows={8}
        value={prompt}
        onChange={(e) =>
          setPrompt(
            e.target.value
          )
        }
        placeholder="Describe what you want..."
      />

      <button
        onClick={onOptimize}
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading
          ? "Optimizing..."
          : "Optimize Prompt"}
      </button>
    </div>
  );
}

export default PromptInput;
