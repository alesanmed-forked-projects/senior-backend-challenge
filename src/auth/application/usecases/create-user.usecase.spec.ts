import { describe, it, beforeEach, expect, vi, beforeAll } from 'vitest';
import { CreateUserUsecase } from './create-user.usecase';
import { CreateUserCommand } from './commands/create-user.command';
import { faker } from '@faker-js/faker';
import { createUserRepositoryMock } from 'src/test-utils';
import { User } from 'src/users/domain/entities/user.entity';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { UserAlreadyExists } from 'src/auth/domain/errors/user-exists.error';
import { Email } from 'src/users/domain/value-objects/email.vo';
import { DateTime } from 'luxon';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
}));

describe('CreateUserUsecase', () => {
  let usecase: CreateUserUsecase;
  let userRepository: ReturnType<typeof createUserRepositoryMock>;
  let bcrypt: typeof import('bcrypt');

  beforeAll(async () => {
    bcrypt = await import('bcrypt');
  });

  beforeEach(() => {
    userRepository = createUserRepositoryMock();
    usecase = new CreateUserUsecase(userRepository as any);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new user correctly', async () => {
      const command: CreateUserCommand = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(20),
      };

      vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined);
      vi.mocked(userRepository.create).mockResolvedValue();

      await usecase.execute(command);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(command.email);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when email already exists', async () => {
      const command: CreateUserCommand = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(20),
      };

      const existingUser = User.fromData({
        id: 1,
        name: command.name,
        email: Email.fromString(command.email),
        password: command.password,
        role: UserRole.fromRole(Role.USER),
        createdAt: DateTime.now(),
      });

      vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser);

      await expect(usecase.execute(command)).rejects.toThrow(UserAlreadyExists);
    });

    it('should hash password correctly', async () => {
      const command: CreateUserCommand = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(20),
      };

      vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined);
      vi.mocked(userRepository.create).mockResolvedValue();

      await usecase.execute(command);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(command.password, 10);
    });

    it('should assign USER role by default', async () => {
      const command: CreateUserCommand = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(20),
      };

      vi.mocked(userRepository.findByEmail).mockResolvedValue(undefined);
      vi.mocked(userRepository.create).mockResolvedValue();

      await usecase.execute(command);

      const createdUser = vi.mocked(userRepository.create).mock.calls[0][0];
      expect(createdUser.role.role).toBe(Role.USER);
    });

    it('should handle repository errors', async () => {
      const command: CreateUserCommand = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(20),
      };

      vi.mocked(userRepository.findByEmail).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(command)).rejects.toThrow('Database error');
    });
  });
});
