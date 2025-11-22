import { Logger, Module } from '@nestjs/common';
import { KNEX } from './knex.tokens';
import { Knex, knex } from 'knex';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: KNEX,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Knex => {
        const logger = new Logger(KnexModule.name);

        return knex({
          client: 'better-sqlite3',
          connection: {
            filename: configService.get<string>('DATABASE_PATH') as string,
          },
          useNullAsDefault: true,
          debug: configService.get<string>('NODE_ENV') !== 'production',
          log: {
            warn: logger.warn.bind(logger),
            error: logger.error.bind(logger),
            debug: logger.debug.bind(logger),
            deprecate: logger.warn.bind(logger),
          },
        });
      },
    },
  ],
  exports: [KNEX],
})
export class KnexModule {}
