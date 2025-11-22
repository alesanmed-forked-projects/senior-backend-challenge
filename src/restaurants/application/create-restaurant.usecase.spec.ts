import { describe, it, beforeEach, expect, vi } from 'vitest';
import { CreateRestaurantUsecase } from './create-restaurant.usecase';
import { createRestaurantRepositoryMock } from 'src/test-utils';
import { CreateRestaurantCommand } from './usecases/commands/create-restaurant.command';
import { faker } from '@faker-js/faker';
import { Url } from 'src/core/domain/value-objects/url.vo';

describe('CreateRestaurantUsecase', () => {
  let usecase: CreateRestaurantUsecase;
  let restaurantRepository: ReturnType<typeof createRestaurantRepositoryMock>;

  beforeEach(() => {
    restaurantRepository = createRestaurantRepositoryMock();
    usecase = new CreateRestaurantUsecase(restaurantRepository as any);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a restaurant and return its ID', async () => {
      const command: CreateRestaurantCommand = {
        name: faker.company.name(),
        neighborhood: faker.location.city(),
        photograph: `${faker.word.adjective()}.jpg`,
        address: faker.location.streetAddress(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        image_url: faker.image.url(),
        cuisine_type: faker.word.adjective(),
      };

      const restaurantId = faker.number.int({ min: 1, max: 1000 });
      vi.mocked(restaurantRepository.create).mockResolvedValue(restaurantId);

      const result = await usecase.execute(command);

      expect(result).toBe(restaurantId);
      expect(restaurantRepository.create).toHaveBeenCalledTimes(1);
      expect(restaurantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: command.name,
          neighborhood: command.neighborhood,
          photograph: command.photograph,
          address: command.address,
          coordinates: command.coordinates,
          imageUrl: Url.fromString(command.image_url),
          cuisineType: command.cuisine_type,
        }),
      );
    });

    it('should propagate repository errors', async () => {
      const command: CreateRestaurantCommand = {
        name: faker.company.name(),
        neighborhood: faker.location.city(),
        photograph: `${faker.word.adjective()}.jpg`,
        address: faker.location.streetAddress(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        image_url: faker.image.url(),
        cuisine_type: faker.word.adjective(),
      };

      vi.mocked(restaurantRepository.create).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(command)).rejects.toThrow('Database error');
    });
  });
});
