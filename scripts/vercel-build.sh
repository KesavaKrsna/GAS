#!/usr/bin/env bash
# Copy the Vite SPA to ./public so Vercel can find it.
# The Vite preset / dashboard default looks for a folder named "public".
# The app itself writes to artifacts/golden-age-society/dist/public (Replit).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

pnpm --filter @workspace/golden-age-society run build

SRC="$ROOT/artifacts/golden-age-society/dist/public"
if [[ ! -f "$SRC/index.html" ]]; then
  echo "Vite build did not produce $SRC/index.html" >&2
  ls -la "$SRC" >&2 || true
  exit 1
fi

rm -rf "$ROOT/public"
mkdir -p "$ROOT/public"
cp -a "$SRC"/. "$ROOT/public/"

echo "Copied Vite output to $ROOT/public"
ls -la "$ROOT/public/index.html"

# Pre-bundle Express so Vercel does not compile workspace TypeScript.
node "$ROOT/artifacts/api-server/build-vercel.mjs"
if [[ ! -f "$ROOT/api/index.mjs" ]]; then
  echo "API bundle was not written to api/index.mjs" >&2
  exit 1
fi
size="$(wc -c < "$ROOT/api/index.mjs")"
if [[ "$size" -lt 10000 ]]; then
  echo "API bundle is too small (${size} bytes); esbuild likely failed" >&2
  exit 1
fi
echo "API bundle ${size} bytes"
