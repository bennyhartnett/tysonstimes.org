function ResponsiveImage({ image, alt, eager = false, sizes = "(max-width: 700px) 100vw, 720px" }) {
  if (!image) return null;

  return (
    <picture>
      <source type="image/webp" srcSet={image.srcSet} sizes={sizes} />
      <img
        src={image.src}
        alt={alt ?? image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

export function ImagePlate({ article, caption, size = "large", priority = false }) {
  const sizeClass = size === "wide" ? "wide-photo" : "image-plate";
  const image = article?.hero;

  return (
    <figure className={sizeClass}>
      <ResponsiveImage
        image={image}
        eager={priority}
        sizes={size === "wide" ? "(max-width: 960px) 100vw, 760px" : "(max-width: 960px) 100vw, 620px"}
      />
      <figcaption className="caption">
        {caption || image?.caption}
        {image?.credit ? <span>Photo: {image.credit}</span> : null}
      </figcaption>
    </figure>
  );
}

export function MiniPhoto({ article }) {
  return (
    <div className="mini-photo" aria-hidden="true">
      <ResponsiveImage image={article?.hero} alt="" sizes="(max-width: 640px) 100vw, 360px" />
    </div>
  );
}
