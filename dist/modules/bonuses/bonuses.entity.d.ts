import { Model } from 'sequelize-typescript';
import { Consultant } from '../consultant/consultant.entity';
export declare enum BonusType {
    DIRECT = "direct",
    INDIRECT_LEVEL_1 = "indirect_level_1",
    INDIRECT_LEVEL_2 = "indirect_level_2",
    INDIRECT_LEVEL_3 = "indirect_level_3",
    INDIRECT_LEVEL_4 = "indirect_level_4",
    GLOBAL = "global",
    PROGRESSION = "progression"
}
export declare enum BonusStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Bonus extends Model<Bonus> {
    id: number;
    consultantId?: number;
    consultant?: Consultant;
    fromConsultantId?: number;
    fromConsultant?: Consultant;
    bonusType: BonusType;
    amount: string;
    percentage?: string;
    baseAmount: string;
    levelDepth?: number;
    admissionId?: number;
    referenceType?: string;
    description?: string;
    status: BonusStatus;
    earnedDate: Date;
    processedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
