import { describe, it, expect, beforeEach } from 'vitest';
import { SqliteStatsRepository } from 'src/dashboard/infrastructure/persistence/sqlite-stats.repository';
import { useTestDatabase } from 'test/helpers/test-database.helper';
import { Knex } from 'knex';
import { Stats } from 'src/dashboard/domain/entities/stats';
import {
  stubSqliteRestaurant,
  stubSqliteReview,
  stubSqliteUser,
} from 'src/test-utils';

describe('SqliteStatsRepository - Integration', () => {
  const { getDb } = useTestDatabase();
  let db: Knex;
  let repository: SqliteStatsRepository;

  beforeEach(async () => {
    db = getDb();
    repository = new SqliteStatsRepository(db);

    // Insert users
    const user1 = stubSqliteUser();
    delete user1.id;
    const user2 = stubSqliteUser();
    delete user2.id;

    const [userId1] = await db('users').insert(user1);
    const [userId2] = await db('users').insert(user2);

    // Insert restaurants
    const restaurant1 = stubSqliteRestaurant();
    delete restaurant1.id;
    delete restaurant1.average_rating;
    const restaurant2 = stubSqliteRestaurant();
    delete restaurant2.id;
    delete restaurant2.average_rating;

    const [restaurantId1] = await db('restaurants').insert(restaurant1);
    const [restaurantId2] = await db('restaurants').insert(restaurant2);

    // Insert reviews for both restaurants
    const review1 = stubSqliteReview({
      restaurant_id: restaurantId1,
      user_id: userId1,
      rating: 5,
    });
    delete review1.id;
    delete review1.author_name;

    const review2 = stubSqliteReview({
      restaurant_id: restaurantId1,
      user_id: userId2,
      rating: 4,
    });
    delete review2.id;
    delete review2.author_name;

    const review3 = stubSqliteReview({
      restaurant_id: restaurantId2,
      user_id: userId1,
      rating: 3,
    });
    delete review3.id;
    delete review3.author_name;

    const review4 = stubSqliteReview({
      restaurant_id: restaurantId2,
      user_id: userId2,
      rating: 2,
    });
    delete review4.id;
    delete review4.author_name;

    await db('reviews').insert([review1, review2, review3, review4]);
  });

  it('should return an instance of Stats', async () => {
    const stats = await repository.compute();
    expect(stats).toBeInstanceOf(Stats);
  });

  it('should compute total users', async () => {
    const stats = await repository.compute();
    expect(stats.totalUsers).toBe(2);
  });

  it('should compute total restaurants', async () => {
    const stats = await repository.compute();
    expect(stats.totalRestaurants).toBe(2);
  });

  it('should compute total reviews', async () => {
    const stats = await repository.compute();
    expect(stats.totalReviews).toBe(4);
  });

  it('should return an array of top rated restaurants', async () => {
    const stats = await repository.compute();
    expect(stats.topRatedRestaurants).toBeInstanceOf(Array);
  });

  it('should compute top rated restaurants', async () => {
    const stats = await repository.compute();
    expect(stats.topRatedRestaurants.length).toBe(2);
  });

  it('should return the top rated restaurant with the highest rating', async () => {
    const stats = await repository.compute();
    expect(stats.topRatedRestaurants[0].averageRating).toBeGreaterThan(
      stats.topRatedRestaurants[1].averageRating,
    );
  });

  it('should return an array of top reviewed restaurants', async () => {
    const stats = await repository.compute();
    expect(stats.topReviewedRestaurants).toBeInstanceOf(Array);
  });

  it('should compute top reviewed restaurants', async () => {
    const stats = await repository.compute();
    expect(stats.topReviewedRestaurants.length).toBe(2);
  });

  it('should return the top reviewed restaurant with the most or equal reviews', async () => {
    const stats = await repository.compute();
    expect(
      stats.topReviewedRestaurants[0].numberOfReviews,
    ).toBeGreaterThanOrEqual(stats.topReviewedRestaurants[1].numberOfReviews);
  });
});
