"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BonusesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bonuses_service_1 = require("./bonuses.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const enums_1 = require("../../common/enums");
let BonusesController = class BonusesController {
    constructor(bonusesService) {
        this.bonusesService = bonusesService;
    }
    async getMyBonuses(paginationDto, user) {
        const { bonuses, total } = await this.bonusesService.getUserBonuses(String(user.id), paginationDto);
        const result = new pagination_dto_1.PaginatedResponseDto(bonuses, total, paginationDto.page, paginationDto.limit);
        return pagination_dto_1.ResponseDto.success(result, 'Your bonuses retrieved successfully');
    }
    async getMyStats(user) {
        const stats = await this.bonusesService.getUserBonusStats(String(user.id));
        return pagination_dto_1.ResponseDto.success(stats, 'Your bonus statistics retrieved successfully');
    }
    async getUserBonuses(userId, paginationDto) {
        const { bonuses, total } = await this.bonusesService.getUserBonuses(userId, paginationDto);
        const result = new pagination_dto_1.PaginatedResponseDto(bonuses, total, paginationDto.page, paginationDto.limit);
        return pagination_dto_1.ResponseDto.success(result, 'User bonuses retrieved successfully');
    }
    async getUserStats(userId) {
        const stats = await this.bonusesService.getUserBonusStats(userId);
        return pagination_dto_1.ResponseDto.success(stats, 'User bonus statistics retrieved successfully');
    }
    async getSystemStats() {
        const stats = await this.bonusesService.getSystemBonusStats();
        return pagination_dto_1.ResponseDto.success(stats, 'System bonus statistics retrieved successfully');
    }
    async getMonthlyStats(year, userId) {
        const stats = await this.bonusesService.getMonthlyBonusStats(year, userId);
        return pagination_dto_1.ResponseDto.success(stats, 'Monthly bonus statistics retrieved successfully');
    }
    async getTopEarners(limit, period = 'month') {
        const earners = await this.bonusesService.getTopBonusEarners(limit || 10, period);
        return pagination_dto_1.ResponseDto.success(earners, 'Top earners retrieved successfully');
    }
    async getTeamPerformance(userId, user) {
        if (String(userId) !== String(user.id) && ![enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER].includes(user.role)) {
            userId = String(user.id);
        }
        const performance = await this.bonusesService.getTeamBonusPerformance(userId);
        return pagination_dto_1.ResponseDto.success(performance, 'Team performance retrieved successfully');
    }
    async findAll(params, user) {
        return await this.bonusesService.findAll(params, user);
    }
};
exports.BonusesController = BonusesController;
__decorate([
    (0, common_1.Get)('my-bonuses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user bonuses' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User bonuses retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getMyBonuses", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user bonus statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User bonus statistics retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bonuses by user ID (Admin/Manager only)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User bonuses retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getUserBonuses", null);
__decorate([
    (0, common_1.Get)('user/:userId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bonus statistics by user ID (Admin/Manager only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User bonus statistics retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('system-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system-wide bonus statistics (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System bonus statistics retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getSystemStats", null);
__decorate([
    (0, common_1.Get)('monthly-stats/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly bonus statistics for a year' }),
    (0, swagger_1.ApiQuery)({ name: 'user_id', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monthly bonus statistics retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)('top-earners'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top bonus earners' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, enum: ['month', 'year', 'all'], description: 'Time period for stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top earners retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getTopEarners", null);
__decorate([
    (0, common_1.Get)('team-performance/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team bonus performance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team performance retrieved successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "getTeamPerformance", null);
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BonusesController.prototype, "findAll", null);
exports.BonusesController = BonusesController = __decorate([
    (0, swagger_1.ApiTags)('Bonuses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('bonuses'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [bonuses_service_1.BonusesService])
], BonusesController);
//# sourceMappingURL=bonuses.controller.js.map