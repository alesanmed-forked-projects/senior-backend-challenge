import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Knex } from 'knex';
import {
  createTestApp,
  createTestRestaurant,
  createTestUser,
  createTestReview,
} from 'test/helpers/e2e-test.helper';
import { stubUserData } from 'src/test-utils';

describe('RestaurantController (E2E)', () => {
  let app: INestApplication;
  let db: Knex;
  let restaurantId: number;
  let userId: number;
  let adminAccessToken: string;

  beforeAll(async () => {
    const module = await createTestApp();
    app = module.app;
    db = module.db;

    // Create test data
    const user = await createTestUser(db);
    userId = user.id;

    restaurantId = await createTestRestaurant(db, {
      name: 'Test Restaurant',
      neighborhood: 'Manhattan',
      cuisine_type: 'Italian',
    });

    // Add reviews to calculate average rating
    await createTestReview(db, userId, restaurantId, { rating: 5 });
    await createTestReview(db, userId, restaurantId, { rating: 3 });

    // Create user
    const admin = stubUserData();
    await request(app.getHttpServer()).post('/auth/register').send({
      name: admin.name,
      email: admin.email.toString(),
      password: admin.password,
    });

    // Promote user to ADMIN
    await db('users')
      .where('email', admin.email.toString())
      .update({ role: 'ADMIN' });

    // Login to obtain JWT
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

  describe('GET /restaurants', () => {
    it('should return paginated restaurants', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return restaurant with average rating', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);

      const restaurant = response.body.data[0];
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name', 'Test Restaurant');
      expect(restaurant).toHaveProperty('neighborhood', 'Manhattan');
      expect(restaurant).toHaveProperty('cuisine_type', 'Italian');
      expect(restaurant).toHaveProperty('average_rating', 4); // Average of 5 and 3
    });

    it('should filter by cuisine type', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants?cuisine=Italian')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].cuisine_type).toBe('Italian');
    });

    it('should filter by minimum rating', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants?rating=4')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].average_rating).toBeGreaterThanOrEqual(4);
    });

    it('should filter by neighborhood', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants?neighborhood=Manhattan')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].neighborhood).toBe('Manhattan');
    });

    it('should handle pagination', async () => {
      // Create more restaurants
      await createTestRestaurant(db, { name: 'Restaurant 2' });
      await createTestReview(db, userId, restaurantId + 1, { rating: 4 });

      const response = await request(app.getHttpServer())
        .get('/restaurants?page=1&limit=1')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(1);
    });

    it('should sort by name', async () => {
      await createTestRestaurant(db, { name: 'AAA Restaurant' });
      await createTestReview(db, userId, restaurantId + 1, { rating: 4 });

      const response = await request(app.getHttpServer())
        .get('/restaurants?sort=name&sortOrder=asc')
        .expect(200);

      expect(response.body.data[0].name).toBe('AAA Restaurant');
    });

    it('should return empty array when no restaurants match filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants?cuisine=NonexistentCuisine')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });
  });

  describe('GET /restaurants/:id', () => {
    it('should return specific restaurant by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/restaurants/${restaurantId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', restaurantId);
      expect(response.body).toHaveProperty('name', 'Test Restaurant');
      expect(response.body).toHaveProperty('average_rating', 4);
    });

    it('should return 404 when restaurant does not exist', async () => {
      await request(app.getHttpServer()).get('/restaurants/999').expect(404);
    });

    it('should return 400 with invalid id', async () => {
      await request(app.getHttpServer())
        .get('/restaurants/invalid')
        .expect(400);
    });
  });

  describe('Integration: Restaurant listing and details', () => {
    it('should list restaurants and get details', async () => {
      // List restaurants
      const listResponse = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);

      const restaurant = listResponse.body.data[0];
      const restaurantId = restaurant.id;

      // Get details
      const detailResponse = await request(app.getHttpServer())
        .get(`/restaurants/${restaurantId}`)
        .expect(200);

      expect(detailResponse.body.id).toBe(restaurantId);
      expect(detailResponse.body.name).toBe(restaurant.name);
    });
  });

  describe('POST /restaurants', () => {
    it('should create a new restaurant when user is admin', async () => {
      const payload = {
        name: 'New Restaurant',
        neighborhood: 'Brooklyn',
        photograph: 'photo.jpg',
        address: '123 Test Street',
        coordinates: {
          lat: 40.6782,
          lng: -73.9442,
        },
        image_url: 'https://example.com/image.jpg',
        cuisine_type: 'Mexican',
      };

      const response = await request(app.getHttpServer())
        .post('/restaurants')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(payload)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      const createdId = response.body.id;

      const restaurant = await db('restaurants').where('id', createdId).first();

      expect(restaurant).toBeDefined();
      expect(restaurant.name).toBe(payload.name);
      expect(restaurant.neighborhood).toBe(payload.neighborhood);
      expect(restaurant.photograph).toBe(payload.photograph);
      expect(restaurant.address).toBe(payload.address);
      expect(Number(restaurant.lat)).toBeCloseTo(payload.coordinates.lat);
      expect(Number(restaurant.lng)).toBeCloseTo(payload.coordinates.lng);
      expect(restaurant.image).toBe(payload.image_url);
      expect(restaurant.cuisine_type).toBe(payload.cuisine_type);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/restaurants')
        .send({
          name: 'Unauthorized Restaurant',
          neighborhood: 'Queens',
          photograph: 'photo.jpg',
          address: '456 Test Street',
          coordinates: {
            lat: 40.7282,
            lng: -73.7949,
          },
          image_url: 'https://example.com/image2.jpg',
          cuisine_type: 'Italian',
        })
        .expect(401);
    });

    it('should return 403 when user is not admin', async () => {
      const nonAdminUser = stubUserData();

      // Register non-admin user
      await request(app.getHttpServer()).post('/auth/register').send({
        name: nonAdminUser.name,
        email: nonAdminUser.email.toString(),
        password: nonAdminUser.password,
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: nonAdminUser.email.toString(),
          password: nonAdminUser.password,
        })
        .expect(201);

      const nonAdminToken = loginResponse.body.access_token;

      await request(app.getHttpServer())
        .post('/restaurants')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({
          name: 'Forbidden Restaurant',
          neighborhood: 'Bronx',
          photograph: 'photo.jpg',
          address: '789 Test Street',
          coordinates: {
            lat: 40.8448,
            lng: -73.8648,
          },
          image_url: 'https://example.com/image3.jpg',
          cuisine_type: 'Chinese',
        })
        .expect(403);
    });

    it('should return 400 with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/restaurants')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: '', // invalid
          neighborhood: 'Brooklyn',
          photograph: 'photo.jpg',
          address: '123 Test Street',
          coordinates: {
            lat: 'invalid',
            lng: 'invalid',
          },
          image_url: 'not-a-url',
          cuisine_type: '',
        })
        .expect(400);
    });
  });

  describe('PUT /restaurants/:id', () => {
    it('should update restaurant when user is admin', async () => {
      const payload = {
        name: 'Updated Restaurant',
        neighborhood: 'Brooklyn Updated',
        photograph: 'updated-photo.jpg',
        address: '999 Updated Street',
        coordinates: {
          lat: 41.0,
          lng: -74.0,
        },
        image_url: 'https://example.com/updated-image.jpg',
        cuisine_type: 'French',
      };

      await request(app.getHttpServer())
        .put(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(payload)
        .expect(200);

      const restaurant = await db('restaurants')
        .where('id', restaurantId)
        .first();

      expect(restaurant.name).toBe(payload.name);
      expect(restaurant.neighborhood).toBe(payload.neighborhood);
      expect(restaurant.photograph).toBe(payload.photograph);
      expect(restaurant.address).toBe(payload.address);
      expect(Number(restaurant.lat)).toBeCloseTo(payload.coordinates.lat);
      expect(Number(restaurant.lng)).toBeCloseTo(payload.coordinates.lng);
      expect(restaurant.image).toBe(payload.image_url);
      expect(restaurant.cuisine_type).toBe(payload.cuisine_type);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .put(`/restaurants/${restaurantId}`)
        .send({
          name: 'Unauthorized Update',
        })
        .expect(401);
    });

    it('should return 403 when user is not admin', async () => {
      const nonAdminUser = stubUserData();

      // Register non-admin user
      await request(app.getHttpServer()).post('/auth/register').send({
        name: nonAdminUser.name,
        email: nonAdminUser.email.toString(),
        password: nonAdminUser.password,
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: nonAdminUser.email.toString(),
          password: nonAdminUser.password,
        })
        .expect(201);

      const nonAdminToken = loginResponse.body.access_token;

      await request(app.getHttpServer())
        .put(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({
          name: 'Forbidden Update',
        })
        .expect(403);
    });

    it('should return 400 with invalid data', async () => {
      await request(app.getHttpServer())
        .put(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: '', // invalid
          image_url: 'not-a-url',
        })
        .expect(400);
    });
  });

  describe('DELETE /restaurants/:id', () => {
    it('should delete restaurant when user is admin', async () => {
      const restaurantToDelete = await createTestRestaurant(db, {
        name: 'To Be Deleted',
      });

      await request(app.getHttpServer())
        .delete(`/restaurants/${restaurantToDelete}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      const deleted = await db('restaurants')
        .where('id', restaurantToDelete)
        .first();

      expect(deleted).toBeUndefined();
    });

    it('should return 401 when not authenticated', async () => {
      const restaurantToDelete = await createTestRestaurant(db, {
        name: 'To Be Deleted 2',
      });

      await request(app.getHttpServer())
        .delete(`/restaurants/${restaurantToDelete}`)
        .expect(401);
    });

    it('should return 403 when user is not admin', async () => {
      const nonAdminUser = stubUserData();

      // Register non-admin user
      await request(app.getHttpServer()).post('/auth/register').send({
        name: nonAdminUser.name,
        email: nonAdminUser.email.toString(),
        password: nonAdminUser.password,
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: nonAdminUser.email.toString(),
          password: nonAdminUser.password,
        })
        .expect(201);

      const nonAdminToken = loginResponse.body.access_token;

      const restaurantToDelete = await createTestRestaurant(db, {
        name: 'To Be Deleted 3',
      });

      await request(app.getHttpServer())
        .delete(`/restaurants/${restaurantToDelete}`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .expect(403);
    });
  });
});
