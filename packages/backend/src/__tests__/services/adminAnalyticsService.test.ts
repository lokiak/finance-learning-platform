/// <reference types="jest" />

import { AdminAnalyticsService } from '../../services/adminAnalyticsService';
import { prisma } from '../../index';

// Mock Prisma
jest.mock('../../index', () => ({
  prisma: {
    user: {
      count: jest.fn(),
    },
    module: {
      count: jest.fn(),
    },
    userProgress: {
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    moodEntry: {
      findMany: jest.fn(),
    },
  },
}));

describe('AdminAnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should return comprehensive analytics', async () => {
      // Mock data
      (prisma.user.count as jest.Mock).mockResolvedValue(100);
      (prisma.module.count as jest.Mock).mockResolvedValue(17);
      (prisma.userProgress.groupBy as jest.Mock).mockResolvedValue([
        { status: 'completed', _count: 50 },
        { status: 'in_progress', _count: 30 },
      ]);
      // Mock userProgress.findMany - first call for engagement, second for adaptive path
      (prisma.userProgress.findMany as jest.Mock)
        .mockResolvedValueOnce([]) // For engagement metrics
        .mockResolvedValueOnce([
          { adaptive_path_taken: 'fast' },
          { adaptive_path_taken: 'standard' },
          { adaptive_path_taken: 'thorough' },
          { adaptive_path_taken: 'remedial' },
        ]); // For adaptive path usage

      // Mock stress predictions (using any for Prisma type issues)
      (prisma as any).stressPrediction = {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      };

      // Mock learning styles
      (prisma as any).learningStyle = {
        findMany: jest.fn().mockResolvedValue([]),
      };

      // Mock concept masteries
      (prisma as any).conceptMastery = {
        findMany: jest.fn().mockResolvedValue([]),
      };

      // Mock reflective thinking processes
      (prisma as any).reflectiveThinkingProcess = {
        findMany: jest.fn().mockResolvedValue([]),
      };

      // Mock learning performances
      (prisma as any).learningPerformance = {
        findMany: jest.fn().mockResolvedValue([]),
      };

      // Mock learning interventions
      (prisma as any).learningIntervention = {
        findMany: jest.fn().mockResolvedValue([]),
      };

      const analytics = await AdminAnalyticsService.getAnalytics();

      expect(analytics).toHaveProperty('overview');
      expect(analytics).toHaveProperty('predictions');
      expect(analytics).toHaveProperty('adaptations');
      expect(analytics).toHaveProperty('support');
      expect(analytics).toHaveProperty('engagement');
      expect(analytics).toHaveProperty('reflection');
      expect(analytics).toHaveProperty('performance');
      expect(analytics.overview.totalUsers).toBe(100);
      expect(analytics.overview.totalModules).toBe(17);
    });
  });
});

