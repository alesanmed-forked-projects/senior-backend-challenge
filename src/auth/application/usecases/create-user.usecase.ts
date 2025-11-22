import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/users/infrastructure/persistence/user-repository.token';
import { CreateUserCommand } from './commands/create-user.command';
import { User } from 'src/users/domain/entities/user.entity';
import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { hash } from 'bcrypt';
import { UserAlreadyExists } from 'src/auth/domain/errors/user-exists.error';
import type { UserRepository } from 'src/users/application/ports/user.repository';

@Injectable()
export class CreateUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new UserAlreadyExists(command.email);
    }

    const passwordHash = await hash(command.password, 10);

    const user = User.createNew({
      name: command.name,
      email: command.email,
      password: passwordHash,
      role: UserRole.fromRole(Role.USER),
    });

    await this.userRepository.create(user);
  }
}
