import { DomainError } from './domain.error';

export class InvalidUrl extends DomainError {
  static readonly code = 'INVALID_URL';

  constructor(url: string) {
    super(`Invalid URL: ${url}`, InvalidUrl.code);
  }
}
