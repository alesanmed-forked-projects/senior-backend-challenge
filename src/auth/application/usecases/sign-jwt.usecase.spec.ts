import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { SignJwtUsecase } from './sign-jwt.usecase';
import { createJwtServiceMock, stubAuthUser } from 'src/test-utils';
import { AuthUser } from 'src/auth/domain/auth-user';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';

describe('SignJwtUsecase', () => {
  let usecase: SignJwtUsecase;
  let jwtService: ReturnType<typeof createJwtServiceMock>;

  beforeEach(() => {
    jwtService = createJwtServiceMock();
    usecase = new SignJwtUsecase(jwtService as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('execute', () => {
    let user: AuthUser;
    let token: string;

    beforeEach(() => {
      user = stubAuthUser();
      token = 'dummy-token';
      vi.mocked(jwtService.sign).mockReturnValue(token);
    });

    it('should generate a valid JWT for a user', () => {
      const result = usecase.execute(user);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(result).toBe(token);
    });

    it('should generate JWT with admin role', () => {
      user = stubAuthUser({ role: UserRole.fromRole(Role.ADMIN) });

      token = 'mock-admin-token';
      vi.mocked(jwtService.sign).mockReturnValue(token);

      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign).mock.calls[0][0];
      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.role).toBe(user.role.toString());
    });

    it('should include timestamp in payload', () => {
      const beforeTime = Math.floor(Date.now() / 1000);

      usecase.execute(user);

      const afterTime = Math.floor(Date.now() / 1000);

      const payload = vi.mocked(jwtService.sign).mock.calls[0][0];
      expect(payload.iat).toBeGreaterThanOrEqual(beforeTime);
      expect(payload.iat).toBeLessThanOrEqual(afterTime);
    });

    it('should use user ID as subject', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign).mock.calls[0][0];
      expect(payload.sub).toBe(user.id);
    });

    it('should include all required fields in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign).mock.calls[0][0];
      expect('sub' in payload).toBe(true);
      expect('email' in payload).toBe(true);
      expect('role' in payload).toBe(true);
      expect('iat' in payload).toBe(true);
    });
  });
});
