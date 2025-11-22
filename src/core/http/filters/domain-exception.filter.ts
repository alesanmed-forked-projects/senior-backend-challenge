import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainError } from 'src/core/domain/errors/domain.error';
import { HTTP_ERROR_MAPPING } from '../http-error.mapping';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    const status =
      HTTP_ERROR_MAPPING[exception.code ?? 'UNKNOWN_ERROR'] ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    const body = {
      message: exception.message,
      code: exception.code,
    };

    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}
