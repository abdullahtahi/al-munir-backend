import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BonusesService } from './bonuses.service';
import { PaginationDto, ResponseDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CurrentUser, CurrentUserInfo } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums';

@ApiTags('Bonuses')
@ApiBearerAuth()
@Controller('bonuses')
@UseGuards(RolesGuard)
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) { }

  @Get('my-bonuses')
  @ApiOperation({ summary: 'Get current user bonuses' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User bonuses retrieved successfully' })
  async getMyBonuses(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserInfo,
  ) {
    const { bonuses, total } = await this.bonusesService.getUserBonuses(String(user.id), paginationDto);
    const result = new PaginatedResponseDto(bonuses, total, paginationDto.page, paginationDto.limit);
    return ResponseDto.success(result, 'Your bonuses retrieved successfully');
  }

  @Get('my-stats')
  @ApiOperation({ summary: 'Get current user bonus statistics' })
  @ApiResponse({ status: 200, description: 'User bonus statistics retrieved successfully' })
  async getMyStats(@CurrentUser() user: CurrentUserInfo) {
    const stats = await this.bonusesService.getUserBonusStats(String(user.id));
    return ResponseDto.success(stats, 'Your bonus statistics retrieved successfully');
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user bonuses by user ID (Admin/Manager only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User bonuses retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getUserBonuses(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const { bonuses, total } = await this.bonusesService.getUserBonuses(userId, paginationDto);
    const result = new PaginatedResponseDto(bonuses, total, paginationDto.page, paginationDto.limit);
    return ResponseDto.success(result, 'User bonuses retrieved successfully');
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: 'Get user bonus statistics by user ID (Admin/Manager only)' })
  @ApiResponse({ status: 200, description: 'User bonus statistics retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getUserStats(@Param('userId') userId: string) {
    const stats = await this.bonusesService.getUserBonusStats(userId);
    return ResponseDto.success(stats, 'User bonus statistics retrieved successfully');
  }

  @Get('system-stats')
  @ApiOperation({ summary: 'Get system-wide bonus statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'System bonus statistics retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async getSystemStats() {
    const stats = await this.bonusesService.getSystemBonusStats();
    return ResponseDto.success(stats, 'System bonus statistics retrieved successfully');
  }

  @Get('monthly-stats/:year')
  @ApiOperation({ summary: 'Get monthly bonus statistics for a year' })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Monthly bonus statistics retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getMonthlyStats(
    @Param('year') year: number,
    @Query('user_id') userId?: string,
  ) {
    const stats = await this.bonusesService.getMonthlyBonusStats(year, userId);
    return ResponseDto.success(stats, 'Monthly bonus statistics retrieved successfully');
  }

  @Get('top-earners')
  @ApiOperation({ summary: 'Get top bonus earners' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'period', required: false, enum: ['month', 'year', 'all'], description: 'Time period for stats' })
  @ApiResponse({ status: 200, description: 'Top earners retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getTopEarners(
    @Query('limit') limit?: number,
    @Query('period') period: 'month' | 'year' | 'all' = 'month',
  ) {
    const earners = await this.bonusesService.getTopBonusEarners(limit || 10, period);
    return ResponseDto.success(earners, 'Top earners retrieved successfully');
  }

  @Get('team-performance/:userId')
  @ApiOperation({ summary: 'Get team bonus performance' })
  @ApiResponse({ status: 200, description: 'Team performance retrieved successfully' })
  async getTeamPerformance(
    @Param('userId') userId: string,
    @CurrentUser() user: CurrentUserInfo,
  ) {
    // Users can only view their own team performance unless they're admin/manager
    if (String(userId) !== String(user.id) && ![UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(user.role as UserRole)) {
      userId = String(user.id);
    }

    const performance = await this.bonusesService.getTeamBonusPerformance(userId);
    return ResponseDto.success(performance, 'Team performance retrieved successfully');
  }
}
