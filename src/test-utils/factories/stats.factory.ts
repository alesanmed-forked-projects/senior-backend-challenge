import { faker } from '@faker-js/faker';
import { Stats, StatsData } from 'src/dashboard/domain/entities/stats';
import { RestaurantData } from 'src/dashboard/domain/interfaces/restaurant-data.interface';
import { SqliteRestaurantData } from 'src/dashboard/infrastructure/persistence/restaurant-data.mapper';
import { SqliteStats } from 'src/dashboard/infrastructure/persistence/stats.mapper';

export const stubRestaurantStatsData = (
  overrides?: Partial<RestaurantData>,
) => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.company.name(),
  averageRating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
  numberOfReviews: faker.number.int({ min: 0, max: 100 }),
  ...overrides,
});

export const stubSqliteRestaurantStatsData = (
  overrides?: Partial<SqliteRestaurantData>,
): SqliteRestaurantData => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.company.name(),
  average_rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
  reviews_amount: faker.number.int({ min: 0, max: 100 }),
  ...overrides,
});

export const stubSqliteStats = (
  overrides?: Partial<SqliteStats>,
): SqliteStats => ({
  totalRestaurants: faker.number.int({ min: 0, max: 100 }),
  totalReviews: faker.number.int({ min: 0, max: 100 }),
  totalUsers: faker.number.int({ min: 0, max: 100 }),
  topRatedRestaurants: [stubRestaurantStatsData()],
  topReviewedRestaurants: [stubRestaurantStatsData()],
  ...overrides,
});

export const stubStatsData = (overrides?: Partial<StatsData>): Stats =>
  Stats.fromData(stubSqliteStats(overrides));
