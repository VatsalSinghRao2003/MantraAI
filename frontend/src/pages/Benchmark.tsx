import { useState } from "react";
import { benchmarkPrompts }
from "../services/api";

export default function Benchmark() {

  const [prompt1, setPrompt1] =
    useState("");

  const [prompt2, setPrompt2] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  const handleBenchmark =
    async () => {

      const data =
        await benchmarkPrompts(
          prompt1,
          prompt2
        );

      setResult(data);
    };

  return (
    <div>

      <h1>
        🏆 Prompt Benchmark
      </h1>

      <textarea
        rows={5}
        value={prompt1}
        onChange={(e) =>
          setPrompt1(e.target.value)
        }
        placeholder="Prompt 1"
      />

      <br />
      <br />

      <textarea
        rows={5}
        value={prompt2}
        onChange={(e) =>
          setPrompt2(e.target.value)
        }
        placeholder="Prompt 2"
      />

      <br />
      <br />

      <button
        onClick={handleBenchmark}
      >
        Benchmark
      </button>

      {result && (

        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#1f2937",
            borderRadius: "10px",
          }}
        >
          <h2>
            Winner:
            {" "}
            {result.winner}
          </h2>

          <p>
            Prompt 1 Score:
            {" "}
            {result.prompt1Score}
          </p>

          <p>
            Prompt 2 Score:
            {" "}
            {result.prompt2Score}
          </p>

          <p>
            Prompt 1 Length:
            {" "}
            {result.prompt1Length}
          </p>

          <p>
            Prompt 2 Length:
            {" "}
            {result.prompt2Length}
          </p>
        </div>
      )}
    </div>
  );
}
