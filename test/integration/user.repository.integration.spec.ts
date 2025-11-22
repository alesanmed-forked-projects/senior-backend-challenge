import { describe, it, expect, beforeEach } from 'vitest';
import { UserSqliteRepository } from 'src/users/infrastructure/persistence/sqlite-user.repository';
import { User } from 'src/users/domain/entities/user.entity';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { useTestDatabase } from 'test/helpers/test-database.helper';
import { faker } from '@faker-js/faker';
import { stubUser } from 'src/test-utils';
import { Knex } from 'knex';

describe('UserSqliteRepository - Integration', () => {
  const { getDb } = useTestDatabase();
  let db: Knex;
  let repository: UserSqliteRepository;

  beforeEach(() => {
    db = getDb();
    repository = new UserSqliteRepository(db);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const [userId] = await db('users').insert({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(10),
        role: 'USER',
        created_at: new Date().toISOString(),
      });

      const user = await repository.findById(userId);

      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user?.id).toBe(userId);
    });

    it('should return undefined when user does not exist', async () => {
      const user = await repository.findById(999);

      expect(user).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const email = faker.internet.email();
      await db('users').insert({
        name: faker.person.fullName(),
        email,
        password: faker.string.alphanumeric(10),
        role: 'USER',
        created_at: new Date().toISOString(),
      });

      const user = await repository.findByEmail(email);

      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user?.email.toString()).toBe(email);
    });

    it('should return undefined when email does not exist', async () => {
      const user = await repository.findByEmail('nonexistent@example.com');

      expect(user).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new user and assign ID', async () => {
      const user = stubUser({ id: undefined });

      expect(user.id).toBeUndefined();

      await repository.create(user);

      expect(user.id).toBeDefined();
      expect(user.id).toBeGreaterThan(0);

      // Verify user was inserted
      const savedUser = await db('users').where('id', user.id).first();
      expect(savedUser).toBeDefined();
      expect(savedUser.name).toBe(user.name);
      expect(savedUser.email).toBe(user.email.toString());
    });

    it('should create user with ADMIN role', async () => {
      const user = stubUser({
        role: UserRole.fromRole(Role.ADMIN),
      });

      await repository.create(user);

      const savedUser = await db('users').where('id', user.id).first();
      expect(savedUser.role).toBe('ADMIN');
    });

    it('should handle multiple users with different emails', async () => {
      const user1 = stubUser({ id: undefined });

      const user2 = stubUser({ id: undefined });

      await repository.create(user1);
      await repository.create(user2);

      expect(user1.id).not.toBe(user2.id);

      const count = await db('users').count('* as count').first();
      expect(count?.count).toBe(2);
    });
  });

  describe('integration scenarios', () => {
    it('should create and retrieve user by id', async () => {
      const user = stubUser();

      await repository.create(user);

      const retrievedUser = await repository.findById(user.id!);

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.name).toBe(user.name);
      expect(retrievedUser?.email).toEqual(user.email);
      expect(retrievedUser?.role.role).toBe(Role.USER);
    });

    it('should create and retrieve user by email', async () => {
      const email = faker.internet.email();
      const user = stubUser({
        email,
      });

      await repository.create(user);

      const retrievedUser = await repository.findByEmail(email);

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.id).toBe(user.id);
      expect(retrievedUser?.email).toEqual(user.email);
    });
  });
});
