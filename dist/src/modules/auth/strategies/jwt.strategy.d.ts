import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { CurrentUserInfo } from '../../../common/decorators/current-user.decorator';
import { ConsultantService } from '@/modules/consultant/consultant.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private consultantService;
    constructor(configService: ConfigService, consultantService: ConsultantService);
    validate(payload: any): Promise<CurrentUserInfo>;
}
export {};
