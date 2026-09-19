import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';

const UPDATES_DIR = path.join(process.cwd(), 'updates');
const LATEST_FILE = path.join(UPDATES_DIR, 'latest.json');

const allowedOrigins = [
  // Capacitor WebView origins (Android default scheme, iOS for later)
  'https://localhost',
  'capacitor://localhost',
];

const app = express();
// Railway terminates TLS at its proxy; trust its X-Forwarded-Proto so req.protocol reports https.
app.set('trust proxy', 1);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/app/version', (req, res) => {
  if (!fs.existsSync(LATEST_FILE)) {
    res.status(404).json({ error: 'No update published yet' });
    return;
  }

  const raw = fs.readFileSync(LATEST_FILE, 'utf-8').replace(/^﻿/, '');
  const latest = JSON.parse(raw);
  const url = `${req.protocol}://${req.get('host')}/updates/files/${latest.file}`;
  res.json({ version: latest.version, url });
});

app.use('/updates/files', express.static(path.join(UPDATES_DIR, 'files')));

const PORT = Number(process.env.PORT) || 8081;
app.listen(PORT, () => {
  console.log(`OTA server running on port ${PORT}`);
});
