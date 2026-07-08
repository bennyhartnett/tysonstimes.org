# Tysons Times

A React/Vite local-news site built for GitHub Pages and the custom domain `tysonstimes.org`.

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

Pushes to `main` deploy through `.github/workflows/deploy-pages.yml`.

The app uses hash-based routes so GitHub Pages can serve every page reliably:

- `#/`
- `#/section/local`
- `#/article/tysons-next-chapter`
- `#/archive`
- `#/events`

`public/CNAME` configures the GitHub Pages custom domain.
