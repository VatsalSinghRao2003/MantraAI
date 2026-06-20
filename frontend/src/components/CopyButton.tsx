import { Copy } from "lucide-react";

type Props = {
  text: string;
};

function CopyButton({
  text,
}: Props) {
  const copy = async () => {
    await navigator.clipboard.writeText(
      text
    );

    alert(
      "Prompt copied successfully"
    );
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-2"
    >
      <Copy size={16} />
      Copy
    </button>
  );
}

export default CopyButton;
