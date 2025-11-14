"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteSettingModule = void 0;
const common_1 = require("@nestjs/common");
const website_setting_service_1 = require("./website-setting.service");
const website_setting_controller_1 = require("./website-setting.controller");
const database_provider_1 = require("../../database/database.provider");
let WebsiteSettingModule = class WebsiteSettingModule {
};
exports.WebsiteSettingModule = WebsiteSettingModule;
exports.WebsiteSettingModule = WebsiteSettingModule = __decorate([
    (0, common_1.Module)({
        controllers: [website_setting_controller_1.WebsiteSettingController],
        providers: [website_setting_service_1.WebsiteSettingService, ...database_provider_1.databaseProviders],
    })
], WebsiteSettingModule);
//# sourceMappingURL=website-setting.module.js.map