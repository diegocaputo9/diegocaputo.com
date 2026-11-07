# diegocaputo.com

Personal site of Diego Caputo, Industrial & Systems Engineer.

- **Stack:** Next.js (static export) + Tailwind v4 + Motion
- **Hosting:** GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main`
- **Domain:** `diegocaputo.com` (Namecheap DNS → GitHub Pages), set in `public/CNAME`

## Edit content

All copy lives in [`content/site.ts`](content/site.ts). Items marked `DRAFT` / `TODO` are placeholders.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # writes the static site to ./out
```
