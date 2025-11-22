import { describe, it, beforeEach, expect } from 'vitest';
import { HttpRestaurantMapper } from './http-restaurant.mapper';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { stubRestaurant } from 'src/test-utils';

describe('HttpRestaurantMapper', () => {
  describe('toDto', () => {
    let restaurant: Restaurant;

    beforeEach(() => {
      restaurant = stubRestaurant();
    });

    it('should map id correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.id).toBe(restaurant.id);
    });

    it('should map name correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.name).toBe(restaurant.name);
    });

    it('should map neighborhood correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.neighborhood).toBe(restaurant.neighborhood);
    });

    it('should map photograph correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.photograph).toBe(restaurant.photograph);
    });

    it('should map address correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.address).toBe(restaurant.address);
    });

    it('should map coordinates correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.coordinates).toEqual(restaurant.coordinates);
    });

    it('should map image_url correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.image_url).toBe(restaurant.imageUrl.toString());
    });

    it('should map cuisine_type correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.cuisine_type).toBe(restaurant.cuisineType);
    });

    it('should map average_rating correctly', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.average_rating).toBe(restaurant.averageRating);
    });

    it('should map restaurant with rating 0', () => {
      const restaurant = stubRestaurant({ averageRating: 0 });

      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.average_rating).toBe(0);
    });

    it('should preserve exact coordinates', () => {
      const restaurant = stubRestaurant({
        coordinates: { lat: 12.3456789, lng: -78.9012345 },
      });

      const result = HttpRestaurantMapper.toDto(restaurant);

      expect(result.coordinates.lat).toBe(12.3456789);
      expect(result.coordinates.lng).toBe(-78.9012345);
    });

    it('should include all required fields', () => {
      const result = HttpRestaurantMapper.toDto(restaurant);

      expect('id' in result).toBe(true);
      expect('name' in result).toBe(true);
      expect('neighborhood' in result).toBe(true);
      expect('photograph' in result).toBe(true);
      expect('address' in result).toBe(true);
      expect('coordinates' in result).toBe(true);
      expect('image_url' in result).toBe(true);
      expect('cuisine_type' in result).toBe(true);
      expect('average_rating' in result).toBe(true);
    });
  });
});
