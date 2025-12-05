// @ts-ignore - supertest types may not be resolved by IDE but work at runtime
import request from 'supertest';
import { Express } from 'express';
import { prisma } from '../../index';
import { createUserWithRole } from '../../utils/prismaHelpers';
import bcrypt from 'bcrypt';
import { createTestApp } from '../helpers/testApp';

let app: Express;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  app = createTestApp();

  // Clean up any existing test users first
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['test_admin@example.com', 'test_user@example.com'],
      },
    },
  });

  // Create admin user using type-safe helper
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10); // Reduced rounds for faster tests
  await createUserWithRole(prisma, {
    email: 'test_admin@example.com',
    password_hash: adminPasswordHash,
    name: 'Test Admin',
    role: 'admin',
  });

  // Login as admin to get token
  const adminLoginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test_admin@example.com',
      password: 'AdminPassword123!',
    });

  if (!adminLoginResponse.body.token) {
    console.error('Admin login failed:', adminLoginResponse.status, adminLoginResponse.body);
    throw new Error('Failed to get admin token');
  }
  adminToken = adminLoginResponse.body.token;

  // Create regular user using type-safe helper
  const userPasswordHash = await bcrypt.hash('UserPassword123!', 10); // Reduced rounds for faster tests
  await createUserWithRole(prisma, {
    email: 'test_user@example.com',
    password_hash: userPasswordHash,
    name: 'Test User',
    role: 'user',
  });

  // Login as regular user
  const userLoginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test_user@example.com',
      password: 'UserPassword123!',
    });

  if (!userLoginResponse.body.token) {
    console.error('User login failed:', userLoginResponse.status, userLoginResponse.body);
    throw new Error('Failed to get user token');
  }
  userToken = userLoginResponse.body.token;
}, 10000); // 10 second timeout

afterAll(async () => {
  // Clean up test data
  try {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['test_admin@example.com', 'test_user@example.com'],
        },
      },
    });
  } catch (error) {
    // Ignore cleanup errors
  }

  // Force disconnect to prevent hanging
  await prisma.$disconnect();

  // Give Jest time to exit
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Admin API Integration Tests', () => {
  describe('GET /api/admin/analytics', () => {
    it('should return analytics for admin user', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('analytics');
      expect(response.body.analytics).toHaveProperty('overview');
      expect(response.body.analytics).toHaveProperty('predictions');
      expect(response.body.analytics).toHaveProperty('adaptations');
      expect(response.body.analytics).toHaveProperty('support');
      expect(response.body.analytics).toHaveProperty('engagement');
      expect(response.body.analytics).toHaveProperty('reflection');
      expect(response.body.analytics).toHaveProperty('performance');
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/admin/analytics')
        .expect(401);
    });

    it('should return analytics overview', async () => {
      const response = await request(app)
        .get('/api/admin/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('overview');
      expect(response.body.overview).toHaveProperty('totalUsers');
      expect(response.body.overview).toHaveProperty('totalModules');
    });

    it('should return predictions analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics/predictions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('predictions');
    });

    it('should return adaptations analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics/adaptations')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('adaptations');
    });

    it('should return support analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics/support')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('support');
    });

    it('should return engagement analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics/engagement')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('engagement');
    });

    it('should return reflection analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics/reflection')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('reflection');
    });

    it('should return performance analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics/performance')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('performance');
    });
  });
});

