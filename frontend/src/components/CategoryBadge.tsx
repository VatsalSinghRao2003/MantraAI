interface CategoryBadgeProps {
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  code: "badge-model",
  java: "badge-model",
  react: "badge-info",
  devops: "badge-warning",
  interview: "badge-success",
  dsa: "badge-danger",
  general: "badge-category",
  writing: "badge-category",
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const lower = category?.toLowerCase() ?? "general";
  const cls = CATEGORY_COLORS[lower] ?? "badge-category";
  return <span className={`badge ${cls}`}>{category || "General"}</span>;
}
