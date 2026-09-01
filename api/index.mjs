// Overwritten by `pnpm run vercel-build` (artifacts/api-server/build-vercel.mjs).
// Kept in git so Vercel always sees an /api function entry.
export default function unbundledApi(request, response) {
  response.statusCode = 500;
  response.end("API bundle missing. The Vercel build did not run scripts/vercel-build.sh.");
}
