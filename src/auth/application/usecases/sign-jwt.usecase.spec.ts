import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { SignJwtUsecase } from './sign-jwt.usecase';
import { createJwtServiceMock, stubAuthUser } from 'src/test-utils';
import { AuthUser } from 'src/auth/domain/auth-user';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/infrastructure/strategies/jwt.strategy';

describe('SignJwtUsecase', () => {
  let usecase: SignJwtUsecase;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = createJwtServiceMock();
    usecase = new SignJwtUsecase(jwtService);
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

    it('should include sub in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload).toHaveProperty('sub');
    });

    it('should include user id in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload.sub).toBe(user.id);
    });

    it('should include email in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload).toHaveProperty('email');
    });

    it('should include user email in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload.email).toBe(user.email);
    });

    it('should include role in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload).toHaveProperty('role');
    });

    it('should include user role in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload.role).toBe(user.role.toString());
    });

    it('should include iat in payload', () => {
      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload).toHaveProperty('iat');
    });

    it('should include timestamp in payload', () => {
      usecase.execute(user);

      const now = Math.floor(Date.now() / 1000);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload.iat).toBeGreaterThanOrEqual(now);
      expect(payload.iat).toBeLessThanOrEqual(now + 1);
    });

    it('should generate JWT with admin role', () => {
      user = stubAuthUser({ role: UserRole.fromRole(Role.ADMIN) });

      token = 'mock-admin-token';
      vi.mocked(jwtService.sign).mockReturnValue(token);

      usecase.execute(user);

      const payload = vi.mocked(jwtService.sign<JwtPayload>).mock.calls[0][0];
      expect(payload.role).toBe(user.role.toString());
    });
  });
});
