"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const consultant_entity_1 = require("../src/modules/consultant/consultant.entity");
const student_entity_1 = require("../src/modules/students/student.entity");
const depend_on_entity_1 = require("../src/modules/depend-on/depend-on.entity");
const admissions_entity_1 = require("../src/modules/admissions/admissions.entity");
const bank_entity_1 = require("../src/modules/bank/bank.entity");
const bonuses_entity_1 = require("../src/modules/bonuses/bonuses.entity");
exports.models = [
    consultant_entity_1.Consultant,
    admissions_entity_1.Admissions,
    student_entity_1.Students,
    depend_on_entity_1.DependOn,
    bank_entity_1.Banks,
    bonuses_entity_1.Bonus
];
//# sourceMappingURL=index.js.map