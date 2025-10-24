"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalDbModule = void 0;
const common_1 = require("@nestjs/common");
const global_db_provider_1 = require("./global-db.provider");
const global_db_service_1 = require("./global-db.service");
let GlobalDbModule = class GlobalDbModule {
};
exports.GlobalDbModule = GlobalDbModule;
exports.GlobalDbModule = GlobalDbModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [global_db_service_1.GlobalDbService, ...global_db_provider_1.globalDbPRovider],
        exports: [global_db_service_1.GlobalDbService]
    })
], GlobalDbModule);
//# sourceMappingURL=global-db.module.js.map