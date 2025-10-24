"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jwtConfig = (configService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
        expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
    },
});
exports.jwtConfig = jwtConfig;
//# sourceMappingURL=jwt.config.js.map