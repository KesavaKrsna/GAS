/**
 * Vercel serverless entry for the Express API.
 * vercel.json rewrites /api/* here so Express can keep its /api prefix.
 */
export { default } from '@workspace/api-server/app';
