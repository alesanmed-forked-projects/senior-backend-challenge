import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KnexModule } from './core/infrastructure/persistence/knex.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigSchema } from './core/infrastructure/config/env.schema';
import { LoggerModule } from 'nestjs-pino';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ReviewsModule } from './reviews/reviews.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './core/http/guards/role.guard';
import { JwtAuthGuard } from './auth/infrastructure/guards/jwt.guard';
import { DomainExceptionFilter } from './core/http/filters/domain-exception.filter';
import { DashboardModule } from './dashboard/dashboard.module';
import { CacheModule, CacheOptions } from '@nestjs/cache-manager';
import { HttpCacheInterceptor } from './core/http/interceptors/cache.interceptor';
import KeyvRedis from '@keyv/redis';
import Keyv, { KeyvStoreAdapter } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvConfigSchema,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        let level = 'info';

        if (nodeEnv === 'development') {
          level = 'debug';
        } else if (nodeEnv === 'test') {
          level = 'silent';
        }

        const transport =
          nodeEnv !== 'production' ? { target: 'pino-pretty' } : undefined;

        return {
          pinoHttp: {
            level,
            transport,
          },
        };
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CacheOptions => {
        const env = configService.get<string>('NODE_ENV');

        if (env === 'test') {
          return {
            ttl: 5000,
          };
        }

        const stores: (Keyv | KeyvStoreAdapter)[] = [
          new Keyv(
            new KeyvCacheableMemory({
              ttl: 5000,
              lruSize: 5000,
            }),
          ),
        ];

        if (env === 'production') {
          const redisUrl = configService.get<string>('REDIS_CACHE_URL');

          if (redisUrl) {
            stores.push(new KeyvRedis(redisUrl));
          }
        }

        return {
          stores,
        };
      },
    }),
    KnexModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    ReviewsModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useExisting: HttpCacheInterceptor,
    },
    HttpCacheInterceptor, // This, combined with the useExisting, allows us to mock the provider in tests
  ],
})
export class AppModule {}
