import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { Favorite } from 'src/users/domain/entities/favorite.entity';

export interface FavoriteRepository {
  findAllByUserId(userId: number): Promise<Restaurant[]>;
  findByUserIdAndRestaurantId(
    userId: number,
    restaurantId: number,
  ): Promise<Favorite | undefined>;

  create(favorite: Favorite): Promise<void>;
  delete(favorite: Favorite): Promise<void>;
}
