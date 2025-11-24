import { describe, it, beforeEach, expect, vi, beforeAll } from 'vitest';
import { ValidateUserUsecase } from './validate-user.usecase';
import { createUserRepositoryMock, stubUserData } from 'src/test-utils';
import { InvalidCredentialsException } from 'src/auth/domain/errors/invalid-credentials.error';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { faker } from '@faker-js/faker';

vi.mock('bcrypt', () => ({
  compare: vi.fn().mockResolvedValue(true),
}));

describe('ValidateUserUsecase', () => {
  let bcrypt: typeof import('bcrypt');
  let usecase: ValidateUserUsecase;
  let userRepository: ReturnType<typeof createUserRepositoryMock>;

  beforeAll(async () => {
    bcrypt = await import('bcrypt');
  });

  beforeEach(() => {
    userRepository = createUserRepositoryMock();
    usecase = new ValidateUserUsecase(userRepository);
    vi.clearAllMocks();
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
  });

  describe('execute', () => {
    it('should validate user with valid credentials', async () => {
      const user = stubUserData();

      vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

      const result = await usecase.execute(
        user.email.toString(),
        user.password,
      );

      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email.toString());
    });

    it('should throw error when user does not exist', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined);

      await expect(
        usecase.execute(faker.internet.email(), faker.string.alphanumeric(10)),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw error when password is incorrect', async () => {
      const user = stubUserData();

      vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

      // Mock bcrypt.compare to return false
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        usecase.execute(user.email.toString(), faker.string.alphanumeric(10)),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should return AuthUser with admin role when user is admin', async () => {
      const user = stubUserData({ role: UserRole.fromRole(Role.ADMIN) });

      vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

      const result = await usecase.execute(
        user.email.toString(),
        user.password,
      );

      expect(result.role.role).toBe(Role.ADMIN);
    });

    it('should handle repository errors', async () => {
      vi.mocked(userRepository.findByEmail).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        usecase.execute(faker.internet.email(), faker.string.alphanumeric(10)),
      ).rejects.toThrow('Database error');
    });

    it('should validate emails in different formats', async () => {
      const user = stubUserData({ email: 'Test.User@Example.COM' });

      vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

      await usecase.execute(user.email.toString(), user.password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
    });
  });
});
