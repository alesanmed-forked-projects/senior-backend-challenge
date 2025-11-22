import { DateTime } from 'luxon';
import { User } from 'src/users/domain/entities/user.entity';
import { Email } from 'src/users/domain/value-objects/email.vo';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';

export type SqliteUser = {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
};

export class UserMapper {
  static toDomain(sqliteUser: SqliteUser): User {
    return User.fromData({
      id: sqliteUser.id,
      name: sqliteUser.name,
      email: Email.fromString(sqliteUser.email),
      password: sqliteUser.password,
      role: UserRole.fromString(sqliteUser.role),
      createdAt: DateTime.fromISO(sqliteUser.created_at),
    });
  }

  static toInfrastructure(user: User): SqliteUser {
    return {
      name: user.name,
      email: user.email.toString(),
      password: user.password,
      role: user.role.toString(),
      created_at: user.createdAt.toISO()!,
    };
  }
}
