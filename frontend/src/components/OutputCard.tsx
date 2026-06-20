import PromptOutput from "./PromptOutput";

type Props = {
  result: any;
};

function OutputCard({
  result,
}: Props) {
  if (!result) return null;

  return (
    <div className="mt-8">
      <PromptOutput result={result} />
    </div>
  );
}

export default OutputCard;
