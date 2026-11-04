import fs from 'node:fs';
import path from 'node:path';
import type { Connect, Plugin } from 'vite';
import {
  KARTIKA_CANONICAL,
  KARTIKA_DESCRIPTION,
  KARTIKA_IMAGE,
  KARTIKA_IMAGE_ALT,
  KARTIKA_IMAGE_HEIGHT,
  KARTIKA_IMAGE_WIDTH,
  KARTIKA_POST_PATH,
  KARTIKA_TITLE,
  kartikaArticleJsonLd,
  kartikaFaqJsonLd,
  renderKartikaNoscriptHtml,
} from '../content/kartikaJapaPost';

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function replaceMeta(html: string, attr: 'name' | 'property', key: string, content: string): string {
  const pattern = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*("\\s*/>)`);
  if (!pattern.test(html)) {
    throw new Error(`Kartika static fallback: index.html is missing <meta ${attr}="${key}">`);
  }
  return html.replace(pattern, `$1${escapeAttr(content)}$2`);
}

function jsonLdScript(id: string, data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script type="application/ld+json" id="${id}">${json}</script>`;
}

/**
 * There is no prerender pipeline. This writes a route HTML file from the built
 * index.html so the first response carries the post's head tags. The SPA still
 * boots from the same bundle; the noscript article is only for clients without JS.
 */
function staticPostPath(url: string | undefined): boolean {
  const pathOnly = (url ?? '').split('?')[0];
  return pathOnly === KARTIKA_POST_PATH || pathOnly === `${KARTIKA_POST_PATH}/`;
}

export function kartikaPostStaticFallback(): Plugin {
  let outDir = '';
  const serveBuiltPost: Connect.NextHandleFunction = (req, res, next) => {
    if (!staticPostPath(req.url)) {
      next();
      return;
    }
    const file = path.join(outDir, 'kartik-month-2026-daily-online-japa', 'index.html');
    if (!fs.existsSync(file)) {
      next();
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    fs.createReadStream(file).pipe(res);
  };

  return {
    name: 'kartika-post-static-fallback',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    // Vite's preview SPA fallback serves index.html for extension-less routes.
    // This runs first so the built post file is the response for the public URL.
    configurePreviewServer(server) {
      server.middlewares.use(serveBuiltPost);
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        throw new Error(`Kartika static fallback: ${indexPath} was not built`);
      }
      let html = fs.readFileSync(indexPath, 'utf8');
      if (!html.includes('<title>Golden Age Society</title>')) {
        throw new Error('Kartika static fallback: expected the homepage <title> in index.html');
      }
      html = html.replace('<title>Golden Age Society</title>', `<title>${escapeAttr(KARTIKA_TITLE)}</title>`);
      html = replaceMeta(html, 'name', 'description', KARTIKA_DESCRIPTION);
      html = replaceMeta(html, 'property', 'og:title', KARTIKA_TITLE);
      html = replaceMeta(html, 'property', 'og:description', KARTIKA_DESCRIPTION);
      html = replaceMeta(html, 'property', 'og:type', 'article');
      html = replaceMeta(html, 'property', 'og:image', KARTIKA_IMAGE);
      html = replaceMeta(html, 'property', 'og:image:alt', KARTIKA_IMAGE_ALT);
      html = replaceMeta(html, 'property', 'og:image:width', String(KARTIKA_IMAGE_WIDTH));
      html = replaceMeta(html, 'property', 'og:image:height', String(KARTIKA_IMAGE_HEIGHT));
      html = replaceMeta(html, 'name', 'twitter:card', 'summary_large_image');
      html = replaceMeta(html, 'name', 'twitter:title', KARTIKA_TITLE);
      html = replaceMeta(html, 'name', 'twitter:description', KARTIKA_DESCRIPTION);
      html = replaceMeta(html, 'name', 'twitter:image', KARTIKA_IMAGE);

      const headExtra = [
        `    <link rel="canonical" href="${KARTIKA_CANONICAL}" />`,
        `    <meta property="og:url" content="${KARTIKA_CANONICAL}" />`,
        `    <meta name="twitter:image:alt" content="${escapeAttr(KARTIKA_IMAGE_ALT)}" />`,
        `    ${jsonLdScript('kartika-article-jsonld', kartikaArticleJsonLd)}`,
        `    ${jsonLdScript('kartika-faq-jsonld', kartikaFaqJsonLd)}`,
      ].join('\n');
      if (!html.includes('</head>')) throw new Error('Kartika static fallback: missing </head>');
      html = html.replace('</head>', `${headExtra}\n  </head>`);

      const noscript = `    <noscript>\n      ${renderKartikaNoscriptHtml()}\n    </noscript>`;
      if (!html.includes('</body>')) throw new Error('Kartika static fallback: missing </body>');
      html = html.replace('</body>', `${noscript}\n  </body>`);

      const routeDir = path.join(outDir, KARTIKA_POST_PATH.replace(/^\//, ''));
      fs.mkdirSync(routeDir, { recursive: true });
      const dest = path.join(routeDir, 'index.html');
      fs.writeFileSync(dest, html);
      console.log(`Kartika post static fallback written to ${dest}`);
    },
  };
}
