import { useEffect, useState } from "react";
import api from "../services/api";

export default function Templates() {

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    api.get("/templates")
      .then(res => setTemplates(res.data));
  }, []);

  return (
    <div>
      <h1>Prompt Templates</h1>

      {templates.map((t, index) => (
        <div key={index}>
          <h3>{t.category}</h3>
          <p>{t.template}</p>
        </div>
      ))}
    </div>
  );
}
