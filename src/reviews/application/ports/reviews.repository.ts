import { Review } from 'src/reviews/domain/entities/review.entity';

export interface ReviewRepository {
  findAllByRestaurantId(restaurantId: number): Promise<Review[]>;
  findAllByUserId(userId: number): Promise<Review[]>;
  findByUserAndId(userId: number, id: number): Promise<Review | undefined>;

  create(review: Review): Promise<number>;
  update(review: Review): Promise<void>;
  delete(id: number): Promise<void>;
}
