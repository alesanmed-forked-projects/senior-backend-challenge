import { Inject, Injectable } from '@nestjs/common';
import { STATS_REPOSITORY } from 'src/dashboard/infrastructure/persistence/sqlite-stats-repository.token';
import type { StatsRepository } from '../ports/stats.repository';
import { Stats } from 'src/dashboard/domain/entities/stats';

@Injectable()
export class GetStatsUsecase {
  constructor(
    @Inject(STATS_REPOSITORY)
    private readonly statsRepository: StatsRepository,
  ) {}

  async execute(): Promise<Stats> {
    return this.statsRepository.compute();
  }
}
