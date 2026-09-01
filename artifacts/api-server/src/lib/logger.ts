import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const isServerless = Boolean(process.env.VERCEL);

const redact = [
  "req.headers.authorization",
  "req.headers.cookie",
  "res.headers['set-cookie']",
];

const base = {
  level: process.env.LOG_LEVEL ?? "info",
  redact,
};

// Avoid pino-pretty / thread-stream workers on Vercel Functions.
export const logger =
  isProduction || isServerless
    ? pino(base, pino.destination({ dest: 1, sync: true }))
    : pino({
        ...base,
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      });
