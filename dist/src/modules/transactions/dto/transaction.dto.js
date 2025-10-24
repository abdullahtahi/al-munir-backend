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
exports.WithdrawalRequestDto = exports.TransactionFilterDto = exports.ProcessWithdrawalDto = exports.UpdateTransactionStatusDto = exports.CreateTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class CreateTransactionDto {
    constructor() {
        this.fee = 0;
        this.status = enums_1.TransactionStatus.PENDING;
    }
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of transaction', enum: enums_1.TransactionType }),
    (0, class_validator_1.IsEnum)(enums_1.TransactionType),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "transaction_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction amount', example: 5000, minimum: 0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction fee', example: 50, minimum: 0, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "fee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction status', enum: enums_1.TransactionStatus, default: enums_1.TransactionStatus.PENDING }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.TransactionStatus),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reference ID for related entity', example: 'admission-123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "reference_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Type of reference', example: 'admission' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "reference_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction description', example: 'Withdrawal request' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes', example: 'Bank transfer to account xyz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment method', example: 'bank_transfer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "payment_method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment details', example: 'Account: 1234567890, Bank: HBL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "payment_details", void 0);
class UpdateTransactionStatusDto {
}
exports.UpdateTransactionStatusDto = UpdateTransactionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New transaction status', enum: enums_1.TransactionStatus }),
    (0, class_validator_1.IsEnum)(enums_1.TransactionStatus),
    __metadata("design:type", String)
], UpdateTransactionStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes for status update' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransactionStatusDto.prototype, "notes", void 0);
class ProcessWithdrawalDto {
}
exports.ProcessWithdrawalDto = ProcessWithdrawalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to approve the withdrawal', example: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], ProcessWithdrawalDto.prototype, "approved", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Processing notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessWithdrawalDto.prototype, "notes", void 0);
class TransactionFilterDto {
}
exports.TransactionFilterDto = TransactionFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.TransactionType),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "transaction_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.TransactionStatus),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "date_from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "date_to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TransactionFilterDto.prototype, "min_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TransactionFilterDto.prototype, "max_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "payment_method", void 0);
class WithdrawalRequestDto {
}
exports.WithdrawalRequestDto = WithdrawalRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Withdrawal amount', example: 10000, minimum: 100 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], WithdrawalRequestDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment method', example: 'bank_transfer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WithdrawalRequestDto.prototype, "payment_method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment details (account info)', example: 'Account: 1234567890, Bank: HBL, Name: John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WithdrawalRequestDto.prototype, "payment_details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawalRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=transaction.dto.js.map