import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { apiRouter } from './api';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCliArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv[index + 1] && !process.argv[index + 1].startsWith('-')) {
    return process.argv[index + 1];
  }
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  if (match) {
    return match.slice(prefix.length);
  }
  return undefined;
}

export async function startServer() {
  const app = express();

  const isProduction = process.env.NODE_ENV === 'production';
  const cliPort = getCliArg('--port') || getCliArg('-p');
  const cliHost = getCliArg('--host') || getCliArg('-h');

  // In development, the AI Studio dev server runs on port 3001.
  // In production (Cloud Run), honor PORT environment variable or CLI --port.
  // Never default to 8080 in dev because 8080 is reserved for the platform proxy/nginx.
const port = cliPort
  ? parseInt(cliPort, 10)
  : (process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3001);
const host = cliHost || process.env.HOST || '0.0.0.0';

  app.disable('x-powered-by');

  // Security Headers & CORS Preflight Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Admin-Secret');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json({ limit: '15mb' }));

  // Cloud Run Health check probes (both /health and /api/health)
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'buzzing-brain', timestamp: new Date().toISOString() });
  });

  // REST API endpoints
  app.use('/api', apiRouter);

  // Locate the built frontend dist/ directory
  const candidatePaths = [
    path.resolve(__dirname, 'index.html'),
    path.resolve(__dirname, 'dist', 'index.html'),
    path.resolve(__dirname, '../dist', 'index.html'),
    path.resolve(process.cwd(), 'dist', 'index.html'),
  ];

  let resolvedDistPath = '';
  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      resolvedDistPath = path.dirname(candidate);
      break;
    }
  }

  if (isProduction && resolvedDistPath) {
    console.log(`[Buzzing Brain] Serving static production build from ${resolvedDistPath}`);
    app.use(express.static(resolvedDistPath, { maxAge: '1h', index: 'index.html' }));

    // SPA fallback: serve index.html for all non-API GET requests
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(resolvedDistPath, 'index.html'));
    });
  } else {
    console.log('[DEBUG] Importing Vite...');

const { createServer: createViteServer } = await import('vite');

console.log('[DEBUG] Vite imported successfully.');
console.log('[DEBUG] Creating Vite development server...');

const vite = await createViteServer({
  configFile: path.resolve(process.cwd(), 'vite.config.ts'),
  server: {
    middlewareMode: true,
    host,
  },
  appType: 'spa',
});

console.log('[DEBUG] Vite development server created successfully.');

app.use(vite.middlewares);

console.log('[DEBUG] Vite middleware attached successfully.');
  }

  const server = app.listen(port, host, () => {
    console.log(`[Buzzing Brain] Server successfully listening on http://${host}:${port}`);
  });

  server.on('error', (err: any) => {
    console.error(`[Buzzing Brain] Server error on port ${port}:`, err);
    process.exit(1);
  });

  // Graceful shutdown handling for Cloud Run container lifecycle
  process.on('SIGTERM', () => {
    console.log('[Buzzing Brain] SIGTERM received. Gracefully shutting down HTTP server...');
    server.close(() => {
      console.log('[Buzzing Brain] HTTP server closed cleanly.');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('[Buzzing Brain] SIGINT received. Shutting down...');
    server.close(() => {
      process.exit(0);
    });
  });

  return server;
}

// Automatically start server when executed as main entry
startServer().catch((err) => {
  console.error('[Buzzing Brain] Failed to start server:', err);
  process.exit(1);
});
