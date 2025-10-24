"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasPermission = void 0;
const common_1 = require("@nestjs/common");
const HasPermission = (permissions, match) => {
    return (0, common_1.SetMetadata)('checkPermissions', { permissions, match });
};
exports.HasPermission = HasPermission;
//# sourceMappingURL=has-permission.decorator.js.map