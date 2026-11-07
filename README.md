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

## Domain, security and analytics

DNS stays at Namecheap (BasicDNS). Hosting stays on GitHub Pages.

| Record | Host | Value | Purpose |
|---|---|---|---|
| A ×4 | @ | 185.199.108–111.153 | GitHub Pages |
| CNAME | www | diegocaputo9.github.io. | GitHub Pages |
| CAA | @ | 0 issue "letsencrypt.org" | only Let's Encrypt (GitHub's CA) may issue certs |
| TXT | _dmarc | v=DMARC1; p=none | anti-spoofing policy for @diegocaputo.com |
| TXT | @ | google-site-verification=… | Google Search Console (Domain property) |
| TXT | @ | v=spf1 include:spf.efwd… | Namecheap email forwarding (locked) |

- **HTTPS:** free Let's Encrypt cert issued by GitHub Pages; "Enforce HTTPS" on, which also sends HSTS.
- **CSP:** set as a `<meta>` tag in `app/layout.tsx` (production only), since GitHub Pages can't send custom headers.
- **Analytics:** Cloudflare Web Analytics, JS snippet mode (no DNS change, no cookies). Token in `content/site.ts`.
- **SEO:** `robots.txt`, `sitemap.xml`, canonical URL, Open Graph/Twitter card (`public/og.png`), schema.org Person JSON-LD.
