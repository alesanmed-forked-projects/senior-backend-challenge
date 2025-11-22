import { Inject, Injectable } from '@nestjs/common';
import { RESTAURANT_REPOSITORY } from 'src/restaurants/infrastructure/persistence/restaurant-repository.token';
import type { RestaurantRepository } from 'src/restaurants/application/ports/restaurants.repository';
import { CreateRestaurantCommand } from 'src/restaurants/application/usecases/commands/create-restaurant.command';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';

@Injectable()
export class CreateRestaurantUsecase {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async execute(command: CreateRestaurantCommand): Promise<number> {
    const restaurant = Restaurant.createNew({
      name: command.name,
      neighborhood: command.neighborhood,
      photograph: command.photograph,
      address: command.address,
      coordinates: command.coordinates,
      imageUrl: command.image_url,
      cuisineType: command.cuisine_type,
    });

    return this.restaurantRepository.create(restaurant);
  }
}
