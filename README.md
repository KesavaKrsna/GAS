# Golden Age Society

Public website for Golden Age Society (Vite + React) with an Express API for contact mail and Paystack donations.

## Deploy on Vercel

Import **this GitHub repository** at [vercel.com/new](https://vercel.com/new). Leave **Root Directory** as the repo root (`.`). `vercel.json` already sets the install command, Vite build, static output folder, SPA fallback, and `/api` function.

### Environment variables

Set these in Vercel → Project → Settings → Environment Variables. Apply them to **Production** and **Preview**. The Paystack *public* key is inlined at **build** time, so add it before the first deploy (or Redeploy after changing it).

| Name | Needed for | Notes |
| --- | --- | --- |
| `VITE_PAYSTACK_PUBLIC_KEY` | Donate page | Paystack public key (`pk_live_…` or `pk_test_…`). `PAYSTACK_PUBLIC_KEY` also works. |
| `PAYSTACK_SECRET_KEY` | Recurring gifts + verification | Server-only. Never prefix with `VITE_`. |
| `RESEND_API_KEY` | Contact form + donation certificates | From [resend.com](https://resend.com). |
| `RESEND_FROM` | Outbound email | Must be a verified Resend domain, e.g. `Golden Age Society <donations@your-domain>`. |
| `CONTACT_EMAIL` | Contact form inbox | Defaults to `ocsacademy2020@gmail.com` if unset. |

`DATABASE_URL` is **not** required for this site. Postgres is scaffolded in `lib/db` but unused by the live routes.

### After import

1. Enable **Git LFS** in Vercel → Project → Settings → Git. The homepage video `in-every-town.mp4` is stored with Git LFS; without this toggle Vercel deploys a 133-byte pointer and the video will not play.
2. Deploy. The site is the Vite app in `artifacts/golden-age-society`. Contact (`POST /api/contact`) and donate (`POST /api/donate/*`) run as one Vercel Function wrapping the Express app.
3. Confirm `GET /api/healthz` returns `{"status":"ok"}`.

### Local

```bash
pnpm install
pnpm --filter @workspace/golden-age-society run dev   # Vite, port 5173
pnpm --filter @workspace/api-server run dev           # Express, requires PORT
```

The frontend calls `/api/...` on the same origin. On Vercel that is the function. Locally, run the API on another port and proxy, or use `vercel dev`.
