import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidFavoriteData extends DomainError {
  static readonly code = 'INVALID_FAVORITE_DATA';

  constructor(fieldName: string, value: string) {
    super(`Invalid ${fieldName}: ${value}`, InvalidFavoriteData.code);
  }
}
