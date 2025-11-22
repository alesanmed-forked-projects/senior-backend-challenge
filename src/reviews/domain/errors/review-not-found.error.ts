import { DomainError } from 'src/core/domain/errors/domain.error';

export class ReviewNotFound extends DomainError {
  static readonly code = 'REVIEW_NOT_FOUND';

  constructor(id: number) {
    super(`Review ${id} not found`, ReviewNotFound.code);
  }
}
