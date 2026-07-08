export function ImagePlate({ article, caption, size = "large" }) {
  const sizeClass = size === "wide" ? "wide-photo" : "image-plate";
  const styleClass = article?.imageStyle || article?.section || "local";

  return (
    <figure className={`${sizeClass} ${styleClass}`} aria-label="Monochrome newspaper photo treatment">
      {sizeClass === "image-plate" ? <div className="image-lines" /> : null}
      <figcaption className="caption">{caption}</figcaption>
    </figure>
  );
}

export function MiniPhoto({ article }) {
  const styleClass = article?.imageStyle || article?.section || "local";
  return <div className={`mini-photo ${styleClass}`} />;
}
