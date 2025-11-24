import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Knex } from 'knex';
import {
  createTestApp,
  createTestRestaurant,
  createTestReview,
} from 'test/helpers/e2e-test.helper';
import { stubUserData } from 'src/test-utils';
import { HttpReview } from 'src/reviews/http/dto/http-review';

describe('ReviewsController (E2E)', () => {
  let app: INestApplication;
  let db: Knex;
  let accessToken: string;
  let userId: number;
  let restaurantId: number;
  let reviewId: number;

  beforeAll(async () => {
    const module = await createTestApp();
    app = module.app;
    db = module.db;
    const user = stubUserData();

    // Register and login a user
    await request(app.getHttpServer()).post('/auth/register').send({
      name: user.name,
      email: user.email.toString(),
      password: user.password,
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email.toString(),
        password: user.password,
      });

    accessToken = loginResponse.body.access_token;

    // Get user ID
    const userResponse = await db('users')
      .where('email', user.email.toString())
      .first();

    userId = userResponse.id;

    // Create test restaurant
    restaurantId = await createTestRestaurant(db);

    // Create test review
    reviewId = await createTestReview(db, userId, restaurantId, { rating: 5 });
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  describe('GET /restaurants/:restaurantId/reviews', () => {
    it('should return reviews for a restaurant', async () => {
      const response = await request(app.getHttpServer())
        .get(`/restaurants/${restaurantId}/reviews`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('restaurantId', restaurantId);
      expect(response.body[0]).toHaveProperty('rating');
      expect(response.body[0]).toHaveProperty('comment');
      expect(response.body[0]).toHaveProperty('autor');
    });

    it('should return empty array when restaurant has no reviews', async () => {
      const emptyRestaurantId = await createTestRestaurant(db, {
        name: 'No Reviews Restaurant',
      });

      const response = await request(app.getHttpServer())
        .get(`/restaurants/${emptyRestaurantId}/reviews`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should return 404 when restaurant does not exist', async () => {
      await request(app.getHttpServer())
        .get('/restaurants/999/reviews')
        .expect(404);
    });
  });

  describe('GET /me/reviews', () => {
    it('should return reviews by current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/me/reviews')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0].autor.id).toBe(userId);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/me/reviews').expect(401);
    });

    it('should return empty array when user has no reviews', async () => {
      // Register new user without reviews
      await request(app.getHttpServer()).post('/auth/register').send({
        name: 'No Reviews User',
        email: 'noreviews@example.com',
        password: 'Password123!@#4567',
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'noreviews@example.com',
          password: 'Password123!@#4567',
        });

      const response = await request(app.getHttpServer())
        .get('/me/reviews')
        .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /restaurants/:restaurantId/reviews', () => {
    it('should create a new review', async () => {
      const response = await request(app.getHttpServer())
        .post(`/restaurants/${restaurantId}/reviews`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 4,
          comment: 'Great experience!',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('number');

      // Verify review was created
      const review = await db('reviews').where('id', response.body.id).first();
      expect(review).toBeDefined();
      expect(review.rating).toBe(4);
      expect(review.comments).toBe('Great experience!');
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post(`/restaurants/${restaurantId}/reviews`)
        .send({
          rating: 5,
          comment: 'Amazing!',
        })
        .expect(401);
    });

    it('should return 400 with invalid data', async () => {
      await request(app.getHttpServer())
        .post(`/restaurants/${restaurantId}/reviews`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 10, // Invalid rating (should be 1-5)
          comment: 'Test',
        })
        .expect(400);
    });

    it('should return 400 with missing fields', async () => {
      await request(app.getHttpServer())
        .post(`/restaurants/${restaurantId}/reviews`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 5,
        })
        .expect(400);
    });
  });

  describe('PUT /reviews/:id', () => {
    it('should update own review', async () => {
      await request(app.getHttpServer())
        .put(`/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 3,
          comment: 'Updated comment',
        })
        .expect(200);

      // Verify review was updated
      const review = await db('reviews').where('id', reviewId).first();
      expect(review.rating).toBe(3);
      expect(review.comments).toBe('Updated comment');
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .put(`/reviews/${reviewId}`)
        .send({
          rating: 3,
          comment: 'Test',
        })
        .expect(401);
    });

    it('should return 404 when review does not exist', async () => {
      await request(app.getHttpServer())
        .put('/reviews/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 3,
          comment: 'Test',
        })
        .expect(404);
    });

    it('should return 404 when trying to update another user review', async () => {
      // Create another user
      await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Another User',
        email: 'another@example.com',
        password: 'Password123!@#4567',
      });

      const anotherLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'another@example.com',
          password: 'Password123!@#4567',
        });

      await request(app.getHttpServer())
        .put(`/reviews/${reviewId}`)
        .set(
          'Authorization',
          `Bearer ${anotherLoginResponse.body.access_token}`,
        )
        .send({
          rating: 1,
          comment: 'Trying to update someone elses review',
        })
        .expect(404);
    });
  });

  describe('DELETE /reviews/:id', () => {
    it('should delete own review', async () => {
      await request(app.getHttpServer())
        .delete(`/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify review was deleted
      const review = await db('reviews').where('id', reviewId).first();
      expect(review).toBeUndefined();
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/reviews/${reviewId}`)
        .expect(401);
    });

    it('should return 404 when review does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/reviews/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 when trying to delete another user review', async () => {
      // Create another user
      await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Another User',
        email: 'another@example.com',
        password: 'Password123!@#4567',
      });

      const anotherLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'another@example.com',
          password: 'Password123!@#4567',
        });

      await request(app.getHttpServer())
        .delete(`/reviews/${reviewId}`)
        .set(
          'Authorization',
          `Bearer ${anotherLoginResponse.body.access_token}`,
        )
        .expect(404);
    });
  });

  describe('Integration: Complete review CRUD flow', () => {
    it('should create, read, update, and delete a review', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post(`/restaurants/${restaurantId}/reviews`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 5,
          comment: 'Initial review',
        })
        .expect(201);

      const newReviewId = createResponse.body.id;

      // Read
      const readResponse = await request(app.getHttpServer())
        .get('/me/reviews')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const createdReview = readResponse.body.find(
        (r: HttpReview) => r.id === newReviewId,
      );
      expect(createdReview).toBeDefined();
      expect(createdReview.rating).toBe(5);
      expect(createdReview.comment).toBe('Initial review');

      // Update
      await request(app.getHttpServer())
        .put(`/reviews/${newReviewId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 4,
          comment: 'Updated review',
        })
        .expect(200);

      // Verify update
      const updatedReview = await db('reviews')
        .where('id', newReviewId)
        .first();
      expect(updatedReview.rating).toBe(4);
      expect(updatedReview.comments).toBe('Updated review');

      // Delete
      await request(app.getHttpServer())
        .delete(`/reviews/${newReviewId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify deletion
      const deletedReview = await db('reviews')
        .where('id', newReviewId)
        .first();
      expect(deletedReview).toBeUndefined();
    });
  });
});
