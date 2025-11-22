import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidRestaurantData extends DomainError {
  static readonly code = 'INVALID_RESTAURANT_DATA';

  constructor(fieldName: string, value: string) {
    super(
      `Invalid value for field ${fieldName}: ${value}`,
      InvalidRestaurantData.code,
    );
  }
}
