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
exports.AdmissionsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const enums_1 = require("../../common/enums");
const bonuses_service_1 = require("../bonuses/bonuses.service");
const consultant_service_1 = require("../consultant/consultant.service");
const global_db_service_1 = require("../global-db/global-db.service");
const constants_1 = require("../../constants");
const moment = require("moment");
const _ = require("lodash");
const helpers_1 = require("../../helpers");
let AdmissionsService = class AdmissionsService {
    constructor(db, sequelize, consultantService, bonusesService) {
        this.db = db;
        this.sequelize = sequelize;
        this.consultantService = consultantService;
        this.bonusesService = bonusesService;
    }
    async create(createAdmissionDto, loginUser) {
        try {
            const result = await this.sequelize.transaction(async (transaction) => {
                const dependon = await this.db.repo.DependOn.create({
                    name: createAdmissionDto.name,
                    relation: createAdmissionDto.relation,
                    address: createAdmissionDto.address,
                }, { transaction });
                const student = await this.db.repo.Student.create({
                    studentName: createAdmissionDto.studentName,
                    gender: createAdmissionDto.gender,
                    phone: createAdmissionDto.phone,
                    residentNumber: createAdmissionDto.residentNumber,
                    profileImg: createAdmissionDto.profileImg,
                    birthCertificate: createAdmissionDto.birthCertificate,
                    schoolLeavingCertificate: createAdmissionDto.schoolLeavingCertificate,
                    fatherCnicImgFront: createAdmissionDto.fatherCnicImgFront,
                    fatherCnicImgBack: createAdmissionDto.fatherCnicImgBack,
                    dateOfBirth: createAdmissionDto.dateOfBirth,
                    fatherName: createAdmissionDto.fatherName,
                    fatherEducation: createAdmissionDto.fatherEducation,
                    fatherOccupation: createAdmissionDto.fatherOccupation,
                    fatherCnic: createAdmissionDto.fatherCnic,
                    motherName: createAdmissionDto.motherName,
                    motherEducation: createAdmissionDto.motherEducation,
                    motherOccupation: createAdmissionDto.motherOccupation,
                    motherCnic: createAdmissionDto.motherCnic,
                    permanentAddress: createAdmissionDto.permanentAddress,
                    secondaryAddress: createAdmissionDto.secondaryAddress,
                    admissionType: createAdmissionDto.admissionType,
                    feeAmount: createAdmissionDto.feeAmount,
                    commissionAmount: createAdmissionDto.commissionAmount,
                    admissionDate: createAdmissionDto.admissionDate,
                    admissionId: createAdmissionDto.admissionId,
                    status: createAdmissionDto.status,
                }, { transaction });
                if (!createAdmissionDto.commissionAmount) {
                    createAdmissionDto.commissionAmount = this.calculateCommission(createAdmissionDto.feeAmount, createAdmissionDto.admissionType);
                }
                const admission = await this.db.repo.Admission.create({
                    consultantId: createAdmissionDto?.sponsorId || null,
                    studentId: student.id,
                    dependOnId: dependon.id,
                    admissionInClass: createAdmissionDto.admissionInClass,
                    admissionType: createAdmissionDto.admissionType,
                    feeAmount: createAdmissionDto.feeAmount,
                    commissionAmount: Math.round(createAdmissionDto.commissionAmount || 0),
                    admissionDate: moment(createAdmissionDto.admissionDate).format('YYYY-MM-DD'),
                    admissionNumber: createAdmissionDto.admissionNumber,
                    status: createAdmissionDto.status,
                }, { include: [{ model: this.db.repo.Consultant }], transaction });
                if (createAdmissionDto?.consultantId) {
                    const consultant = await this.consultantService.findById(createAdmissionDto.consultantId);
                    if (consultant?.level) {
                        await this.consultantService.updateAdmissionCounts(createAdmissionDto.consultantId, createAdmissionDto.admissionType);
                    }
                    if (admission?.id) {
                        await this.bonusesService.calculateAndDistributeBonuses(admission.id);
                    }
                }
                return { message: "Admission created successfully", admission };
            });
            return result;
        }
        catch (error) {
            console.error("Admission creation failed:", error);
            throw new common_1.BadRequestException(error.message || "Failed to create admission");
        }
    }
    async findAll(params) {
        let pagination = (0, helpers_1.getPaginationOptions)(params);
        const where = {};
        const studentWhere = {};
        if (!_.isEmpty(params.studentName)) {
            studentWhere[sequelize_1.Op.and] = {
                studentName: { [sequelize_1.Op.iLike]: `%${params.studentName.trim()}%` }
            };
        }
        if (params?.admissionNumber) {
            where.admissionNumber = params.admissionNumber;
        }
        if (params?.admissionType) {
            where.admissionType = params.admissionType;
        }
        if (params?.consultantId) {
            where.consultantId = params.consultantId;
        }
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.admissionDateFrom && params?.admissionDateTo) {
            const dateFilter = {};
            if (params.admissionDateFrom) {
                dateFilter[sequelize_1.Op.gte] = moment(params.admissionDateFrom)
                    .startOf('day')
                    .toDate();
            }
            if (params.admissionDateTo) {
                dateFilter[sequelize_1.Op.lte] = moment(params.admissionDateTo)
                    .endOf('day')
                    .toDate();
            }
            where.admissionDate = dateFilter;
        }
        const admissions = await this.db.repo.Admission.findAndCountAll({
            where: where,
            include: [
                {
                    model: this.db.repo.Consultant,
                },
                {
                    model: this.db.repo.Student,
                    where: studentWhere
                },
                {
                    model: this.db.repo.DependOn,
                },
            ],
            ...pagination,
            order: [['createdAt', 'DESC']],
        });
        return admissions;
    }
    async findById(id) {
        const admission = await this.db.repo.Admission.findByPk(id, {
            include: [
                {
                    model: this.db.repo.Consultant,
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
                },
            ],
        });
        if (!admission) {
            throw new common_1.NotFoundException('Admission not found');
        }
        return admission;
    }
    async findByUserId(userId, paginationDto) {
        const { page, limit, offset } = paginationDto;
        const { count, rows } = await this.db.repo.Admission.findAndCountAll({
            where: { user_id: userId },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        return { admissions: rows, total: count };
    }
    async update(id, updateAdmissionDto) {
        try {
            const admission = await this.findById(id);
            await this.sequelize.transaction(async (transaction) => {
                await this.db.repo.DependOn.update({
                    name: updateAdmissionDto.name,
                    relation: updateAdmissionDto.relation,
                    address: updateAdmissionDto.address,
                }, {
                    where: { id: updateAdmissionDto?.dependOnId },
                    transaction,
                });
                await this.db.repo.Student.update({
                    studentName: updateAdmissionDto.studentName,
                    gender: updateAdmissionDto.gender,
                    phone: updateAdmissionDto.phone,
                    residentNumber: updateAdmissionDto.residentNumber,
                    profileImg: updateAdmissionDto.profileImg,
                    birthCertificate: updateAdmissionDto.birthCertificate,
                    schoolLeavingCertificate: updateAdmissionDto.schoolLeavingCertificate,
                    fatherCnicImgFront: updateAdmissionDto.fatherCnicImgFront,
                    fatherCnicImgBack: updateAdmissionDto.fatherCnicImgBack,
                    dateOfBirth: updateAdmissionDto.dateOfBirth,
                    fatherName: updateAdmissionDto.fatherName,
                    fatherEducation: updateAdmissionDto.fatherEducation,
                    fatherOccupation: updateAdmissionDto.fatherOccupation,
                    fatherCnic: updateAdmissionDto.fatherCnic,
                    motherName: updateAdmissionDto.motherName,
                    motherEducation: updateAdmissionDto.motherEducation,
                    motherOccupation: updateAdmissionDto.motherOccupation,
                    motherCnic: updateAdmissionDto.motherCnic,
                    permanentAddress: updateAdmissionDto.permanentAddress,
                    secondaryAddress: updateAdmissionDto.secondaryAddress,
                    admissionType: updateAdmissionDto.admissionType,
                    feeAmount: updateAdmissionDto.feeAmount,
                    commissionAmount: updateAdmissionDto.commissionAmount,
                    admissionDate: updateAdmissionDto.admissionDate,
                    admissionId: updateAdmissionDto.admissionId,
                    status: updateAdmissionDto.status,
                    updatedAt: new Date(),
                }, {
                    where: { id: updateAdmissionDto.studentId },
                    transaction,
                });
                if (updateAdmissionDto.feeAmount &&
                    updateAdmissionDto.feeAmount !== admission.feeAmount) {
                    updateAdmissionDto.commissionAmount = this.calculateCommission(updateAdmissionDto.feeAmount, updateAdmissionDto.admissionType || admission.admissionType);
                }
                await this.db.repo.Admission.update({
                    consultantId: updateAdmissionDto?.consultantId,
                    studentId: updateAdmissionDto?.studentId,
                    dependOnId: updateAdmissionDto?.dependOnId,
                    admissionInClass: updateAdmissionDto.admissionInClass,
                    admissionType: updateAdmissionDto.admissionType,
                    feeAmount: updateAdmissionDto.feeAmount,
                    commissionAmount: Math.round(updateAdmissionDto.commissionAmount || 0),
                    admissionDate: moment(updateAdmissionDto.admissionDate).format('YYYY-MM-DD'),
                    admissionNumber: updateAdmissionDto.admissionNumber,
                    status: updateAdmissionDto.status,
                }, {
                    where: { id },
                    transaction,
                });
            });
            return await this.findById(id);
        }
        catch (error) {
            console.log('error', error);
            throw new common_1.BadRequestException((0, helpers_1.getErrorMessage)(error));
        }
    }
    async remove(id) {
        const admission = await this.findById(id);
        await admission.destroy();
    }
    async getStats(userId) {
        const whereClause = userId ? { user_id: userId } : {};
        const stats = await this.db.repo.Admission.findAll({
            where: whereClause,
            attributes: [
                'admissionType',
                [this.db.repo.Admission.sequelize.fn('COUNT', this.db.repo.Admission.sequelize.col('id')), 'count'],
                [this.db.repo.Admission.sequelize.fn('SUM', this.db.repo.Admission.sequelize.col('fee_amount')), 'total_fees'],
                [this.db.repo.Admission.sequelize.fn('SUM', this.db.repo.Admission.sequelize.col('commission_amount')), 'total_commissions'],
            ],
            group: ['admissionType'],
        });
        const result = {
            total_admissions: 0,
            school_admissions: 0,
            academy_admissions: 0,
            technical_admissions: 0,
            total_fees: 0,
            total_commissions: 0,
            by_type: {},
        };
        stats.forEach((stat) => {
            const data = stat.get();
            const count = parseInt(data.count);
            const fees = parseFloat(data.total_fees) || 0;
            const commissions = parseFloat(data.total_commissions) || 0;
            result.total_admissions += count;
            result.total_fees += fees;
            result.total_commissions += commissions;
            switch (data.admissionType) {
                case enums_1.AdmissionType.SCHOOL:
                    result.school_admissions += count;
                    break;
                case enums_1.AdmissionType.ACADEMY:
                    result.academy_admissions += count;
                    break;
                case enums_1.AdmissionType.TECHNICAL:
                    result.technical_admissions += count;
                    break;
            }
            result.by_type[data.admissionType] = {
                count,
                total_fees: fees,
                total_commissions: commissions,
            };
        });
        return result;
    }
    async getMonthlyStats(year, userId) {
        const whereClause = {
            admission_date: {
                [sequelize_1.Op.between]: [
                    new Date(`${year}-01-01`),
                    new Date(`${year}-12-31 23:59:59`)
                ]
            }
        };
        if (userId) {
            whereClause.user_id = userId;
        }
        const stats = await this.db.repo.Admission.findAll({
            where: whereClause,
            attributes: [
                [this.db.repo.Admission.sequelize.fn('EXTRACT', this.db.repo.Admission.sequelize.literal('MONTH FROM admission_date')), 'month'],
                [this.db.repo.Admission.sequelize.fn('COUNT', this.db.repo.Admission.sequelize.col('id')), 'admissions'],
                [this.db.repo.Admission.sequelize.fn('SUM', this.db.repo.Admission.sequelize.col('fee_amount')), 'fees'],
                [this.db.repo.Admission.sequelize.fn('SUM', this.db.repo.Admission.sequelize.col('commission_amount')), 'commissions'],
            ],
            group: [this.db.repo.Admission.sequelize.fn('EXTRACT', this.db.repo.Admission.sequelize.literal('MONTH FROM admission_date'))],
            order: [[this.db.repo.Admission.sequelize.fn('EXTRACT', this.db.repo.Admission.sequelize.literal('MONTH FROM admission_date')), 'ASC']],
        });
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            month_name: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
            admissions: 0,
            fees: 0,
            commissions: 0,
        }));
        stats.forEach((stat) => {
            const data = stat.get();
            const monthIndex = parseInt(data.month) - 1;
            monthlyData[monthIndex] = {
                ...monthlyData[monthIndex],
                admissions: parseInt(data.admissions),
                fees: parseFloat(data.fees) || 0,
                commissions: parseFloat(data.commissions) || 0,
            };
        });
        return monthlyData;
    }
    async getTopCourses(limit = 10) {
        const courses = await this.db.repo.Admission.findAll({
            attributes: [
                'course_name',
                'admissionType',
                [this.db.repo.Admission.sequelize.fn('COUNT', this.db.repo.Admission.sequelize.col('id')), 'count'],
                [this.db.repo.Admission.sequelize.fn('SUM', this.db.repo.Admission.sequelize.col('fee_amount')), 'total_fees'],
                [this.db.repo.Admission.sequelize.fn('AVG', this.db.repo.Admission.sequelize.col('fee_amount')), 'avg_fee'],
            ],
            group: ['course_name', 'admissionType'],
            order: [[this.db.repo.Admission.sequelize.fn('COUNT', this.db.repo.Admission.sequelize.col('id')), 'DESC']],
            limit,
        });
        return courses.map(course => {
            const data = course.get();
            return {
                course_name: data.course_name,
                admissionType: data.admissionType,
                count: parseInt(data.count),
                total_fees: parseFloat(data.total_fees) || 0,
                avg_fee: parseFloat(data.avg_fee) || 0,
            };
        });
    }
    async getTopPerformers(limit = 10) {
        const performers = await this.db.repo.Admission.findAll({
            attributes: [
                'user_id',
                [this.db.repo.Admission.sequelize.fn('COUNT', this.db.repo.Admission.sequelize.col('Admission.id')), 'admissions'],
                [this.db.repo.Admission.sequelize.fn('SUM', this.db.repo.Admission.sequelize.col('fee_amount')), 'total_fees'],
                [this.db.repo.Admission.sequelize.fn('SUM', this.db.repo.Admission.sequelize.col('commission_amount')), 'total_commissions'],
            ],
            include: [
                {
                    model: this.db.repo.Consultant,
                    attributes: ['firstName', 'lastName', 'email', 'level'],
                },
            ],
            group: ['user_id', 'user.id'],
            order: [[this.db.repo.Admission.sequelize.fn('COUNT', this.db.repo.Admission.sequelize.col('Admission.id')), 'DESC']],
            limit,
        });
        return performers.map(performer => {
            const data = performer.get();
            return {
                user_id: data.user_id,
                user_name: `${data.user.firstName} ${data.user.lastName}`,
                email: data.user.email,
                level: data.user.level,
                admissions: parseInt(data.admissions),
                total_fees: parseFloat(data.total_fees) || 0,
                total_commissions: parseFloat(data.total_commissions) || 0,
            };
        });
    }
    calculateCommission(feeAmount, admissionType) {
        const commissionRates = {
            [enums_1.AdmissionType.SCHOOL]: 0.15,
            [enums_1.AdmissionType.ACADEMY]: 0.12,
            [enums_1.AdmissionType.TECHNICAL]: 0.20,
        };
        return feeAmount * (commissionRates[admissionType] || 0.15);
    }
};
exports.AdmissionsService = AdmissionsService;
exports.AdmissionsService = AdmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [global_db_service_1.GlobalDbService,
        sequelize_1.Sequelize,
        consultant_service_1.ConsultantService,
        bonuses_service_1.BonusesService])
], AdmissionsService);
//# sourceMappingURL=admissions.service.js.map