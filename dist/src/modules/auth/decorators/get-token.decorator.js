"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetToken = void 0;
const common_1 = require("@nestjs/common");
exports.GetToken = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization.split('Bearer ')[1];
    return token;
});
//# sourceMappingURL=get-token.decorator.js.map