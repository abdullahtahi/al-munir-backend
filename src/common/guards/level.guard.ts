import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserLevel } from '../enums';
import { LEVEL_KEY } from '../decorators/level.decorator';

@Injectable()
export class LevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevel = this.reflector.getAllAndOverride<UserLevel>(
      LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredLevel === undefined) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      return false;
    }

    // Lower numbers mean higher levels (Level 1 > Level 4)
    return user.level <= requiredLevel;
  }
}
