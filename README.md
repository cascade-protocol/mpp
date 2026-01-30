# MPP Website

Website for the Machine Payments Protocol (MPP).

## Development

```bash
pnpm install      # Install
pnpm run dev      # Start development server
pnpm run build    # Build 
pnpm run preview  # Preview build
```

## Deployment

```bash
pnpx wrangler secret put AUTH_CREDENTIALS  # Set basic auth credentials
pnpx wrangler secret put SECRET_KEY        # Set secret key

pnpm run deploy                            # Deploy to Cloudflare Workers
```