import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdmissionsService } from './admissions.service';
import { PaginationDto, ResponseDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CurrentUser, CurrentUserInfo } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums';
import { AuthGuard } from '@nestjs/passport';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';

@Controller('admissions')
@UseGuards(AuthGuard('jwt'))
// @UseGuards(RolesGuard)
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) { }

  @Post('create')
  async create(
    @Body() createAdmissionDto: any, @GetLoggedInUser() user
  ) {
    return await this.admissionsService.create(createAdmissionDto, user);
  }

  @Get()
  async findAll(
    @Query() params: any,
  ) {
    return await this.admissionsService.findAll(params);
  }

  @Get('my-admissions')
  @ApiOperation({ summary: 'Get current user admissions' })
  @ApiResponse({ status: 200, description: 'User admissions retrieved successfully' })
  async getMyAdmissions(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserInfo,
  ) {
    const { admissions, total } = await this.admissionsService.findByUserId(String(user.id), paginationDto);
    const result = new PaginatedResponseDto(admissions, total, paginationDto.page, paginationDto.limit);
    return ResponseDto.success(result, 'Your admissions retrieved successfully');
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get admission statistics' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getStats(@Query('userId') userId?: string) {
    const stats = await this.admissionsService.getStats(userId);
    return ResponseDto.success(stats, 'Statistics retrieved successfully');
  }

  @Get('my-stats')
  @ApiOperation({ summary: 'Get current user admission statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  async getMyStats(@CurrentUser() user: CurrentUserInfo) {
    const stats = await this.admissionsService.getStats(String(user.id));
    return ResponseDto.success(stats, 'Your statistics retrieved successfully');
  }

  @Get('monthly-stats/:year')
  @ApiOperation({ summary: 'Get monthly admission statistics for a year' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Monthly statistics retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getMonthlyStats(
    @Param('year') year: number,
    @Query('userId') userId?: string,
  ) {
    const stats = await this.admissionsService.getMonthlyStats(year, userId);
    return ResponseDto.success(stats, 'Monthly statistics retrieved successfully');
  }

  @Get('top-courses')
  @ApiOperation({ summary: 'Get top performing courses' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Top courses retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getTopCourses(@Query('limit') limit?: number) {
    const courses = await this.admissionsService.getTopCourses(limit || 10);
    return ResponseDto.success(courses, 'Top courses retrieved successfully');
  }

  @Get('top-performers')
  @ApiOperation({ summary: 'Get top performing users' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Top performers retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getTopPerformers(@Query('limit') limit?: number) {
    const performers = await this.admissionsService.getTopPerformers(limit || 10);
    return ResponseDto.success(performers, 'Top performers retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admission by ID' })
  @ApiResponse({ status: 200, description: 'Admission retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Admission not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserInfo) {
    const admission = await this.admissionsService.findById(id);

    // Users can only view their own admissions unless they're admin/manager
    if (String(admission.consultantId) !== String(user.id) && ![UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(user.role as UserRole)) {
      return ResponseDto.error('Access denied');
    }

    return ResponseDto.success(admission, 'Admission retrieved successfully');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdmissionDto: any,
    @CurrentUser() user: CurrentUserInfo,
  ) {
    return await this.admissionsService.update(id, updateAdmissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admission' })
  @ApiResponse({ status: 200, description: 'Admission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admission not found' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.admissionsService.remove(id);
    return ResponseDto.success(null, 'Admission deleted successfully');
  }
}
