import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthUser } from 'src/auth/domain/auth-user';
import { InvalidCredentialsException } from 'src/auth/domain/errors/invalid-credentials.error';
import type { UserRepository } from 'src/users/application/ports/user.repository';
import { USER_REPOSITORY } from 'src/users/infrastructure/persistence/user-repository.token';

@Injectable()
export class ValidateUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<AuthUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return {
      id: user.id!,
      email: user.email.toString(),
      role: user.role,
    };
  }
}
