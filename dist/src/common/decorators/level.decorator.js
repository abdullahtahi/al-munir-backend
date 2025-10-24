"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireLevel = exports.LEVEL_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.LEVEL_KEY = 'level';
const RequireLevel = (level) => (0, common_1.SetMetadata)(exports.LEVEL_KEY, level);
exports.RequireLevel = RequireLevel;
//# sourceMappingURL=level.decorator.js.map