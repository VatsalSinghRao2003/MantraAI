interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "32px",
      }}
    >
      <div className={`spinner${size === "lg" ? " spinner-lg" : ""}`} />
      {text && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{text}</p>}
    </div>
  );
}
