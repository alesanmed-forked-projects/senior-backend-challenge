import { Module } from '@nestjs/common';
import { KnexModule } from 'src/core/infrastructure/persistence/knex.module';
import { StatsController } from './http/stats.controller';
import { GetStatsUsecase } from './application/usecases/get-stats.usecase';
import { SqliteStatsRepository } from './infrastructure/persistence/sqlite-stats.repository';
import { STATS_REPOSITORY } from './infrastructure/persistence/sqlite-stats-repository.token';

@Module({
  imports: [KnexModule],
  controllers: [StatsController],
  providers: [
    {
      provide: STATS_REPOSITORY,
      useClass: SqliteStatsRepository,
    },
    GetStatsUsecase,
  ],
})
export class DashboardModule {}
