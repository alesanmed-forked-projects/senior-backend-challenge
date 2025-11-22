import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { HttpRestaurant } from 'src/restaurants/http/dto/http-restaurant';

export class HttpRestaurantMapper {
  static toDto(this: void, restaurant: Restaurant): HttpRestaurant {
    return {
      id: restaurant.id!,
      name: restaurant.name,
      neighborhood: restaurant.neighborhood,
      photograph: restaurant.photograph,
      address: restaurant.address,
      coordinates: restaurant.coordinates,
      average_rating: restaurant.averageRating!,
      image_url: restaurant.imageUrl.toString(),
      cuisine_type: restaurant.cuisineType,
    };
  }
}
