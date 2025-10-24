import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
  ProcessWithdrawalDto,
  TransactionFilterDto,
  WithdrawalRequestDto
} from './dto/transaction.dto';
import { PaginationDto, ResponseDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CurrentUser, CurrentUserInfo } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole, TransactionType, TransactionStatus } from '../../common/enums';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create new transaction (Admin only)' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: CurrentUserInfo,
  ) {
    const transaction = await this.transactionsService.create(String(user.id), createTransactionDto);
    return ResponseDto.success(transaction, 'Transaction created successfully');
  }

  @Post('withdrawal-request')
  @ApiOperation({ summary: 'Request withdrawal from available balance' })
  @ApiResponse({ status: 201, description: 'Withdrawal request submitted successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient balance or invalid request' })
  async requestWithdrawal(
    @Body() withdrawalRequestDto: WithdrawalRequestDto,
    @CurrentUser() user: CurrentUserInfo,
  ) {
    const transactionDto: CreateTransactionDto = {
      transaction_type: TransactionType.WITHDRAWAL,
      amount: withdrawalRequestDto.amount,
      description: `Withdrawal request - ${withdrawalRequestDto.payment_method}`,
      notes: withdrawalRequestDto.notes,
      payment_method: withdrawalRequestDto.payment_method,
      payment_details: withdrawalRequestDto.payment_details,
      status: TransactionStatus.PENDING,
    };

    const transaction = await this.transactionsService.create(String(user.id), transactionDto);
    return ResponseDto.success(transaction, 'Withdrawal request submitted successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions with filtering and pagination (Admin/Manager only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'transaction_type', required: false, enum: ['bonus_credit', 'incentive_credit', 'withdrawal', 'penalty'] })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'completed', 'failed', 'cancelled'] })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: TransactionFilterDto,
  ) {
    const { transactions, total } = await this.transactionsService.findAll(paginationDto, filterDto);
    const result = new PaginatedResponseDto(transactions, total, paginationDto.page, paginationDto.limit);
    return ResponseDto.success(result, 'Transactions retrieved successfully');
  }

  @Get('my-transactions')
  @ApiOperation({ summary: 'Get current user transactions' })
  @ApiResponse({ status: 200, description: 'User transactions retrieved successfully' })
  async getMyTransactions(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: CurrentUserInfo,
  ) {
    const { transactions, total } = await this.transactionsService.findByUserId(String(user.id), paginationDto);
    const result = new PaginatedResponseDto(transactions, total, paginationDto.page, paginationDto.limit);
    return ResponseDto.success(result, 'Your transactions retrieved successfully');
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get transaction statistics (Admin/Manager only)' })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getStats(@Query('user_id') userId?: string) {
    const stats = await this.transactionsService.getStats(userId);
    return ResponseDto.success(stats, 'Statistics retrieved successfully');
  }

  @Get('my-stats')
  @ApiOperation({ summary: 'Get current user transaction statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  async getMyStats(@CurrentUser() user: CurrentUserInfo) {
    const stats = await this.transactionsService.getStats(String(user.id));
    return ResponseDto.success(stats, 'Your statistics retrieved successfully');
  }

  @Get('monthly-stats/:year')
  @ApiOperation({ summary: 'Get monthly transaction statistics for a year' })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Monthly statistics retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  async getMonthlyStats(
    @Param('year') year: number,
    @Query('user_id') userId?: string,
  ) {
    const stats = await this.transactionsService.getMonthlyStats(year, userId);
    return ResponseDto.success(stats, 'Monthly statistics retrieved successfully');
  }

  @Get('pending-withdrawals')
  @ApiOperation({ summary: 'Get pending withdrawal requests (Admin only)' })
  @ApiResponse({ status: 200, description: 'Pending withdrawals retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async getPendingWithdrawals() {
    const withdrawals = await this.transactionsService.getPendingWithdrawals();
    return ResponseDto.success(withdrawals, 'Pending withdrawals retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserInfo) {
    const transaction = await this.transactionsService.findById(id);

    // Users can only view their own transactions unless they're admin/manager
    if (transaction.user_id !== user.id && ![UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(user.role as UserRole)) {
      return ResponseDto.error('Access denied');
    }

    return ResponseDto.success(transaction, 'Transaction retrieved successfully');
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update transaction status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Transaction status updated successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTransactionStatusDto,
  ) {
    const transaction = await this.transactionsService.updateStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.notes
    );
    return ResponseDto.success(transaction, 'Transaction status updated successfully');
  }

  @Patch(':id/process-withdrawal')
  @ApiOperation({ summary: 'Process withdrawal request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Withdrawal processed successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Invalid withdrawal request' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async processWithdrawal(
    @Param('id') id: string,
    @Body() processDto: ProcessWithdrawalDto,
  ) {
    const transaction = await this.transactionsService.processWithdrawal(
      id,
      processDto.approved,
      processDto.notes
    );
    return ResponseDto.success(
      transaction,
      `Withdrawal ${processDto.approved ? 'approved' : 'rejected'} successfully`
    );
  }
}
