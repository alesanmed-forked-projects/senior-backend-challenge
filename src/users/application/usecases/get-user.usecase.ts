import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/users/infrastructure/persistence/user-repository.token';
import type { UserRepository } from 'src/users/application/ports/user.repository';
import { User } from 'src/users/domain/entities/user.entity';
import { UserNotFound } from 'src/users/domain/errors/user-not-found.error';

@Injectable()
export class GetUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFound(id);
    }

    return user;
  }
}
