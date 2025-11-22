import { User } from 'src/users/domain/entities/user.entity';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { AuthUser } from 'src/auth/domain/auth-user';
import { faker } from '@faker-js/faker';
import { SqliteUser } from 'src/users/infrastructure/persistence/user.mapper';
import { DateTime } from 'luxon';
import { Email } from 'src/users/domain/value-objects/email.vo';

export const stubUserData = (overrides?: Partial<unknown>) => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.person.fullName(),
  email: Email.fromString(faker.internet.email()),
  password: `${faker.internet.password({ length: 16 })}1aZ!`,
  role: UserRole.fromRole(Role.USER),
  createdAt: DateTime.fromJSDate(faker.date.past()),
  ...overrides,
});

export const stubUser = (overrides?: Partial<unknown>): User => {
  return User.fromData(stubUserData(overrides));
};

export const stubAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  email: faker.internet.email(),
  role: UserRole.fromRole(Role.USER),
  ...overrides,
});

export const stubSqliteUser = (
  overrides?: Partial<SqliteUser>,
): SqliteUser => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: `${faker.internet.password({ length: 16 })}1aZ!`,
  role: UserRole.fromRole(Role.USER).toString(),
  created_at: DateTime.fromJSDate(faker.date.past()).toISO()!,
  ...overrides,
});
