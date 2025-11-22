import { DomainError } from 'src/core/domain/errors/domain.error';

export class UserAlreadyExists extends DomainError {
  static readonly code = 'USER_ALREADY_EXISTS';

  constructor(email: string) {
    super(`User with email ${email} already exists`, UserAlreadyExists.code);
  }
}
