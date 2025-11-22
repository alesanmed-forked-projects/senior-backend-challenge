import { DomainError } from 'src/core/domain/errors/domain.error';

export class RestaurantNotFound extends DomainError {
  static readonly code = 'RESTAURANT_NOT_FOUND';

  constructor(id: number) {
    super(`Restaurant ${id} not found`, RestaurantNotFound.code);
  }
}
