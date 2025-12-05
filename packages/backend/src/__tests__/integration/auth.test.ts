// @ts-ignore - supertest types may not be resolved by IDE but work at runtime
import request from 'supertest';
import { Express } from 'express';
import { prisma } from '../../index';
import bcrypt from 'bcrypt';
import { createTestApp } from '../helpers/testApp';

let app: Express;

beforeAll(async () => {
  app = createTestApp();

  // Clean up test data
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: 'test_',
      },
    },
  });
});

afterAll(async () => {
  // Clean up test data
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: 'test_',
      },
    },
  });
  await prisma.$disconnect();
});

describe('Auth API Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test_register@example.com',
          password: 'TestPassword123!',
          name: 'Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test_register@example.com');
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 409 if user already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test_duplicate@example.com',
          password: 'TestPassword123!',
          name: 'Test User',
        });

      // Try to register again
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test_duplicate@example.com',
          password: 'TestPassword123!',
          name: 'Test User',
        })
        .expect(409);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'TestPassword123!',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test_weak@example.com',
          password: '123',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const password_hash = await bcrypt.hash('TestPassword123!', 12);
      await prisma.user.upsert({
        where: { email: 'test_login@example.com' },
        update: { password_hash },
        create: {
          email: 'test_login@example.com',
          password_hash,
          name: 'Test Login User',
        },
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test_login@example.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test_login@example.com');
    });

    it('should return 401 with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test_login@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeAll(async () => {
      // Create user and get token
      const password_hash = await bcrypt.hash('TestPassword123!', 12);
      await prisma.user.create({
        data: {
          email: 'test_me@example.com',
          password_hash,
          name: 'Test Me User',
        },
      });

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test_me@example.com',
          password: 'TestPassword123!',
        });
      authToken = loginResponse.body.token;
    });

    it('should return user data with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test_me@example.com');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });

    it('should support ETag caching', async () => {
      const firstResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const etag = firstResponse.headers.etag;
      expect(etag).toBeDefined();

      // Second request with ETag should return 304
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .set('If-None-Match', etag)
        .expect(304);
    });
  });
});

