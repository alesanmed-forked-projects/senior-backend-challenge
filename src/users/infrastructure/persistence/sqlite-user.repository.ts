import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX } from 'src/core/infrastructure/persistence/knex.tokens';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { User } from 'src/users/domain/entities/user.entity';
import { SqliteUser, UserMapper } from './user.mapper';

export class UserSqliteRepository implements UserRepository {
  constructor(
    @Inject(KNEX)
    private readonly knex: Knex,
  ) {}

  async findById(id: number): Promise<User | undefined> {
    const user = await this.knex<SqliteUser>('users').where('id', id).first();

    return user ? UserMapper.toDomain(user) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.knex<SqliteUser>('users')
      .where('email', email)
      .first();

    return user ? UserMapper.toDomain(user) : undefined;
  }

  async create(user: User): Promise<void> {
    const [id] = await this.knex<SqliteUser>('users').insert(
      UserMapper.toInfrastructure(user),
    );

    user.withId(id);
  }
}
