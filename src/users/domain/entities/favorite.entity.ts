import { DateTime } from 'luxon';
import { InvalidFavoriteData } from '../errors/invalid-favorite-data.error';

interface FavoriteData {
  userId: number;
  restaurantId: number;
  createdAt: DateTime;
}

export class Favorite {
  private constructor(private readonly data: FavoriteData) {
    this.validate(data);
  }

  static createNew(params: Omit<FavoriteData, 'createdAt'>): Favorite {
    return new Favorite({
      ...params,
      createdAt: DateTime.now(),
    });
  }

  static fromData(data: FavoriteData): Favorite {
    return new Favorite(data);
  }

  get userId(): number {
    return this.data.userId;
  }

  get restaurantId(): number {
    return this.data.restaurantId;
  }

  get createdAt(): DateTime {
    return this.data.createdAt;
  }

  private validate(data: FavoriteData): void {
    this.validateCreatedAt(data.createdAt);
  }

  private validateCreatedAt(createdAt: DateTime): void {
    if (!createdAt.isValid) {
      throw new InvalidFavoriteData('createdAt', createdAt.invalidReason!);
    }
  }
}
