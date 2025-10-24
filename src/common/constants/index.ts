import { UserLevel, AdmissionType, IncentiveType } from '../enums';

export const LEVEL_REQUIREMENTS = {
  [UserLevel.LEVEL_1]: {
    [AdmissionType.SCHOOL]: 50,
    [AdmissionType.ACADEMY]: 100,
    [AdmissionType.TECHNICAL]: 30,
  },
  [UserLevel.LEVEL_2]: {
    [AdmissionType.SCHOOL]: 50,
    [AdmissionType.ACADEMY]: 100,
    [AdmissionType.TECHNICAL]: 30,
  },
  [UserLevel.LEVEL_3]: {
    [AdmissionType.SCHOOL]: 50,
    [AdmissionType.ACADEMY]: 100,
    [AdmissionType.TECHNICAL]: 30,
  },
  [UserLevel.LEVEL_4]: {
    [AdmissionType.SCHOOL]: 50,
    [AdmissionType.ACADEMY]: 100,
    [AdmissionType.TECHNICAL]: 30,
  },
};

export const JWT_SECRET_KEY = 'your-super-secret-jwt-key-here-change-in-production'
export const defaultStrategy = 'jwt'
export const BONUS_RATES = {
  [UserLevel.LEVEL_4]: {
    direct: 10,
  },
  [UserLevel.LEVEL_3]: {
    direct: 15,
    indirect_level_1: 8,
  },
  [UserLevel.LEVEL_2]: {
    direct: 20,
    indirect_level_1: 15,
    indirect_level_2: 5,
    indirect_level_3: 3,
    indirect_level_4: 1,

  },
  [UserLevel.LEVEL_1]: {
    direct: 25,
    indirect_level_1: 8,
    indirect_level_2: 3,
    indirect_level_3: 2,
    indirect_level_4: 1,

  },
  [UserLevel.MANAGER]: {
    direct: 30,
    indirect_level_1: 5,
    indirect_level_2: 3,
    indirect_level_3: 2,
    indirect_level_4: 1,
    global: 2,
  },
  [UserLevel.SENIOR_MANAGER]: {
    direct: 30,
    indirect_level_1: 5,
    indirect_level_2: 3,
    indirect_level_3: 2,
    indirect_level_4: 1,
    global: 3,
  },
  [UserLevel.AREA_MANAGER]: {
    direct: 30,
    indirect_level_1: 5,
    indirect_level_2: 3,
    indirect_level_3: 2,
    indirect_level_4: 1,
    global: 4,
  },
  [UserLevel.SECTOR_HEAD]: {
    direct: 30,
    indirect_level_1: 5,
    indirect_level_2: 3,
    indirect_level_3: 2,
    indirect_level_4: 1,
    global: 4,
  },
};

export const INCENTIVE_VALUES = {
  [IncentiveType.COMPUTER]: 25000,
  [IncentiveType.MOBILE]: 25000,
  [IncentiveType.LAPTOP]: 25000,
  [IncentiveType.CASH]: 5000,
};

export const COMPLETION_RATES = {
  MIN_AREA_MANAGER: 70,
  PERFORMANCE_THRESHOLDS: [50, 60, 70, 80],
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const JWT_CONSTANTS = {
  SECRET: 'JWT_SECRET',
  EXPIRES_IN: 'JWT_EXPIRES_IN',
};

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_TEAM: 'user_team',
  BONUS_CALCULATIONS: 'bonus_calculations',
};
