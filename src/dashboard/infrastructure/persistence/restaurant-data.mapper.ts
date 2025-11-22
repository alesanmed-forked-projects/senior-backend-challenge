import { RestaurantData } from 'src/dashboard/domain/interfaces/restaurant-data.interface';

export type SqliteRestaurantData = {
  id: number;
  name: string;
  average_rating: number;
  reviews_amount: number;
};

export class RestaurantDataMapper {
  static toDomain(
    this: void,
    sqliteRestaurantData: SqliteRestaurantData,
  ): RestaurantData {
    return {
      id: sqliteRestaurantData.id,
      name: sqliteRestaurantData.name,
      averageRating: sqliteRestaurantData.average_rating ?? 0,
      numberOfReviews: sqliteRestaurantData.reviews_amount ?? 0,
    };
  }
}
