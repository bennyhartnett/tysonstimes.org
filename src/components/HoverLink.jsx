function hoverClassName(className) {
  return className ? `${className} hw-ready` : "hw-ready";
}

export function HoverLink({ children, className, "aria-label": ariaLabel, ...props }) {
  return (
    <a className={hoverClassName(className)} aria-label={ariaLabel} {...props}>
      {children}
    </a>
  );
}

export function HoverButton({ children, className, "aria-label": ariaLabel, ...props }) {
  return (
    <button className={hoverClassName(className)} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
}
