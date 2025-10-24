import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { CurrentUserInfo } from '../../../common/decorators/current-user.decorator';
import { JWT_SECRET_KEY } from '@/common/constants';
import { ConsultantService } from '@/modules/consultant/consultant.service';

const jwtExtractor = (req) => {
  let token = null;
  if (req?.headers) {
    const tokenParts = req.headers?.authorization?.split('Bearer ');
    if (tokenParts?.[1]) {
      token = tokenParts[1];
      global.jwtToken = token;
    }
  }

  // If no token in header, check URL query parameters
  if (!token && req?.query?.authorization) {
    token = req.query.authorization;
    global.jwtToken = token;
  }

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private consultantService: ConsultantService,
  ) {
    super({
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(payload: any): Promise<CurrentUserInfo> {
    const user = await this.consultantService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('User account is not active');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      level: user.level,
      status: user.status,
    };
  }
}
