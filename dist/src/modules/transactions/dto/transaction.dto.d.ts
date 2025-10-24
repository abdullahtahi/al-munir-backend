import { TransactionType, TransactionStatus } from '../../../common/enums';
export declare class CreateTransactionDto {
    transaction_type: TransactionType;
    amount: number;
    fee?: number;
    status?: TransactionStatus;
    reference_id?: string;
    reference_type?: string;
    description?: string;
    notes?: string;
    payment_method?: string;
    payment_details?: string;
}
export declare class UpdateTransactionStatusDto {
    status: TransactionStatus;
    notes?: string;
}
export declare class ProcessWithdrawalDto {
    approved: boolean;
    notes?: string;
}
export declare class TransactionFilterDto {
    transaction_type?: TransactionType;
    user_id?: string;
    status?: TransactionStatus;
    date_from?: string;
    date_to?: string;
    min_amount?: number;
    max_amount?: number;
    payment_method?: string;
}
export declare class WithdrawalRequestDto {
    amount: number;
    payment_method: string;
    payment_details: string;
    notes?: string;
}
