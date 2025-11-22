import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'src/auth/domain/auth-user';

@Injectable()
export class SignJwtUsecase {
  constructor(private readonly jwtService: JwtService) {}

  execute(user: AuthUser): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.role,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.sign(payload);
  }
}
