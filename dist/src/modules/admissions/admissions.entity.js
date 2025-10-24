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
exports.Admissions = void 0;
const student_entity_1 = require("../students/student.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
const depend_on_entity_1 = require("../depend-on/depend-on.entity");
const consultant_entity_1 = require("../consultant/consultant.entity");
let Admissions = class Admissions extends sequelize_typescript_1.Model {
};
exports.Admissions = Admissions;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Admissions.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => consultant_entity_1.Consultant),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: "fkConsultantId",
        allowNull: true
    }),
    __metadata("design:type", Number)
], Admissions.prototype, "consultantId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => student_entity_1.Students),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: "fkStudentId",
        allowNull: false
    }),
    __metadata("design:type", Number)
], Admissions.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => depend_on_entity_1.DependOn),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: "fkDependOnId",
        allowNull: false
    }),
    __metadata("design:type", Number)
], Admissions.prototype, "dependOnId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Admissions.prototype, "admissionInClass", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Admissions.prototype, "admissionType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Admissions.prototype, "feeAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Admissions.prototype, "commissionAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Admissions.prototype, "admissionDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true
    }),
    __metadata("design:type", String)
], Admissions.prototype, "admissionNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Admissions.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Admissions.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Admissions.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => consultant_entity_1.Consultant),
    __metadata("design:type", consultant_entity_1.Consultant)
], Admissions.prototype, "consultant", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => student_entity_1.Students),
    __metadata("design:type", student_entity_1.Students)
], Admissions.prototype, "Student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => depend_on_entity_1.DependOn),
    __metadata("design:type", depend_on_entity_1.DependOn)
], Admissions.prototype, "DependOn", void 0);
exports.Admissions = Admissions = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Admissions',
        timestamps: true,
    })
], Admissions);
//# sourceMappingURL=admissions.entity.js.map