import pg from "pg";

let pool: pg.Pool | null = null;

/** Lazily created pool, so importing this never crashes when DATABASE_URL is unset. */
export function getPool(): pg.Pool {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  pool = new pg.Pool({
    connectionString,
    max: 3,
    ssl: /localhost|127\.0\.0\.1/.test(connectionString) ? undefined : { rejectUnauthorized: false },
  });
  return pool;
}
