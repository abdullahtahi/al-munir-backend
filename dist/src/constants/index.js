"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEQUELIZE = exports.FILE_EXTENTIONS = exports.IMAGE_EXTENTIONS = exports.MAX_FILE_SIZE = exports.MAX_PHOTO_SIZE = exports.DEFAULT_LIMIT = void 0;
const KB = 1024;
const MB = 1024 * KB;
exports.DEFAULT_LIMIT = 10;
exports.MAX_PHOTO_SIZE = 5 * MB;
exports.MAX_FILE_SIZE = 25 * MB;
exports.IMAGE_EXTENTIONS = /jpeg|jpg|png|PNG/;
exports.FILE_EXTENTIONS = /pdf|doc|msword|docx|png|jpeg|jpg/;
exports.SEQUELIZE = 'SEQUELIZE';
//# sourceMappingURL=index.js.map