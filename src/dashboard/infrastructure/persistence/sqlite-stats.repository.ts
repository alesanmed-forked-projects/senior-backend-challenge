import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX } from 'src/core/infrastructure/persistence/knex.tokens';
import { StatsRepository } from 'src/dashboard/application/ports/stats.repository';
import { RestaurantData } from 'src/dashboard/domain/interfaces/restaurant-data.interface';
import {
  RestaurantDataMapper,
  SqliteRestaurantData,
} from './restaurant-data.mapper';
import { StatsMapper } from './stats.mapper';
import { Stats } from 'src/dashboard/domain/entities/stats';

type TopRestaurantsCriteria = 'average_rating' | 'reviews_amount';

@Injectable()
export class SqliteStatsRepository implements StatsRepository {
  constructor(
    @Inject(KNEX)
    private readonly knex: Knex,
  ) {}

  private async getTotalUsers(): Promise<number> {
    const totalUsers = await this.knex('users').count({ total: 'id' }).first();

    return (totalUsers?.total as number) ?? 0;
  }

  private async getTotalRestaurants(): Promise<number> {
    const totalRestaurants = await this.knex('restaurants')
      .count({ total: 'id' })
      .first();

    return (totalRestaurants?.total as number) ?? 0;
  }

  private async getTotalReviews(): Promise<number> {
    const totalReviews = await this.knex('reviews')
      .count({ total: 'id' })
      .first();

    return (totalReviews?.total as number) ?? 0;
  }

  private async getTopRestaurants(
    amount = 3,
    criteria: TopRestaurantsCriteria,
  ): Promise<RestaurantData[]> {
    const topRestaurants = await this.knex('restaurants')
      .leftJoin('reviews', 'restaurants.id', 'reviews.restaurant_id')
      .select({
        id: 'restaurants.id',
        name: 'restaurants.name',
      })
      .avg({
        average_rating: 'reviews.rating',
      })
      .count<SqliteRestaurantData[]>({
        reviews_amount: 'restaurants.id',
      })
      .groupBy('restaurants.id')
      .orderBy(criteria, 'desc')
      .limit(amount);

    return topRestaurants.map(RestaurantDataMapper.toDomain);
  }

  private getTopRatedRestaurants(amount = 3): Promise<RestaurantData[]> {
    return this.getTopRestaurants(amount, 'average_rating');
  }

  private getMostReviewedRestaurants(amount = 3): Promise<RestaurantData[]> {
    return this.getTopRestaurants(amount, 'reviews_amount');
  }

  async compute(): Promise<Stats> {
    const [
      totalUsers,
      totalRestaurants,
      totalReviews,
      topRatedRestaurants,
      mostReviewedRestaurants,
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getTotalRestaurants(),
      this.getTotalReviews(),
      this.getTopRatedRestaurants(),
      this.getMostReviewedRestaurants(),
    ]);

    return StatsMapper.toDomain({
      totalUsers,
      totalRestaurants,
      totalReviews,
      topRatedRestaurants,
      topReviewedRestaurants: mostReviewedRestaurants,
    });
  }
}
