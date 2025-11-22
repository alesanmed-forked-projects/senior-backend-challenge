import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidSort extends DomainError {
  static readonly code = 'INVALID_SORT';

  constructor(sort: string) {
    super(`Invalid sort field: ${sort}`, InvalidSort.code);
  }
}
