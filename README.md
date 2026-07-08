# Tysons Times

Hello world React site for `tysonstimes.com`, built with Vite and deployed to
GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` builds and deploys the site
on every push to `main`.

In GitHub, set **Settings -> Pages -> Build and deployment -> Source** to
**GitHub Actions**.

The custom domain is configured in `public/CNAME` as:

```txt
tysonstimes.com
```
