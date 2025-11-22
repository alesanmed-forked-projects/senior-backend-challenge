import { describe, it, beforeEach, expect } from 'vitest';
import { stubSqliteRestaurant, stubRestaurant } from 'src/test-utils';
import { RestaurantMapper, SqliteRestaurant } from './restaurant.mapper';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';

describe('RestaurantMapper', () => {
  describe('toDomain', () => {
    let sqliteRestaurant: SqliteRestaurant;

    beforeEach(() => {
      sqliteRestaurant = stubSqliteRestaurant();
    });

    it('should map a SQLite restaurant to domain', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result).toBeInstanceOf(Restaurant);
    });

    it('should map the restaurant id correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.id).toBe(sqliteRestaurant.id);
    });

    it('should map the restaurant name correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.name).toBe(sqliteRestaurant.name);
    });

    it('should map the restaurant neighborhood correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.neighborhood).toBe(sqliteRestaurant.neighborhood);
    });

    it('should map the restaurant photograph correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.photograph).toBe(sqliteRestaurant.photograph);
    });

    it('should map the restaurant address correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.address).toBe(sqliteRestaurant.address);
    });

    it('should map the restaurant coordinates correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.coordinates).toEqual({
        lat: sqliteRestaurant.lat,
        lng: sqliteRestaurant.lng,
      });
    });

    it('should map the restaurant image correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.imageUrl.toString()).toEqual(sqliteRestaurant.image);
    });

    it('should map the restaurant cuisine type correctly', () => {
      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.cuisineType).toBe(sqliteRestaurant.cuisine_type);
    });

    it('should map restaurant without rating (default to 0)', () => {
      sqliteRestaurant = stubSqliteRestaurant({ average_rating: undefined });

      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.averageRating).toBe(0);
    });

    it('should map restaurant without ID', () => {
      sqliteRestaurant = stubSqliteRestaurant({ id: undefined });

      const result = RestaurantMapper.toDomain(sqliteRestaurant);

      expect(result.id).toBeUndefined();
      expect(result.name).toBe(sqliteRestaurant.name);
    });
  });

  describe('toInfrastructure', () => {
    let restaurant: Restaurant;

    beforeEach(() => {
      restaurant = stubRestaurant();
    });

    it('should map name correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.name).toBe(restaurant.name);
    });

    it('should map neighborhood correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.neighborhood).toBe(restaurant.neighborhood);
    });

    it('should map photograph correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.photograph).toBe(restaurant.photograph);
    });

    it('should map address correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.address).toBe(restaurant.address);
    });

    it('should map latitude correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.lat).toBe(restaurant.coordinates.lat);
    });

    it('should map longitude correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.lng).toBe(restaurant.coordinates.lng);
    });

    it('should map image correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.image).toBe(restaurant.imageUrl.toString());
    });

    it('should map cuisine type correctly', () => {
      const result = RestaurantMapper.toInfrastructure(restaurant);
      expect(result.cuisine_type).toBe(restaurant.cuisineType);
    });

    it('should map restaurant with ID', () => {
      const restaurant = stubRestaurant({ id: 1 });

      const result = RestaurantMapper.toInfrastructure(restaurant);

      expect(result.id).toBe(1);
    });

    it('should preserve coordinates correctly', () => {
      const restaurant = stubRestaurant({
        coordinates: { lat: 12.3456, lng: -78.9012 },
      });

      const result = RestaurantMapper.toInfrastructure(restaurant);

      expect(result.lat).toBe(12.3456);
      expect(result.lng).toBe(-78.9012);
    });
  });

  describe('toInfrastructureSort', () => {
    it('should map sort "name" correctly', () => {
      const result = RestaurantMapper.toInfrastructureSort('name');
      expect(result).toBe('restaurants.name');
    });

    it('should map sort "neighborhood" correctly', () => {
      const result = RestaurantMapper.toInfrastructureSort('neighborhood');
      expect(result).toBe('restaurants.neighborhood');
    });

    it('should map sort "rating" to "average_rating"', () => {
      const result = RestaurantMapper.toInfrastructureSort('rating');
      expect(result).toBe('average_rating');
    });

    it('should use "average_rating" as default for unknown values', () => {
      const result = RestaurantMapper.toInfrastructureSort('unknown');
      expect(result).toBe('average_rating');
    });
  });
});
