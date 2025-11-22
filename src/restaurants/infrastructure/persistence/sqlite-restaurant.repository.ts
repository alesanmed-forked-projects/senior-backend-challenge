import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { Filter, Paginated } from 'src/core/application/database/filter.type';
import { KNEX } from 'src/core/infrastructure/persistence/knex.tokens';
import {
  RestaurantFilters,
  RestaurantRepository,
} from 'src/restaurants/application/ports/restaurants.repository';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { RestaurantMapper, SqliteRestaurant } from './restaurant.mapper';

export class RestaurantSqliteRepository implements RestaurantRepository {
  constructor(
    @Inject(KNEX)
    private readonly knex: Knex,
  ) {}

  async findAll(
    filter: Filter<RestaurantFilters>,
  ): Promise<Paginated<Restaurant>> {
    const { page = 1, limit = 10, sort, sortOrder } = filter;

    const query = this.knex('restaurants')
      .leftJoin('reviews', 'restaurants.id', 'reviews.restaurant_id')
      .groupBy('restaurants.id');

    if (filter.cuisine) {
      query.where('cuisine_type', 'like', `%${filter.cuisine}%`);
    }
    if (filter.neighborhood) {
      query.where('neighborhood', 'like', `%${filter.neighborhood}%`);
    }
    if (filter.rating !== undefined) {
      query.having('average_rating', '>=', filter.rating);
    }

    if (sort && sortOrder) {
      query.orderBy(RestaurantMapper.toInfrastructureSort(sort), sortOrder);
    }

    const [data, total] = await Promise.all([
      query
        .clone()
        .select('restaurants.*')
        .avg({
          average_rating: 'reviews.rating',
        })
        .limit(limit)
        .offset((page - 1) * limit),
      query
        .clone()
        .avg({
          average_rating: 'reviews.rating',
        })
        .select<{ total: number }[]>(
          this.knex.raw('COUNT(*) OVER() as ??', ['total']),
        ),
    ]);

    return {
      data: data.map(RestaurantMapper.toDomain),
      total: total[0]?.total ?? 0,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<Restaurant | undefined> {
    const restaurant = await this.knex('restaurants')
      .leftJoin('reviews', 'restaurants.id', 'reviews.restaurant_id')
      .select('restaurants.*')
      .avg<SqliteRestaurant>({
        average_rating: 'reviews.rating',
      })
      .groupBy('restaurants.id')
      .where('restaurants.id', id)
      .first();

    return restaurant ? RestaurantMapper.toDomain(restaurant) : undefined;
  }

  async create(restaurant: Restaurant): Promise<number> {
    const [id] = await this.knex('restaurants').insert(
      RestaurantMapper.toInfrastructure(restaurant),
    );

    return id;
  }

  async update(restaurant: Restaurant): Promise<void> {
    await this.knex('restaurants')
      .where('id', restaurant.id)
      .update(RestaurantMapper.toInfrastructureUpdate(restaurant));
  }

  async delete(restaurant: Restaurant): Promise<void> {
    await this.knex('restaurants').where('id', restaurant.id).delete();
  }
}
