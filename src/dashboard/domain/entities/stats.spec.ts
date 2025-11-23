import { describe, it, expect } from 'vitest';
import { Stats } from './stats';
import { InvalidStatsData } from '../errors/invalid-stats-data.error';
import { stubRestaurantStatsData } from 'src/test-utils/factories/stats.factory';

describe('Stats', () => {
  const baseData = {
    totalRestaurants: 5,
    totalReviews: 20,
    totalUsers: 10,
    topRatedRestaurants: [stubRestaurantStatsData()],
    topReviewedRestaurants: [
      stubRestaurantStatsData({ id: 2, name: 'Most Reviewed' }),
    ],
  };

  describe('fromData', () => {
    it('should create a Stats instance with valid data', () => {
      const stats = Stats.fromData(baseData);

      expect(stats).toBeInstanceOf(Stats);
      expect(stats.totalRestaurants).toBe(baseData.totalRestaurants);
      expect(stats.totalReviews).toBe(baseData.totalReviews);
      expect(stats.totalUsers).toBe(baseData.totalUsers);
      expect(stats.topRatedRestaurants).toEqual(baseData.topRatedRestaurants);
      expect(stats.topReviewedRestaurants).toEqual(
        baseData.topReviewedRestaurants,
      );
    });

    it('should throw InvalidStatsData when totalRestaurants is negative', () => {
      expect(() =>
        Stats.fromData({
          ...baseData,
          totalRestaurants: -1,
        }),
      ).toThrow(InvalidStatsData);
    });

    it('should throw InvalidStatsData when totalReviews is negative', () => {
      expect(() =>
        Stats.fromData({
          ...baseData,
          totalReviews: -1,
        }),
      ).toThrow(InvalidStatsData);
    });

    it('should throw InvalidStatsData when totalUsers is negative', () => {
      expect(() =>
        Stats.fromData({
          ...baseData,
          totalUsers: -1,
        }),
      ).toThrow(InvalidStatsData);
    });
  });
});
