import { describe, it, beforeEach, expect, vi } from 'vitest';
import { DeleteRestaurantUsecase } from './delete-restaurant.usecase';
import { createRestaurantRepositoryMock, stubRestaurant } from 'src/test-utils';
import { faker } from '@faker-js/faker';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';

describe('DeleteRestaurantUsecase', () => {
  let usecase: DeleteRestaurantUsecase;
  let restaurantRepository: ReturnType<typeof createRestaurantRepositoryMock>;

  beforeEach(() => {
    restaurantRepository = createRestaurantRepositoryMock();
    usecase = new DeleteRestaurantUsecase(restaurantRepository as any);
    vi.clearAllMocks();
  });

  it('should delete restaurant when it exists', async () => {
    const restaurant = stubRestaurant();
    const id = restaurant.id!;

    vi.mocked(restaurantRepository.findById).mockResolvedValue(restaurant);
    vi.mocked(restaurantRepository.delete).mockResolvedValue();

    await usecase.execute(id);

    expect(restaurantRepository.findById).toHaveBeenCalledWith(id);
    expect(restaurantRepository.delete).toHaveBeenCalledWith(restaurant);
  });

  it('should throw RestaurantNotFound when restaurant does not exist', async () => {
    const id = faker.number.int({ min: 1, max: 1000 });

    vi.mocked(restaurantRepository.findById).mockResolvedValue(undefined);

    await expect(usecase.execute(id)).rejects.toThrow(RestaurantNotFound);
    expect(restaurantRepository.delete).not.toHaveBeenCalled();
  });
});
