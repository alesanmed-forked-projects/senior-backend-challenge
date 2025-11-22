import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidCredentialsException extends DomainError {
  static readonly code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Invalid credentials', InvalidCredentialsException.code);
  }
}
