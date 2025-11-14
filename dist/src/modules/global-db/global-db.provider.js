"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalDbPRovider = void 0;
const repositories_1 = require("../../constants/repositories");
const consultant_entity_1 = require("../consultant/consultant.entity");
const student_entity_1 = require("../students/student.entity");
const depend_on_entity_1 = require("../depend-on/depend-on.entity");
const admissions_entity_1 = require("../admissions/admissions.entity");
const bank_entity_1 = require("../bank/bank.entity");
const bonuses_entity_1 = require("../bonuses/bonuses.entity");
const transactions_entity_1 = require("../transactions/transactions.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
const course_entity_1 = require("../courses/entities/course.entity");
const website_setting_entity_1 = require("../website-setting/entities/website-setting.entity");
exports.globalDbPRovider = [
    {
        provide: repositories_1.USER_REPOSITORY,
        useValue: consultant_entity_1.Consultant,
    },
    {
        provide: repositories_1.ADMISSION_REPOSITORY,
        useValue: admissions_entity_1.Admissions,
    },
    {
        provide: repositories_1.STUDENT_REPOSITORY,
        useValue: student_entity_1.Students,
    },
    {
        provide: repositories_1.DEPENDON_REPOSITORY,
        useValue: depend_on_entity_1.DependOn,
    },
    {
        provide: repositories_1.BANK_REPOSITORY,
        useValue: bank_entity_1.Banks,
    },
    {
        provide: repositories_1.BONUS_REPOSITORY,
        useValue: bonuses_entity_1.Bonus,
    },
    {
        provide: repositories_1.TRANSACTION_REPOSITORY,
        useValue: transactions_entity_1.Transactions,
    },
    {
        provide: repositories_1.BRANCHS_REPOSITORY,
        useValue: branch_entity_1.Branches,
    },
    {
        provide: repositories_1.COURSES_REPOSITORY,
        useValue: course_entity_1.Courses,
    },
    {
        provide: repositories_1.COURSES_REPOSITORY,
        useValue: course_entity_1.Courses,
    },
    {
        provide: repositories_1.WEBSITE_SETTING_REPOSITORY,
        useValue: website_setting_entity_1.WebsiteSetting,
    },
];
//# sourceMappingURL=global-db.provider.js.map