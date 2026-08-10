const allowedTags = new Set(["a", "blockquote", "br", "code", "em", "h2", "h3", "li", "ol", "p", "strong", "ul"]);
const removedWithContents = new Set(["base", "button", "embed", "form", "iframe", "input", "link", "meta", "object", "script", "select", "style", "template", "textarea"]);

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

export function sanitizeArticleHtml(html) {
  const document = new DOMParser().parseFromString(String(html || ""), "text/html");

  for (const element of [...document.body.querySelectorAll("*")]) {
    const tag = element.tagName.toLowerCase();
    if (removedWithContents.has(tag)) {
      element.remove();
      continue;
    }
    if (!allowedTags.has(tag)) {
      element.replaceWith(...element.childNodes);
      continue;
    }

    for (const attribute of [...element.attributes]) {
      if (tag !== "a" || attribute.name.toLowerCase() !== "href") element.removeAttribute(attribute.name);
    }

    if (tag === "a") {
      const href = element.getAttribute("href");
      if (!isSafeArticleUrl(href)) element.removeAttribute("href");
      else if (/^https?:/i.test(href)) element.setAttribute("rel", "noopener noreferrer");
    }
  }

  return document.body.innerHTML;
}
