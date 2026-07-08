function HoverText({ text }) {
  return text.split(/(\s+)/).map((token, tokenIndex) => {
    if (!token) return null;
    if (/^\s+$/.test(token)) return token;

    return (
      <span className="hw-word" key={`${token}-${tokenIndex}`}>
        {Array.from(token).map((character, characterIndex) => (
          <span className="hw-cell" key={`${character}-${characterIndex}`}>
            <span className="hw-spacer" data-character={character} aria-hidden="true" />
            <span className="hw-anim">{character}</span>
          </span>
        ))}
      </span>
    );
  });
}

export function HoverLink({ children, className, "aria-label": ariaLabel, ...props }) {
  const text = typeof children === "string" || typeof children === "number" ? String(children) : null;

  if (text === null) {
    return (
      <a className={className} aria-label={ariaLabel} {...props}>
        {children}
      </a>
    );
  }

  const linkClassName = className ? `${className} hw-ready` : "hw-ready";

  return (
    <a className={linkClassName} aria-label={ariaLabel || text} {...props}>
      <span className="hw-text" aria-hidden="true">
        <HoverText text={text} />
      </span>
    </a>
  );
}
