"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = exports.ConsultantStatus = exports.IncentiveType = exports.BonusType = exports.AdmissionType = exports.UserLevel = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["SENIOR_MANAGER"] = "senior_manager";
    UserRole["AREA_MANAGER"] = "area_manager";
    UserRole["SECTOR_HEAD"] = "sector_head";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserLevel;
(function (UserLevel) {
    UserLevel[UserLevel["LEVEL_1"] = 1] = "LEVEL_1";
    UserLevel[UserLevel["LEVEL_2"] = 2] = "LEVEL_2";
    UserLevel[UserLevel["LEVEL_3"] = 3] = "LEVEL_3";
    UserLevel[UserLevel["LEVEL_4"] = 4] = "LEVEL_4";
    UserLevel[UserLevel["MANAGER"] = 5] = "MANAGER";
    UserLevel[UserLevel["SENIOR_MANAGER"] = 6] = "SENIOR_MANAGER";
    UserLevel[UserLevel["AREA_MANAGER"] = 7] = "AREA_MANAGER";
    UserLevel[UserLevel["SECTOR_HEAD"] = 8] = "SECTOR_HEAD";
})(UserLevel || (exports.UserLevel = UserLevel = {}));
var AdmissionType;
(function (AdmissionType) {
    AdmissionType["SCHOOL"] = "school";
    AdmissionType["ACADEMY"] = "academy";
    AdmissionType["TECHNICAL"] = "technical";
})(AdmissionType || (exports.AdmissionType = AdmissionType = {}));
var BonusType;
(function (BonusType) {
    BonusType["DIRECT"] = "direct";
    BonusType["INDIRECT_LEVEL_1"] = "indirect_level_1";
    BonusType["INDIRECT_LEVEL_2"] = "indirect_level_2";
    BonusType["INDIRECT_LEVEL_3"] = "indirect_level_3";
    BonusType["INDIRECT_LEVEL_4"] = "indirect_level_4";
    BonusType["GLOBAL"] = "global";
    BonusType["PROGRESSION"] = "progression";
})(BonusType || (exports.BonusType = BonusType = {}));
var IncentiveType;
(function (IncentiveType) {
    IncentiveType["COMPUTER"] = "computer";
    IncentiveType["MOBILE"] = "mobile";
    IncentiveType["LAPTOP"] = "laptop";
    IncentiveType["BIKE_CD70"] = "bike_cd70";
    IncentiveType["BIKE_HONDA_CD70"] = "bike_honda_cd70";
    IncentiveType["BIKE_HONDA_125"] = "bike_honda_125";
    IncentiveType["CAR"] = "car";
    IncentiveType["CASH"] = "cash";
})(IncentiveType || (exports.IncentiveType = IncentiveType = {}));
var ConsultantStatus;
(function (ConsultantStatus) {
    ConsultantStatus["ACTIVE"] = "active";
    ConsultantStatus["INACTIVE"] = "inactive";
    ConsultantStatus["SUSPENDED"] = "suspended";
    ConsultantStatus["PENDING"] = "pending";
})(ConsultantStatus || (exports.ConsultantStatus = ConsultantStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["BONUS_CREDIT"] = "bonus_credit";
    TransactionType["INCENTIVE_CREDIT"] = "incentive_credit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["PENALTY"] = "penalty";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
//# sourceMappingURL=index.js.map