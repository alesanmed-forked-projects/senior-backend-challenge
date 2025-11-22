import { Url } from 'src/core/domain/value-objects/url.vo';
import { InvalidRestaurantData } from '../errors/invalid-restaurant-data.error';

interface RestaurantData {
  id?: number;
  name: string;
  neighborhood: string;
  photograph: string;
  address: string;
  averageRating?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: Url;
  cuisineType: string;
}

export class Restaurant {
  private readonly data: RestaurantData;

  private constructor(
    data:
      | RestaurantData
      | (Omit<RestaurantData, 'imageUrl'> & { imageUrl: string }),
  ) {
    this.validate(data);

    this.data = {
      ...data,
      imageUrl:
        data.imageUrl instanceof Url
          ? data.imageUrl
          : Url.fromString(data.imageUrl),
    };
  }

  static createNew(
    params: Omit<RestaurantData, 'id' | 'averageRating' | 'imageUrl'> & {
      imageUrl: string;
    },
  ): Restaurant {
    return new Restaurant({
      ...params,
      id: undefined,
    });
  }

  static fromData(data: RestaurantData): Restaurant {
    return new Restaurant(data);
  }

  withId(id: number): Restaurant {
    this.data.id = id;

    return this;
  }

  get id(): number | undefined {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  set name(name: string) {
    this.validateName(name);
    this.data.name = name;
  }

  get neighborhood(): string {
    return this.data.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.validateNeighborhood(neighborhood);
    this.data.neighborhood = neighborhood;
  }

  get averageRating(): number | undefined {
    return this.data.averageRating;
  }

  set averageRating(averageRating: number) {
    this.validateAverageRating(averageRating);
    this.data.averageRating = averageRating;
  }

  get photograph(): string {
    return this.data.photograph;
  }

  set photograph(photograph: string) {
    this.validatePhotograph(photograph);
    this.data.photograph = photograph;
  }

  get address(): string {
    return this.data.address;
  }

  set address(address: string) {
    this.validateAddress(address);
    this.data.address = address;
  }

  get coordinates(): { lat: number; lng: number } {
    return this.data.coordinates;
  }

  set coordinates(coordinates: { lat: number; lng: number }) {
    this.validateCoordinates(coordinates);
    this.data.coordinates = coordinates;
  }

  get imageUrl(): Url {
    return this.data.imageUrl;
  }

  set imageUrl(imageUrl: string) {
    this.data.imageUrl = Url.fromString(imageUrl);
  }

  get cuisineType(): string {
    return this.data.cuisineType;
  }

  set cuisineType(cuisineType: string) {
    this.validateCuisineType(cuisineType);
    this.data.cuisineType = cuisineType;
  }

  private validate(
    data: RestaurantData | Omit<RestaurantData, 'imageUrl'>,
  ): void {
    this.validateName(data.name);
    this.validateNeighborhood(data.neighborhood);
    this.validatePhotograph(data.photograph);
    this.validateAddress(data.address);
    this.validateCoordinates(data.coordinates);
    this.validateCuisineType(data.cuisineType);
  }

  private validateName(name: string): void {
    if (!name.trim() || name.length > 255) {
      throw new InvalidRestaurantData('name', name);
    }
  }

  private validateNeighborhood(neighborhood: string): void {
    if (!neighborhood.trim() || neighborhood.length > 255) {
      throw new InvalidRestaurantData('neighborhood', neighborhood);
    }
  }

  private validatePhotograph(photograph: string): void {
    if (!photograph.trim() || photograph.length > 255) {
      throw new InvalidRestaurantData('photograph', photograph);
    }
  }

  private validateAddress(address: string): void {
    if (!address.trim() || address.length > 255) {
      throw new InvalidRestaurantData('address', address);
    }
  }

  private validateCoordinates(coordinates: { lat: number; lng: number }): void {
    if (
      coordinates.lat < -90 ||
      coordinates.lat > 90 ||
      coordinates.lng < -180 ||
      coordinates.lng > 180
    ) {
      throw new InvalidRestaurantData(
        'coordinates',
        JSON.stringify(coordinates),
      );
    }
  }

  private validateCuisineType(cuisineType: string): void {
    if (!cuisineType.trim() || cuisineType.length > 255) {
      throw new InvalidRestaurantData('cuisineType', cuisineType);
    }
  }

  private validateAverageRating(averageRating: number): void {
    if (averageRating < 0 || averageRating > 5) {
      throw new InvalidRestaurantData(
        'averageRating',
        averageRating.toString(),
      );
    }
  }
}
