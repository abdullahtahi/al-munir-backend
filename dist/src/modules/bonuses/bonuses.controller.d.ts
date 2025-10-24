import { BonusesService } from './bonuses.service';
import { PaginationDto, ResponseDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CurrentUserInfo } from '../../common/decorators/current-user.decorator';
export declare class BonusesController {
    private readonly bonusesService;
    constructor(bonusesService: BonusesService);
    getMyBonuses(paginationDto: PaginationDto, user: CurrentUserInfo): Promise<ResponseDto<PaginatedResponseDto<unknown>>>;
    getMyStats(user: CurrentUserInfo): Promise<ResponseDto<any>>;
    getUserBonuses(userId: string, paginationDto: PaginationDto): Promise<ResponseDto<PaginatedResponseDto<unknown>>>;
    getUserStats(userId: string): Promise<ResponseDto<any>>;
    getSystemStats(): Promise<ResponseDto<any>>;
    getMonthlyStats(year: number, userId?: string): Promise<ResponseDto<any>>;
    getTopEarners(limit?: number, period?: 'month' | 'year' | 'all'): Promise<ResponseDto<any>>;
    getTeamPerformance(userId: string, user: CurrentUserInfo): Promise<ResponseDto<any>>;
}
