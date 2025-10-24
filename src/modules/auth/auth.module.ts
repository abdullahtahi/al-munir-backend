import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { defaultStrategy, JWT_SECRET_KEY } from '@/common/constants';
import { ConsultantModule } from '../consultant/consultant.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: defaultStrategy }),

    JwtModule.register({
      secret: JWT_SECRET_KEY
    }),
    ConsultantModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule { }
