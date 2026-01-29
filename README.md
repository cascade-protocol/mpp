# MPP Website

```bash
npm install      # Install
npm run dev      # Start development server
npm run build    # Build 
npm run preview  # Preview build
```

## Cloudflare Workers Deploy

```bash
pnpm install
pnpm run build
pnpm run deploy
```

Set secrets before deploying:

```bash
pnpm exec wrangler secret put AUTH_PASS
```
