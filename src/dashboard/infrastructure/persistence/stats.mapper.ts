import { Stats } from 'src/dashboard/domain/entities/stats';
import { RestaurantData } from 'src/dashboard/domain/interfaces/restaurant-data.interface';

export type SqliteStats = {
  totalRestaurants: number;
  totalReviews: number;
  totalUsers: number;
  topRatedRestaurants: RestaurantData[];
  topReviewedRestaurants: RestaurantData[];
};

export class StatsMapper {
  static toDomain(sqliteStats: SqliteStats): Stats {
    return Stats.fromData({
      totalRestaurants: sqliteStats.totalRestaurants,
      totalReviews: sqliteStats.totalReviews,
      totalUsers: sqliteStats.totalUsers,
      topRatedRestaurants: sqliteStats.topRatedRestaurants,
      topReviewedRestaurants: sqliteStats.topReviewedRestaurants,
    });
  }
}
