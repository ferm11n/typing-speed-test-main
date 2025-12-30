interface Props {
  passage: string;
  currentIndex: number;
  errors: Set<number>;
}

export function TypingArea({ passage, currentIndex, errors }: Props) {
  return (
    <div className="font-mono text-xl">
      {passage.split("").map((char, i) => {
        let className = "text-gray-400";

        if (i < currentIndex) {
          className = errors.has(i)
            ? "text-red-500 underline"
            : "text-green-500";
        }

        if (i === currentIndex) {
          className += " bg-yellow-200";
        }

        return (
          <span key={i} className={className}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
