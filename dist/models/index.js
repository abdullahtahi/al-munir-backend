"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const consultant_entity_1 = require("../src/modules/consultant/consultant.entity");
const student_entity_1 = require("../src/modules/students/student.entity");
const depend_on_entity_1 = require("../src/modules/depend-on/depend-on.entity");
const admissions_entity_1 = require("../src/modules/admissions/admissions.entity");
const bank_entity_1 = require("../src/modules/bank/bank.entity");
const bonuses_entity_1 = require("../src/modules/bonuses/bonuses.entity");
const transactions_entity_1 = require("../src/modules/transactions/transactions.entity");
const branch_entity_1 = require("../src/modules/branches/entities/branch.entity");
const course_entity_1 = require("../src/modules/courses/entities/course.entity");
const website_setting_entity_1 = require("../src/modules/website-setting/entities/website-setting.entity");
exports.models = [
    consultant_entity_1.Consultant,
    admissions_entity_1.Admissions,
    student_entity_1.Students,
    depend_on_entity_1.DependOn,
    bank_entity_1.Banks,
    bonuses_entity_1.Bonus,
    transactions_entity_1.Transactions,
    branch_entity_1.Branches, course_entity_1.Courses,
    website_setting_entity_1.WebsiteSetting
];
//# sourceMappingURL=index.js.map