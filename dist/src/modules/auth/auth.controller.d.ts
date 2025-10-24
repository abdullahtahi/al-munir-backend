import { AuthService } from './auth.service';
import { CurrentUserInfo } from '../../common/decorators/current-user.decorator';
import { ResponseDto } from '../../common/dto/pagination.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: any): Promise<{
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            level: any;
            status: any;
        };
        accessToken: string;
        expiresIn: any;
    }>;
    register(registerDto: any): Promise<{
        user: any;
        message: string;
    }>;
    getProfile(req: any, user: CurrentUserInfo): Promise<import("../consultant/consultant.entity").Consultant>;
    changePassword(user: CurrentUserInfo, changePasswordDto: any): Promise<ResponseDto<any>>;
    forgotPassword(forgotPasswordDto: any): Promise<ResponseDto<{
        reset_token: string;
    }>>;
    resetPassword(resetPasswordDto: any): Promise<ResponseDto<any>>;
    logout(): Promise<ResponseDto<any>>;
}
