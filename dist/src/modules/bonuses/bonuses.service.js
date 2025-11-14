"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BonusesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const enums_1 = require("../../common/enums");
const constants_1 = require("../../common/constants");
const consultant_service_1 = require("../consultant/consultant.service");
const global_db_service_1 = require("../global-db/global-db.service");
const constants_2 = require("../../constants");
const helpers_1 = require("../../helpers");
const _ = require("lodash");
let BonusesService = class BonusesService {
    constructor(db, consultantService) {
        this.db = db;
        this.consultantService = consultantService;
    }
    async calculateAndDistributeBonuses(admission, transaction) {
        try {
            await this.calculateDirectBonus(admission, transaction);
            await this.calculateIndirectBonuses(admission, transaction);
            await this.calculateGlobalBonuses(admission, transaction);
        }
        catch (error) {
            console.error("Bonus calculation error: 1122", error);
            throw error;
        }
    }
    async calculateDirectBonus(admission, transaction) {
        const consultant = await this.db.repo.Consultant.findOne({
            where: {
                id: admission?.consultantId,
            },
        });
        const user = consultant;
        const bonusRates = constants_1.BONUS_RATES[user.level];
        if (!bonusRates || !bonusRates.direct) {
            return;
        }
        const bonusAmount = (admission.feeAmount * bonusRates.direct) / 100;
        await this.db.repo.Bonus.create({
            consultantId: user?.dataValues?.id,
            fromConsultantId: user?.dataValues?.id,
            bonusType: enums_1.BonusType.DIRECT,
            amount: bonusAmount,
            percentage: bonusRates.direct,
            baseAmount: admission.feeAmount,
            admissionId: admission.id,
            referenceType: "admission",
            description: `Direct bonus for ${admission.admissionType} admission`,
            status: "completed",
            processedAt: new Date(),
        }, { transaction });
        await this.updateBalance(user, bonusAmount, transaction);
        await this.db.repo.Transactions.create({
            consultantId: user.id,
            transactionType: enums_1.TransactionType.BONUS_CREDIT,
            amount: bonusAmount,
            netAmount: bonusAmount,
            admissionId: admission.id,
            referenceType: "admission_bonus",
            description: `Direct bonus for ${admission.admissionInClass} admission`,
            status: "completed",
            processedAt: new Date(),
        }, { transaction });
    }
    async updateBalance(user, amount, transaction) {
        const newTotalEarnings = Math.floor(Number(user.totalEarnings || 0) + Number(amount || 0));
        const newAvailableBalance = Math.floor(Number(user.availableBalance || 0) + Number(amount || 0));
        console.log({
            totalEarnings: newTotalEarnings,
            availableBalance: newAvailableBalance,
        });
        await this.db.repo.Consultant.update({
            totalEarnings: newTotalEarnings,
            availableBalance: newAvailableBalance,
        }, {
            where: {
                id: user.id,
            },
        }, { transaction });
    }
    async calculateIndirectBonuses(admission, transaction) {
        const directConsultant = await this.db.repo.Consultant.findByPk(admission.consultantId);
        if (!directConsultant) {
            return;
        }
        let currentSponsorId = directConsultant.sponsorId;
        let level = 1;
        const maxLevels = 4;
        while (level <= maxLevels && currentSponsorId) {
            const sponsor = await this.db.repo.Consultant.findByPk(currentSponsorId);
            if (!sponsor) {
                break;
            }
            const bonusRates = constants_1.BONUS_RATES[sponsor.level];
            const bonusKey = this.getIndirectBonusKey(level);
            if (bonusRates && bonusRates[bonusKey]) {
                const bonusAmount = Number((admission.feeAmount * bonusRates[bonusKey]) / 100 || 0);
                console.log(`Level ${level} indirect bonus for sponsor ${sponsor.id}:`, bonusAmount);
                await this.db.repo.Bonus.create({
                    consultantId: sponsor.id,
                    fromConsultantId: directConsultant.id,
                    bonusType: this.getBonusType(level),
                    amount: bonusAmount,
                    percentage: bonusRates[bonusKey],
                    baseAmount: admission.feeAmount,
                    levelDepth: level,
                    admissionId: admission.id,
                    referenceType: "admission",
                    description: `Level ${level} indirect bonus from ${directConsultant.firstName} ${directConsultant.lastName}`,
                    status: "completed",
                    processedAt: new Date(),
                }, { transaction });
                await this.updateBalance(sponsor, bonusAmount, transaction);
                await this.db.repo.Transactions.create({
                    consultantId: sponsor.id,
                    transactionType: enums_1.TransactionType.BONUS_CREDIT,
                    amount: bonusAmount,
                    netAmount: bonusAmount,
                    admissionId: admission.id,
                    referenceType: "team_bonus",
                    description: `Level ${level} team bonus from ${directConsultant.firstName} ${directConsultant.lastName}`,
                    status: "completed",
                    processedAt: new Date(),
                }, { transaction });
            }
            currentSponsorId = sponsor.sponsorId;
            level++;
        }
    }
    async calculateGlobalBonuses(admission, transaction) {
        const eligibleUsers = await this.db.repo.Consultant.findAll({
            where: {
                level: {
                    [sequelize_1.Op.in]: [5, 6, 7, 8],
                },
                status: "active",
            },
        });
        for (const user of eligibleUsers) {
            const bonusRates = constants_1.BONUS_RATES[user.level];
            if (bonusRates && bonusRates.global) {
                const bonusAmount = (admission.feeAmount * bonusRates.global) / 100;
                await this.db.repo.Bonus.create({
                    consultantId: user.id,
                    fromConsultantId: admission.consultantId,
                    bonusType: enums_1.BonusType.GLOBAL,
                    amount: bonusAmount,
                    percentage: bonusRates.global,
                    baseAmount: admission.feeAmount,
                    admissionId: admission.id,
                    referenceType: "admission",
                    description: `Global bonus for ${admission.admissionType} admission`,
                    status: "completed",
                    processedAt: new Date(),
                }, { transaction });
                await this.updateBalance(user, bonusAmount, transaction);
                await this.db.repo.Transactions.create({
                    consultantId: user.id,
                    transactionType: enums_1.TransactionType.BONUS_CREDIT,
                    amount: bonusAmount,
                    netAmount: bonusAmount,
                    admissionId: admission.id,
                    referenceType: "global_bonus",
                    description: `Global bonus from company performance`,
                    status: "completed",
                    processedAt: new Date(),
                }, { transaction });
            }
        }
    }
    getIndirectBonusKey(level) {
        switch (level) {
            case 1:
                return "indirect_level_1";
            case 2:
                return "indirect_level_2";
            case 3:
                return "indirect_level_3";
            case 4:
                return "indirect_level_4";
            default:
                return "";
        }
    }
    getBonusType(level) {
        switch (level) {
            case 1:
                return enums_1.BonusType.INDIRECT_LEVEL_1;
            case 2:
                return enums_1.BonusType.INDIRECT_LEVEL_2;
            case 3:
                return enums_1.BonusType.INDIRECT_LEVEL_3;
            case 4:
                return enums_1.BonusType.INDIRECT_LEVEL_4;
            default:
                return enums_1.BonusType.INDIRECT_LEVEL_1;
        }
    }
    async getUserBonuses(userId, pagination) {
        const { count, rows } = await this.db.repo.Bonus.findAndCountAll({
            where: { user_id: userId },
            include: [
                {
                    model: this.db.repo.Consultant,
                    as: "fromUser",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
            ],
            order: [["created_at", "DESC"]],
            limit: pagination?.limit || 10,
            offset: pagination?.offset || 0,
        });
        return { bonuses: rows, total: count };
    }
    async getUserBonusStats(userId) {
        const bonuses = await this.db.repo.Bonus.findAll({
            where: { user_id: userId },
            attributes: [
                "bonus_type",
                [
                    this.db.repo.Bonus.sequelize.fn("COUNT", this.db.repo.Bonus.sequelize.col("id")),
                    "count",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("SUM", this.db.repo.Bonus.sequelize.col("amount")),
                    "total_amount",
                ],
            ],
            group: ["bonus_type"],
        });
        const stats = {
            total_bonuses: 0,
            total_amount: 0,
            by_type: {},
        };
        bonuses.forEach((bonus) => {
            const bonusData = bonus.get();
            stats.total_bonuses += parseInt(bonusData.count);
            stats.total_amount += parseFloat(bonusData.total_amount);
            stats.by_type[bonusData.bonus_type] = {
                count: parseInt(bonusData.count),
                amount: parseFloat(bonusData.total_amount),
            };
        });
        return stats;
    }
    async processProgressionBonus(userId, oldLevel, newLevel) {
        const progressionBonus = this.calculateProgressionBonusAmount(oldLevel, newLevel);
        if (progressionBonus > 0) {
            const transaction = await this.db.repo.Bonus.sequelize.transaction();
            try {
                await this.db.repo.Bonus.create({
                    user_id: userId,
                    from_user_id: userId,
                    bonus_type: enums_1.BonusType.PROGRESSION,
                    amount: progressionBonus,
                    percentage: 5,
                    base_amount: progressionBonus,
                    description: `Progression bonus for advancing from Level ${oldLevel} to Level ${newLevel}`,
                    status: "completed",
                    processed_at: new Date(),
                }, { transaction });
                await this.consultantService.updateBalance(Number(userId), progressionBonus, transaction);
                await this.db.repo.transaction.create({
                    user_id: userId,
                    transaction_type: enums_1.TransactionType.BONUS_CREDIT,
                    amount: progressionBonus,
                    net_amount: progressionBonus,
                    reference_type: "progression",
                    description: `Level progression bonus: ${oldLevel} → ${newLevel}`,
                    status: "completed",
                    processed_at: new Date(),
                }, { transaction });
                await transaction.commit();
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
    }
    calculateProgressionBonusAmount(oldLevel, newLevel) {
        const bonusAmounts = {
            "4_to_3": 5000,
            "3_to_2": 10000,
            "2_to_1": 15000,
            "1_to_manager": 25000,
            manager_to_senior: 35000,
            senior_to_area: 50000,
            area_to_sector: 75000,
        };
        const key = `${oldLevel}_to_${newLevel}`;
        return bonusAmounts[key] || 0;
    }
    async getSystemBonusStats() {
        const stats = await this.db.repo.Bonus.findAll({
            attributes: [
                "bonus_type",
                [
                    this.db.repo.Bonus.sequelize.fn("COUNT", this.db.repo.Bonus.sequelize.col("id")),
                    "count",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("SUM", this.db.repo.Bonus.sequelize.col("amount")),
                    "total_amount",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("AVG", this.db.repo.Bonus.sequelize.col("amount")),
                    "avg_amount",
                ],
            ],
            group: ["bonus_type"],
        });
        const totalStats = await this.db.repo.Bonus.findOne({
            attributes: [
                [
                    this.db.repo.Bonus.sequelize.fn("COUNT", this.db.repo.Bonus.sequelize.col("id")),
                    "total_bonuses",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("SUM", this.db.repo.Bonus.sequelize.col("amount")),
                    "total_amount",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("AVG", this.db.repo.Bonus.sequelize.col("amount")),
                    "avg_amount",
                ],
            ],
        });
        const result = {
            total_bonuses: parseInt(totalStats.get().total_bonuses) || 0,
            total_amount: parseFloat(totalStats.get().total_amount) || 0,
            avg_amount: parseFloat(totalStats.get().avg_amount) || 0,
            by_type: {},
        };
        stats.forEach((stat) => {
            const data = stat.get();
            result.by_type[data.bonus_type] = {
                count: parseInt(data.count),
                total_amount: parseFloat(data.total_amount),
                avg_amount: parseFloat(data.avg_amount),
            };
        });
        return result;
    }
    async getMonthlyBonusStats(year, userId) {
        const whereClause = {
            earned_date: {
                [sequelize_1.Op.between]: [
                    new Date(`${year}-01-01`),
                    new Date(`${year}-12-31 23:59:59`),
                ],
            },
        };
        if (userId) {
            whereClause.user_id = userId;
        }
        const stats = await this.db.repo.Bonus.findAll({
            where: whereClause,
            attributes: [
                [
                    this.db.repo.Bonus.sequelize.fn("EXTRACT", this.db.repo.Bonus.sequelize.literal("MONTH FROM earned_date")),
                    "month",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("COUNT", this.db.repo.Bonus.sequelize.col("id")),
                    "bonuses",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("SUM", this.db.repo.Bonus.sequelize.col("amount")),
                    "total_amount",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("AVG", this.db.repo.Bonus.sequelize.col("amount")),
                    "avg_amount",
                ],
            ],
            group: [
                this.db.repo.Bonus.sequelize.fn("EXTRACT", this.db.repo.Bonus.sequelize.literal("MONTH FROM earned_date")),
            ],
            order: [
                [
                    this.db.repo.Bonus.sequelize.fn("EXTRACT", this.db.repo.Bonus.sequelize.literal("MONTH FROM earned_date")),
                    "ASC",
                ],
            ],
        });
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            month_name: new Date(2000, i, 1).toLocaleString("default", {
                month: "long",
            }),
            bonuses: 0,
            total_amount: 0,
            avg_amount: 0,
        }));
        stats.forEach((stat) => {
            const data = stat.get();
            const monthIndex = parseInt(data.month) - 1;
            monthlyData[monthIndex] = {
                ...monthlyData[monthIndex],
                bonuses: parseInt(data.bonuses),
                total_amount: parseFloat(data.total_amount) || 0,
                avg_amount: parseFloat(data.avg_amount) || 0,
            };
        });
        return monthlyData;
    }
    async getTopBonusEarners(limit = 10, period = "month") {
        let whereClause = {};
        if (period === "month") {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            whereClause = {
                earned_date: {
                    [sequelize_1.Op.between]: [startOfMonth, endOfMonth],
                },
            };
        }
        else if (period === "year") {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
            whereClause = {
                earned_date: {
                    [sequelize_1.Op.between]: [startOfYear, endOfYear],
                },
            };
        }
        const earners = await this.db.repo.Bonus.findAll({
            where: whereClause,
            attributes: [
                "user_id",
                [
                    this.db.repo.Bonus.sequelize.fn("COUNT", this.db.repo.Bonus.sequelize.col("Bonus.id")),
                    "total_bonuses",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("SUM", this.db.repo.Bonus.sequelize.col("amount")),
                    "total_amount",
                ],
                [
                    this.db.repo.Bonus.sequelize.fn("AVG", this.db.repo.Bonus.sequelize.col("amount")),
                    "avg_amount",
                ],
            ],
            include: [
                {
                    model: this.db.repo.Consultant,
                    attributes: ["first_name", "last_name", "email", "level"],
                },
            ],
            group: ["user_id", "user.id"],
            order: [
                [
                    this.db.repo.Bonus.sequelize.fn("SUM", this.db.repo.Bonus.sequelize.col("amount")),
                    "DESC",
                ],
            ],
            limit,
        });
        return earners.map((earner) => {
            const data = earner.get();
            return {
                user_id: data.user_id,
                user_name: `${data.user.first_name} ${data.user.last_name}`,
                email: data.user.email,
                level: data.user.level,
                total_bonuses: parseInt(data.total_bonuses),
                total_amount: parseFloat(data.total_amount) || 0,
                avg_amount: parseFloat(data.avg_amount) || 0,
            };
        });
    }
    async getTeamBonusPerformance(userId) {
        const directDownlines = await this.db.repo.Consultant.findAll({
            where: { sponsor_id: userId },
            attributes: ["id", "first_name", "last_name", "email", "level"],
        });
        const teamPerformance = [];
        for (const downline of directDownlines) {
            const bonusStats = await this.getUserBonusStats(downline.id);
            teamPerformance.push({
                user_id: downline.id,
                user_name: `${downline.first_name} ${downline.last_name}`,
                email: downline.email,
                level: downline.level,
                ...bonusStats,
            });
        }
        teamPerformance.sort((a, b) => b.total_amount - a.total_amount);
        return {
            team_size: directDownlines.length,
            team_members: teamPerformance,
            team_totals: {
                total_bonuses: teamPerformance.reduce((sum, member) => sum + member.total_bonuses, 0),
                total_amount: teamPerformance.reduce((sum, member) => sum + member.total_amount, 0),
            },
        };
    }
    async findAll(params, user) {
        let pagination = (0, helpers_1.getPaginationOptions)(params);
        let where = {};
        let admissionWhere = {};
        let studentWhere = {};
        let userWhere = {};
        if (!_.isEmpty(params.studentName)) {
            studentWhere[sequelize_1.Op.and] = {
                studentName: { [sequelize_1.Op.iLike]: `%${params.studentName.trim()}%` },
            };
        }
        if (params?.admissionNumber) {
            admissionWhere.admissionNumber = params.admissionNumber;
        }
        if (params?.admissionType) {
            admissionWhere.admissionType = params.admissionType;
        }
        if (params?.consultantId) {
            userWhere.id = params.consultantId;
        }
        try {
            const bonus = await this.db.repo.Bonus.findAndCountAll({
                where,
                include: [
                    { model: this.db.repo.Consultant, as: 'fkConsultant' },
                    { model: this.db.repo.Consultant, as: 'fkFromConsultant' },
                    {
                        model: this.db.repo.Admission,
                        required: true,
                        where: admissionWhere,
                        include: [{
                                model: this.db.repo.Student,
                                where: studentWhere
                            }],
                        as: "admission",
                    },
                    {
                        model: this.db.repo.Consultant,
                        required: true,
                        as: "fkConsultant",
                        where: userWhere,
                    },
                ],
            });
            return bonus;
        }
        catch (error) {
            console.log("error", error);
            throw new common_1.BadRequestException((0, helpers_1.getErrorMessage)(error));
        }
    }
};
exports.BonusesService = BonusesService;
exports.BonusesService = BonusesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_2.SEQUELIZE)),
    __metadata("design:paramtypes", [global_db_service_1.GlobalDbService,
        consultant_service_1.ConsultantService])
], BonusesService);
//# sourceMappingURL=bonuses.service.js.map