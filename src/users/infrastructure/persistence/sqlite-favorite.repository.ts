import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX } from 'src/core/infrastructure/persistence/knex.tokens';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import {
  RestaurantMapper,
  SqliteRestaurant,
} from 'src/restaurants/infrastructure/persistence/restaurant.mapper';
import { FavoriteRepository } from 'src/users/application/ports/favorite.repository';
import { Favorite } from 'src/users/domain/entities/favorite.entity';
import { FavoriteMapper, SqliteFavorite } from './favorite.mapper';

export class FavoriteSqliteRepository implements FavoriteRepository {
  constructor(
    @Inject(KNEX)
    private readonly knex: Knex,
  ) {}

  async create(favorite: Favorite): Promise<void> {
    await this.knex('favorites').insert(
      FavoriteMapper.toInfrastructure(favorite),
    );
  }

  async delete(favorite: Favorite): Promise<void> {
    await this.knex('favorites')
      .where('user_id', favorite.userId)
      .where('restaurant_id', favorite.restaurantId)
      .delete();
  }

  async findAllByUserId(userId: number): Promise<Restaurant[]> {
    const favorites = await this.knex('favorites')
      .select('restaurants.*')
      .innerJoin('restaurants', 'favorites.restaurant_id', 'restaurants.id')
      .leftJoin('reviews', 'restaurants.id', 'reviews.restaurant_id')
      .avg<SqliteRestaurant[]>({
        average_rating: 'reviews.rating',
      })
      .where('favorites.user_id', userId)
      .groupBy('restaurants.id');

    return favorites.map(RestaurantMapper.toDomain);
  }

  async findByUserIdAndRestaurantId(
    userId: number,
    restaurantId: number,
  ): Promise<Favorite | undefined> {
    const favorite = await this.knex<SqliteFavorite>('favorites')
      .where('user_id', userId)
      .where('restaurant_id', restaurantId)
      .first();

    return favorite ? FavoriteMapper.toDomain(favorite) : undefined;
  }
}
