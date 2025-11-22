import { beforeEach, describe, it, expect } from 'vitest';
import { UserMapper, SqliteUser } from './user.mapper';
import { User } from 'src/users/domain/entities/user.entity';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { stubSqliteUser, stubUser } from 'src/test-utils';
import { DateTime } from 'luxon';

describe('UserMapper', () => {
  describe('toDomain', () => {
    let sqliteUser: SqliteUser;

    beforeEach(() => {
      sqliteUser = stubSqliteUser();
    });

    it('should map a SQLite user to domain', () => {
      const result = UserMapper.toDomain(sqliteUser);

      expect(result).toBeInstanceOf(User);
    });

    it('should map id correctly', () => {
      const result = UserMapper.toDomain(sqliteUser);
      expect(result.id).toBe(sqliteUser.id);
    });

    it('should map name correctly', () => {
      const result = UserMapper.toDomain(sqliteUser);
      expect(result.name).toBe(sqliteUser.name);
    });

    it('should map email correctly', () => {
      const result = UserMapper.toDomain(sqliteUser);
      expect(result.email.toString()).toBe(sqliteUser.email);
    });

    it('should map password correctly', () => {
      const result = UserMapper.toDomain(sqliteUser);
      expect(result.password).toBe(sqliteUser.password);
    });

    it('should map role correctly', () => {
      const result = UserMapper.toDomain(sqliteUser);
      expect(result.role.toString()).toBe(sqliteUser.role);
    });

    it('should map createdAt correctly', () => {
      const result = UserMapper.toDomain(sqliteUser);
      expect(result.createdAt).toBeInstanceOf(DateTime);
      expect(result.createdAt.isValid).toBe(true);
    });

    it('should map an admin user correctly', () => {
      sqliteUser.role = UserRole.fromRole(Role.ADMIN).toString();

      const result = UserMapper.toDomain(sqliteUser);

      expect(result.role.toString()).toBe('ADMIN');
    });

    it('should map user without ID', () => {
      delete sqliteUser.id;

      const result = UserMapper.toDomain(sqliteUser);

      expect(result.id).toBeUndefined();
    });
  });

  describe('toInfrastructure', () => {
    let user: User;

    beforeEach(() => {
      user = stubUser();
    });

    it('should map name correctly', () => {
      const result = UserMapper.toInfrastructure(user);
      expect(result.name).toBe(user.name);
    });

    it('should map email correctly', () => {
      const result = UserMapper.toInfrastructure(user);
      expect(result.email).toBe(user.email.toString());
    });

    it('should map password correctly', () => {
      const result = UserMapper.toInfrastructure(user);
      expect(result.password).toBe(user.password);
    });

    it('should map role correctly', () => {
      const result = UserMapper.toInfrastructure(user);
      expect(result.role).toBe(user.role.toString());
    });

    it('should map createdAt correctly', () => {
      const result = UserMapper.toInfrastructure(user);
      expect(result.created_at).toBe(user.createdAt.toISO()!);
    });

    it('should map an admin user correctly', () => {
      const user = stubUser({ role: UserRole.fromRole(Role.ADMIN) });

      const result = UserMapper.toInfrastructure(user);
      expect(result.role).toBe(user.role.toString());
    });

    it('should not include id in the infrastructure user', () => {
      const result = UserMapper.toInfrastructure(user);
      expect(result.id).toBeUndefined();
    });
  });
});
