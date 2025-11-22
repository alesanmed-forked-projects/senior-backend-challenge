import { DomainError } from 'src/core/domain/errors/domain.error';

export class FavoriteNotFound extends DomainError {
  static readonly code = 'FAVORITE_NOT_FOUND';

  constructor(restaurantId: number) {
    super(
      `Favorite for restaurant ${restaurantId} not found`,
      FavoriteNotFound.code,
    );
  }
}
