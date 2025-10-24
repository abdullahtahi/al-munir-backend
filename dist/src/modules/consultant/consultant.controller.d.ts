import { ResponseDto, PaginatedResponseDto, SearchUsersDto } from '../../common/dto/pagination.dto';
import { CurrentUserInfo } from '../../common/decorators/current-user.decorator';
import { ConsultantService } from './consultant.service';
export declare class UsersController {
    private readonly consultantService;
    constructor(consultantService: ConsultantService);
    findAll(params: any): Promise<any>;
    search(dto: SearchUsersDto): Promise<ResponseDto<PaginatedResponseDto<unknown>>>;
    findOne(id: number): Promise<ResponseDto<import("./consultant.entity").Consultant>>;
    getTeamStructure(id: number, user: CurrentUserInfo, depth?: number): Promise<ResponseDto<any>>;
    getTeamStats(id: number, user: CurrentUserInfo): Promise<ResponseDto<any>>;
    updateProfile(user: CurrentUserInfo, updateUserDto: any): Promise<ResponseDto<{
        message: string;
    }>>;
    update(id: number, updateUserDto: any): Promise<{
        message: string;
    }>;
    updateStatus(id: number, updateStatusDto: any): Promise<ResponseDto<import("./consultant.entity").Consultant>>;
    updateLevel(id: number, updateLevelDto: any): Promise<ResponseDto<import("./consultant.entity").Consultant>>;
    remove(id: number): Promise<ResponseDto<any>>;
}
