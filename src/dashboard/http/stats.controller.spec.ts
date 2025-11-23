import { describe, it, beforeEach, expect, vi } from 'vitest';
import { StatsController } from './stats.controller';
import { GetStatsUsecase } from '../application/usecases/get-stats.usecase';
import { stubStatsData } from 'src/test-utils/factories/stats.factory';

describe('StatsController', () => {
  let controller: StatsController;
  let getStatsUsecase: GetStatsUsecase;

  beforeEach(() => {
    getStatsUsecase = {
      execute: vi.fn(),
    } as unknown as GetStatsUsecase;

    controller = new StatsController(getStatsUsecase);
    vi.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return stats from GetStatsUsecase', async () => {
      const stats = stubStatsData();
      vi.mocked(getStatsUsecase.execute).mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toBe(stats);
      expect(getStatsUsecase.execute).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from GetStatsUsecase', async () => {
      vi.mocked(getStatsUsecase.execute).mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(controller.getStats()).rejects.toThrow('Unexpected error');
    });
  });
});
