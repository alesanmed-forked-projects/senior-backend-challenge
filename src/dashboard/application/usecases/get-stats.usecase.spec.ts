import { describe, it, beforeEach, expect, vi } from 'vitest';
import { GetStatsUsecase } from './get-stats.usecase';
import type { StatsRepository } from '../ports/stats.repository';
import { stubStatsData } from 'src/test-utils/factories/stats.factory';

describe('GetStatsUsecase', () => {
  let usecase: GetStatsUsecase;
  let statsRepository: StatsRepository;

  beforeEach(() => {
    statsRepository = {
      compute: vi.fn(),
    } as unknown as StatsRepository;

    usecase = new GetStatsUsecase(statsRepository);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should return stats computed by repository', async () => {
      const stats = stubStatsData();
      vi.mocked(statsRepository.compute).mockResolvedValue(stats);

      const result = await usecase.execute();

      expect(result).toBe(stats);
      expect(statsRepository.compute).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      vi.mocked(statsRepository.compute).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute()).rejects.toThrow('Database error');
    });
  });
});
