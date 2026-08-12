const allowedTags = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h2",
  "h3",
  "li",
  "ol",
  "p",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
]);

const tagPattern = /<\/?\s*([a-z0-9-]+)/gi;
const hrefPattern = /\shref\s*=\s*(["'])(.*?)\1/gi;
const stylePattern = /\sstyle\s*=\s*(["'])(.*?)\1/gi;

export function isSafeArticleUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return false;
  if (/^(?:#|\/|\.\/|\.\.\/)/.test(trimmed)) return true;

  try {
    return ["http:", "https:", "mailto:"].includes(new URL(trimmed).protocol);
  } catch {
    return false;
  }
}

export function validateArticleHtml(html, articleId = "unknown") {
  const source = String(html || "");
  const invalidTags = new Set();
  let match;

  tagPattern.lastIndex = 0;
  while ((match = tagPattern.exec(source))) {
    const tag = match[1].toLowerCase();
    if (!allowedTags.has(tag)) invalidTags.add(tag);
  }

  if (invalidTags.size) {
    throw new Error(`Article '${articleId}' contains unsupported HTML tags: ${[...invalidTags].join(", ")}`);
  }

  if (/\s(?:on[a-z]+|srcdoc)\s*=/i.test(source)) {
    throw new Error(`Article '${articleId}' contains unsafe HTML attributes.`);
  }

  stylePattern.lastIndex = 0;
  const sourceWithoutQuotedStyles = source.replace(stylePattern, "");
  if (/\sstyle\s*=/i.test(sourceWithoutQuotedStyles)) {
    throw new Error(`Article '${articleId}' contains unsafe HTML attributes.`);
  }

  stylePattern.lastIndex = 0;
  while ((match = stylePattern.exec(source))) {
    if (!/^text-align\s*:\s*(?:left|right|center)\s*;?$/i.test(match[2].trim())) {
      throw new Error(`Article '${articleId}' contains unsafe HTML attributes.`);
    }
  }

  hrefPattern.lastIndex = 0;
  while ((match = hrefPattern.exec(source))) {
    if (!isSafeArticleUrl(match[2])) {
      throw new Error(`Article '${articleId}' contains an unsafe link URL.`);
    }
  }

  return true;
}
