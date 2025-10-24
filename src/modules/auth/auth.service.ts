import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConsultantService } from '../consultant/consultant.service';
import { ConsultantStatus } from '../../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private ConsultantService: ConsultantService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.ConsultantService.findByEmail(email);

    if (user && await user.validatePassword(password)) {
      if (user.status === ConsultantStatus.SUSPENDED) {
        throw new UnauthorizedException('Account suspended. Contact administrator.');
      }
      if (user.status === ConsultantStatus.INACTIVE) {
        throw new UnauthorizedException('Account inactive. Contact administrator.');
      }

      const { password: _, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async login(payload: any) {
    const findUser = await this.validateUser(payload.email, payload.password);
    if (findUser !== null) {
      const { password, ...user } = findUser
      return {
        user: {
          id: findUser.id,
          email: findUser.email,
          firstName: findUser.first_name,
          lastName: findUser.last_name,
          role: findUser.role,
          level: findUser.level,
          status: findUser.status,
        },
        accessToken: this.jwtService.sign(user),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
      };
    } else {
      throw new BadRequestException("Password is incorrect")
    }

  }

  async register(registerDto: any) {
    try {
      const userData = {
        ...registerDto,
        status: ConsultantStatus.PENDING,
      };
      const user = await this.ConsultantService.create(userData);
      return {
        user,
        message: "User Added"
      }
    }

    catch (error) {
      throw new BadRequestException(error);
    }
  }
  async profile(loginUser) {
    try {
      return await this.ConsultantService.findById(loginUser?.id);
    }

    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changePassword(userId: number, changePasswordDto: any): Promise<any> {
    const user = await this.ConsultantService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await user.validatePassword(changePasswordDto.currentPassword);
    if (!isValidPassword) {
      throw new BadRequestException('Current password is incorrect');
    }

    await this.ConsultantService.updatePassword(userId, changePasswordDto.newPassword);
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.ConsultantService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const payload = {
      sub: user.id,
      type: 'reset_password',
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
    };

    return this.jwtService.sign(payload);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'reset_password') {
        throw new BadRequestException('Invalid token');
      }

      await this.ConsultantService.updatePassword(payload.sub, newPassword);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
