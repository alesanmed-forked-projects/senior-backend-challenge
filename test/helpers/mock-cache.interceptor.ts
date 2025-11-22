import { CacheInterceptor } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockCacheInterceptor extends CacheInterceptor {
  trackBy(): string | undefined {
    // Don't cache anything in testing
    return undefined;
  }
}
