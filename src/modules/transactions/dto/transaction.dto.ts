import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '../../../common/enums';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Type of transaction', enum: TransactionType })
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @ApiProperty({ description: 'Transaction amount', example: 5000, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ description: 'Transaction fee', example: 50, minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fee?: number = 0;

  @ApiPropertyOptional({ description: 'Transaction status', enum: TransactionStatus, default: TransactionStatus.PENDING })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus = TransactionStatus.PENDING;

  @ApiPropertyOptional({ description: 'Reference ID for related entity', example: 'admission-123' })
  @IsOptional()
  @IsString()
  reference_id?: string;

  @ApiPropertyOptional({ description: 'Type of reference', example: 'admission' })
  @IsOptional()
  @IsString()
  reference_type?: string;

  @ApiPropertyOptional({ description: 'Transaction description', example: 'Withdrawal request' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Additional notes', example: 'Bank transfer to account xyz' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Payment method', example: 'bank_transfer' })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiPropertyOptional({ description: 'Payment details', example: 'Account: 1234567890, Bank: HBL' })
  @IsOptional()
  @IsString()
  payment_details?: string;
}

export class UpdateTransactionStatusDto {
  @ApiProperty({ description: 'New transaction status', enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiPropertyOptional({ description: 'Additional notes for status update' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ProcessWithdrawalDto {
  @ApiProperty({ description: 'Whether to approve the withdrawal', example: true })
  @IsNotEmpty()
  approved: boolean;

  @ApiPropertyOptional({ description: 'Processing notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class TransactionFilterDto {
  @IsOptional()
  @IsEnum(TransactionType)
  transaction_type?: TransactionType;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  date_from?: string;

  @IsOptional()
  @IsString()
  date_to?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  min_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  max_amount?: number;

  @IsOptional()
  @IsString()
  payment_method?: string;
}

export class WithdrawalRequestDto {
  @ApiProperty({ description: 'Withdrawal amount', example: 10000, minimum: 100 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(100)
  amount: number;

  @ApiProperty({ description: 'Payment method', example: 'bank_transfer' })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiProperty({ description: 'Payment details (account info)', example: 'Account: 1234567890, Bank: HBL, Name: John Doe' })
  @IsString()
  @IsNotEmpty()
  payment_details: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
