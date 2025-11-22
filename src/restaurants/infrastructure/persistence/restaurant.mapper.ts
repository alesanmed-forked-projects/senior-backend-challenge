import { Url } from 'src/core/domain/value-objects/url.vo';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';

export type SqliteRestaurant = {
  id?: number;
  name: string;
  neighborhood: string;
  photograph: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  cuisine_type: string;
  average_rating?: number;
};

export class RestaurantMapper {
  static toDomain(this: void, sqliteRestaurant: SqliteRestaurant): Restaurant {
    return Restaurant.fromData({
      id: sqliteRestaurant.id,
      name: sqliteRestaurant.name,
      neighborhood: sqliteRestaurant.neighborhood,
      photograph: sqliteRestaurant.photograph,
      address: sqliteRestaurant.address,
      coordinates: { lat: sqliteRestaurant.lat, lng: sqliteRestaurant.lng },
      imageUrl: Url.fromString(sqliteRestaurant.image),
      cuisineType: sqliteRestaurant.cuisine_type,
      averageRating: sqliteRestaurant.average_rating ?? 0,
    });
  }

  static toInfrastructure(
    this: void,
    restaurant: Restaurant,
  ): SqliteRestaurant {
    return {
      id: restaurant.id,
      name: restaurant.name,
      neighborhood: restaurant.neighborhood,
      photograph: restaurant.photograph,
      address: restaurant.address,
      lat: restaurant.coordinates.lat,
      lng: restaurant.coordinates.lng,
      image: restaurant.imageUrl.toString(),
      cuisine_type: restaurant.cuisineType,
    };
  }

  static toInfrastructureUpdate(
    this: void,
    restaurant: Restaurant,
  ): Partial<SqliteRestaurant> {
    return {
      name: restaurant.name,
      neighborhood: restaurant.neighborhood,
      photograph: restaurant.photograph,
      address: restaurant.address,
      lat: restaurant.coordinates?.lat,
      lng: restaurant.coordinates?.lng,
      image: restaurant.imageUrl.toString(),
      cuisine_type: restaurant.cuisineType,
    };
  }

  static toInfrastructureSort(this: void, sort: string): string {
    switch (sort) {
      case 'name':
        return 'restaurants.name';
      case 'neighborhood':
        return 'restaurants.neighborhood';
      default:
        return 'average_rating';
    }
  }
}
