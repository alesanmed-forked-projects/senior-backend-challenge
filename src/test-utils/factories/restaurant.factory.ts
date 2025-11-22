import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { SqliteRestaurant } from 'src/restaurants/infrastructure/persistence/restaurant.mapper';
import { faker } from '@faker-js/faker';
import { Url } from 'src/core/domain/value-objects/url.vo';

export const stubRestaurantData = (overrides?: Partial<unknown>) => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.company.name(),
  neighborhood: faker.location.city(),
  photograph: `${faker.word.adjective()}.jpg`,
  address: faker.location.streetAddress(),
  coordinates: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  imageUrl: Url.fromString(faker.image.url()),
  cuisineType: faker.word.adjective(),
  averageRating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
  ...overrides,
});

export const stubRestaurant = (overrides?: Partial<unknown>) => {
  return Restaurant.fromData(stubRestaurantData(overrides));
};

export const stubSqliteRestaurant = (
  overrides?: Partial<SqliteRestaurant>,
): SqliteRestaurant => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.company.name(),
  neighborhood: faker.location.city(),
  photograph: `${faker.word.adjective()}.jpg`,
  address: faker.location.streetAddress(),
  lat: faker.location.latitude(),
  lng: faker.location.longitude(),
  image: faker.image.url(),
  cuisine_type: faker.word.adjective(),
  average_rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
  ...overrides,
});
