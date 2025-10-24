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
import { PaginationDto, ResponseDto, PaginatedResponseDto, SearchUsersDto } from '../../common/dto/pagination.dto';
import { CurrentUser, CurrentUserInfo } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums';
import { AuthGuard } from '@nestjs/passport';
import { ConsultantService } from './consultant.service';

@ApiTags('Users')
@Controller('users')
// @UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly consultantService: ConsultantService) { }

    @Get()
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
    async findAll(@Query() params) {
        return await this.consultantService.findAll(params);
    }

    @Get('search')
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
    async search(
        @Query() dto: SearchUsersDto,
    ) {
        const { users, total } = await this.consultantService.searchUsers(dto.query, dto);
        const result = new PaginatedResponseDto(users, total, dto.page, dto.limit);
        return ResponseDto.success(result, 'Search results retrieved successfully');
    }
    @Get(':id')
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
    async findOne(@Param('id') id: number) {
        const user = await this.consultantService.findById(id);
        return ResponseDto.success(user, 'User retrieved successfully');
    }

    @Get(':id/team-structure')
    async getTeamStructure(
        @Param('id') id: number,
        @CurrentUser() user: CurrentUserInfo,
        @Query('depth') depth?: number,
    ) {
        // Users can only view their own team structure unless they're admin/manager
        if (id !== user.id && ![UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(user.role as UserRole)) {
            id = user.id;
        }

        const teamStructure = await this.consultantService.getTeamStructure(id, depth || 3);
        return ResponseDto.success(teamStructure, 'Team structure retrieved successfully');
    }

    @Get(':id/team-stats')
    async getTeamStats(
        @Param('id') id: number,
        @CurrentUser() user: CurrentUserInfo,
    ) {
        // Users can only view their own team stats unless they're admin/manager
        if (id !== user.id && ![UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(user.role as UserRole)) {
            id = user.id;
        }

        const stats = await this.consultantService.getTeamStats(id);
        return ResponseDto.success(stats, 'Team statistics retrieved successfully');
    }

    @Patch('profile')
    async updateProfile(
        @CurrentUser() user: CurrentUserInfo,
        @Body() updateUserDto: any,
    ) {
        delete updateUserDto.role;
        delete updateUserDto.level;
        delete updateUserDto.status;

        const updatedUser = await this.consultantService.update(user.id, updateUserDto);
        return ResponseDto.success(updatedUser, 'Profile updated successfully');
    }

    @Put(':id')
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    async update(@Param('id') id: number, @Body() updateUserDto: any) {
        return await this.consultantService.update(id, updateUserDto);

    }

    @Patch(':id/status')
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    async updateStatus(
        @Param('id') id: number,
        @Body() updateStatusDto: any,
    ) {
        const user = await this.consultantService.updateStatus(id, updateStatusDto.status);
        return ResponseDto.success(user, 'User status updated successfully');
    }

    @Patch(':id/level')
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    async updateLevel(
        @Param('id') id: number,
        @Body() updateLevelDto: any,
    ) {
        const user = await this.consultantService.updateLevel(id, updateLevelDto.level);
        return ResponseDto.success(user, 'User level updated successfully');
    }

    @Delete(':id')
    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    async remove(@Param('id') id: number) {
        await this.consultantService.remove(id);
        return ResponseDto.success(null, 'User removed successfully');
    }
}
