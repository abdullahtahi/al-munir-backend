"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_KEYS = exports.JWT_CONSTANTS = exports.PAGINATION = exports.COMPLETION_RATES = exports.INCENTIVE_VALUES = exports.BONUS_RATES = exports.defaultStrategy = exports.JWT_SECRET_KEY = exports.LEVEL_REQUIREMENTS = void 0;
const enums_1 = require("../enums");
exports.LEVEL_REQUIREMENTS = {
    [enums_1.UserLevel.LEVEL_1]: {
        [enums_1.AdmissionType.SCHOOL]: 50,
        [enums_1.AdmissionType.ACADEMY]: 100,
        [enums_1.AdmissionType.TECHNICAL]: 30,
    },
    [enums_1.UserLevel.LEVEL_2]: {
        [enums_1.AdmissionType.SCHOOL]: 50,
        [enums_1.AdmissionType.ACADEMY]: 100,
        [enums_1.AdmissionType.TECHNICAL]: 30,
    },
    [enums_1.UserLevel.LEVEL_3]: {
        [enums_1.AdmissionType.SCHOOL]: 50,
        [enums_1.AdmissionType.ACADEMY]: 100,
        [enums_1.AdmissionType.TECHNICAL]: 30,
    },
    [enums_1.UserLevel.LEVEL_4]: {
        [enums_1.AdmissionType.SCHOOL]: 50,
        [enums_1.AdmissionType.ACADEMY]: 100,
        [enums_1.AdmissionType.TECHNICAL]: 30,
    },
};
exports.JWT_SECRET_KEY = 'your-super-secret-jwt-key-here-change-in-production';
exports.defaultStrategy = 'jwt';
exports.BONUS_RATES = {
    [enums_1.UserLevel.LEVEL_4]: {
        direct: 10,
    },
    [enums_1.UserLevel.LEVEL_3]: {
        direct: 15,
        indirect_level_1: 8,
    },
    [enums_1.UserLevel.LEVEL_2]: {
        direct: 20,
        indirect_level_1: 15,
        indirect_level_2: 5,
        indirect_level_3: 3,
        indirect_level_4: 1,
    },
    [enums_1.UserLevel.LEVEL_1]: {
        direct: 25,
        indirect_level_1: 8,
        indirect_level_2: 3,
        indirect_level_3: 2,
        indirect_level_4: 1,
    },
    [enums_1.UserLevel.MANAGER]: {
        direct: 30,
        indirect_level_1: 5,
        indirect_level_2: 3,
        indirect_level_3: 2,
        indirect_level_4: 1,
        global: 2,
    },
    [enums_1.UserLevel.SENIOR_MANAGER]: {
        direct: 30,
        indirect_level_1: 5,
        indirect_level_2: 3,
        indirect_level_3: 2,
        indirect_level_4: 1,
        global: 3,
    },
    [enums_1.UserLevel.AREA_MANAGER]: {
        direct: 30,
        indirect_level_1: 5,
        indirect_level_2: 3,
        indirect_level_3: 2,
        indirect_level_4: 1,
        global: 4,
    },
    [enums_1.UserLevel.SECTOR_HEAD]: {
        direct: 30,
        indirect_level_1: 5,
        indirect_level_2: 3,
        indirect_level_3: 2,
        indirect_level_4: 1,
        global: 4,
    },
};
exports.INCENTIVE_VALUES = {
    [enums_1.IncentiveType.COMPUTER]: 25000,
    [enums_1.IncentiveType.MOBILE]: 25000,
    [enums_1.IncentiveType.LAPTOP]: 25000,
    [enums_1.IncentiveType.CASH]: 5000,
};
exports.COMPLETION_RATES = {
    MIN_AREA_MANAGER: 70,
    PERFORMANCE_THRESHOLDS: [50, 60, 70, 80],
};
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};
exports.JWT_CONSTANTS = {
    SECRET: 'JWT_SECRET',
    EXPIRES_IN: 'JWT_EXPIRES_IN',
};
exports.CACHE_KEYS = {
    USER_PROFILE: 'user_profile',
    USER_TEAM: 'user_team',
    BONUS_CALCULATIONS: 'bonus_calculations',
};
//# sourceMappingURL=index.js.map