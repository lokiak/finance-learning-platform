import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Express } from 'express';

// Import routes
import authRoutes from '../../routes/auth';
import userRoutes from '../../routes/users';
import moduleRoutes from '../../routes/modules';
import progressRoutes from '../../routes/progress';
import calculatorRoutes from '../../routes/calculators';
import goalRoutes from '../../routes/goals';
import achievementRoutes from '../../routes/achievements';
import aiRoutes from '../../routes/ai';
import journalRoutes from '../../routes/journal';
import moodRoutes from '../../routes/mood';
import preferencesRoutes from '../../routes/preferences';
import adaptiveLearningRoutes from '../../routes/adaptiveLearning';
import reflectionRoutes from '../../routes/reflection';
import wellnessRoutes from '../../routes/wellness';
import supportRoutes from '../../routes/support';
import holisticRoutes from '../../routes/holistic';
import adminRoutes from '../../routes/admin';

// Import middleware
import { errorHandler } from '../../middleware/errorHandler';

export function createTestApp(): Express {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Disable morgan in tests
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

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

  return app;
}

