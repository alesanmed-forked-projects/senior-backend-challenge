import { User } from 'src/users/domain/entities/user.entity';
import type { HttpUser } from 'src/users/http/dto/http-user.dto';

export class HttpUserMapper {
  static toDto(user: User): HttpUser {
    return {
      id: user.id!,
      name: user.name,
      email: user.email.toString(),
      role: user.role.toString(),
    };
  }
}
