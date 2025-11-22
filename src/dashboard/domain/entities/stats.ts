import { InvalidStatsData } from '../errors/invalid-stats-data.error';
import { RestaurantData } from '../interfaces/restaurant-data.interface';

interface StatsData {
  totalRestaurants: number;
  totalReviews: number;
  totalUsers: number;
  topRatedRestaurants: RestaurantData[];
  topReviewedRestaurants: RestaurantData[];
}

export class Stats {
  private readonly data: StatsData;

  private constructor(data: StatsData) {
    this.validate(data);

    this.data = data;
  }

  static fromData(data: StatsData): Stats {
    return new Stats(data);
  }

  get totalRestaurants(): number {
    return this.data.totalRestaurants;
  }

  get totalReviews(): number {
    return this.data.totalReviews;
  }

  get totalUsers(): number {
    return this.data.totalUsers;
  }

  get topRatedRestaurants(): RestaurantData[] {
    return this.data.topRatedRestaurants;
  }

  get topReviewedRestaurants(): RestaurantData[] {
    return this.data.topReviewedRestaurants;
  }

  private validate(data: StatsData): void {
    this.validateTotalRestaurants(data.totalRestaurants);
    this.validateTotalReviews(data.totalReviews);
    this.validateTotalUsers(data.totalUsers);
  }

  private validateTotalRestaurants(totalRestaurants: number): void {
    if (totalRestaurants < 0) {
      throw new InvalidStatsData(
        'totalRestaurants',
        totalRestaurants.toString(),
      );
    }
  }

  private validateTotalReviews(totalReviews: number): void {
    if (totalReviews < 0) {
      throw new InvalidStatsData('totalReviews', totalReviews.toString());
    }
  }

  private validateTotalUsers(totalUsers: number): void {
    if (totalUsers < 0) {
      throw new InvalidStatsData('totalUsers', totalUsers.toString());
    }
  }
}
