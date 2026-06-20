import { useEffect, useState } from "react";
import { getModels } from "../services/api";

export default function ModelsCard() {

  const [models, setModels] =
    useState<any[]>([]);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {

    const data =
      await getModels();

    setModels(data);
  };

  return (
    <div
      style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      <h2>🤖 Installed Models</h2>

      {models.map((model, index) => (
        <p key={index}>
          🟢 {model.name}
        </p>
      ))}
    </div>
  );
}
