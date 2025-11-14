"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const Consultant_module_1 = require("./modules/Consultant/Consultant.module");
const upload_module_1 = require("./modules/upload/upload.module");
const database_module_1 = require("./database/database.module");
const global_db_module_1 = require("./modules/global-db/global-db.module");
const students_module_1 = require("./modules/students/students.module");
const depend_on_module_1 = require("./modules/depend-on/depend-on.module");
const bank_module_1 = require("./modules/bank/bank.module");
const admissions_module_1 = require("./modules/admissions/admissions.module");
const bonuses_module_1 = require("./modules/bonuses/bonuses.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const branches_module_1 = require("./modules/branches/branches.module");
const website_setting_module_1 = require("./modules/website-setting/website-setting.module");
const courses_module_1 = require("./modules/courses/courses.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            database_module_1.DatabaseModule,
            global_db_module_1.GlobalDbModule,
            auth_module_1.AuthModule,
            Consultant_module_1.ConsultantModule,
            admissions_module_1.AdmissionsModule,
            upload_module_1.UploadModule,
            students_module_1.StudentsModule,
            depend_on_module_1.DependOnModule,
            bank_module_1.BankModule,
            bonuses_module_1.BonusesModule,
            transactions_module_1.TransactionsModule,
            branches_module_1.BranchesModule,
            website_setting_module_1.WebsiteSettingModule,
            courses_module_1.CoursesModule,
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map