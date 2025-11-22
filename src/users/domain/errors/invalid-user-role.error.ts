import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidUserRole extends DomainError {
  static readonly code = 'INVALID_USER_ROLE';

  constructor(role: string) {
    super(`Invalid role: ${role}`, InvalidUserRole.code);
  }
}
