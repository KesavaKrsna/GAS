import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const outfile = path.resolve(here, '../.tmp-contact-enquiry.test.mjs');

await esbuild.build({
  entryPoints: [path.resolve(here, '../src/lib/contact-enquiry.test.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
  logLevel: 'silent',
  external: ['express', 'nodemailer', 'pino', 'pino-pretty', 'resend', 'thread-stream'],
});

const child = spawn(process.execPath, ['--test', '--test-concurrency=1', outfile], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
    VERCEL: '1',
    LOG_LEVEL: 'silent',
  },
});

const code = await new Promise((resolve) => {
  child.on('exit', (exitCode) => resolve(exitCode ?? 1));
});
await rm(outfile, { force: true });
process.exit(code);
