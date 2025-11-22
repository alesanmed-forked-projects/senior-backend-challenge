import { describe, it, beforeEach, expect, vi } from 'vitest';
import { GetUserUsecase } from './get-user.usecase';
import { createUserRepositoryMock, stubUser } from 'src/test-utils';
import { UserNotFound } from 'src/users/domain/errors/user-not-found.error';
import { faker } from '@faker-js/faker';

describe('GetUserUsecase', () => {
  let usecase: GetUserUsecase;
  let userRepository: ReturnType<typeof createUserRepositoryMock>;

  beforeEach(() => {
    userRepository = createUserRepositoryMock();
    usecase = new GetUserUsecase(userRepository as any);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should return user when found', async () => {
      const user = stubUser();
      vi.mocked(userRepository.findById).mockResolvedValue(user);

      const result = await usecase.execute(user.id!);

      expect(result).toBe(user);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    });

    it('should throw UserNotFound when user does not exist', async () => {
      const userId = faker.number.int({ min: 1, max: 1000 });
      vi.mocked(userRepository.findById).mockResolvedValue(undefined);

      await expect(usecase.execute(userId)).rejects.toThrow(UserNotFound);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should handle repository errors', async () => {
      const userId = faker.number.int({ min: 1, max: 1000 });
      vi.mocked(userRepository.findById).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(userId)).rejects.toThrow('Database error');
    });
  });
});
