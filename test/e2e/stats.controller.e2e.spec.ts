import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request, { type Response } from 'supertest';
import { Knex } from 'knex';
import {
  createTestApp,
  createTestRestaurant,
  createTestUser,
  createTestReview,
} from 'test/helpers/e2e-test.helper';
import { stubUserData } from 'src/test-utils';
import { Stats } from 'src/dashboard/domain/entities/stats';

describe('StatsController (E2E)', () => {
  let app: INestApplication;
  let db: Knex;
  let adminAccessToken: string;

  beforeAll(async () => {
    const module = await createTestApp();
    app = module.app;
    db = module.db;

    // Seed users
    const user1 = await createTestUser(db);
    const user2 = await createTestUser(db);

    // Seed restaurants
    const restaurant1Id = await createTestRestaurant(db, {
      name: 'Stats Restaurant 1',
    });
    const restaurant2Id = await createTestRestaurant(db, {
      name: 'Stats Restaurant 2',
    });

    // Seed reviews
    await createTestReview(db, user1.id, restaurant1Id, { rating: 5 });
    await createTestReview(db, user2.id, restaurant1Id, { rating: 4 });
    await createTestReview(db, user1.id, restaurant2Id, { rating: 3 });
    await createTestReview(db, user2.id, restaurant2Id, { rating: 2 });

    // Create admin user
    const admin = stubUserData();
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: admin.name,
        email: admin.email.toString(),
        password: admin.password,
      })
      .expect(201);

    await db('users')
      .where('email', admin.email.toString())
      .update({ role: 'ADMIN' });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: admin.email.toString(),
        password: admin.password,
      })
      .expect(201);

    adminAccessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app?.close();
    await db?.destroy();
  });

  describe('GET /admin/stats as admin', () => {
    let response: Response;
    let stats: Stats;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .get('/admin/stats')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      stats = response.body.data;
    });

    it('should respond with status 200', () => {
      expect(response.statusCode).toBe(200);
    });

    it('should include stats object in response body', () => {
      expect(stats).toBeDefined();
    });

    it('should include totalUsers field in stats', () => {
      expect('totalUsers' in stats).toBe(true);
    });

    it('should include totalRestaurants field in stats', () => {
      expect('totalRestaurants' in stats).toBe(true);
    });

    it('should include totalReviews field in stats', () => {
      expect('totalReviews' in stats).toBe(true);
    });

    it('should include topRatedRestaurants field in stats', () => {
      expect('topRatedRestaurants' in stats).toBe(true);
    });

    it('should include topReviewedRestaurants field in stats', () => {
      expect('topReviewedRestaurants' in stats).toBe(true);
    });

    it('should have totalUsers as a number', () => {
      expect(typeof stats.totalUsers).toBe('number');
    });

    it('should have totalRestaurants as a number', () => {
      expect(typeof stats.totalRestaurants).toBe('number');
    });

    it('should have totalReviews as a number', () => {
      expect(typeof stats.totalReviews).toBe('number');
    });

    it('should have totalUsers with the expected value', () => {
      expect(stats.totalUsers).toBe(3);
    });

    it('should have totalRestaurants with the expected value', () => {
      expect(stats.totalRestaurants).toBe(2);
    });

    it('should have totalReviews with the expected value', () => {
      expect(stats.totalReviews).toBe(4);
    });

    it('should have topRatedRestaurants as an array', () => {
      expect(Array.isArray(stats.topRatedRestaurants)).toBe(true);
    });

    it('should have topReviewedRestaurants as an array', () => {
      expect(Array.isArray(stats.topReviewedRestaurants)).toBe(true);
    });

    it('should have exactly two top rated restaurants', () => {
      expect(stats.topRatedRestaurants.length).toBe(2);
    });

    it('should have exactly two top reviewed restaurants', () => {
      expect(stats.topReviewedRestaurants.length).toBe(2);
    });
  });

  it('should return 401 when not authenticated', async () => {
    await request(app.getHttpServer()).get('/admin/stats').expect(401);
  });

  it('should return 403 when user is not admin', async () => {
    const nonAdmin = stubUserData();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: nonAdmin.name,
        email: nonAdmin.email.toString(),
        password: nonAdmin.password,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: nonAdmin.email.toString(),
        password: nonAdmin.password,
      })
      .expect(201);

    const token = loginResponse.body.access_token;

    await request(app.getHttpServer())
      .get('/admin/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
