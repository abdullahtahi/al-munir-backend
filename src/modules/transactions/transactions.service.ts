import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { CreateTransactionDto, TransactionFilterDto } from './dto/transaction.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { TransactionType, TransactionStatus } from '../../common/enums';
import { GlobalDbService } from '../global-db/global-db.service';
import { SEQUELIZE } from '@/constants';
import { ConsultantService } from '../consultant/consultant.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly db: GlobalDbService,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    private ConsultantService: ConsultantService,
  ) { }

  async create(userId: string, createTransactionDto: CreateTransactionDto): Promise<any> {
    // Verify user exists
    const user = await this.ConsultantService.findById(Number(userId));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // For withdrawals, check if user has sufficient balance
    if (createTransactionDto.transaction_type === TransactionType.WITHDRAWAL) {
      if (user.availableBalance < createTransactionDto.amount) {
        throw new BadRequestException('Insufficient balance');
      }
    }

    // Calculate net amount (amount - fee)
    const netAmount = createTransactionDto.amount - (createTransactionDto.fee || 0);

    const transaction = await this.db.repo.Transaction.create({
      user_id: userId,
      ...createTransactionDto,
      net_amount: netAmount,
    });

    // For completed withdrawals, update user balance
    if (createTransactionDto.transaction_type === TransactionType.WITHDRAWAL &&
      createTransactionDto.status === TransactionStatus.COMPLETED) {
      await this.ConsultantService.updateBalance(Number(userId), -createTransactionDto.amount);
    }

    return transaction;
  }

  async findAll(paginationDto: PaginationDto, filterDto?: TransactionFilterDto) {
    const { page, limit, offset } = paginationDto;
    const whereClause: any = {};

    // Apply filters
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
        whereClause.transaction_date[Op.gte] = new Date(filterDto.date_from);
      }
      if (filterDto.date_to) {
        whereClause.transaction_date[Op.lte] = new Date(filterDto.date_to);
      }
    }
    if (filterDto?.min_amount || filterDto?.max_amount) {
      whereClause.amount = {};
      if (filterDto.min_amount) {
        whereClause.amount[Op.gte] = filterDto.min_amount;
      }
      if (filterDto.max_amount) {
        whereClause.amount[Op.lte] = filterDto.max_amount;
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

  async findById(id: string): Promise<any> {
    const transaction = await this.db.repo.Transaction.findByPk(id, {
      include: [
        {
          model: this.db.repo.Consultant,
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
        },
      ],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async findByUserId(userId: string, paginationDto: PaginationDto) {
    const { page, limit, offset } = paginationDto;

    const { count, rows } = await this.db.repo.Transaction.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return { transactions: rows, total: count };
  }

  async updateStatus(id: string, status: TransactionStatus, notes?: string): Promise<any> {
    const transaction = await this.findById(id);

    const updateData: any = {
      status,
      processed_at: new Date()
    };

    if (notes) {
      updateData.notes = notes;
    }

    await transaction.update(updateData);

    // If this is a withdrawal being completed, update user balance
    if (transaction.transaction_type === TransactionType.WITHDRAWAL &&
      status === TransactionStatus.COMPLETED &&
      transaction.status !== TransactionStatus.COMPLETED) {
      await this.ConsultantService.updateBalance(transaction.user_id, -transaction.amount);
    }

    return transaction.reload();
  }

  async getStats(userId?: string): Promise<any> {
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

    stats.forEach((stat: any) => {
      const data = stat.get();
      const count = parseInt(data.count);
      const amount = parseFloat(data.total_amount) || 0;
      const netAmount = parseFloat(data.total_net_amount) || 0;
      const fees = parseFloat(data.total_fees) || 0;

      result.total_transactions += count;
      result.total_amount += amount;
      result.total_net_amount += netAmount;
      result.total_fees += fees;

      // Group by type
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

      // Group by status
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

  async getMonthlyStats(year: number, userId?: string): Promise<any> {
    const whereClause: any = {
      transaction_date: {
        [Op.between]: [
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

    stats.forEach((stat: any) => {
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

  async getPendingWithdrawals(): Promise<any[]> {
    return this.db.repo.Transaction.findAll({
      where: {
        transaction_type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
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

  async processWithdrawal(id: string, approved: boolean, notes?: string): Promise<any> {
    const transaction = await this.findById(id);

    if (transaction.transaction_type !== TransactionType.WITHDRAWAL) {
      throw new BadRequestException('Transaction is not a withdrawal');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    const newStatus = approved ? TransactionStatus.COMPLETED : TransactionStatus.FAILED;

    return this.updateStatus(id, newStatus, notes);
  }
}
