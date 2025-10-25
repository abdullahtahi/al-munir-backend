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
exports.ConsultantService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const enums_1 = require("../../common/enums");
const helpers_1 = require("../../helpers");
const _ = require("lodash");
const constants_1 = require("../../constants");
const consultant_entity_1 = require("./consultant.entity");
const global_db_service_1 = require("../global-db/global-db.service");
let ConsultantService = class ConsultantService {
    constructor(db, sequelize) {
        this.db = db;
        this.sequelize = sequelize;
    }
    async create(createUserDto) {
        try {
            await this.sequelize.transaction(async (transaction) => {
                const { bankName, accountNumber, accountAddress, sponsorId, ...rest } = createUserDto;
                const bank = await this.db.repo.Bank.create({
                    name: bankName,
                    accountNumber,
                    accountAddress,
                }, { transaction });
                console.log("line 32", bank.id);
                if (bank.id) {
                    await this.db.repo.Consultant.create({
                        bankId: bank.id,
                        sponsorId: sponsorId == "" ? null : sponsorId,
                        ...rest,
                    }, { transaction });
                }
            });
            return {
                message: "Consultant Created Sucessfully",
            };
        }
        catch (error) {
            console.log("error", error);
            throw new common_1.BadRequestException((0, helpers_1.getErrorMessage)(error));
        }
    }
    async findAll(params) {
        let pagination = (0, helpers_1.getPaginationOptions)(params);
        let where = {};
        where.role = { [sequelize_1.Op.notIn]: [enums_1.UserRole.SUPER_ADMIN] };
        if (!_.isEmpty(params.userName)) {
            const namePattern = `%${params.userName}%`;
            where[sequelize_1.Op.and] = {
                [sequelize_1.Op.or]: [
                    { firstName: { [sequelize_1.Op.iLike]: namePattern } },
                    { lastName: { [sequelize_1.Op.iLike]: namePattern } },
                    this.sequelize.literal(`CONCAT("Consultant"."firstName", ' ', "Consultant"."lastName") ILIKE '${namePattern}'`),
                ],
            };
        }
        if (!_.isEmpty(params.sponsorId) && params.sponsorId !== "null") {
            where.sponsorId = params.sponsorId;
        }
        if (!_.isEmpty(params.status) && params.status !== "null") {
            where.status = params.status;
        }
        if (!_.isEmpty(params.cnic) && params.cnic !== "null") {
            where.cnic = { [sequelize_1.Op.like]: `%${params.cnic}%` };
        }
        const users = await this.db.repo.Consultant.scope(null).findAndCountAll({
            ...pagination,
            where,
            include: [
                {
                    model: this.db.repo.Bank,
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return users;
    }
    async findById(id) {
        return this.db.repo.Consultant.findByPk(id);
    }
    async findByEmail(email) {
        return this.db.repo.Consultant.findOne({
            where: { email },
        });
    }
    async findByPhone(phone) {
        return this.db.repo.Consultant.findOne({
            where: { phone },
        });
    }
    async findByReferralCode(referralCode) {
        return this.db.repo.Consultant.findOne({
            where: { referral_code: referralCode },
        });
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.findById(id);
            if (!user) {
                throw new common_1.NotFoundException("User not found");
            }
            const { password, bankName, accountNumber, accountAddress, bankId, sponsorId, ...rest } = updateUserDto;
            await this.sequelize.transaction(async (transaction) => {
                await this.db.repo.Bank.update({
                    name: bankName,
                    accountNumber: accountNumber,
                    accountAddress: accountAddress,
                }, {
                    where: {
                        id: bankId,
                    },
                }, { transaction });
                await this.db.repo.Consultant.update({
                    consultantId: sponsorId,
                    ...rest,
                }, {
                    where: {
                        id,
                    },
                }, { transaction });
            });
            return {
                message: "Updated SuccessFully",
            };
        }
        catch (error) {
            console.log("line 138", error);
            throw new common_1.BadRequestException(error);
        }
    }
    async updatePassword(id, newPassword) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        await user.update({ password: newPassword });
    }
    async updateLastLogin(id) {
        await this.db.repo.Consultant.update({ last_login: new Date() }, { where: { id } });
    }
    async updateStatus(id, status) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        await user.update({ status });
        return user.reload();
    }
    async updateLevel(id, level) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        await user.update({ level });
        return user.reload();
    }
    async getTeamStructure(userId, depth = 3) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return this.buildTeamTree(userId, depth);
    }
    async buildTeamTree(userId, depth, currentDepth = 0) {
        if (currentDepth >= depth) {
            return null;
        }
        const user = await this.db.repo.Consultant.findByPk(userId, {
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "level",
                "status",
                "total_admissions",
            ],
            include: [
                {
                    model: consultant_entity_1.Consultant,
                    as: "downlines",
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                        "email",
                        "level",
                        "status",
                    ],
                },
            ],
        });
        if (!user)
            return null;
        const children = [];
        if (user.downlines) {
            for (const downline of user.downlines) {
                const child = await this.buildTeamTree(downline.id, depth, currentDepth + 1);
                if (child) {
                    children.push(child);
                }
            }
        }
        return {
            ...user.toJSON(),
            children,
            depth: currentDepth,
        };
    }
    async getTeamStats(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const allDownlines = await this.getAllDownlines(userId);
        const stats = {
            total_team_members: allDownlines.length,
            active_members: allDownlines.filter((u) => u.status === enums_1.ConsultantStatus.ACTIVE).length,
            total_team_admissions: allDownlines.reduce((sum, u) => sum + u.totalAdmissions, 0),
            level_distribution: {},
            admission_type_distribution: {
                [enums_1.AdmissionType.SCHOOL]: 0,
                [enums_1.AdmissionType.ACADEMY]: 0,
                [enums_1.AdmissionType.TECHNICAL]: 0,
            },
        };
        allDownlines.forEach((user) => {
            const level = `level_${user.level}`;
            stats.level_distribution[level] =
                (stats.level_distribution[level] || 0) + 1;
        });
        allDownlines.forEach((user) => {
            stats.admission_type_distribution[enums_1.AdmissionType.SCHOOL] +=
                user.schoolAdmissions;
            stats.admission_type_distribution[enums_1.AdmissionType.ACADEMY] +=
                user.academyAdmissions;
            stats.admission_type_distribution[enums_1.AdmissionType.TECHNICAL] +=
                user.technicalAdmissions;
        });
        return stats;
    }
    async getAllDownlines(userId, collected = []) {
        const directDownlines = await this.db.repo.Consultant.findAll({
            where: { sponsorId: userId },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "level",
                "status",
                "school_admissions",
                "academy_admissions",
                "technical_admissions",
            ],
        });
        for (const downline of directDownlines) {
            if (!collected.find((u) => u.id === downline.id)) {
                collected.push(downline);
                await this.getAllDownlines(downline.id, collected);
            }
        }
        return collected;
    }
    async searchUsers(query, paginationDto) {
        const { page, limit, offset } = paginationDto;
        const whereClause = {
            [sequelize_1.Op.or]: [
                { first_name: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { last_name: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { phone: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { referral_code: { [sequelize_1.Op.iLike]: `%${query}%` } },
            ],
        };
        const { count, rows } = await this.db.repo.Consultant.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        return { users: rows, total: count };
    }
    async updateAdmissionCounts(userId, admissionType) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const updateData = {};
        switch (admissionType) {
            case enums_1.AdmissionType.SCHOOL:
                updateData.schoolAdmissions = user.schoolAdmissions + 1;
                break;
            case enums_1.AdmissionType.ACADEMY:
                updateData.academyAdmissions = user.academyAdmissions + 1;
                break;
            case enums_1.AdmissionType.TECHNICAL:
                updateData.technicalAdmissions = user.technicalAdmissions + 1;
                break;
        }
        await user.update(updateData);
    }
    async updateBalance(userId, amount, transaction) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const newTotalEarnings = parseFloat(user.totalEarnings.toString()) + amount;
        const newAvailableBalance = parseFloat(user.availableBalance.toString()) + amount;
        await user.update({
            total_earnings: newTotalEarnings,
            available_balance: newAvailableBalance,
        }, { transaction });
    }
    async remove(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        await user.update({
            status: enums_1.ConsultantStatus.INACTIVE,
            deletedAt: new Date(),
        });
    }
};
exports.ConsultantService = ConsultantService;
exports.ConsultantService = ConsultantService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [global_db_service_1.GlobalDbService,
        sequelize_1.Sequelize])
], ConsultantService);
//# sourceMappingURL=consultant.service.js.map