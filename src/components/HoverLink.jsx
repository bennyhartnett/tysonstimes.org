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

function hoverClassName(className) {
  return className ? `${className} hw-ready` : "hw-ready";
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

  return (
    <a className={hoverClassName(className)} aria-label={ariaLabel || text} {...props}>
      <span className="hw-text" aria-hidden="true">
        <HoverText text={text} />
      </span>
    </a>
  );
}

export function HoverButton({ children, className, "aria-label": ariaLabel, ...props }) {
  const text = typeof children === "string" || typeof children === "number" ? String(children) : null;

  if (text === null) {
    return (
      <button className={className} aria-label={ariaLabel} {...props}>
        {children}
      </button>
    );
  }

  return (
    <button className={hoverClassName(className)} aria-label={ariaLabel || text} {...props}>
      <span className="hw-text" aria-hidden="true">
        <HoverText text={text} />
      </span>
    </button>
  );
}
