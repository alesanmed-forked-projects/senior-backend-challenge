import { Knex, knex } from 'knex';
import { afterEach, beforeEach } from 'vitest';

/**
 * Creates an in-memory SQLite database for integration tests
 */
export function createTestDatabase(): Knex {
  return knex({
    client: 'better-sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
}

/**
 * Initializes the database schema with all required tables
 */
export async function initializeSchema(db: Knex): Promise<void> {
  // Create users table
  await db.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').notNullable();
    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  // Create restaurants table
  await db.schema.createTable('restaurants', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('neighborhood').notNullable();
    table.string('photograph').notNullable();
    table.string('address').notNullable();
    table.decimal('lat', 10, 8).notNullable();
    table.decimal('lng', 11, 8).notNullable();
    table.string('image').notNullable();
    table.string('cuisine_type').notNullable();
  });

  // Create reviews table
  await db.schema.createTable('reviews', (table) => {
    table.increments('id').primary();
    table
      .integer('restaurant_id')
      .notNullable()
      .references('id')
      .inTable('restaurants');
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.integer('rating').notNullable();
    table.text('comments').notNullable();
    table.string('date').notNullable();
    table.string('created_at').notNullable();
  });

  // Create favorites table
  await db.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table
      .integer('restaurant_id')
      .notNullable()
      .references('id')
      .inTable('restaurants');
    table.timestamp('created_at').defaultTo(db.fn.now());
  });
}

/**
 * Hook to setup and teardown an in-memory database for each test
 */
export function useTestDatabase() {
  let db: Knex;

  beforeEach(async () => {
    db = createTestDatabase();
    await initializeSchema(db);
  });

  afterEach(async () => {
    await db.destroy();
  });

  return {
    getDb: () => db,
  };
}
