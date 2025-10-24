import { SetMetadata } from '@nestjs/common';
import { UserLevel } from '../enums';

export const LEVEL_KEY = 'level';
export const RequireLevel = (level: UserLevel) => SetMetadata(LEVEL_KEY, level);
