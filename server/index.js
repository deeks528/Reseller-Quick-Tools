import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import apiRoutes from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { initRetentionScheduler } from './src/services/orderRetentionJob.js';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// CORS configuration supporting credentials (httpOnly cookie)
const allowedOrigins = [
  ENV.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.github.io')) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'reseller-tools-api', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect to Database & Start Server
const startServer = async () => {
  await connectDB();

  // Initialize scheduled jobs
  initRetentionScheduler();

  app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Reseller Tools Server running on port ${ENV.PORT}`);
    console.log(`   Environment: ${ENV.NODE_ENV}`);
    console.log(`   Public App URL: ${ENV.PUBLIC_APP_URL}`);
    console.log(`====================================================`);
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});

export default app;
