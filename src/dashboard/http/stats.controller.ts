import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/core/http/decorators/role.decorator';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { GetStatsUsecase } from '../application/usecases/get-stats.usecase';

@Controller('/admin/stats')
@ApiTags('Statistics')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Roles(Role.ADMIN)
export class StatsController {
  constructor(private readonly getStatsUsecase: GetStatsUsecase) {}

  @ApiOperation({ summary: 'Get statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @Get('/')
  async getStats() {
    return this.getStatsUsecase.execute();
  }
}
