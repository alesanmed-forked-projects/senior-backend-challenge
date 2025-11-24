import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Knex } from 'knex';
import { createTestApp, createTestUser } from 'test/helpers/e2e-test.helper';
import { stubUser, stubUserData } from 'src/test-utils';
import { faker } from '@faker-js/faker';
import { User } from 'src/users/domain/entities/user.entity';

describe('AuthController (E2E)', () => {
  let app: INestApplication;
  let db: Knex;

  beforeAll(async () => {
    const module = await createTestApp();
    app = module.app;
    db = module.db;
  });

  afterAll(async () => {
    await app?.close();
    await db?.destroy();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userData = stubUserData();

      const httpServer = app.getHttpServer();

      await request(httpServer)
        .post('/auth/register')
        .send({
          name: userData.name,
          email: userData.email.toString(),
          password: userData.password,
        })
        .expect(201);

      // Verify user was created in database
      const user = await db('users')
        .where('email', userData.email.toString())
        .first();
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role.toString());
    });

    it('should return 409 when email already exists', async () => {
      const existingEmail = faker.internet.email();

      // Create user first
      await createTestUser(db, { email: existingEmail });

      const otherUser = stubUserData();

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: otherUser.name,
          email: existingEmail,
          password: otherUser.password,
        })
        .expect(409);
    });

    it('should return 400 with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: faker.person.fullName(),
          email: 'invalid-email',
          password: faker.internet.password({ length: 20 }),
        })
        .expect(400);
    });

    it('should return 400 with missing fields', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: faker.internet.email(),
        })
        .expect(400);
    });

    it('should return 400 with invalid password', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: 'short',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    let user: User;
    beforeEach(async () => {
      user = stubUser();

      // Register a user first
      await request(app.getHttpServer()).post('/auth/register').send({
        name: user.name,
        email: user.email.toString(),
        password: user.password,
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email.toString(),
          password: user.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
      expect(response.body.access_token.length).toBeGreaterThan(0);
    });

    it('should return 401 with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: faker.internet.email(),
          password: user.password,
        })
        .expect(401);
    });

    it('should return 401 with invalid password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email.toString(),
          password: faker.internet.password({ length: 20 }),
        })
        .expect(401);
    });

    it('should return 400 with missing credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email.toString(),
        })
        .expect(401);
    });
  });

  describe('Integration: Register and Login flow', () => {
    it('should register user and login immediately', async () => {
      const userData = stubUserData();

      // Register
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: userData.name,
          email: userData.email.toString(),
          password: userData.password,
        })
        .expect(201);

      // Login with the same credentials
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email.toString(),
          password: userData.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });
  });
});
