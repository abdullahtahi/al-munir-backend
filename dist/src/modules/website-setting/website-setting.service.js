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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteSettingService = void 0;
const common_1 = require("@nestjs/common");
const global_db_service_1 = require("../global-db/global-db.service");
let WebsiteSettingService = class WebsiteSettingService {
    constructor(db) {
        this.db = db;
    }
    async create(createWebsiteSettingDto) {
        let websiteSetting;
        if (createWebsiteSettingDto?.id !== null) {
            websiteSetting = await this.db.repo.WebsiteSetting.create({
                ...createWebsiteSettingDto,
            });
        }
        else {
            websiteSetting = await this.db.repo.WebsiteSetting.update({
                ...createWebsiteSettingDto,
            }, {
                where: {
                    id: createWebsiteSettingDto.id,
                },
            });
        }
        return websiteSetting;
    }
    findAll() {
        return this.db.repo.WebsiteSetting.findOne();
    }
    findOne(id) {
        return `This action returns a #${id} websiteSetting`;
    }
    update(id, updateWebsiteSettingDto) {
        return `This action updates a #${id} websiteSetting`;
    }
    remove(id) {
        return `This action removes a #${id} websiteSetting`;
    }
};
exports.WebsiteSettingService = WebsiteSettingService;
exports.WebsiteSettingService = WebsiteSettingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [global_db_service_1.GlobalDbService])
], WebsiteSettingService);
//# sourceMappingURL=website-setting.service.js.map