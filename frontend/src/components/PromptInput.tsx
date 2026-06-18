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
return ( <div>
<textarea
rows={8}
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Enter your prompt..."
style={{
width: "100%",
padding: "12px",
}}
/>

  <button
    onClick={onOptimize}
    disabled={isLoading}
    style={{
      marginTop: "10px",
      padding: "10px 20px",
      cursor: "pointer",
    }}
  >
    {isLoading ? "Optimizing..." : "Optimize Prompt"}
  </button>
</div>


);
}

export default PromptInput;