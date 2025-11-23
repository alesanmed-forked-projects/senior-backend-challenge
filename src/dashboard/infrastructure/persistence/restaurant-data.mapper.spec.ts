import { describe, it, expect } from 'vitest';
import { RestaurantDataMapper } from './restaurant-data.mapper';
import { stubSqliteRestaurantStatsData } from 'src/test-utils/factories/stats.factory';

describe('RestaurantDataMapper', () => {
  describe('toDomain', () => {
    it('should map SQLite restaurant data to domain RestaurantData', () => {
      const sqliteData = stubSqliteRestaurantStatsData();

      const result = RestaurantDataMapper.toDomain(sqliteData);

      expect(result.id).toBe(sqliteData.id);
      expect(result.name).toBe(sqliteData.name);
      expect(result.averageRating).toBe(sqliteData.average_rating);
      expect(result.numberOfReviews).toBe(sqliteData.reviews_amount);
    });

    it('should default averageRating and numberOfReviews to 0 when undefined', () => {
      const sqliteData = stubSqliteRestaurantStatsData({
        average_rating: undefined as unknown as number,
        reviews_amount: undefined as unknown as number,
      });

      const result = RestaurantDataMapper.toDomain(sqliteData);

      expect(result.averageRating).toBe(0);
      expect(result.numberOfReviews).toBe(0);
    });
  });
});
