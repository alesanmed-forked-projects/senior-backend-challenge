import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidUserData extends DomainError {
  static readonly code = 'INVALID_USER_DATA';

  constructor(fieldName: string, value: string) {
    super(`Invalid ${fieldName}: ${value}`, InvalidUserData.code);
  }
}
