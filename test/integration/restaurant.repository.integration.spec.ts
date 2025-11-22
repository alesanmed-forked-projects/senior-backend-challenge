import { describe, it, expect, beforeEach } from 'vitest';
import { RestaurantSqliteRepository } from 'src/restaurants/infrastructure/persistence/sqlite-restaurant.repository';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { useTestDatabase } from 'test/helpers/test-database.helper';
import { faker } from '@faker-js/faker';
import { Knex } from 'knex';
import {
  stubRestaurant,
  stubSqliteRestaurant,
  stubSqliteReview,
  stubSqliteUser,
} from 'src/test-utils';

describe('RestaurantSqliteRepository - Integration', () => {
  const { getDb } = useTestDatabase();
  let restaurantId: number;
  let userId: number;
  let db: Knex;
  let repository: RestaurantSqliteRepository;

  beforeEach(async () => {
    db = getDb();
    repository = new RestaurantSqliteRepository(db);

    const user = stubSqliteUser();
    delete user.id;

    // Insert test user for reviews
    [userId] = await db('users').insert(user);

    const restaurant = stubSqliteRestaurant();
    delete restaurant.average_rating;
    delete restaurant.id;

    // Insert test restaurant
    [restaurantId] = await db('restaurants').insert(restaurant);

    const review1 = stubSqliteReview({
      restaurant_id: restaurantId,
      user_id: userId,
      rating: 5,
    });
    delete review1.id;
    delete review1.author_name;

    const review2 = stubSqliteReview({
      restaurant_id: restaurantId,
      user_id: userId,
      rating: 4,
    });
    delete review2.id;
    delete review2.author_name;

    // Insert reviews for the restaurant
    await db('reviews').insert([review1, review2]);
  });

  describe('findById', () => {
    it('should return restaurant with average rating', async () => {
      const restaurant = await repository.findById(restaurantId);

      expect(restaurant).toBeDefined();
      expect(restaurant).toBeInstanceOf(Restaurant);
      expect(restaurant?.id).toBe(restaurantId);
      expect(restaurant?.averageRating).toBe(4.5); // Average of 5 and 4
    });

    it('should return undefined when restaurant does not exist', async () => {
      const restaurant = await repository.findById(999);

      expect(restaurant).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated restaurants', async () => {
      const result = await repository.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data[0]).toBeInstanceOf(Restaurant);
      expect(result.data[0].averageRating).toBe(4.5);
    });

    it('should filter by cuisine type', async () => {
      // Get the cuisine type of the inserted restaurant
      const restaurant = await db('restaurants')
        .where('id', restaurantId)
        .first();

      const result = await repository.findAll({
        cuisine: restaurant.cuisine_type,
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].cuisineType).toContain(restaurant.cuisine_type);
    });

    it('should filter by minimum rating', async () => {
      const result = await repository.findAll({
        rating: 4,
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].averageRating).toBeGreaterThanOrEqual(4);
    });

    it('should filter by neighborhood', async () => {
      const restaurant = await db('restaurants')
        .where('id', restaurantId)
        .first();

      const result = await repository.findAll({
        neighborhood: restaurant.neighborhood,
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].neighborhood).toContain(restaurant.neighborhood);
    });

    it('should sort by name', async () => {
      const secondRestaurant = stubSqliteRestaurant({
        name: 'AAA Restaurant',
      });
      delete secondRestaurant.id;
      delete secondRestaurant.average_rating;
      const [secondRestaurantId] =
        await db('restaurants').insert(secondRestaurant);

      const review = stubSqliteReview({
        restaurant_id: secondRestaurantId,
        user_id: userId,
      });
      delete review.id;
      delete review.author_name;
      await db('reviews').insert(review);

      const result = await repository.findAll({
        sort: 'name',
        sortOrder: 'asc',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe('AAA Restaurant');
    });

    it('should handle pagination', async () => {
      const result = await repository.findAll({
        page: 1,
        limit: 1,
      });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.limit).toBe(1);
    });

    it('should return empty array when no restaurants match filter', async () => {
      const result = await repository.findAll({
        cuisine: 'NonexistentCuisine',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('integration scenarios', () => {
    it('should calculate correct average rating with multiple reviews', async () => {
      const review3 = stubSqliteReview({
        restaurant_id: restaurantId,
        user_id: userId,
        rating: 3,
      });
      delete review3.id;
      delete review3.author_name;

      const review4 = stubSqliteReview({
        restaurant_id: restaurantId,
        user_id: userId,
        rating: 2,
      });
      delete review4.id;
      delete review4.author_name;

      await db('reviews').insert([review3, review4]);

      const restaurant = await repository.findById(restaurantId);

      // Average of 5, 4, 3, 2 = 3.5
      expect(restaurant?.averageRating).toBe(3.5);
    });
  });

  describe('create', () => {
    it('should create a restaurant and return its id', async () => {
      const restaurant = stubRestaurant();

      const id = await repository.create(restaurant);

      expect(typeof id).toBe('number');

      const savedRestaurant = await db('restaurants').where('id', id).first();

      expect(savedRestaurant).toBeDefined();
      expect(savedRestaurant.name).toBe(restaurant.name);
      expect(savedRestaurant.neighborhood).toBe(restaurant.neighborhood);
      expect(savedRestaurant.photograph).toBe(restaurant.photograph);
      expect(savedRestaurant.address).toBe(restaurant.address);
      expect(savedRestaurant.image).toBe(restaurant.imageUrl.toString());
      expect(savedRestaurant.cuisine_type).toBe(restaurant.cuisineType);
    });
  });

  describe('update', () => {
    it('should update an existing restaurant', async () => {
      const restaurant = await repository.findById(restaurantId);
      expect(restaurant).toBeDefined();

      restaurant!.name = faker.company.name();
      restaurant!.neighborhood = faker.location.city();
      restaurant!.photograph = `${faker.word.adjective()}.jpg`;
      restaurant!.address = faker.location.streetAddress();
      restaurant!.coordinates = {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      };
      restaurant!.imageUrl = faker.image.url();
      restaurant!.cuisineType = faker.word.adjective();

      await repository.update(restaurant!);

      const updated = await db('restaurants').where('id', restaurantId).first();

      expect(updated.name).toBe(restaurant!.name);
      expect(updated.neighborhood).toBe(restaurant!.neighborhood);
      expect(updated.photograph).toBe(restaurant!.photograph);
      expect(updated.address).toBe(restaurant!.address);
      expect(Number(updated.lat)).toBeCloseTo(restaurant!.coordinates.lat);
      expect(Number(updated.lng)).toBeCloseTo(restaurant!.coordinates.lng);
      expect(updated.image).toEqual(restaurant!.imageUrl.toString());
      expect(updated.cuisine_type).toBe(restaurant!.cuisineType);
    });
  });

  describe('delete', () => {
    it('should delete an existing restaurant', async () => {
      const sqliteRestaurant = stubSqliteRestaurant();
      delete sqliteRestaurant.id;
      delete sqliteRestaurant.average_rating;

      const [restaurantId] = await db('restaurants').insert(sqliteRestaurant);

      const restaurant = await repository.findById(restaurantId);
      expect(restaurant).toBeDefined();

      await repository.delete(restaurant!);

      const deleted = await repository.findById(restaurantId);
      expect(deleted).toBeUndefined();
    });
  });
});
