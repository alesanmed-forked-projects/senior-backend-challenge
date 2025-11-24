import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Knex } from 'knex';
import { AppModule } from 'src/app.module';
import { KNEX } from 'src/core/infrastructure/persistence/knex.tokens';
import { setupApp } from 'src/core/infrastructure/config/app.config';
import {
  stubSqliteRestaurant,
  stubSqliteReview,
  stubSqliteUser,
} from 'src/test-utils';
import { createTestDatabase, initializeSchema } from './test-database.helper';
import { MockCacheInterceptor } from './mock-cache.interceptor';
import { HttpCacheInterceptor } from 'src/core/http/interceptors/cache.interceptor';
import { SqliteRestaurant } from 'src/restaurants/infrastructure/persistence/restaurant.mapper';
import { SqliteReview } from 'src/reviews/infrastructure/persistence/review.mapper';

export interface TestAppModule {
  app: INestApplication;
  db: Knex;
}

/**
 * Crea una aplicación Nest para E2E usando AppModule y una base de datos SQLite en memoria.
 */
export async function createTestApp(): Promise<TestAppModule> {
  const db = createTestDatabase();
  await initializeSchema(db);

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(KNEX)
    .useValue(db)
    .overrideProvider(HttpCacheInterceptor)
    .useClass(MockCacheInterceptor)
    .compile();

  const app = moduleRef.createNestApplication();
  setupApp(app);
  await app.init();

  return { app, db };
}

/**
 * Helper para insertar un usuario de prueba en la base de datos
 */
export async function createTestUser(
  db: Knex,
  overrides?: {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
  },
): Promise<{ id: number; email: string; password: string; name: string }> {
  const sqliteUser = stubSqliteUser(overrides);
  delete sqliteUser.id;

  const [id] = await db('users').insert(sqliteUser);

  return {
    id,
    email: sqliteUser.email,
    password: sqliteUser.password,
    name: sqliteUser.name,
  };
}

/**
 * Helper para insertar un restaurante de prueba en la base de datos
 */
export async function createTestRestaurant(
  db: Knex,
  overrides?: Partial<SqliteRestaurant>,
): Promise<number> {
  const sqliteRestaurant = stubSqliteRestaurant(overrides);
  delete sqliteRestaurant.id;
  delete sqliteRestaurant.average_rating;

  const [id] = await db('restaurants').insert(sqliteRestaurant);

  return id;
}

/**
 * Helper para insertar una reseña de prueba en la base de datos
 */
export async function createTestReview(
  db: Knex,
  userId: number,
  restaurantId: number,
  overrides?: Partial<SqliteReview>,
): Promise<number> {
  const sqliteReview = stubSqliteReview({
    user_id: userId,
    restaurant_id: restaurantId,
    ...overrides,
  });
  delete sqliteReview.id;
  delete sqliteReview.author_name;

  const [id] = await db('reviews').insert(sqliteReview);

  return id;
}
