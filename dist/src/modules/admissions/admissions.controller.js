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
exports.AdmissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admissions_service_1 = require("./admissions.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
const passport_1 = require("@nestjs/passport");
const get_logged_in_user_decorator_1 = require("../auth/decorators/get-logged-in-user.decorator");
let AdmissionsController = class AdmissionsController {
    constructor(admissionsService) {
        this.admissionsService = admissionsService;
    }
    async create(createAdmissionDto, user) {
        return await this.admissionsService.create(createAdmissionDto, user);
    }
    async findAll(params) {
        return await this.admissionsService.findAll(params);
    }
    async getMyAdmissions(paginationDto, user) {
        const { admissions, total } = await this.admissionsService.findByUserId(String(user.id), paginationDto);
        const result = new pagination_dto_1.PaginatedResponseDto(admissions, total, paginationDto.page, paginationDto.limit);
        return pagination_dto_1.ResponseDto.success(result, 'Your admissions retrieved successfully');
    }
    async getStats(userId) {
        const stats = await this.admissionsService.getStats(userId);
        return pagination_dto_1.ResponseDto.success(stats, 'Statistics retrieved successfully');
    }
    async getMyStats(user) {
        const stats = await this.admissionsService.getStats(String(user.id));
        return pagination_dto_1.ResponseDto.success(stats, 'Your statistics retrieved successfully');
    }
    async getMonthlyStats(year, userId) {
        const stats = await this.admissionsService.getMonthlyStats(year, userId);
        return pagination_dto_1.ResponseDto.success(stats, 'Monthly statistics retrieved successfully');
    }
    async getTopCourses(limit) {
        const courses = await this.admissionsService.getTopCourses(limit || 10);
        return pagination_dto_1.ResponseDto.success(courses, 'Top courses retrieved successfully');
    }
    async getTopPerformers(limit) {
        const performers = await this.admissionsService.getTopPerformers(limit || 10);
        return pagination_dto_1.ResponseDto.success(performers, 'Top performers retrieved successfully');
    }
    async findOne(id, user) {
        const admission = await this.admissionsService.findById(id);
        if (String(admission.consultantId) !== String(user.id) && ![enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER].includes(user.role)) {
            return pagination_dto_1.ResponseDto.error('Access denied');
        }
        return pagination_dto_1.ResponseDto.success(admission, 'Admission retrieved successfully');
    }
    async update(id, updateAdmissionDto, user) {
        return await this.admissionsService.update(id, updateAdmissionDto);
    }
    async remove(id) {
        await this.admissionsService.remove(id);
        return pagination_dto_1.ResponseDto.success(null, 'Admission deleted successfully');
    }
};
exports.AdmissionsController = AdmissionsController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_logged_in_user_decorator_1.GetLoggedInUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-admissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user admissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User admissions retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "getMyAdmissions", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admission statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user admission statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User statistics retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('monthly-stats/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly admission statistics for a year' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monthly statistics retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)('top-courses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top performing courses' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top courses retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "getTopCourses", null);
__decorate([
    (0, common_1.Get)('top-performers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top performing users' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top performers retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "getTopPerformers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admission by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admission retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admission not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete admission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admission deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admission not found' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdmissionsController.prototype, "remove", null);
exports.AdmissionsController = AdmissionsController = __decorate([
    (0, common_1.Controller)('admissions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [admissions_service_1.AdmissionsService])
], AdmissionsController);
//# sourceMappingURL=admissions.controller.js.map