import { User } from 'src/users/domain/entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<User | undefined>;

  findByEmail(email: string): Promise<User | undefined>;

  create(user: User): Promise<void>;
}
