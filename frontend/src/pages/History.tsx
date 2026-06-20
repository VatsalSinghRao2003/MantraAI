import { useEffect, useState } from "react";
import {
  getHistory,
  searchHistory,
  deleteHistory,
  exportHistory
} from "../services/api";

export default function HistoryPage() {

  const [history, setHistory] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {

    if (!query.trim()) {
      loadHistory();
      return;
    }

    try {

      const data =
        await searchHistory(query);

      setHistory(data);

    } catch (error) {

      console.error(error);

    }
  };

  const handleDelete = async (
    id: number
  ) => {

    try {

      await deleteHistory(id);

      await loadHistory();

    } catch (error) {

      console.error(error);

    }
  };

  const handleExport = async () => {

    try {

      const blob =
        await exportHistory();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "prompt-history.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div>

      <h2>Prompt History</h2>

      <div
        style={{
          marginBottom: "20px"
        }}
      >

        <button
          onClick={handleExport}
          style={{
            marginRight: "10px"
          }}
        >
          📥 Export CSV
        </button>

        <input
          type="text"
          placeholder="Search prompts..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
          }}
        />

        <button
          onClick={handleSearch}
        >
          Search
        </button>

      </div>

      {history.length === 0 ? (
        <p>No prompts found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#1f2937",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h4>{item.originalPrompt}</h4>

            <p>
              <b>Score:</b> {item.score}
            </p>

            <p>
              <b>Category:</b> {item.category}
            </p>

            <small>{item.createdAt}</small>

            <br />

            <button
              onClick={() =>
                handleDelete(item.id)
              }
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              🗑 Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}