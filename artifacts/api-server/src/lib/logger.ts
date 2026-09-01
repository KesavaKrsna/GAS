import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const isServerless = Boolean(process.env.VERCEL);

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  // pino-pretty / thread-stream workers are not reliable on Vercel Functions
  ...(isProduction || isServerless
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
