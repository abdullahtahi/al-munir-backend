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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const enums_1 = require("../../common/enums");
const global_db_service_1 = require("../global-db/global-db.service");
const constants_1 = require("../../constants");
const consultant_service_1 = require("../consultant/consultant.service");
let TransactionsService = class TransactionsService {
    constructor(db, sequelize, transactionService, ConsultantService) {
        this.db = db;
        this.sequelize = sequelize;
        this.transactionService = transactionService;
        this.ConsultantService = ConsultantService;
    }
    async create(userId, createTransactionDto) {
        const user = await this.ConsultantService.findById(Number(userId));
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (createTransactionDto.transaction_type === enums_1.TransactionType.WITHDRAWAL) {
            if (user.availableBalance < createTransactionDto.amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
        }
        const netAmount = createTransactionDto.amount - (createTransactionDto.fee || 0);
        const transaction = await this.db.repo.Transaction.create({
            user_id: userId,
            ...createTransactionDto,
            net_amount: netAmount,
        });
        if (createTransactionDto.transaction_type === enums_1.TransactionType.WITHDRAWAL &&
            createTransactionDto.status === enums_1.TransactionStatus.COMPLETED) {
            await this.ConsultantService.updateBalance(Number(userId), -createTransactionDto.amount);
        }
        return transaction;
    }
    async findAll(paginationDto, filterDto) {
        const { page, limit, offset } = paginationDto;
        const whereClause = {};
        if (filterDto?.transaction_type) {
            whereClause.transaction_type = filterDto.transaction_type;
        }
        if (filterDto?.user_id) {
            whereClause.user_id = filterDto.user_id;
        }
        if (filterDto?.status) {
            whereClause.status = filterDto.status;
        }
        if (filterDto?.date_from || filterDto?.date_to) {
            whereClause.transaction_date = {};
            if (filterDto.date_from) {
                whereClause.transaction_date[sequelize_1.Op.gte] = new Date(filterDto.date_from);
            }
            if (filterDto.date_to) {
                whereClause.transaction_date[sequelize_1.Op.lte] = new Date(filterDto.date_to);
            }
        }
        if (filterDto?.min_amount || filterDto?.max_amount) {
            whereClause.amount = {};
            if (filterDto.min_amount) {
                whereClause.amount[sequelize_1.Op.gte] = filterDto.min_amount;
            }
            if (filterDto.max_amount) {
                whereClause.amount[sequelize_1.Op.lte] = filterDto.max_amount;
            }
        }
        const { count, rows } = await this.db.repo.Transaction.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: this.db.repo.Consultant,
                    attributes: ['id', 'first_name', 'last_name', 'email'],
                },
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });
        return { transactions: rows, total: count };
    }
    async findById(id) {
        const transaction = await this.db.repo.Transaction.findByPk(id, {
            include: [
                {
                    model: this.db.repo.Consultant,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
                },
            ],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async findByUserId(userId, paginationDto) {
        const { page, limit, offset } = paginationDto;
        const { count, rows } = await this.db.repo.Transaction.findAndCountAll({
            where: { user_id: userId },
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });
        return { transactions: rows, total: count };
    }
    async updateStatus(id, status, notes) {
        const transaction = await this.findById(id);
        const updateData = {
            status,
            processed_at: new Date()
        };
        if (notes) {
            updateData.notes = notes;
        }
        await transaction.update(updateData);
        if (transaction.transaction_type === enums_1.TransactionType.WITHDRAWAL &&
            status === enums_1.TransactionStatus.COMPLETED &&
            transaction.status !== enums_1.TransactionStatus.COMPLETED) {
            await this.ConsultantService.updateBalance(transaction.user_id, -transaction.amount);
        }
        return transaction.reload();
    }
    async getStats(userId) {
        const whereClause = userId ? { user_id: userId } : {};
        const stats = await this.db.repo.Transaction.findAll({
            where: whereClause,
            attributes: [
                'transaction_type',
                'status',
                [this.db.repo.Transaction.sequelize.fn('COUNT', this.db.repo.Transaction.sequelize.col('id')), 'count'],
                [this.db.repo.Transaction.sequelize.fn('SUM', this.db.repo.Transaction.sequelize.col('amount')), 'total_amount'],
                [this.db.repo.Transaction.sequelize.fn('SUM', this.db.repo.Transaction.sequelize.col('net_amount')), 'total_net_amount'],
                [this.db.repo.Transaction.sequelize.fn('SUM', this.db.repo.Transaction.sequelize.col('fee')), 'total_fees'],
            ],
            group: ['transaction_type', 'status'],
        });
        const result = {
            total_transactions: 0,
            total_amount: 0,
            total_net_amount: 0,
            total_fees: 0,
            by_type: {},
            by_status: {},
        };
        stats.forEach((stat) => {
            const data = stat.get();
            const count = parseInt(data.count);
            const amount = parseFloat(data.total_amount) || 0;
            const netAmount = parseFloat(data.total_net_amount) || 0;
            const fees = parseFloat(data.total_fees) || 0;
            result.total_transactions += count;
            result.total_amount += amount;
            result.total_net_amount += netAmount;
            result.total_fees += fees;
            if (!result.by_type[data.transaction_type]) {
                result.by_type[data.transaction_type] = {
                    count: 0,
                    total_amount: 0,
                    total_net_amount: 0,
                    total_fees: 0,
                    by_status: {},
                };
            }
            result.by_type[data.transaction_type].count += count;
            result.by_type[data.transaction_type].total_amount += amount;
            result.by_type[data.transaction_type].total_net_amount += netAmount;
            result.by_type[data.transaction_type].total_fees += fees;
            result.by_type[data.transaction_type].by_status[data.status] = {
                count,
                total_amount: amount,
                total_net_amount: netAmount,
                total_fees: fees,
            };
            if (!result.by_status[data.status]) {
                result.by_status[data.status] = {
                    count: 0,
                    total_amount: 0,
                    total_net_amount: 0,
                    total_fees: 0,
                };
            }
            result.by_status[data.status].count += count;
            result.by_status[data.status].total_amount += amount;
            result.by_status[data.status].total_net_amount += netAmount;
            result.by_status[data.status].total_fees += fees;
        });
        return result;
    }
    async getMonthlyStats(year, userId) {
        const whereClause = {
            transaction_date: {
                [sequelize_1.Op.between]: [
                    new Date(`${year}-01-01`),
                    new Date(`${year}-12-31 23:59:59`)
                ]
            }
        };
        if (userId) {
            whereClause.user_id = userId;
        }
        const stats = await this.db.repo.Transaction.findAll({
            where: whereClause,
            attributes: [
                [this.db.repo.Transaction.sequelize.fn('EXTRACT', this.db.repo.Transaction.sequelize.literal('MONTH FROM transaction_date')), 'month'],
                'transaction_type',
                [this.db.repo.Transaction.sequelize.fn('COUNT', this.db.repo.Transaction.sequelize.col('id')), 'transactions'],
                [this.db.repo.Transaction.sequelize.fn('SUM', this.db.repo.Transaction.sequelize.col('amount')), 'total_amount'],
                [this.db.repo.Transaction.sequelize.fn('SUM', this.db.repo.Transaction.sequelize.col('net_amount')), 'net_amount'],
                [this.db.repo.Transaction.sequelize.fn('SUM', this.db.repo.Transaction.sequelize.col('fee')), 'fees'],
            ],
            group: [
                this.db.repo.Transaction.sequelize.fn('EXTRACT', this.db.repo.Transaction.sequelize.literal('MONTH FROM transaction_date')),
                'transaction_type'
            ],
            order: [[this.db.repo.Transaction.sequelize.fn('EXTRACT', this.db.repo.Transaction.sequelize.literal('MONTH FROM transaction_date')), 'ASC']],
        });
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            month_name: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
            total_transactions: 0,
            total_amount: 0,
            net_amount: 0,
            fees: 0,
            by_type: {},
        }));
        stats.forEach((stat) => {
            const data = stat.get();
            const monthIndex = parseInt(data.month) - 1;
            const transactions = parseInt(data.transactions);
            const totalAmount = parseFloat(data.total_amount) || 0;
            const netAmount = parseFloat(data.net_amount) || 0;
            const fees = parseFloat(data.fees) || 0;
            monthlyData[monthIndex].total_transactions += transactions;
            monthlyData[monthIndex].total_amount += totalAmount;
            monthlyData[monthIndex].net_amount += netAmount;
            monthlyData[monthIndex].fees += fees;
            if (!monthlyData[monthIndex].by_type[data.transaction_type]) {
                monthlyData[monthIndex].by_type[data.transaction_type] = {
                    transactions: 0,
                    total_amount: 0,
                    net_amount: 0,
                    fees: 0,
                };
            }
            monthlyData[monthIndex].by_type[data.transaction_type].transactions += transactions;
            monthlyData[monthIndex].by_type[data.transaction_type].total_amount += totalAmount;
            monthlyData[monthIndex].by_type[data.transaction_type].net_amount += netAmount;
            monthlyData[monthIndex].by_type[data.transaction_type].fees += fees;
        });
        return monthlyData;
    }
    async getPendingWithdrawals() {
        return this.db.repo.Transaction.findAll({
            where: {
                transaction_type: enums_1.TransactionType.WITHDRAWAL,
                status: enums_1.TransactionStatus.PENDING,
            },
            include: [
                {
                    model: this.db.repo.Consultant,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
                },
            ],
            order: [['created_at', 'ASC']],
        });
    }
    async processWithdrawal(id, approved, notes) {
        const transaction = await this.findById(id);
        if (transaction.transaction_type !== enums_1.TransactionType.WITHDRAWAL) {
            throw new common_1.BadRequestException('Transaction is not a withdrawal');
        }
        if (transaction.status !== enums_1.TransactionStatus.PENDING) {
            throw new common_1.BadRequestException('Transaction is not pending');
        }
        const newStatus = approved ? enums_1.TransactionStatus.COMPLETED : enums_1.TransactionStatus.FAILED;
        return this.updateStatus(id, newStatus, notes);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [global_db_service_1.GlobalDbService,
        sequelize_1.Sequelize,
        TransactionsService,
        consultant_service_1.ConsultantService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map