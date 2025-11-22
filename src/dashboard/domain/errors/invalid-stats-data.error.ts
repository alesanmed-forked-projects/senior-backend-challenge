import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidStatsData extends DomainError {
  static readonly code = 'INVALID_STATS_DATA';

  constructor(fieldName: string, value: string) {
    super(`Invalid ${fieldName}: ${value}`, InvalidStatsData.code);
  }
}
