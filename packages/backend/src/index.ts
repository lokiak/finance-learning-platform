import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import moduleRoutes from './routes/modules';
import progressRoutes from './routes/progress';
import calculatorRoutes from './routes/calculators';
import goalRoutes from './routes/goals';
import achievementRoutes from './routes/achievements';
import aiRoutes from './routes/ai';
import journalRoutes from './routes/journal';
import moodRoutes from './routes/mood';
import preferencesRoutes from './routes/preferences';
import adaptiveLearningRoutes from './routes/adaptiveLearning';
import reflectionRoutes from './routes/reflection';
import wellnessRoutes from './routes/wellness';
import supportRoutes from './routes/support';
import holisticRoutes from './routes/holistic';
import adminRoutes from './routes/admin';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/calculators', calculatorRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/learning', adaptiveLearningRoutes);
app.use('/api/reflection', reflectionRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/holistic', holisticRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Error handling middleware
app.use(errorHandler);

// Start server (skip in test environment)
async function startServer() {
  // Don't start server in test environment
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
  });

  startServer();
}
