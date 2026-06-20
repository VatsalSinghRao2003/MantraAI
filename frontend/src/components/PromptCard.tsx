import PromptInput from "./PromptInput";

type Props = {
  prompt: string;
  setPrompt: (value: string) => void;
  onOptimize: () => void;
  isLoading: boolean;
};

function PromptCard({
  prompt,
  setPrompt,
  onOptimize,
  isLoading,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        onOptimize={onOptimize}
        isLoading={isLoading}
      />
    </div>
  );
}

export default PromptCard;
