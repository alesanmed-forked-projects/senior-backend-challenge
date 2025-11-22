import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Knex } from 'knex';
import {
  createTestApp,
  createTestRestaurant,
  createTestReview,
} from 'test/helpers/e2e-test.helper';

describe('FavoriteController (E2E)', () => {
  let app: INestApplication;
  let db: Knex;
  let accessToken: string;
  let userId: number;
  let restaurantId: number;

  beforeAll(async () => {
    const module = await createTestApp();
    app = module.app;
    db = module.db;

    // Register and login a user
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Favorites User',
      email: 'favorites@example.com',
      password: 'Password123!@#4567',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'favorites@example.com',
        password: 'Password123!@#4567',
      })
      .expect(201);

    accessToken = loginResponse.body.access_token;

    // Get user ID
    const userRow = await db('users')
      .where('email', 'favorites@example.com')
      .first();
    userId = userRow.id;

    // Create a restaurant and at least one review so average_rating is computed
    restaurantId = await createTestRestaurant(db, {
      name: 'Favorite Restaurant',
    });
    await createTestReview(db, userId, restaurantId, { rating: 5 });
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  describe('GET /me/favorites', () => {
    it('should return empty array when user has no favorites', async () => {
      const response = await request(app.getHttpServer())
        .get('/me/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return favorites when user has favorites', async () => {
      await request(app.getHttpServer())
        .post(`/me/favorites/${restaurantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/me/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(restaurantId);
    });
  });

  describe('POST /me/favorites/:restaurantId', () => {
    it('should add a restaurant to favorites', async () => {
      await request(app.getHttpServer())
        .post(`/me/favorites/${restaurantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/me/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(restaurantId);
    });

    it('should return 404 when restaurant does not exist', async () => {
      await request(app.getHttpServer())
        .post('/me/favorites/9999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post(`/me/favorites/${restaurantId}`)
        .expect(401);
    });
  });

  describe('DELETE /me/favorites/:restaurantId', () => {
    it('should delete a favorite', async () => {
      // Ensure favorite exists
      await request(app.getHttpServer())
        .post(`/me/favorites/${restaurantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/me/favorites/${restaurantId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/me/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(0);
    });

    it('should return 404 when favorite does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/me/favorites/9999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/me/favorites/${restaurantId}`)
        .expect(401);
    });
  });
});
