import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/core/http/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import type { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignJwtUsecase } from 'src/auth/application/usecases/sign-jwt.usecase';
import { CreateUserUsecase } from 'src/auth/application/usecases/create-user.usecase';
import { LocalAuthGuard } from 'src/auth/infrastructure/guards/local-auth.guard';
import type { AuthUser } from 'src/auth/domain/auth-user';
import { PublicEndpoint } from 'src/core/http/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly signJwtUsecase: SignJwtUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @PublicEndpoint()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@CurrentUser() user: AuthUser) {
    const jwt = this.signJwtUsecase.execute(user);

    return {
      access_token: jwt,
    };
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @PublicEndpoint()
  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    await this.createUserUsecase.execute(createUserDto);

    return response.status(HttpStatus.CREATED).send();
  }
}
