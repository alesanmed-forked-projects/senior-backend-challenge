import { Stats } from 'src/dashboard/domain/entities/stats';

export interface StatsRepository {
  compute(): Promise<Stats>;
}
