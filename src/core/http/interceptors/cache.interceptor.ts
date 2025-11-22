import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();

    const { method, url } = request;

    if (method !== 'GET') {
      return undefined;
    }

    const token = request.headers.authorization?.split(' ')[1] ?? '';

    return `${method} ${url} ${token}`.toLowerCase();
  }
}
