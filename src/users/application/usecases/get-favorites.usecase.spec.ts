import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetFavoritesUsecase } from './get-favorites.usecase';
import { createFavoriteRepositoryMock, stubRestaurant } from 'src/test-utils';

describe('GetFavoritesUsecase', () => {
  let usecase: GetFavoritesUsecase;
  let favoriteRepository: ReturnType<typeof createFavoriteRepositoryMock>;

  beforeEach(() => {
    favoriteRepository = createFavoriteRepositoryMock();
    usecase = new GetFavoritesUsecase(favoriteRepository as any);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should return favorites for a user', async () => {
      const userId = 1;
      const restaurants = [stubRestaurant(), stubRestaurant()];

      vi.mocked(favoriteRepository.findAllByUserId).mockResolvedValue(
        restaurants as any,
      );

      const result = await usecase.execute(userId);

      expect(result).toBe(restaurants);
      expect(favoriteRepository.findAllByUserId).toHaveBeenCalledTimes(1);
      expect(favoriteRepository.findAllByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return empty array when no favorites are found', async () => {
      const userId = 1;
      vi.mocked(favoriteRepository.findAllByUserId).mockResolvedValue([]);
      const result = await usecase.execute(userId);
      expect(result).toEqual([]);
      expect(favoriteRepository.findAllByUserId).toHaveBeenCalledTimes(1);
      expect(favoriteRepository.findAllByUserId).toHaveBeenCalledWith(userId);
    });

    it('should propagate repository errors', async () => {
      const userId = 1;
      vi.mocked(favoriteRepository.findAllByUserId).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(userId)).rejects.toThrow('Database error');
    });
  });
});
