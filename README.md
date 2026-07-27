# Tysons Times

A React/Vite local-news site built for GitHub Pages and the custom domain `tysonstimes.org`.

Production articles and publication images live in the separate [`bennyhartnett/tysons-times-content`](https://github.com/bennyhartnett/tysons-times-content) repository. Its GitHub Pages feed is the site's content source at build time and in the browser.

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

`npm run content:sync` refreshes the build-time article snapshot from the content feed. Article validation, image optimization, and publishing are owned by the content repository.

Pushes to `main` deploy through `.github/workflows/deploy-pages.yml`.

The app uses hash-based routes so GitHub Pages can serve every page reliably:

- `#/`
- `#/section/local`
- `#/article/tysons-next-chapter`
- `#/archive`
- `#/events`

`public/CNAME` configures the GitHub Pages custom domain.
