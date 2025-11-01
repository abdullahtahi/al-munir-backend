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
exports.Transactions = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const admissions_entity_1 = require("../admissions/admissions.entity");
const consultant_entity_1 = require("../consultant/consultant.entity");
let Transactions = class Transactions extends sequelize_typescript_1.Model {
};
exports.Transactions = Transactions;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Transactions.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => consultant_entity_1.Consultant),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: 'fkConsultantId',
        allowNull: true,
        comment: 'Foreign key from Consultant table',
    }),
    __metadata("design:type", Number)
], Transactions.prototype, "consultantId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => admissions_entity_1.Admissions),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: 'fkAdmissionId',
        allowNull: true,
        comment: 'Foreign key from Admission table',
    }),
    __metadata("design:type", Number)
], Transactions.prototype, "admissionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('bonus_credit', 'incentive_credit', 'withdrawal', 'penalty'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Transactions.prototype, "transactionType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Transactions.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Transactions.prototype, "transactionDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0.0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
    }),
    __metadata("design:type", Number)
], Transactions.prototype, "fee", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Transactions.prototype, "netAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Transactions.prototype, "paymentDetails", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Transactions.prototype, "referenceType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Transactions.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('pending'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('pending', 'completed', 'failed', 'cancelled'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Transactions.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Transactions.prototype, "processedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Transactions.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Transactions.prototype, "paymentMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Transactions.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => consultant_entity_1.Consultant),
    __metadata("design:type", consultant_entity_1.Consultant)
], Transactions.prototype, "consultant", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => admissions_entity_1.Admissions),
    __metadata("design:type", admissions_entity_1.Admissions)
], Transactions.prototype, "admission", void 0);
exports.Transactions = Transactions = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Transactions',
        timestamps: true,
    })
], Transactions);
//# sourceMappingURL=transactions.entity.js.map