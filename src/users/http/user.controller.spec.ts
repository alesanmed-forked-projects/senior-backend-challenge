import { describe, it, beforeEach, expect, vi } from 'vitest';
import { UserController } from './user.controller';
import { GetUserUsecase } from 'src/users/application/usecases/get-user.usecase';
import { stubAuthUser, stubUser } from 'src/test-utils';
import { HttpUserMapper } from './mappers/http-user.mapper';

describe('UserController', () => {
  let controller: UserController;
  let getUserUsecase: GetUserUsecase;

  beforeEach(() => {
    getUserUsecase = {
      execute: vi.fn(),
    } as unknown as GetUserUsecase;

    controller = new UserController(getUserUsecase);
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return current user DTO', async () => {
      const authUser = stubAuthUser();
      const user = stubUser({ id: authUser.id });
      const expectedDto = HttpUserMapper.toDto(user);

      vi.mocked(getUserUsecase.execute).mockResolvedValue(user);

      const result = await controller.getCurrentUser(authUser);

      expect(result).toEqual(expectedDto);
      expect(getUserUsecase.execute).toHaveBeenCalledWith(authUser.id);
    });
  });
});
