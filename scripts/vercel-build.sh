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
