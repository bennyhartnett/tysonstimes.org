# Tysons Times

A React/Vite local-news site built for GitHub Pages and the custom domain `tysonstimes.org`.

Production articles are repository-backed Markdown files under `content/articles/`. See the [article system guide](content/README.md) and [copyable template](content/article-template.md).

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

`npm run content:check` validates article structure, text limits, dates, images, captions, and folder routing. `npm run images:optimize` normalizes publication images before they are committed.

Pushes to `main` deploy through `.github/workflows/deploy-pages.yml`.

The app uses hash-based routes so GitHub Pages can serve every page reliably:

- `#/`
- `#/section/local`
- `#/article/tysons-next-chapter`
- `#/archive`
- `#/events`

`public/CNAME` configures the GitHub Pages custom domain.
