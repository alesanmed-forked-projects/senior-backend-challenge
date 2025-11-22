import { DomainError } from 'src/core/domain/errors/domain.error';

export class UserNotFound extends DomainError {
  static readonly code = 'USER_NOT_FOUND';

  constructor(id: number | string) {
    super(`User ${id} not found`, UserNotFound.code);
  }
}
