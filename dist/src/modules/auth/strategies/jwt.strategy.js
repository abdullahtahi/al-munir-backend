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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const constants_1 = require("../../../common/constants");
const consultant_service_1 = require("../../consultant/consultant.service");
const jwtExtractor = (req) => {
    let token = null;
    if (req?.headers) {
        const tokenParts = req.headers?.authorization?.split('Bearer ');
        if (tokenParts?.[1]) {
            token = tokenParts[1];
            global.jwtToken = token;
        }
    }
    if (!token && req?.query?.authorization) {
        token = req.query.authorization;
        global.jwtToken = token;
    }
    return token;
};
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, consultantService) {
        super({
            jwtFromRequest: jwtExtractor,
            ignoreExpiration: false,
            secretOrKey: constants_1.JWT_SECRET_KEY,
        });
        this.configService = configService;
        this.consultantService = consultantService;
    }
    async validate(payload) {
        const user = await this.consultantService.findById(payload.id);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('User account is not active');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            level: user.level,
            status: user.status,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        consultant_service_1.ConsultantService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map