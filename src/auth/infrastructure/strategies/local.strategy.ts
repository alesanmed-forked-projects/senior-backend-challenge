import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ValidateUserUsecase } from 'src/auth/application/usecases/validate-user.usecase';
import { AuthUser } from 'src/auth/domain/auth-user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUserUsecase: ValidateUserUsecase) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  validate(email: string, password: string): Promise<AuthUser> {
    return this.validateUserUsecase.execute(email, password);
  }
}
