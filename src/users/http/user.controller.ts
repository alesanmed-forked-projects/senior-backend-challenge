import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/core/http/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/domain/auth-user';
import { HttpUserMapper } from './mappers/http-user.mapper';
import { GetUserUsecase } from 'src/users/application/usecases/get-user.usecase';

@ApiTags('Users')
@Controller('/me')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUsecase) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('/')
  async getCurrentUser(@CurrentUser() user: AuthUser) {
    const userEntity = await this.getUserUseCase.execute(user.id);

    return HttpUserMapper.toDto(userEntity);
  }
}
