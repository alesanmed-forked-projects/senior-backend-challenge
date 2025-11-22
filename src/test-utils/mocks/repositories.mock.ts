import { vi } from 'vitest';

export const createUserRepositoryMock = () => ({
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
});

export const createReviewRepositoryMock = () => ({
  findAllByRestaurantId: vi.fn(),
  findAllByUserId: vi.fn(),
  findByUserAndId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createRestaurantRepositoryMock = () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createFavoriteRepositoryMock = () => ({
  findAllByUserId: vi.fn(),
  findByUserIdAndRestaurantId: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
});
