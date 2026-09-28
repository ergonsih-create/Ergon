/**
 * @license
 * GRAM-DISHA — Unified Server Entrypoint (Express + FastAPI Proxy + Vite)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides server-side Whisper speech recognition and proxies all /api/v1/*
 * domain endpoints to the FastAPI Python backend on 127.0.0.1:8055.
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { spawn, execSync } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { whisperRouter } from './server/whisperRouter.js';
import { apiRouter } from './server/apiRouter.js';
import { geminiRouter } from './server/geminiRouter.js';

// Load environment variables from .env if present
dotenv.config();

const FASTAPI_PORT = 8055;
const FASTAPI_HOST = '127.0.0.1';

// Ensure FastAPI uvicorn daemon is running with latest code
function ensureFastApiDaemon() {
  const isWin = process.platform === 'win32';
  try {
    if (!isWin) {
      execSync('pkill -f "uvicorn app.main:app" || true');
    }
  } catch {}

  console.log(`[FastAPI] Spawning background Uvicorn daemon on port ${FASTAPI_PORT}...`);
  const pythonCmd = isWin ? 'python' : 'python3';
  const pyProc = spawn(pythonCmd, ['-m', 'uvicorn', 'app.main:app', '--port', String(FASTAPI_PORT), '--host', FASTAPI_HOST], {
    cwd: path.join(process.cwd(), 'backend'),
    env: { ...process.env, PYTHONPATH: path.join(process.cwd(), 'backend') },
    stdio: 'inherit',
    detached: true,
  });
  pyProc.unref();
}

async function startServer() {
  ensureFastApiDaemon();

  const app = express();
  const PORT = 3000;

  // Disable server identification header
  app.disable('x-powered-by');

  // Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(self)');
    next();
  });

  // In-Memory Rate Limiter Middleware for API routes (120 req / 15 mins per IP)
  const apiRateMap = new Map<string, { count: number; resetTime: number }>();
  app.use('/api', (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 mins
    const limit = 120;

    const record = apiRateMap.get(ip) || { count: 0, resetTime: now + windowMs };
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }
    apiRateMap.set(ip, record);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - record.count));

    if (record.count > limit) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'API rate limit exceeded. Please try again shortly.',
      });
    }
    next();
  });

  // Express body parsers for JSON and URL-encoded requests with size limits
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Basic Input Sanitization Middleware to mitigate XSS in payloads
  app.use((req, _res, next) => {
    if (req.body && typeof req.body === 'object') {
      const sanitizeValue = (val: any): any => {
        if (typeof val === 'string') {
          return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        } else if (Array.isArray(val)) {
          return val.map(sanitizeValue);
        } else if (val && typeof val === 'object') {
          for (const k of Object.keys(val)) {
            val[k] = sanitizeValue(val[k]);
          }
        }
        return val;
      };
      req.body = sanitizeValue(req.body);
    }
    next();
  });

  // API Health Check
  app.get('/api/health', async (_req, res) => {
    let fastApiHealthy = false;
    try {
      const resp = await fetch(`http://${FASTAPI_HOST}:${FASTAPI_PORT}/health`, { signal: AbortSignal.timeout(1500) });
      fastApiHealthy = resp.ok;
    } catch {
      fastApiHealthy = false;
    }

    res.json({
      status: 'healthy',
      service: 'GRAM-DISHA Unified Gateway (Express + FastAPI)',
      environment: process.env.NODE_ENV || 'development',
      fastApiConnected: fastApiHealthy,
      whisperConfigured: Boolean(process.env.OPENAI_API_KEY),
      whisperModel: process.env.WHISPER_MODEL || 'whisper-1',
    });
  });

  // Mount Whisper Speech Intelligence Router
  app.use('/api/whisper', whisperRouter);
  app.use('/api/v1/whisper', whisperRouter);

  // Mount Gemini Router
  app.use('/api/gemini', geminiRouter);
  app.use('/api/v1/gemini', geminiRouter);

  // Reverse Proxy middleware forwarding /api/v1/* requests to FastAPI backend (127.0.0.1:8055)
  const proxyToFastApi: express.RequestHandler = (req, res, next) => {
    if (res.headersSent) return;

    const options: http.RequestOptions = {
      hostname: FASTAPI_HOST,
      port: FASTAPI_PORT,
      path: req.originalUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${FASTAPI_HOST}:${FASTAPI_PORT}`,
      },
      timeout: 8000,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('timeout', () => {
      proxyReq.destroy();
      console.warn(`[Gateway Proxy] Request to FastAPI timed out for ${req.originalUrl}`);
      if (!res.headersSent) {
        next();
      }
    });

    proxyReq.on('error', (_err) => {
      if (!res.headersSent) {
        next();
      }
    });

    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
      if (!req.headers['content-type']?.includes('multipart')) {
        proxyReq.setHeader('Content-Type', 'application/json');
      }
      proxyReq.setHeader('Content-Length', bodyData.length);
      proxyReq.write(bodyData);
    }
    proxyReq.end();
  };

  // Mount Proxy to FastAPI with fallback to local apiRouter for all /api/v1/* routes
  app.use('/api/v1', proxyToFastApi, apiRouter);

  // Vite middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Wrap express app with http.Server for WebSocket support
  const httpServer = http.createServer(app);

  // Attach WebSocket Server for Gemini Live API (gemini-3.1-flash-live-preview)
  const wss = new WebSocketServer({ server: httpServer, path: '/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Live API WS] Client connected to /live');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('[Live API WS] GEMINI_API_KEY is not set');
      clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY environment variable is missing.' }));
      clientWs.close();
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const session = await ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: 'You are GRAM-DISHA, an AI voice co-pilot providing real-time assistance to rural and semi-urban entrepreneurs in India on business ideas, government schemes (PMEGP, Mudra, Lakhpati Didi), financial planning, and micro-enterprise operations. Speak in a helpful, friendly, and clear conversational tone.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const modelText = message.serverContent?.modelTurn?.parts?.[0]?.text;
            const outputTrans = (message.serverContent as any)?.outputTranscription?.text || (message.serverContent as any)?.outputAudioTranscription?.text;
            const inputTrans = (message.serverContent as any)?.inputTranscription?.text || (message.serverContent as any)?.inputAudioTranscription?.text;
            const interrupted = message.serverContent?.interrupted;

            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  audio: audioData || null,
                  text: modelText || null,
                  outputTranscription: outputTrans || null,
                  inputTranscription: inputTrans || null,
                  interrupted: Boolean(interrupted),
                })
              );
            }
          },
          onclose: () => {
            console.log('[Live API WS] Gemini Live session ended');
          },
          onerror: (err) => {
            console.error('[Live API WS] Gemini Live error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: err?.message || 'Gemini Live API error' }));
            }
          },
        },
      });

      clientWs.on('message', (rawData) => {
        try {
          const parsed = JSON.parse(rawData.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: {
                data: parsed.audio,
                mimeType: parsed.mimeType || 'audio/pcm;rate=16000',
              },
            });
          } else if (parsed.text) {
            session.sendRealtimeInput({
              text: parsed.text,
            });
          }
        } catch (err) {
          console.error('[Live API WS] Error parsing client message:', err);
        }
      });

      clientWs.on('close', () => {
        console.log('[Live API WS] Client disconnected');
        session.close();
      });
    } catch (err: any) {
      console.error('[Live API WS] Live connection creation failed:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: err?.message || 'Failed to establish Live session' }));
      }
      clientWs.close();
    }
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`GRAM-DISHA Gateway running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start GRAM-DISHA server:', err);
  process.exit(1);
});
