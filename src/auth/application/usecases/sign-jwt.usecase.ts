import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'src/auth/domain/auth-user';
import { JwtPayload } from 'src/auth/infrastructure/strategies/jwt.strategy';

@Injectable()
export class SignJwtUsecase {
  constructor(private readonly jwtService: JwtService) {}

  execute(user: AuthUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.role,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.sign(payload);
  }
}
