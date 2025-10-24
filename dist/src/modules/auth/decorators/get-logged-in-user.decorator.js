"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLoggedInUser = void 0;
const common_1 = require("@nestjs/common");
exports.GetLoggedInUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
//# sourceMappingURL=get-logged-in-user.decorator.js.map