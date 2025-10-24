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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transactions_service_1 = require("./transactions.service");
const transaction_dto_1 = require("./dto/transaction.dto");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const enums_1 = require("../../common/enums");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async create(createTransactionDto, user) {
        const transaction = await this.transactionsService.create(String(user.id), createTransactionDto);
        return pagination_dto_1.ResponseDto.success(transaction, 'Transaction created successfully');
    }
    async requestWithdrawal(withdrawalRequestDto, user) {
        const transactionDto = {
            transaction_type: enums_1.TransactionType.WITHDRAWAL,
            amount: withdrawalRequestDto.amount,
            description: `Withdrawal request - ${withdrawalRequestDto.payment_method}`,
            notes: withdrawalRequestDto.notes,
            payment_method: withdrawalRequestDto.payment_method,
            payment_details: withdrawalRequestDto.payment_details,
            status: enums_1.TransactionStatus.PENDING,
        };
        const transaction = await this.transactionsService.create(String(user.id), transactionDto);
        return pagination_dto_1.ResponseDto.success(transaction, 'Withdrawal request submitted successfully');
    }
    async findAll(paginationDto, filterDto) {
        const { transactions, total } = await this.transactionsService.findAll(paginationDto, filterDto);
        const result = new pagination_dto_1.PaginatedResponseDto(transactions, total, paginationDto.page, paginationDto.limit);
        return pagination_dto_1.ResponseDto.success(result, 'Transactions retrieved successfully');
    }
    async getMyTransactions(paginationDto, user) {
        const { transactions, total } = await this.transactionsService.findByUserId(String(user.id), paginationDto);
        const result = new pagination_dto_1.PaginatedResponseDto(transactions, total, paginationDto.page, paginationDto.limit);
        return pagination_dto_1.ResponseDto.success(result, 'Your transactions retrieved successfully');
    }
    async getStats(userId) {
        const stats = await this.transactionsService.getStats(userId);
        return pagination_dto_1.ResponseDto.success(stats, 'Statistics retrieved successfully');
    }
    async getMyStats(user) {
        const stats = await this.transactionsService.getStats(String(user.id));
        return pagination_dto_1.ResponseDto.success(stats, 'Your statistics retrieved successfully');
    }
    async getMonthlyStats(year, userId) {
        const stats = await this.transactionsService.getMonthlyStats(year, userId);
        return pagination_dto_1.ResponseDto.success(stats, 'Monthly statistics retrieved successfully');
    }
    async getPendingWithdrawals() {
        const withdrawals = await this.transactionsService.getPendingWithdrawals();
        return pagination_dto_1.ResponseDto.success(withdrawals, 'Pending withdrawals retrieved successfully');
    }
    async findOne(id, user) {
        const transaction = await this.transactionsService.findById(id);
        if (transaction.user_id !== user.id && ![enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER].includes(user.role)) {
            return pagination_dto_1.ResponseDto.error('Access denied');
        }
        return pagination_dto_1.ResponseDto.success(transaction, 'Transaction retrieved successfully');
    }
    async updateStatus(id, updateStatusDto) {
        const transaction = await this.transactionsService.updateStatus(id, updateStatusDto.status, updateStatusDto.notes);
        return pagination_dto_1.ResponseDto.success(transaction, 'Transaction status updated successfully');
    }
    async processWithdrawal(id, processDto) {
        const transaction = await this.transactionsService.processWithdrawal(id, processDto.approved, processDto.notes);
        return pagination_dto_1.ResponseDto.success(transaction, `Withdrawal ${processDto.approved ? 'approved' : 'rejected'} successfully`);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new transaction (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transaction created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_dto_1.CreateTransactionDto, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('withdrawal-request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request withdrawal from available balance' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Withdrawal request submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient balance or invalid request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_dto_1.WithdrawalRequestDto, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "requestWithdrawal", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transactions with filtering and pagination (Admin/Manager only)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'transaction_type', required: false, enum: ['bonus_credit', 'incentive_credit', 'withdrawal', 'penalty'] }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['pending', 'completed', 'failed', 'cancelled'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transactions retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        transaction_dto_1.TransactionFilterDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user transactions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User transactions retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getMyTransactions", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction statistics (Admin/Manager only)' }),
    (0, swagger_1.ApiQuery)({ name: 'user_id', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user transaction statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User statistics retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('monthly-stats/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly transaction statistics for a year' }),
    (0, swagger_1.ApiQuery)({ name: 'user_id', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monthly statistics retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)('pending-withdrawals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending withdrawal requests (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending withdrawals retrieved successfully' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPendingWithdrawals", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update transaction status (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transaction_dto_1.UpdateTransactionStatusDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/process-withdrawal'),
    (0, swagger_1.ApiOperation)({ summary: 'Process withdrawal request (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid withdrawal request' }),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transaction_dto_1.ProcessWithdrawalDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "processWithdrawal", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('transactions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map