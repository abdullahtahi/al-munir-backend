import { Sequelize } from 'sequelize';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { BonusesService } from '../bonuses/bonuses.service';
import { ConsultantService } from '../consultant/consultant.service';
import { GlobalDbService } from '../global-db/global-db.service';
import { Admissions } from './admissions.entity';
export declare class AdmissionsService {
    private readonly db;
    private readonly sequelize;
    private consultantService;
    private bonusesService;
    constructor(db: GlobalDbService, sequelize: Sequelize, consultantService: ConsultantService, bonusesService: BonusesService);
    create(createAdmissionDto: any, loginUser: any): Promise<any>;
    findAll(params: any): Promise<any>;
    findById(id: string): Promise<Admissions>;
    findByUserId(userId: string, paginationDto: PaginationDto): Promise<{
        admissions: any;
        total: any;
    }>;
    update(id: string, updateAdmissionDto: any): Promise<any>;
    remove(id: string): Promise<void>;
    getStats(userId?: string): Promise<any>;
    getMonthlyStats(year: number, userId?: string): Promise<any>;
    getTopCourses(limit?: number): Promise<any>;
    getTopPerformers(limit?: number): Promise<any>;
    private calculateCommission;
}
