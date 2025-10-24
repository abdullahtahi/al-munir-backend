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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const consultant_service_1 = require("../consultant/consultant.service");
const enums_1 = require("../../common/enums");
let AuthService = class AuthService {
    constructor(ConsultantService, jwtService, configService) {
        this.ConsultantService = ConsultantService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.ConsultantService.findByEmail(email);
        if (user && await user.validatePassword(password)) {
            if (user.status === enums_1.ConsultantStatus.SUSPENDED) {
                throw new common_1.UnauthorizedException('Account suspended. Contact administrator.');
            }
            if (user.status === enums_1.ConsultantStatus.INACTIVE) {
                throw new common_1.UnauthorizedException('Account inactive. Contact administrator.');
            }
            const { password: _, ...result } = user.toJSON();
            return result;
        }
        return null;
    }
    async login(payload) {
        const findUser = await this.validateUser(payload.email, payload.password);
        if (findUser !== null) {
            const { password, ...user } = findUser;
            return {
                user: {
                    id: findUser.id,
                    email: findUser.email,
                    firstName: findUser.first_name,
                    lastName: findUser.last_name,
                    role: findUser.role,
                    level: findUser.level,
                    status: findUser.status,
                },
                accessToken: this.jwtService.sign(user),
                expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
            };
        }
        else {
            throw new common_1.BadRequestException("Password is incorrect");
        }
    }
    async register(registerDto) {
        try {
            const userData = {
                ...registerDto,
                status: enums_1.ConsultantStatus.PENDING,
            };
            const user = await this.ConsultantService.create(userData);
            return {
                user,
                message: "User Added"
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async profile(loginUser) {
        try {
            return await this.ConsultantService.findById(loginUser?.id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.ConsultantService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isValidPassword = await user.validatePassword(changePasswordDto.currentPassword);
        if (!isValidPassword) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        await this.ConsultantService.updatePassword(userId, changePasswordDto.newPassword);
    }
    async generatePasswordResetToken(email) {
        const user = await this.ConsultantService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const payload = {
            sub: user.id,
            type: 'reset_password',
            exp: Math.floor(Date.now() / 1000) + (15 * 60),
        };
        return this.jwtService.sign(payload);
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'reset_password') {
                throw new common_1.BadRequestException('Invalid token');
            }
            await this.ConsultantService.updatePassword(payload.sub, newPassword);
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [consultant_service_1.ConsultantService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map