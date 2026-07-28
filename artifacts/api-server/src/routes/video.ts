import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger.js';

const videoRouter = Router();

const VIDEO_DIRS = [
  // Production: workspace root relative
  path.resolve(process.cwd(), 'artifacts/golden-age-society/public'),
  // Development fallback
  path.resolve(process.cwd(), '../../artifacts/golden-age-society/public'),
];

function findVideo(name: string): string | null {
  const safe = path.basename(name); // prevent path traversal
  for (const dir of VIDEO_DIRS) {
    const full = path.join(dir, safe);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

// GET /api/video/:name  — stream with range-request support
videoRouter.get('/video/:name', (req, res) => {
  const filePath = findVideo(req.params.name);
  if (!filePath) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Accept-Ranges', 'bytes');

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', chunkSize);

    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.setHeader('Content-Length', fileSize);
    fs.createReadStream(filePath).pipe(res);
  }

  logger.info({ file: req.params.name }, 'Video streamed');
});

export default videoRouter;
