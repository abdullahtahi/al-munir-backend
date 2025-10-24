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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
const passport_1 = require("@nestjs/passport");
const consultant_service_1 = require("./consultant.service");
let UsersController = class UsersController {
    constructor(consultantService) {
        this.consultantService = consultantService;
    }
    async findAll(params) {
        return await this.consultantService.findAll(params);
    }
    async search(dto) {
        const { users, total } = await this.consultantService.searchUsers(dto.query, dto);
        const result = new pagination_dto_1.PaginatedResponseDto(users, total, dto.page, dto.limit);
        return pagination_dto_1.ResponseDto.success(result, 'Search results retrieved successfully');
    }
    async findOne(id) {
        const user = await this.consultantService.findById(id);
        return pagination_dto_1.ResponseDto.success(user, 'User retrieved successfully');
    }
    async getTeamStructure(id, user, depth) {
        if (id !== user.id && ![enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER].includes(user.role)) {
            id = user.id;
        }
        const teamStructure = await this.consultantService.getTeamStructure(id, depth || 3);
        return pagination_dto_1.ResponseDto.success(teamStructure, 'Team structure retrieved successfully');
    }
    async getTeamStats(id, user) {
        if (id !== user.id && ![enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER].includes(user.role)) {
            id = user.id;
        }
        const stats = await this.consultantService.getTeamStats(id);
        return pagination_dto_1.ResponseDto.success(stats, 'Team statistics retrieved successfully');
    }
    async updateProfile(user, updateUserDto) {
        delete updateUserDto.role;
        delete updateUserDto.level;
        delete updateUserDto.status;
        const updatedUser = await this.consultantService.update(user.id, updateUserDto);
        return pagination_dto_1.ResponseDto.success(updatedUser, 'Profile updated successfully');
    }
    async update(id, updateUserDto) {
        return await this.consultantService.update(id, updateUserDto);
    }
    async updateStatus(id, updateStatusDto) {
        const user = await this.consultantService.updateStatus(id, updateStatusDto.status);
        return pagination_dto_1.ResponseDto.success(user, 'User status updated successfully');
    }
    async updateLevel(id, updateLevelDto) {
        const user = await this.consultantService.updateLevel(id, updateLevelDto.level);
        return pagination_dto_1.ResponseDto.success(user, 'User level updated successfully');
    }
    async remove(id) {
        await this.consultantService.remove(id);
        return pagination_dto_1.ResponseDto.success(null, 'User removed successfully');
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.SearchUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/team-structure'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('depth')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTeamStructure", null);
__decorate([
    (0, common_1.Get)(':id/team-stats'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTeamStats", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/level'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateLevel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [consultant_service_1.ConsultantService])
], UsersController);
//# sourceMappingURL=consultant.controller.js.map