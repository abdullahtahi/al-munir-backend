import { Model } from 'sequelize-typescript';
import { Admissions } from '../admissions/admissions.entity';
import { Consultant } from '../consultant/consultant.entity';
export declare class Transactions extends Model<Transactions> {
    id: number;
    consultantId?: number;
    admissionId?: number;
    transactionType: 'bonus_credit' | 'incentive_credit' | 'withdrawal' | 'penalty';
    amount: number;
    transactionDate: Date;
    fee: number;
    netAmount: number;
    paymentDetails?: string;
    referenceType?: string;
    description?: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    processedAt?: Date;
    notes?: string;
    paymentMethod?: string;
    metadata?: Record<string, any>;
    consultant?: Consultant;
    admission?: Admissions;
}
