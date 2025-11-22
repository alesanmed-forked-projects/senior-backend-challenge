import { describe, it, beforeEach, expect, vi } from 'vitest';
import { AuthController } from './auth.controller';
import { stubAuthUser } from 'src/test-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { SignJwtUsecase } from 'src/auth/application/usecases/sign-jwt.usecase';
import { CreateUserUsecase } from 'src/auth/application/usecases/create-user.usecase';
import { UserAlreadyExists } from 'src/auth/domain/errors/user-exists.error';

describe('AuthController', () => {
  let controller: AuthController;
  let signJwtUsecase: SignJwtUsecase;
  let createUserUsecase: CreateUserUsecase;

  beforeEach(() => {
    signJwtUsecase = {
      execute: vi.fn(),
    } as any;

    createUserUsecase = {
      execute: vi.fn(),
    } as any;

    controller = new AuthController(signJwtUsecase, createUserUsecase);
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token', () => {
      const user = stubAuthUser();
      const mockToken = 'mock-jwt-token';

      vi.mocked(signJwtUsecase.execute).mockReturnValue(mockToken);

      const result = controller.login(user);

      expect(result).toEqual({ access_token: mockToken });
      expect(signJwtUsecase.execute).toHaveBeenCalledWith(user);
    });
  });

  describe('register', () => {
    it('should register user and return 201 status', async () => {
      const createUserDto: CreateUserDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(10),
      };

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      vi.mocked(createUserUsecase.execute).mockResolvedValue();

      await controller.register(createUserDto, mockResponse);

      expect(createUserUsecase.execute).toHaveBeenCalledWith(createUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw error when user already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(10),
      };

      vi.mocked(createUserUsecase.execute).mockRejectedValue(
        new UserAlreadyExists(createUserDto.email),
      );

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      await expect(
        controller.register(createUserDto, mockResponse),
      ).rejects.toThrow(UserAlreadyExists);
    });
  });
});
