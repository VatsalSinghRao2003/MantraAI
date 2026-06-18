type PromptResult = {
category: string;
score: number;
optimizedPrompt: string;
};

type Props = {
result: PromptResult | null;
};

function PromptOutput({ result }: Props) {
if (!result) return null;

return (
<div style={{ marginTop: "20px", textAlign: "left" }}> <h3>Category</h3> <p>{result.category}</p>

  <h3>Score</h3>
  <p>{result.score}/100</p>

  <h3>Optimized Prompt</h3>

  <pre
    style={{
      whiteSpace: "pre-wrap",
      background: "#f4f4f4",
      padding: "12px",
    }}
  >
    {result.optimizedPrompt}
  </pre>
</div>


);
}

export default PromptOutput;
