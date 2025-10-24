import { Sequelize } from 'sequelize';
import { CreateTransactionDto, TransactionFilterDto } from './dto/transaction.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { TransactionStatus } from '../../common/enums';
import { GlobalDbService } from '../global-db/global-db.service';
import { ConsultantService } from '../consultant/consultant.service';
export declare class TransactionsService {
    private readonly db;
    private readonly sequelize;
    private transactionService;
    private ConsultantService;
    constructor(db: GlobalDbService, sequelize: Sequelize, transactionService: TransactionsService, ConsultantService: ConsultantService);
    create(userId: string, createTransactionDto: CreateTransactionDto): Promise<any>;
    findAll(paginationDto: PaginationDto, filterDto?: TransactionFilterDto): Promise<{
        transactions: any;
        total: any;
    }>;
    findById(id: string): Promise<any>;
    findByUserId(userId: string, paginationDto: PaginationDto): Promise<{
        transactions: any;
        total: any;
    }>;
    updateStatus(id: string, status: TransactionStatus, notes?: string): Promise<any>;
    getStats(userId?: string): Promise<any>;
    getMonthlyStats(year: number, userId?: string): Promise<any>;
    getPendingWithdrawals(): Promise<any[]>;
    processWithdrawal(id: string, approved: boolean, notes?: string): Promise<any>;
}
