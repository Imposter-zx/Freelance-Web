import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './src/db/pool.js';
import { initializeDatabase } from './src/db/schema.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import projectRoutes from './src/routes/projects.js';
import messageRoutes from './src/routes/messages.js';
import paymentRoutes from './src/routes/payments.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { requestLogger } from './src/middleware/requestLogger.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');

// CORS: accept a comma-separated allowlist, falling back to the local dev app.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://imposter-zx.github.io')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header (curl, server-to-server) are allowed.
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      const error = new Error('Origin not allowed by CORS');
      error.status = 403;
      return callback(error);
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler (must be last)
app.use(errorHandler);

let server = null;

export const startServer = async () => {
  if (server) return server;

  const databaseReady = await initializeDatabase();
  if (!databaseReady && process.env.NODE_ENV === 'production') {
    console.error('❌ Refusing to start without a working database in production.');
    process.exit(1);
  }

  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (!databaseReady) {
      console.warn('⚠️  Starting without a confirmed database connection (development mode).');
    }
  });

  return server;
};

export const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
  await pool.end();
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n📴 Shutting down gracefully...');
  await stopServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopServer();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export { pool };
export default app;
