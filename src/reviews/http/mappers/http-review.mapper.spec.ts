import { describe, it, beforeEach, expect } from 'vitest';
import { HttpReviewMapper } from './http-review.mapper';
import { Review } from 'src/reviews/domain/entities/review.entity';
import { DateTime } from 'luxon';
import { stubReview } from 'src/test-utils';

describe('HttpReviewMapper', () => {
  describe('toDto', () => {
    let review: Review;

    beforeEach(() => {
      review = stubReview();
    });

    it('should map id correctly', () => {
      const result = HttpReviewMapper.toDto(review);

      expect(result.id).toBe(review.id);
    });

    it('should map restaurantId correctly', () => {
      const result = HttpReviewMapper.toDto(review);

      expect(result.restaurantId).toBe(review.restaurantId);
    });

    it('should map comment correctly', () => {
      const result = HttpReviewMapper.toDto(review);

      expect(result.comment).toBe(review.comment);
    });

    it('should map author id correctly', () => {
      const result = HttpReviewMapper.toDto(review);

      expect(result.autor.id).toBe(review.userId);
    });

    it('should map author name correctly', () => {
      const result = HttpReviewMapper.toDto(review);

      expect(result.autor.name).toBe(review.authorName);
    });

    it('should map rating correctly', () => {
      const result = HttpReviewMapper.toDto(review);

      expect(result.rating).toBe(review.rating);
    });

    it('should format date in readable format', () => {
      const review = stubReview({
        date: DateTime.fromFormat('December 25, 2023', 'MMMM d, yyyy'),
      });

      const result = HttpReviewMapper.toDto(review);

      expect(result.date).toBe('December 25, 2023');
    });

    it('should format createdAt as ISO string', () => {
      const createdAt = DateTime.fromISO('2024-01-20T15:45:30.000Z');
      const review = stubReview({ createdAt });

      const result = HttpReviewMapper.toDto(review);

      expect(result.createdAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[Z+-]/,
      );
    });

    it('should include all required fields', () => {
      const result = HttpReviewMapper.toDto(review);

      expect('id' in result).toBe(true);
      expect('restaurantId' in result).toBe(true);
      expect('comment' in result).toBe(true);
      expect('autor' in result).toBe(true);
      expect('id' in result.autor).toBe(true);
      expect('name' in result.autor).toBe(true);
      expect('rating' in result).toBe(true);
      expect('date' in result).toBe(true);
      expect('createdAt' in result).toBe(true);
    });

    it('should handle different ratings correctly', () => {
      const ratings = [1, 2, 3, 4, 5];

      ratings.forEach((rating) => {
        const review = stubReview({ rating });

        const result = HttpReviewMapper.toDto(review);
        expect(result.rating).toBe(rating);
      });
    });
  });
});
