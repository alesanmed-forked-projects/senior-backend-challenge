import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteFavoriteUsecase } from './delete-favorite.usecase';
import { createFavoriteRepositoryMock, stubRestaurant } from 'src/test-utils';
import { Favorite } from 'src/users/domain/entities/favorite.entity';
import { FavoriteNotFound } from 'src/users/domain/errors/favorite-not-found.error';

describe('DeleteFavoriteUsecase', () => {
  let usecase: DeleteFavoriteUsecase;
  let favoriteRepository: ReturnType<typeof createFavoriteRepositoryMock>;

  beforeEach(() => {
    favoriteRepository = createFavoriteRepositoryMock();
    usecase = new DeleteFavoriteUsecase(favoriteRepository as any);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete favorite when it exists', async () => {
      const userId = 1;
      const restaurant = stubRestaurant();
      const favorite = Favorite.createNew({
        userId,
        restaurantId: restaurant.id!,
      });

      vi.mocked(
        favoriteRepository.findByUserIdAndRestaurantId,
      ).mockResolvedValue(favorite);

      await usecase.execute(userId, restaurant.id!);

      expect(
        favoriteRepository.findByUserIdAndRestaurantId,
      ).toHaveBeenCalledWith(userId, restaurant.id);
      expect(favoriteRepository.delete).toHaveBeenCalledWith(favorite);
    });

    it('should throw FavoriteNotFound when favorite does not exist', async () => {
      const userId = 1;
      const restaurantId = 999;

      vi.mocked(
        favoriteRepository.findByUserIdAndRestaurantId,
      ).mockResolvedValue(undefined);

      await expect(usecase.execute(userId, restaurantId)).rejects.toThrow(
        FavoriteNotFound,
      );
      expect(
        favoriteRepository.findByUserIdAndRestaurantId,
      ).toHaveBeenCalledWith(userId, restaurantId);
      expect(favoriteRepository.delete).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const userId = 1;
      const restaurantId = 10;

      vi.mocked(
        favoriteRepository.findByUserIdAndRestaurantId,
      ).mockRejectedValue(new Error('Database error'));

      await expect(usecase.execute(userId, restaurantId)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
