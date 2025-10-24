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
exports.Consultant = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bcrypt = require("bcrypt");
const enums_1 = require("../../common/enums");
const bank_entity_1 = require("../bank/bank.entity");
let Consultant = class Consultant extends sequelize_typescript_1.Model {
    static async hashPassword(user) {
        if (user.changed('password')) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
    }
    static generateReferralCode(user) {
        if (!user.referralCode) {
            user.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
    }
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get totalAdmissions() {
        return this.schoolAdmissions + this.academyAdmissions + this.technicalAdmissions;
    }
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
};
exports.Consultant = Consultant;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Consultant.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "cnic", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "paymentReceipt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        defaultValue: enums_1.UserRole.USER,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: enums_1.UserLevel.LEVEL_1,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "level", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Consultant.prototype, "dateOfBirth", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        defaultValue: enums_1.ConsultantStatus.PENDING,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Consultant),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'fkSponsorId',
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "sponsorId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => bank_entity_1.Banks),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'fkBankId',
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "bankId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Consultant, 'sponsorId'),
    __metadata("design:type", Consultant)
], Consultant.prototype, "sponsor", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Consultant, 'sponsorId'),
    __metadata("design:type", Array)
], Consultant.prototype, "downlines", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "referralCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        defaultValue: 0.00,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "totalEarnings", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        defaultValue: 0.00,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "availableBalance", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        defaultValue: 0.00,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "withdrawnAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "schoolAdmissions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "academyAdmissions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "technicalAdmissions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        defaultValue: 0.00,
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "completionRate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Consultant.prototype, "notificationPreferences", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Consultant.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => bank_entity_1.Banks),
    __metadata("design:type", bank_entity_1.Banks)
], Consultant.prototype, "Bank", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Consultant]),
    __metadata("design:returntype", Promise)
], Consultant, "hashPassword", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Consultant]),
    __metadata("design:returntype", void 0)
], Consultant, "generateReferralCode", null);
exports.Consultant = Consultant = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Consultant',
        timestamps: true,
    })
], Consultant);
//# sourceMappingURL=consultant.entity.js.map