import { describe, it, expect, beforeEach } from 'vitest';
import { StatsMapper, type SqliteStats } from './stats.mapper';
import { Stats } from 'src/dashboard/domain/entities/stats';
import { stubSqliteStats } from 'src/test-utils/factories/stats.factory';

describe('StatsMapper', () => {
  let sqliteStats: SqliteStats;

  beforeEach(() => {
    sqliteStats = stubSqliteStats();
  });

  describe('toDomain', () => {
    it('should map SqliteStats to domain Stats', () => {
      const result = StatsMapper.toDomain(sqliteStats);

      expect(result).toBeInstanceOf(Stats);
    });

    it('should map totalRestaurants correctly', () => {
      const result = StatsMapper.toDomain(sqliteStats);
      expect(result.totalRestaurants).toEqual(sqliteStats.totalRestaurants);
    });

    it('should map totalReviews correctly', () => {
      const result = StatsMapper.toDomain(sqliteStats);
      expect(result.totalReviews).toEqual(sqliteStats.totalReviews);
    });

    it('should map totalUsers correctly', () => {
      const result = StatsMapper.toDomain(sqliteStats);
      expect(result.totalUsers).toEqual(sqliteStats.totalUsers);
    });

    it('should map topRatedRestaurants correctly', () => {
      const result = StatsMapper.toDomain(sqliteStats);
      expect(result.topRatedRestaurants).toEqual(
        sqliteStats.topRatedRestaurants,
      );
    });

    it('should map topReviewedRestaurants correctly', () => {
      const result = StatsMapper.toDomain(sqliteStats);
      expect(result.topReviewedRestaurants).toEqual(
        sqliteStats.topReviewedRestaurants,
      );
    });
  });
});
