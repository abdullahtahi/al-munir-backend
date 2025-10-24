"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resize = void 0;
const uniqId = require('uniqid');
const path = require('path');
const s3 = require('./s3');
class Resize {
    async save(buffer, folder = '', fileMimetype = '') {
        const filename = Resize.filename();
        const response = await s3.uploadsFile(filename, buffer, folder, 'file', fileMimetype);
        if (response.success) {
            return filename;
        }
        else {
            return response;
        }
    }
    static filename() {
        return `${uniqId()}-${Date.now()}.jpg`;
    }
}
exports.Resize = Resize;
//# sourceMappingURL=resizeImage.js.map