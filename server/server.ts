import 'dotenv/config';

import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './api';
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

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const cliPort = getCliArg('--port') || getCliArg('-p');
const port = cliPort ? parseInt(cliPort, 10) : (isProd && process.env.PORT ? parseInt(process.env.PORT, 10) : 3001);
const host = getCliArg('--host') || '0.0.0.0';

app.use(express.json());

// API endpoints
app.use('/api', apiRouter);

// Serve static build in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

export default app;
