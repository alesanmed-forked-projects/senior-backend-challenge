import { describe, it, beforeEach, expect, vi } from 'vitest';
import { FindRestaurantsUsecase } from './find-restaurants.usecase';
import { createRestaurantRepositoryMock, stubRestaurant } from 'src/test-utils';
import { FindRestaurantsQuery } from './queries/find-restaurants.query';
import { InvalidSort } from 'src/restaurants/domain/errors/invalid-sort.error';

describe('FindRestaurantsUsecase', () => {
  let usecase: FindRestaurantsUsecase;
  let restaurantRepository: ReturnType<typeof createRestaurantRepositoryMock>;

  beforeEach(() => {
    restaurantRepository = createRestaurantRepositoryMock();
    usecase = new FindRestaurantsUsecase(restaurantRepository as any);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated restaurants', async () => {
      const restaurants = [
        stubRestaurant(),
        stubRestaurant(),
        stubRestaurant(),
      ];
      const query: FindRestaurantsQuery = {
        page: 1,
        limit: 10,
      };

      const paginatedResult = {
        data: restaurants,
        total: 3,
        page: 1,
        limit: 10,
      };

      vi.mocked(restaurantRepository.findAll).mockResolvedValue(
        paginatedResult,
      );

      const result = await usecase.execute(query);

      expect(result).toEqual(paginatedResult);
      expect(restaurantRepository.findAll).toHaveBeenCalledWith({
        cuisine: undefined,
        rating: undefined,
        neighborhood: undefined,
        page: 1,
        limit: 10,
        sort: undefined,
        sortOrder: undefined,
      });
    });

    it('should apply filters correctly', async () => {
      const restaurants = [stubRestaurant()];
      const query: FindRestaurantsQuery = {
        page: 1,
        limit: 10,
        cuisine: 'Italian',
        rating: 4,
        neighborhood: 'Manhattan',
        sort: 'name',
        sortOrder: 'asc',
      };

      const paginatedResult = {
        data: restaurants,
        total: 1,
        page: 1,
        limit: 10,
      };

      vi.mocked(restaurantRepository.findAll).mockResolvedValue(
        paginatedResult,
      );

      const result = await usecase.execute(query);

      expect(result).toEqual(paginatedResult);
      expect(restaurantRepository.findAll).toHaveBeenCalledWith({
        cuisine: 'Italian',
        rating: 4,
        neighborhood: 'Manhattan',
        page: 1,
        limit: 10,
        sort: 'name',
        sortOrder: 'asc',
      });
    });

    it('should throw InvalidSort when sort field is not allowed', async () => {
      const query: FindRestaurantsQuery = {
        page: 1,
        limit: 10,
        sort: 'invalid-field',
      };

      await expect(usecase.execute(query)).rejects.toThrow(InvalidSort);
      expect(restaurantRepository.findAll).not.toHaveBeenCalled();
    });

    it('should return empty array when no restaurants are found', async () => {
      const query: FindRestaurantsQuery = {
        page: 1,
        limit: 10,
      };

      vi.mocked(restaurantRepository.findAll).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      const result = await usecase.execute(query);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });

    it('should handle repository errors', async () => {
      const query: FindRestaurantsQuery = {
        page: 1,
        limit: 10,
      };

      vi.mocked(restaurantRepository.findAll).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(query)).rejects.toThrow('Database error');
    });
  });
});
