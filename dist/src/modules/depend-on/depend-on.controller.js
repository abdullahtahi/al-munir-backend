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
exports.DependOnController = void 0;
const common_1 = require("@nestjs/common");
const depend_on_service_1 = require("./depend-on.service");
const create_depend_on_dto_1 = require("./dto/create-depend-on.dto");
const update_depend_on_dto_1 = require("./dto/update-depend-on.dto");
let DependOnController = class DependOnController {
    constructor(dependOnService) {
        this.dependOnService = dependOnService;
    }
    create(createDependOnDto) {
        return this.dependOnService.create(createDependOnDto);
    }
    findAll() {
        return this.dependOnService.findAll();
    }
    findOne(id) {
        return this.dependOnService.findOne(+id);
    }
    update(id, updateDependOnDto) {
        return this.dependOnService.update(+id, updateDependOnDto);
    }
    remove(id) {
        return this.dependOnService.remove(+id);
    }
};
exports.DependOnController = DependOnController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_depend_on_dto_1.CreateDependOnDto]),
    __metadata("design:returntype", void 0)
], DependOnController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DependOnController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DependOnController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_depend_on_dto_1.UpdateDependOnDto]),
    __metadata("design:returntype", void 0)
], DependOnController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DependOnController.prototype, "remove", null);
exports.DependOnController = DependOnController = __decorate([
    (0, common_1.Controller)('depend-on'),
    __metadata("design:paramtypes", [depend_on_service_1.DependOnService])
], DependOnController);
//# sourceMappingURL=depend-on.controller.js.map