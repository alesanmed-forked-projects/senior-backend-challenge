import { describe, it, beforeEach, expect } from 'vitest';
import { HttpUserMapper } from './http-user.mapper';
import { User } from 'src/users/domain/entities/user.entity';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { stubUser } from 'src/test-utils';

describe('HttpUserMapper', () => {
  describe('toDto', () => {
    let user: User;

    beforeEach(() => {
      user = stubUser();
    });

    it('should map id correctly', () => {
      const result = HttpUserMapper.toDto(user);

      expect(result.id).toBe(user.id);
    });

    it('should map name correctly', () => {
      const result = HttpUserMapper.toDto(user);

      expect(result.name).toBe(user.name);
    });

    it('should map email correctly', () => {
      const result = HttpUserMapper.toDto(user);

      expect(result.email).toBe(user.email.toString());
    });

    it('should map role correctly', () => {
      const result = HttpUserMapper.toDto(user);

      expect(result.role).toBe(user.role.toString());
    });

    it('should map an admin user correctly', () => {
      const user = stubUser({ role: UserRole.fromRole(Role.ADMIN) });

      const result = HttpUserMapper.toDto(user);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email.toString(),
        role: user.role.toString(),
      });
    });

    it('should not include password in DTO', () => {
      const result = HttpUserMapper.toDto(user);

      expect('password' in result).toBe(false);
    });

    it('should not include created date in DTO', () => {
      const result = HttpUserMapper.toDto(user);

      expect('createdAt' in result).toBe(false);
    });
  });
});
