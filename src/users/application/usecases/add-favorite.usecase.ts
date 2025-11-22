import { Inject, Injectable } from '@nestjs/common';
import { FAVORITE_REPOSITORY } from 'src/users/infrastructure/persistence/favorite-repository.token';
import type { FavoriteRepository } from '../ports/favorite.repository';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';
import { RESTAURANT_REPOSITORY } from 'src/restaurants/infrastructure/persistence/restaurant-repository.token';
import type { RestaurantRepository } from 'src/restaurants/application/ports/restaurants.repository';
import { Favorite } from 'src/users/domain/entities/favorite.entity';

@Injectable()
export class AddFavoriteUsecase {
  constructor(
    @Inject(FAVORITE_REPOSITORY)
    private readonly favoriteRepository: FavoriteRepository,
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async execute(userId: number, restaurantId: number): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(restaurantId);

    if (!restaurant) {
      throw new RestaurantNotFound(restaurantId);
    }

    await this.favoriteRepository.create(
      Favorite.createNew({
        userId,
        restaurantId,
      }),
    );
  }
}
