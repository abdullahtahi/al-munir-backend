import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, ProcessWithdrawalDto, TransactionFilterDto, WithdrawalRequestDto } from './dto/transaction.dto';
import { PaginationDto, ResponseDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CurrentUserInfo } from '../../common/decorators/current-user.decorator';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto, user: CurrentUserInfo): Promise<ResponseDto<any>>;
    requestWithdrawal(withdrawalRequestDto: WithdrawalRequestDto, user: CurrentUserInfo): Promise<ResponseDto<any>>;
    findAll(paginationDto: PaginationDto, filterDto: TransactionFilterDto): Promise<ResponseDto<PaginatedResponseDto<unknown>>>;
    getMyTransactions(paginationDto: PaginationDto, user: CurrentUserInfo): Promise<ResponseDto<PaginatedResponseDto<unknown>>>;
    getStats(userId?: string): Promise<ResponseDto<any>>;
    getMyStats(user: CurrentUserInfo): Promise<ResponseDto<any>>;
    getMonthlyStats(year: number, userId?: string): Promise<ResponseDto<any>>;
    getPendingWithdrawals(): Promise<ResponseDto<any[]>>;
    findOne(id: string, user: CurrentUserInfo): Promise<ResponseDto<any>>;
    updateStatus(id: string, updateStatusDto: UpdateTransactionStatusDto): Promise<ResponseDto<any>>;
    processWithdrawal(id: string, processDto: ProcessWithdrawalDto): Promise<ResponseDto<any>>;
}
