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
exports.WebsiteSettingController = void 0;
const common_1 = require("@nestjs/common");
const website_setting_service_1 = require("./website-setting.service");
let WebsiteSettingController = class WebsiteSettingController {
    constructor(websiteSettingService) {
        this.websiteSettingService = websiteSettingService;
    }
    createAndUpdate(createWebsiteSettingDto) {
        return this.websiteSettingService.create(createWebsiteSettingDto);
    }
    findAll() {
        return this.websiteSettingService.findAll();
    }
    findOne(id) {
        return this.websiteSettingService.findOne(+id);
    }
    update(id, updateWebsiteSettingDto) {
        return this.websiteSettingService.update(+id, updateWebsiteSettingDto);
    }
    remove(id) {
        return this.websiteSettingService.remove(+id);
    }
};
exports.WebsiteSettingController = WebsiteSettingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebsiteSettingController.prototype, "createAndUpdate", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsiteSettingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsiteSettingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebsiteSettingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsiteSettingController.prototype, "remove", null);
exports.WebsiteSettingController = WebsiteSettingController = __decorate([
    (0, common_1.Controller)('website-setting'),
    __metadata("design:paramtypes", [website_setting_service_1.WebsiteSettingService])
], WebsiteSettingController);
//# sourceMappingURL=website-setting.controller.js.map