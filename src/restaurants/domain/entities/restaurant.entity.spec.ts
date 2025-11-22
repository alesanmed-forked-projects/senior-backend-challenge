import { describe, expect, it } from 'vitest';
import { Restaurant } from './restaurant.entity';
import { InvalidRestaurantData } from '../errors/invalid-restaurant-data.error';
import { InvalidUrl } from 'src/core/domain/errors/invalid-url.error';
import { Url } from 'src/core/domain/value-objects/url.vo';

describe('RestaurantEntity', () => {
  describe('createNew', () => {
    it('should create a new restaurant', () => {
      const restaurant = Restaurant.createNew({
        name: 'Test Restaurant',
        neighborhood: 'Test Neighborhood',
        photograph: 'Test Photograph',
        address: 'Test Address',
        coordinates: {
          lat: 0,
          lng: 0,
        },
        cuisineType: 'Test Cuisine Type',
        imageUrl: 'https://example.com/image.jpg',
      });

      expect(restaurant).toBeInstanceOf(Restaurant);
    });

    it('should throw an error if the name is invalid', () => {
      expect(() =>
        Restaurant.createNew({
          name: '',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          cuisineType: 'Test Cuisine Type',
          imageUrl: 'https://example.com/image.jpg',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the neighborhood is invalid', () => {
      expect(() =>
        Restaurant.createNew({
          name: 'Test Restaurant',
          neighborhood: '',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          cuisineType: 'Test Cuisine Type',
          imageUrl: 'https://example.com/image.jpg',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the photograph is invalid', () => {
      expect(() =>
        Restaurant.createNew({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: '',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          cuisineType: 'Test Cuisine Type',
          imageUrl: 'https://example.com/image.jpg',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the address is invalid', () => {
      expect(() =>
        Restaurant.createNew({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: '',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          cuisineType: 'Test Cuisine Type',
          imageUrl: 'https://example.com/image.jpg',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the coordinates are invalid', () => {
      expect(() =>
        Restaurant.createNew({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 100,
            lng: 100,
          },
          cuisineType: 'Test Cuisine Type',
          imageUrl: 'https://example.com/image.jpg',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the cuisine type is invalid', () => {
      expect(() =>
        Restaurant.createNew({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          cuisineType: '',
          imageUrl: 'https://example.com/image.jpg',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the image url is invalid', () => {
      expect(() =>
        Restaurant.createNew({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          cuisineType: 'Test Cuisine Type',
          imageUrl: 'not-a-url',
        }),
      ).toThrow(InvalidUrl);
    });
  });

  describe('fromData', () => {
    it('should create a restaurant from data', () => {
      const restaurant = Restaurant.fromData({
        name: 'Test Restaurant',
        neighborhood: 'Test Neighborhood',
        photograph: 'Test Photograph',
        address: 'Test Address',
        coordinates: {
          lat: 0,
          lng: 0,
        },
        imageUrl: Url.fromString('https://example.com/image.jpg'),
        cuisineType: 'Test Cuisine Type',
      });
      expect(restaurant).toBeInstanceOf(Restaurant);
    });

    it('should throw an error if the name is invalid', () => {
      expect(() =>
        Restaurant.fromData({
          name: '',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          imageUrl: Url.fromString('https://example.com/image.jpg'),
          cuisineType: 'Test Cuisine Type',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the neighborhood is invalid', () => {
      expect(() =>
        Restaurant.fromData({
          name: 'Test Restaurant',
          neighborhood: '',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          imageUrl: Url.fromString('https://example.com/image.jpg'),
          cuisineType: 'Test Cuisine Type',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the photograph is invalid', () => {
      expect(() =>
        Restaurant.fromData({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: '',
          address: 'Test Address',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          imageUrl: Url.fromString('https://example.com/image.jpg'),
          cuisineType: 'Test Cuisine Type',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the address is invalid', () => {
      expect(() =>
        Restaurant.fromData({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: '',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          imageUrl: Url.fromString('https://example.com/image.jpg'),
          cuisineType: 'Test Cuisine Type',
        }),
      ).toThrow(InvalidRestaurantData);
    });

    it('should throw an error if the coordinates are invalid', () => {
      expect(() =>
        Restaurant.fromData({
          name: 'Test Restaurant',
          neighborhood: 'Test Neighborhood',
          photograph: 'Test Photograph',
          address: 'Test Address',
          coordinates: {
            lat: 100,
            lng: 100,
          },
          imageUrl: Url.fromString('https://example.com/image.jpg'),
          cuisineType: 'Test Cuisine Type',
        }),
      ).toThrow(InvalidRestaurantData);
    });
  });

  describe('setters', () => {
    const createValidRestaurant = () =>
      Restaurant.createNew({
        name: 'Test Restaurant',
        neighborhood: 'Test Neighborhood',
        photograph: 'Test Photograph',
        address: 'Test Address',
        coordinates: {
          lat: 0,
          lng: 0,
        },
        cuisineType: 'Test Cuisine Type',
        imageUrl: 'https://example.com/image.jpg',
      });

    it('should set the name', () => {
      const restaurant = createValidRestaurant();

      restaurant.name = 'Updated Name';

      expect(restaurant.name).toBe('Updated Name');
    });

    it('should throw an error if the name is set to an invalid value', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.name = '';
      }).toThrow(InvalidRestaurantData);
    });

    it('should set the neighborhood', () => {
      const restaurant = createValidRestaurant();

      restaurant.neighborhood = 'Updated Neighborhood';

      expect(restaurant.neighborhood).toBe('Updated Neighborhood');
    });

    it('should throw an error if the neighborhood is set to an invalid value', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.neighborhood = '';
      }).toThrow(InvalidRestaurantData);
    });

    it('should set the photograph', () => {
      const restaurant = createValidRestaurant();

      restaurant.photograph = 'updated-photo.jpg';

      expect(restaurant.photograph).toBe('updated-photo.jpg');
    });

    it('should throw an error if the photograph is set to an invalid value', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.photograph = '';
      }).toThrow(InvalidRestaurantData);
    });

    it('should set the address', () => {
      const restaurant = createValidRestaurant();

      restaurant.address = 'Updated Address';

      expect(restaurant.address).toBe('Updated Address');
    });

    it('should throw an error if the address is set to an invalid value', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.address = '';
      }).toThrow(InvalidRestaurantData);
    });

    it('should set the coordinates', () => {
      const restaurant = createValidRestaurant();

      const newCoordinates = { lat: 10, lng: 20 };
      restaurant.coordinates = newCoordinates;

      expect(restaurant.coordinates).toEqual(newCoordinates);
    });

    it('should throw an error if the coordinates are set to invalid values', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.coordinates = { lat: 100, lng: 0 };
      }).toThrow(InvalidRestaurantData);
    });

    it('should set the average rating', () => {
      const restaurant = createValidRestaurant();

      restaurant.averageRating = 4.5;

      expect(restaurant.averageRating).toBe(4.5);
    });

    it('should throw an error if the average rating is set to an invalid value', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.averageRating = -1;
      }).toThrow(InvalidRestaurantData);

      expect(() => {
        restaurant.averageRating = 6;
      }).toThrow(InvalidRestaurantData);
    });

    it('should set the image url', () => {
      const restaurant = createValidRestaurant();

      const newUrl = 'https://example.com/updated-image.jpg';
      restaurant.imageUrl = newUrl;

      expect(restaurant.imageUrl.toString()).toBe(newUrl);
    });

    it('should throw an error if the image url is set to an invalid value', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.imageUrl = 'not-a-url';
      }).toThrow(InvalidUrl);
    });

    it('should set the cuisine type', () => {
      const restaurant = createValidRestaurant();

      restaurant.cuisineType = 'Updated Cuisine';

      expect(restaurant.cuisineType).toBe('Updated Cuisine');
    });

    it('should throw an error if the cuisine type is set to an invalid value', () => {
      const restaurant = createValidRestaurant();

      expect(() => {
        restaurant.cuisineType = '';
      }).toThrow(InvalidRestaurantData);
    });
  });
});
