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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path = require("path");
const constants_1 = require("../../constants");
const resizeImage_1 = require("../../helpers/resizeImage");
const fs = require("fs");
const errorMessage_1 = require("../../helpers/errorMessage");
const s3_1 = require("../../helpers/s3");
const swagger_1 = require("@nestjs/swagger");
const checkFileType = async (file, cb, fileTypes) => {
    const extensionName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    const isImageExtension = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const isImageMimeType = fileTypes.test(file.mimetype);
    if (isImageExtension && isImageMimeType) {
        return cb(null, true);
    }
    else if (mimetype && extensionName) {
        return cb(null, true);
    }
    return cb(new common_1.BadRequestException(`Select ${fileTypes}`));
};
let UploadController = class UploadController {
    async uploadImage(file, body) {
        const isImageExtension = constants_1.IMAGE_EXTENTIONS.test(path.extname(file.originalname).toLowerCase());
        let directory = '';
        if (body && body.directory !== '') {
            directory = body.directory;
        }
        const isImageMimeType = constants_1.IMAGE_EXTENTIONS.test(file.mimetype);
        if (isImageExtension && isImageMimeType) {
            const fileUpload = new resizeImage_1.Resize();
            const filename = await fileUpload.save(file.buffer, directory !== '' ? directory : 'photos', file.mimetype);
            return {
                name: filename,
                path: 'photos' + '/' + filename,
            };
        }
        else {
            const fileName = `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(file.originalname)}`;
            const response = await (0, s3_1.uploadsFile)(fileName, file.buffer, directory !== '' ? directory : 'files', 'file', file.mimetype);
            if (response.success) {
                return {
                    name: fileName,
                    path: 'photos' + '/' + fileName,
                };
            }
            else {
                return response;
            }
        }
    }
    async uploadFile(file, body) {
        try {
            const uploadDir = `${path.resolve()}/public/uploads`;
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const isFileExtension = constants_1.FILE_EXTENTIONS.test(path.extname(file.originalname).toLowerCase());
            if (isFileExtension) {
                let directory = '';
                if (body && body.directory !== '') {
                    directory = body.directory;
                }
                const fileName = `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(file.originalname)}`;
                const response = await (0, s3_1.uploadsFile)(fileName, file.buffer, directory !== '' ? directory : 'company', 'file', file.mimetype);
                console.log("response", response);
                if (response.success) {
                    return {
                        name: fileName,
                        path: 'photos/' + fileName,
                    };
                }
                else {
                    return response;
                }
            }
            else {
                throw new common_1.InternalServerErrorException('Invalid file extension');
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException((0, errorMessage_1.getErrorMessage)(error));
        }
    }
    async deleteFile(filePath) {
        try {
            if (!filePath) {
                throw new common_1.InternalServerErrorException('File path is required');
            }
            const response = await (0, s3_1.deleteFile)(filePath);
            return response;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException((0, errorMessage_1.getErrorMessage)(error));
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: constants_1.MAX_FILE_SIZE },
        fileFilter(req, file, cb) {
            checkFileType(file, cb, constants_1.IMAGE_EXTENTIONS);
        },
    })),
    (0, common_1.Post)('image'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: constants_1.MAX_FILE_SIZE },
        fileFilter(req, file, cb) {
            checkFileType(file, cb, constants_1.FILE_EXTENTIONS);
        },
    })),
    (0, common_1.Post)('file'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Delete)('file'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFile", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.Controller)('upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map