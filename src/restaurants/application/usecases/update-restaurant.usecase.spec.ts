import { describe, it, beforeEach, expect, vi } from 'vitest';
import { UpdateRestaurantUsecase } from './update-restaurant.usecase';
import { createRestaurantRepositoryMock, stubRestaurant } from 'src/test-utils';
import { EditRestaurantCommand } from './commands/edit-restaurant.usecase';
import { faker } from '@faker-js/faker';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';

describe('UpdateRestaurantUsecase', () => {
  let usecase: UpdateRestaurantUsecase;
  let restaurantRepository: ReturnType<typeof createRestaurantRepositoryMock>;

  beforeEach(() => {
    restaurantRepository = createRestaurantRepositoryMock();
    usecase = new UpdateRestaurantUsecase(restaurantRepository as any);
    vi.clearAllMocks();
  });

  it('should update restaurant when it exists', async () => {
    const restaurant = stubRestaurant();
    const command: EditRestaurantCommand = {
      id: restaurant.id!,
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

    vi.mocked(restaurantRepository.findById).mockResolvedValue(restaurant);
    vi.mocked(restaurantRepository.update).mockResolvedValue();

    await usecase.execute(command);

    expect(restaurantRepository.findById).toHaveBeenCalledWith(command.id);
    expect(restaurantRepository.update).toHaveBeenCalledTimes(1);
    const updatedRestaurant = vi.mocked(restaurantRepository.update).mock
      .calls[0][0];

    expect(updatedRestaurant.name).toBe(command.name);
    expect(updatedRestaurant.neighborhood).toBe(command.neighborhood);
    expect(updatedRestaurant.photograph).toBe(command.photograph);
    expect(updatedRestaurant.address).toBe(command.address);
    expect(updatedRestaurant.coordinates).toEqual(command.coordinates);
    expect(updatedRestaurant.imageUrl.toString()).toEqual(command.image_url);
    expect(updatedRestaurant.cuisineType).toBe(command.cuisine_type);
  });

  it('should throw RestaurantNotFound when restaurant does not exist', async () => {
    const command: EditRestaurantCommand = {
      id: faker.number.int({ min: 1, max: 1000 }),
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

    vi.mocked(restaurantRepository.findById).mockResolvedValue(undefined);

    await expect(usecase.execute(command)).rejects.toThrow(RestaurantNotFound);
    expect(restaurantRepository.update).not.toHaveBeenCalled();
  });
});
