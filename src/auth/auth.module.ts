import { Module } from '@nestjs/common';
import { AuthController } from './http/auth.controller';
import { ValidateUserUsecase } from 'src/auth/application/usecases/validate-user.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignJwtUsecase } from 'src/auth/application/usecases/sign-jwt.usecase';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { CreateUserUsecase } from 'src/auth/application/usecases/create-user.usecase';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRES_IN_SECONDS'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    ValidateUserUsecase,
    CreateUserUsecase,
    SignJwtUsecase,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
