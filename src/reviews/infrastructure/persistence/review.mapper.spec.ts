import { describe, it, beforeEach, expect } from 'vitest';
import { ReviewMapper, SqliteReview } from './review.mapper';
import { Review } from 'src/reviews/domain/entities/review.entity';
import { DateTime } from 'luxon';
import { stubSqliteReview, stubReview } from 'src/test-utils';

describe('ReviewMapper', () => {
  describe('toDomain', () => {
    let sqliteReview: SqliteReview;

    beforeEach(() => {
      sqliteReview = stubSqliteReview();
    });

    it('should map a SQLite review to domain', () => {
      const result = ReviewMapper.toDomain(sqliteReview);

      expect(result).toBeInstanceOf(Review);
    });

    it('should map id correctly', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.id).toBe(sqliteReview.id);
    });

    it('should map restaurantId correctly', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.restaurantId).toBe(sqliteReview.restaurant_id);
    });

    it('should map userId correctly', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.userId).toBe(sqliteReview.user_id);
    });

    it('should map rating correctly', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.rating).toBe(sqliteReview.rating);
    });

    it('should map comment correctly', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.comment).toBe(sqliteReview.comments);
    });

    it('should map authorName correctly', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.authorName).toBe(sqliteReview.author_name);
    });

    it('should map date as DateTime', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.date).toBeInstanceOf(DateTime);
    });

    it('should map createdAt as DateTime', () => {
      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.createdAt).toBeInstanceOf(DateTime);
    });

    it('should map review without ID', () => {
      const sqliteReview = stubSqliteReview({ id: undefined });

      const result = ReviewMapper.toDomain(sqliteReview);

      expect(result.id).toBeUndefined();
    });

    it('should map review without authorName', () => {
      const sqliteReview = stubSqliteReview({ author_name: undefined });

      const result = ReviewMapper.toDomain(sqliteReview);

      expect(result.authorName).toBeUndefined();
    });

    it('should parse review date correctly', () => {
      const sqliteReview = stubSqliteReview({
        date: 'December 25, 2023',
      });

      const result = ReviewMapper.toDomain(sqliteReview);

      expect(result.date.toFormat('MMMM d, yyyy')).toBe('December 25, 2023');
    });

    it('should parse created at date correctly', () => {
      const sqliteReview = stubSqliteReview({
        created_at: '2023-12-25 15:30:00',
      });

      const result = ReviewMapper.toDomain(sqliteReview);
      expect(result.createdAt.toFormat('yyyy-MM-dd HH:mm:ss')).toBe(
        '2023-12-25 15:30:00',
      );
    });
  });

  describe('toInfrastructure', () => {
    let review: Review;

    beforeEach(() => {
      review = stubReview();
    });

    it('should map userId correctly', () => {
      const result = ReviewMapper.toInfrastructure(review);
      expect(result.user_id).toBe(review.userId);
    });

    it('should map restaurantId correctly', () => {
      const result = ReviewMapper.toInfrastructure(review);
      expect(result.restaurant_id).toBe(review.restaurantId);
    });

    it('should map rating correctly', () => {
      const result = ReviewMapper.toInfrastructure(review);
      expect(result.rating).toBe(review.rating);
    });

    it('should map comments correctly', () => {
      const result = ReviewMapper.toInfrastructure(review);
      expect(result.comments).toBe(review.comment);
    });

    it('should map date correctly', () => {
      const result = ReviewMapper.toInfrastructure(review);
      expect(result.date).toBe(review.date.toFormat('MMMM d, yyyy'));
    });

    it('should map createdAt correctly', () => {
      const result = ReviewMapper.toInfrastructure(review);
      expect(result.created_at).toBeDefined();
    });

    it('should map review with ID', () => {
      const review = stubReview({ id: 1 });

      const result = ReviewMapper.toInfrastructure(review);

      expect(result.id).toBe(1);
    });

    it('should format dates correctly', () => {
      const date = DateTime.fromISO('2024-01-15T10:30:00.000Z');
      const review = stubReview({ date });

      const result = ReviewMapper.toInfrastructure(review);

      expect(result.date).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
      expect(result.created_at).toMatch(
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      );
    });
  });

  describe('toInfrastructureUpdate', () => {
    let review: Review;

    beforeEach(() => {
      review = stubReview({ id: 1, rating: 4, comment: 'Updated comment' });
    });

    it('should map id correctly', () => {
      const result = ReviewMapper.toInfrastructureUpdate(review);
      expect(result.id).toBe(review.id);
    });

    it('should map rating correctly', () => {
      const result = ReviewMapper.toInfrastructureUpdate(review);
      expect(result.rating).toBe(review.rating);
    });

    it('should map comments correctly', () => {
      const result = ReviewMapper.toInfrastructureUpdate(review);
      expect(result.comments).toBe(review.comment);
    });

    it('should not include userId', () => {
      const result = ReviewMapper.toInfrastructureUpdate(review);
      expect(result.user_id).toBeUndefined();
    });

    it('should not include restaurantId', () => {
      const result = ReviewMapper.toInfrastructureUpdate(review);
      expect(result.restaurant_id).toBeUndefined();
    });

    it('should include only necessary fields for update', () => {
      const review = stubReview({ id: 5, rating: 3, comment: 'Average' });

      const result = ReviewMapper.toInfrastructureUpdate(review);

      expect(Object.keys(result)).toEqual(['id', 'rating', 'comments']);
    });
  });
});
