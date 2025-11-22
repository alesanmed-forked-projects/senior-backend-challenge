import { describe, it, expect } from 'vitest';
import { User } from './user.entity';
import { InvalidUserData } from '../errors/invalid-user-data.error';
import { DateTime } from 'luxon';
import { Email } from '../value-objects/email.vo';
import { UserRole } from '../value-objects/user-role.vo';
import { Role } from '../value-objects/role.enum';

describe('UserEntity', () => {
  const validRole = UserRole.fromRole(Role.USER);

  describe('createNew', () => {
    it('should create a new user', () => {
      const user = User.createNew({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePassword1234',
        role: validRole,
      });

      expect(user).toBeInstanceOf(User);
    });

    it('should throw an error if the name is invalid', () => {
      expect(() =>
        User.createNew({
          name: '',
          email: 'test@example.com',
          password: 'SecurePassword1234',
          role: validRole,
        }),
      ).toThrow(InvalidUserData);
    });

    it('should throw an error if the email is invalid', () => {
      expect(() =>
        User.createNew({
          name: 'Test User',
          email: 'not-an-email',
          password: 'SecurePassword1234',
          role: validRole,
        }),
      ).toThrow(InvalidUserData);
    });
  });

  describe('fromData', () => {
    it('should create a user from data', () => {
      const user = User.fromData({
        id: 1,
        name: 'Test User',
        email: Email.fromString('test@example.com'),
        password: 'SecurePassword1234',
        role: validRole,
        createdAt: DateTime.now(),
      });

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(1);
      expect(user.name).toBe('Test User');
      expect(user.email.toString()).toBe('test@example.com');
    });

    it('should throw an error if the name is invalid', () => {
      expect(() =>
        User.fromData({
          id: 1,
          name: '',
          email: Email.fromString('test@example.com'),
          password: 'SecurePassword1234',
          role: validRole,
          createdAt: DateTime.now(),
        }),
      ).toThrow(InvalidUserData);
    });

    it('should throw an error if createdAt is invalid', () => {
      const invalidCreatedAt = DateTime.fromISO('invalid');

      expect(() =>
        User.fromData({
          id: 1,
          name: 'Test User',
          email: Email.fromString('test@example.com'),
          password: 'SecurePassword1234',
          role: validRole,
          createdAt: invalidCreatedAt,
        }),
      ).toThrow(InvalidUserData);
    });
  });
});
