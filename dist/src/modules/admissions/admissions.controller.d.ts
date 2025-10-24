import { AdmissionsService } from './admissions.service';
import { PaginationDto, ResponseDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CurrentUserInfo } from '../../common/decorators/current-user.decorator';
export declare class AdmissionsController {
    private readonly admissionsService;
    constructor(admissionsService: AdmissionsService);
    create(createAdmissionDto: any, user: any): Promise<any>;
    findAll(params: any): Promise<any>;
    getMyAdmissions(paginationDto: PaginationDto, user: CurrentUserInfo): Promise<ResponseDto<PaginatedResponseDto<unknown>>>;
    getStats(userId?: string): Promise<ResponseDto<any>>;
    getMyStats(user: CurrentUserInfo): Promise<ResponseDto<any>>;
    getMonthlyStats(year: number, userId?: string): Promise<ResponseDto<any>>;
    getTopCourses(limit?: number): Promise<ResponseDto<any>>;
    getTopPerformers(limit?: number): Promise<ResponseDto<any>>;
    findOne(id: string, user: CurrentUserInfo): Promise<ResponseDto<unknown>>;
    update(id: string, updateAdmissionDto: any, user: CurrentUserInfo): Promise<any>;
    remove(id: string): Promise<ResponseDto<any>>;
}
