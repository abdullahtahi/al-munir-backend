import { Sequelize, Transaction } from "sequelize";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { ConsultantStatus, UserLevel, AdmissionType } from "../../common/enums";
import { Consultant } from "@/modules/consultant/consultant.entity";
import { GlobalDbService } from "../global-db/global-db.service";
export declare class ConsultantService {
    private readonly db;
    private readonly sequelize;
    constructor(db: GlobalDbService, sequelize: Sequelize);
    create(createUserDto: any): Promise<any>;
    findAll(params: any): Promise<any>;
    findById(id: number): Promise<Consultant | null>;
    findByEmail(email: string): Promise<Consultant | null>;
    findByPhone(phone: string): Promise<Consultant | null>;
    findByReferralCode(referralCode: string): Promise<Consultant | null>;
    update(id: number, updateUserDto: any): Promise<{
        message: string;
    }>;
    updatePassword(id: number, newPassword: string): Promise<void>;
    updateLastLogin(id: number): Promise<void>;
    updateStatus(id: number, status: ConsultantStatus): Promise<Consultant>;
    updateLevel(id: number, level: UserLevel): Promise<Consultant>;
    getTeamStructure(userId: number, depth?: number): Promise<any>;
    private buildTeamTree;
    getTeamStats(userId: number): Promise<any>;
    private getAllDownlines;
    searchUsers(query: string, paginationDto: PaginationDto): Promise<{
        users: any;
        total: any;
    }>;
    updateAdmissionCounts(userId: number, admissionType: AdmissionType): Promise<void>;
    updateBalance(user: any, amount: number, transaction?: Transaction): Promise<void>;
    remove(id: number): Promise<void>;
}
