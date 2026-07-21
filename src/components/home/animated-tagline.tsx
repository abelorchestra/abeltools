const tagline = "Easier, Better, Funnier";
const words = ["Easier,", "Better,", "Funnier"];

export function AnimatedTagline() {
  return (
    <p
      className="animated-tagline mt-2 text-center text-3xl font-bold text-[#000000] sm:text-4xl"
      aria-label={tagline}
    >
      {words.map((word, index) => (
        <span
          key={word}
          aria-hidden="true"
          className="inline-block"
          style={{ animationDelay: `${320 + index * 500}ms` }}
        >
          {word}
          {index < words.length - 1 && <span className="inline-block w-[0.28em]">&nbsp;</span>}
        </span>
      ))}
    </p>
  );
}
