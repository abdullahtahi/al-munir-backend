export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SENIOR_MANAGER = 'senior_manager',
  AREA_MANAGER = 'area_manager',
  SECTOR_HEAD = 'sector_head',
  USER = 'user',
}

export enum UserLevel {
  LEVEL_1 = 1,// Entry level
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  MANAGER = 5,
  SENIOR_MANAGER = 6,
  AREA_MANAGER = 7,
  SECTOR_HEAD = 8,
}

export enum AdmissionType {
  SCHOOL = 'school',
  ACADEMY = 'academy',
  TECHNICAL = 'technical',
}

export enum BonusType {
  DIRECT = 'direct',
  INDIRECT_LEVEL_1 = 'indirect_level_1',
  INDIRECT_LEVEL_2 = 'indirect_level_2',
  INDIRECT_LEVEL_3 = 'indirect_level_3',
  INDIRECT_LEVEL_4 = 'indirect_level_4',
  GLOBAL = 'global',
  PROGRESSION = 'progression',
}

export enum IncentiveType {
  COMPUTER = 'computer',
  MOBILE = 'mobile',
  LAPTOP = 'laptop',
  BIKE_CD70 = 'bike_cd70',
  BIKE_HONDA_CD70 = 'bike_honda_cd70',
  BIKE_HONDA_125 = 'bike_honda_125',
  CAR = 'car',
  CASH = 'cash',
}

export enum ConsultantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum TransactionType {
  BONUS_CREDIT = 'bonus_credit',
  INCENTIVE_CREDIT = 'incentive_credit',
  WITHDRAWAL = 'withdrawal',
  PENALTY = 'penalty',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
