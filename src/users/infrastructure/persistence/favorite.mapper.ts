import { DateTime } from 'luxon';
import { Favorite } from 'src/users/domain/entities/favorite.entity';

export type SqliteFavorite = {
  user_id: number;
  restaurant_id: number;
  created_at: string;
};

export class FavoriteMapper {
  static toDomain(sqliteFavorite: SqliteFavorite): Favorite {
    return Favorite.fromData({
      userId: sqliteFavorite.user_id,
      restaurantId: sqliteFavorite.restaurant_id,
      createdAt: DateTime.fromISO(sqliteFavorite.created_at),
    });
  }

  static toInfrastructure(favorite: Favorite): SqliteFavorite {
    return {
      user_id: favorite.userId,
      restaurant_id: favorite.restaurantId,
      created_at: favorite.createdAt.toISO()!,
    };
  }
}
