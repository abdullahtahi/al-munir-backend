import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConsultantService } from '../consultant/consultant.service';
export declare class AuthService {
    private ConsultantService;
    private jwtService;
    private configService;
    constructor(ConsultantService: ConsultantService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(payload: any): Promise<{
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
    profile(loginUser: any): Promise<import("../consultant/consultant.entity").Consultant>;
    changePassword(userId: number, changePasswordDto: any): Promise<any>;
    generatePasswordResetToken(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
