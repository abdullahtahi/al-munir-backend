import { ConsultantService } from '../consultant/consultant.service';
import { GlobalDbService } from '../global-db/global-db.service';
export declare class BonusesService {
    private readonly db;
    private consultantService;
    constructor(db: GlobalDbService, consultantService: ConsultantService);
    calculateAndDistributeBonuses(admissionId: string): Promise<void>;
    private calculateDirectBonus;
    private calculateIndirectBonuses;
    private calculateGlobalBonuses;
    private getIndirectBonusKey;
    private getBonusType;
    getUserBonuses(userId: string, pagination?: any): Promise<{
        bonuses: any;
        total: any;
    }>;
    getUserBonusStats(userId: string): Promise<any>;
    processProgressionBonus(userId: string, oldLevel: number, newLevel: number): Promise<void>;
    private calculateProgressionBonusAmount;
    getSystemBonusStats(): Promise<any>;
    getMonthlyBonusStats(year: number, userId?: string): Promise<any>;
    getTopBonusEarners(limit?: number, period?: 'month' | 'year' | 'all'): Promise<any>;
    getTeamBonusPerformance(userId: string): Promise<any>;
}
