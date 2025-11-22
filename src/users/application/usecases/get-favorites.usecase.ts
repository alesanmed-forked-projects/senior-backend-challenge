import { Inject, Injectable } from '@nestjs/common';
import { FAVORITE_REPOSITORY } from 'src/users/infrastructure/persistence/favorite-repository.token';
import type { FavoriteRepository } from 'src/users/application/ports/favorite.repository';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';

@Injectable()
export class GetFavoritesUsecase {
  constructor(
    @Inject(FAVORITE_REPOSITORY)
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async execute(userId: number): Promise<Restaurant[]> {
    return this.favoriteRepository.findAllByUserId(userId);
  }
}
