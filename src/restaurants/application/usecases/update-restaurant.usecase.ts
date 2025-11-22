import { Inject, Injectable } from '@nestjs/common';
import { RESTAURANT_REPOSITORY } from 'src/restaurants/infrastructure/persistence/restaurant-repository.token';
import type { RestaurantRepository } from '../ports/restaurants.repository';
import { EditRestaurantCommand } from './commands/edit-restaurant.usecase';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';

@Injectable()
export class UpdateRestaurantUsecase {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async execute(command: EditRestaurantCommand): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(command.id);

    if (!restaurant) {
      throw new RestaurantNotFound(command.id);
    }

    restaurant.name = command.name;
    restaurant.neighborhood = command.neighborhood;
    restaurant.photograph = command.photograph;
    restaurant.address = command.address;
    restaurant.coordinates = command.coordinates;
    restaurant.imageUrl = command.image_url;
    restaurant.cuisineType = command.cuisine_type;

    await this.restaurantRepository.update(restaurant);
  }
}
