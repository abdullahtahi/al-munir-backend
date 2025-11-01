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
exports.Bonus = exports.BonusStatus = exports.BonusType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const consultant_entity_1 = require("../consultant/consultant.entity");
const admissions_entity_1 = require("../admissions/admissions.entity");
var BonusType;
(function (BonusType) {
    BonusType["DIRECT"] = "direct";
    BonusType["INDIRECT_LEVEL_1"] = "indirect_level_1";
    BonusType["INDIRECT_LEVEL_2"] = "indirect_level_2";
    BonusType["INDIRECT_LEVEL_3"] = "indirect_level_3";
    BonusType["INDIRECT_LEVEL_4"] = "indirect_level_4";
    BonusType["GLOBAL"] = "global";
    BonusType["PROGRESSION"] = "progression";
})(BonusType || (exports.BonusType = BonusType = {}));
var BonusStatus;
(function (BonusStatus) {
    BonusStatus["PENDING"] = "pending";
    BonusStatus["COMPLETED"] = "completed";
    BonusStatus["CANCELLED"] = "cancelled";
})(BonusStatus || (exports.BonusStatus = BonusStatus = {}));
let Bonus = class Bonus extends sequelize_typescript_1.Model {
};
exports.Bonus = Bonus;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Bonus.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => consultant_entity_1.Consultant),
    (0, sequelize_typescript_1.Column)({
        field: 'fkConsultantId',
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Foreign key from Consultant table',
    }),
    __metadata("design:type", Number)
], Bonus.prototype, "consultantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => consultant_entity_1.Consultant, 'fkConsultantId'),
    __metadata("design:type", consultant_entity_1.Consultant)
], Bonus.prototype, "consultant", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => consultant_entity_1.Consultant),
    (0, sequelize_typescript_1.Column)({
        field: 'fkFromConsultantId',
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Foreign key from Consultant table',
    }),
    __metadata("design:type", Number)
], Bonus.prototype, "fromConsultantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => consultant_entity_1.Consultant, 'fkFromConsultantId'),
    __metadata("design:type", consultant_entity_1.Consultant)
], Bonus.prototype, "fromConsultant", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(BonusType)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Bonus.prototype, "bonusType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Bonus.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Bonus.prototype, "percentage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Bonus.prototype, "baseAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Bonus.prototype, "levelDepth", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => admissions_entity_1.Admissions),
    (0, sequelize_typescript_1.Column)({
        field: 'fkAdmissionId',
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Foreign key from Admission table',
    }),
    __metadata("design:type", Number)
], Bonus.prototype, "admissionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Bonus.prototype, "referenceType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Bonus.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(BonusStatus.PENDING),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(BonusStatus)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Bonus.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Bonus.prototype, "earnedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Bonus.prototype, "processedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Bonus.prototype, "metadata", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Bonus.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Bonus.prototype, "updatedAt", void 0);
exports.Bonus = Bonus = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Bonuses',
        timestamps: true,
    })
], Bonus);
//# sourceMappingURL=bonuses.entity.js.map