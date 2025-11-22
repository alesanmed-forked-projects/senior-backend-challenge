import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidReviewData extends DomainError {
  static readonly code = 'INVALID_REVIEW_DATA';

  constructor(
    public readonly field: string,
    public readonly value: string,
  ) {
    super(`Invalid ${field}: ${value}`);
  }
}
