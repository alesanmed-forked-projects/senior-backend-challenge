import { Inject, Injectable } from '@nestjs/common';
import { FAVORITE_REPOSITORY } from 'src/users/infrastructure/persistence/favorite-repository.token';
import type { FavoriteRepository } from 'src/users/application/ports/favorite.repository';
import { FavoriteNotFound } from 'src/users/domain/errors/favorite-not-found.error';

@Injectable()
export class DeleteFavoriteUsecase {
  constructor(
    @Inject(FAVORITE_REPOSITORY)
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async execute(userId: number, restaurantId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findByUserIdAndRestaurantId(
      userId,
      restaurantId,
    );

    if (!favorite) {
      throw new FavoriteNotFound(restaurantId);
    }

    await this.favoriteRepository.delete(favorite);
  }
}
