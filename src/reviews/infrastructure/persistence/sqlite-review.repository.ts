import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX } from 'src/core/infrastructure/persistence/knex.tokens';
import { ReviewRepository } from 'src/reviews/application/ports/reviews.repository';
import { ReviewMapper, SqliteReview } from './review.mapper';
import { Review } from 'src/reviews/domain/entities/review.entity';

export class ReviewSqliteRepository implements ReviewRepository {
  constructor(
    @Inject(KNEX)
    private readonly knex: Knex,
  ) {}

  async findAllByRestaurantId(restaurantId: number): Promise<Review[]> {
    const reviews = await this.knex<SqliteReview>('reviews')
      .select('reviews.*', 'users.name as author_name')
      .where('restaurant_id', restaurantId)
      .innerJoin('users', 'reviews.user_id', 'users.id')
      .orderBy('created_at', 'desc');

    return reviews.map(ReviewMapper.toDomain);
  }

  async findAllByUserId(userId: number): Promise<Review[]> {
    const reviews = await this.knex<SqliteReview>('reviews')
      .select('reviews.*', 'users.name as author_name')
      .where('user_id', userId)
      .innerJoin('users', 'reviews.user_id', 'users.id')
      .orderBy('created_at', 'desc');

    return reviews.map(ReviewMapper.toDomain);
  }

  async findByUserAndId(
    userId: number,
    id: number,
  ): Promise<Review | undefined> {
    const review = await this.knex('reviews')
      .select<SqliteReview>('reviews.*', 'users.name as author_name')
      .innerJoin('users', 'reviews.user_id', 'users.id')
      .where('reviews.user_id', userId)
      .andWhere('reviews.id', id)
      .first();

    return review ? ReviewMapper.toDomain(review) : undefined;
  }

  async create(review: Review): Promise<number> {
    const [id] = await this.knex('reviews').insert(
      ReviewMapper.toInfrastructure(review),
    );

    return id;
  }

  async update(review: Review): Promise<void> {
    await this.knex('reviews')
      .where('id', review.id)
      .update(ReviewMapper.toInfrastructureUpdate(review));
  }

  async delete(id: number): Promise<void> {
    await this.knex('reviews').where('id', id).delete();
  }
}
