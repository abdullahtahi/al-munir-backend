"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependOnModule = void 0;
const common_1 = require("@nestjs/common");
const depend_on_service_1 = require("./depend-on.service");
const depend_on_controller_1 = require("./depend-on.controller");
let DependOnModule = class DependOnModule {
};
exports.DependOnModule = DependOnModule;
exports.DependOnModule = DependOnModule = __decorate([
    (0, common_1.Module)({
        controllers: [depend_on_controller_1.DependOnController],
        providers: [depend_on_service_1.DependOnService],
    })
], DependOnModule);
//# sourceMappingURL=depend-on.module.js.map