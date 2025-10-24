import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { BonusType, AdmissionType, TransactionType } from '../../common/enums';
import { BONUS_RATES } from '../../common/constants';
import { ConsultantService } from '../consultant/consultant.service';
import { TransactionsService } from '../transactions/transactions.service';
import { GlobalDbService } from '../global-db/global-db.service';
import { SEQUELIZE } from '@/constants';

@Injectable()
export class BonusesService {
    constructor(
        private readonly db: GlobalDbService,
        @Inject(SEQUELIZE)
        private consultantService: ConsultantService,
    ) { }

    async calculateAndDistributeBonuses(admissionId: string): Promise<void> {
        const admission = await this.db.repo.Admission.findByPk(admissionId, {
            include: [{ model: this.db.repo.Consultant, }],
        }) as any;

        if (!admission) {
            throw new Error('Admission not found');
        }

        const transaction = await this.db.repo.Consultant.sequelize.transaction();

        try {
            // Calculate direct bonus
            await this.calculateDirectBonus(admission, transaction);

            // Calculate indirect bonuses (team bonuses)
            await this.calculateIndirectBonuses(admission, transaction);

            // Calculate global bonuses for managers
            await this.calculateGlobalBonuses(admission, transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    private async calculateDirectBonus(admission: any, transaction: any): Promise<void> {
        const user = admission.user;
        const bonusRates = BONUS_RATES[user.level];

        if (!bonusRates || !bonusRates.direct) {
            return;
        }

        const bonusAmount = (admission.fee_amount * bonusRates.direct) / 100;

        // Create bonus record
        await this.db.repo.Bonus.create({
            user_id: user.id,
            from_user_id: user.id,
            bonus_type: BonusType.DIRECT,
            amount: bonusAmount,
            percentage: bonusRates.direct,
            base_amount: admission.fee_amount,
            reference_id: admission.id,
            reference_type: 'admission',
            description: `Direct bonus for ${admission.admission_type} admission`,
            status: 'completed',
            processed_at: new Date(),
        }, { transaction });

        // Update user balance
        await this.consultantService.updateBalance(user.id, bonusAmount, transaction);

        // Create transaction record
        await this.db.repo.transaction.create({
            user_id: user.id,
            transaction_type: TransactionType.BONUS_CREDIT,
            amount: bonusAmount,
            net_amount: bonusAmount,
            reference_id: admission.id,
            reference_type: 'admission_bonus',
            description: `Direct bonus for ${admission.course_name} admission`,
            status: 'completed',
            processed_at: new Date(),
        }, { transaction });
    }

    private async calculateIndirectBonuses(admission: any, transaction: any): Promise<void> {
        const directUser = admission.user;
        let currentUser = directUser;
        let level = 1;
        const maxLevels = 4;

        while (level <= maxLevels && currentUser.sponsor_id) {
            const sponsor = await this.db.repo.Consultant.findByPk(currentUser.sponsor_id);

            if (!sponsor) {
                break;
            }

            const bonusRates = BONUS_RATES[sponsor.level];
            const bonusKey = this.getIndirectBonusKey(level);

            if (bonusRates && bonusRates[bonusKey]) {
                const bonusAmount = (admission.fee_amount * bonusRates[bonusKey]) / 100;

                // Create bonus record
                await this.db.repo.Bonus.create({
                    user_id: sponsor.id,
                    from_user_id: directUser.id,
                    bonus_type: this.getBonusType(level),
                    amount: bonusAmount,
                    percentage: bonusRates[bonusKey],
                    base_amount: admission.fee_amount,
                    level_depth: level,
                    reference_id: admission.id,
                    reference_type: 'admission',
                    description: `Level ${level} indirect bonus from ${directUser.first_name} ${directUser.last_name}`,
                    status: 'completed',
                    processed_at: new Date(),
                }, { transaction });

                // Update sponsor balance
                await this.consultantService.updateBalance(sponsor.id, bonusAmount, transaction);

                // Create transaction record
                await this.db.repo.transaction.create({
                    user_id: sponsor.id,
                    transaction_type: TransactionType.BONUS_CREDIT,
                    amount: bonusAmount,
                    net_amount: bonusAmount,
                    reference_id: admission.id,
                    reference_type: 'team_bonus',
                    description: `Level ${level} team bonus from ${directUser.first_name} ${directUser.last_name}`,
                    status: 'completed',
                    processed_at: new Date(),
                }, { transaction });
            }

            currentUser = sponsor;
            level++;
        }
    }

    private async calculateGlobalBonuses(admission: any, transaction: any): Promise<void> {
        // Get all managers and above who are eligible for global bonuses
        const eligibleUsers = await this.db.repo.Consultant.findAll({
            where: {
                level: {
                    [Op.in]: [5, 6, 7, 8], // Manager, Senior Manager, Area Manager, Sector Head
                },
                status: 'active',
            },
        });

        for (const user of eligibleUsers) {
            const bonusRates = BONUS_RATES[user.level] as any;

            if (bonusRates && bonusRates.global) {
                const bonusAmount = (admission.fee_amount * bonusRates.global) / 100;

                // Create bonus record
                await this.db.repo.Bonus.create({
                    user_id: user.id,
                    from_user_id: admission.user.id,
                    bonus_type: BonusType.GLOBAL,
                    amount: bonusAmount,
                    percentage: bonusRates.global,
                    base_amount: admission.fee_amount,
                    reference_id: admission.id,
                    reference_type: 'admission',
                    description: `Global bonus for ${admission.admission_type} admission`,
                    status: 'completed',
                    processed_at: new Date(),
                }, { transaction });

                // Update user balance
                await this.consultantService.updateBalance(user.id, bonusAmount, transaction);

                // Create transaction record
                await this.db.repo.transaction.create({
                    user_id: user.id,
                    transaction_type: TransactionType.BONUS_CREDIT,
                    amount: bonusAmount,
                    net_amount: bonusAmount,
                    reference_id: admission.id,
                    reference_type: 'global_bonus',
                    description: `Global bonus from company performance`,
                    status: 'completed',
                    processed_at: new Date(),
                }, { transaction });
            }
        }
    }

    private getIndirectBonusKey(level: number): string {
        switch (level) {
            case 1: return 'indirect_level_1';
            case 2: return 'indirect_level_2';
            case 3: return 'indirect_level_3';
            case 4: return 'indirect_level_4';
            default: return '';
        }
    }

    private getBonusType(level: number): BonusType {
        switch (level) {
            case 1: return BonusType.INDIRECT_LEVEL_1;
            case 2: return BonusType.INDIRECT_LEVEL_2;
            case 3: return BonusType.INDIRECT_LEVEL_3;
            case 4: return BonusType.INDIRECT_LEVEL_4;
            default: return BonusType.INDIRECT_LEVEL_1;
        }
    }

    async getUserBonuses(userId: string, pagination?: any) {
        const { count, rows } = await this.db.repo.Bonus.findAndCountAll({
            where: { user_id: userId },
            include: [
                {
                    model: this.db.repo.Consultant,
                    as: 'fromUser',
                    attributes: ['id', 'first_name', 'last_name', 'email'],
                },
            ],
            order: [['created_at', 'DESC']],
            limit: pagination?.limit || 10,
            offset: pagination?.offset || 0,
        });

        return { bonuses: rows, total: count };
    }

    async getUserBonusStats(userId: string): Promise<any> {
        const bonuses = await this.db.repo.Bonus.findAll({
            where: { user_id: userId },
            attributes: [
                'bonus_type',
                [this.db.repo.Bonus.sequelize.fn('COUNT', this.db.repo.Bonus.sequelize.col('id')), 'count'],
                [this.db.repo.Bonus.sequelize.fn('SUM', this.db.repo.Bonus.sequelize.col('amount')), 'total_amount'],
            ],
            group: ['bonus_type'],
        });

        const stats = {
            total_bonuses: 0,
            total_amount: 0,
            by_type: {},
        };

        bonuses.forEach((bonus: any) => {
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

    async processProgressionBonus(userId: string, oldLevel: number, newLevel: number): Promise<void> {
        // Calculate progression bonus based on level advancement
        const progressionBonus = this.calculateProgressionBonusAmount(oldLevel, newLevel);

        if (progressionBonus > 0) {
            const transaction = await this.db.repo.Bonus.sequelize.transaction();

            try {
                // Create bonus record
                await this.db.repo.Bonus.create({
                    user_id: userId,
                    from_user_id: userId,
                    bonus_type: BonusType.PROGRESSION,
                    amount: progressionBonus,
                    percentage: 5, // 5% progression bonus
                    base_amount: progressionBonus,
                    description: `Progression bonus for advancing from Level ${oldLevel} to Level ${newLevel}`,
                    status: 'completed',
                    processed_at: new Date(),
                }, { transaction });

                // Update user balance
                await this.consultantService.updateBalance(Number(userId), progressionBonus, transaction);

                // Create transaction record
                await this.db.repo.transaction.create({
                    user_id: userId,
                    transaction_type: TransactionType.BONUS_CREDIT,
                    amount: progressionBonus,
                    net_amount: progressionBonus,
                    reference_type: 'progression',
                    description: `Level progression bonus: ${oldLevel} → ${newLevel}`,
                    status: 'completed',
                    processed_at: new Date(),
                }, { transaction });

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
    }

    private calculateProgressionBonusAmount(oldLevel: number, newLevel: number): number {
        // Define progression bonus amounts based on level advancement
        const bonusAmounts = {
            '4_to_3': 5000,
            '3_to_2': 10000,
            '2_to_1': 15000,
            '1_to_manager': 25000,
            'manager_to_senior': 35000,
            'senior_to_area': 50000,
            'area_to_sector': 75000,
        };

        const key = `${oldLevel}_to_${newLevel}`;
        return bonusAmounts[key] || 0;
    }

    async getSystemBonusStats(): Promise<any> {
        const stats = await this.db.repo.Bonus.findAll({
            attributes: [
                'bonus_type',
                [this.db.repo.Bonus.sequelize.fn('COUNT', this.db.repo.Bonus.sequelize.col('id')), 'count'],
                [this.db.repo.Bonus.sequelize.fn('SUM', this.db.repo.Bonus.sequelize.col('amount')), 'total_amount'],
                [this.db.repo.Bonus.sequelize.fn('AVG', this.db.repo.Bonus.sequelize.col('amount')), 'avg_amount'],
            ],
            group: ['bonus_type'],
        });

        const totalStats = await this.db.repo.Bonus.findOne({
            attributes: [
                [this.db.repo.Bonus.sequelize.fn('COUNT', this.db.repo.Bonus.sequelize.col('id')), 'total_bonuses'],
                [this.db.repo.Bonus.sequelize.fn('SUM', this.db.repo.Bonus.sequelize.col('amount')), 'total_amount'],
                [this.db.repo.Bonus.sequelize.fn('AVG', this.db.repo.Bonus.sequelize.col('amount')), 'avg_amount'],
            ],
        });

        const result = {
            total_bonuses: parseInt((totalStats as any).get().total_bonuses) || 0,
            total_amount: parseFloat((totalStats as any).get().total_amount) || 0,
            avg_amount: parseFloat((totalStats as any).get().avg_amount) || 0,
            by_type: {},
        };

        stats.forEach((stat: any) => {
            const data = stat.get();
            result.by_type[data.bonus_type] = {
                count: parseInt(data.count),
                total_amount: parseFloat(data.total_amount),
                avg_amount: parseFloat(data.avg_amount),
            };
        });

        return result;
    }

    async getMonthlyBonusStats(year: number, userId?: string): Promise<any> {
        const whereClause: any = {
            earned_date: {
                [Op.between]: [
                    new Date(`${year}-01-01`),
                    new Date(`${year}-12-31 23:59:59`)
                ]
            }
        };

        if (userId) {
            whereClause.user_id = userId;
        }

        const stats = await this.db.repo.Bonus.findAll({
            where: whereClause,
            attributes: [
                [this.db.repo.Bonus.sequelize.fn('EXTRACT', this.db.repo.Bonus.sequelize.literal('MONTH FROM earned_date')), 'month'],
                [this.db.repo.Bonus.sequelize.fn('COUNT', this.db.repo.Bonus.sequelize.col('id')), 'bonuses'],
                [this.db.repo.Bonus.sequelize.fn('SUM', this.db.repo.Bonus.sequelize.col('amount')), 'total_amount'],
                [this.db.repo.Bonus.sequelize.fn('AVG', this.db.repo.Bonus.sequelize.col('amount')), 'avg_amount'],
            ],
            group: [this.db.repo.Bonus.sequelize.fn('EXTRACT', this.db.repo.Bonus.sequelize.literal('MONTH FROM earned_date'))],
            order: [[this.db.repo.Bonus.sequelize.fn('EXTRACT', this.db.repo.Bonus.sequelize.literal('MONTH FROM earned_date')), 'ASC']],
        });

        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            month_name: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
            bonuses: 0,
            total_amount: 0,
            avg_amount: 0,
        }));

        stats.forEach((stat: any) => {
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

    async getTopBonusEarners(limit: number = 10, period: 'month' | 'year' | 'all' = 'month'): Promise<any> {
        let whereClause = {};

        if (period === 'month') {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            whereClause = {
                earned_date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            };
        } else if (period === 'year') {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
            whereClause = {
                earned_date: {
                    [Op.between]: [startOfYear, endOfYear]
                }
            };
        }

        const earners = await this.db.repo.Bonus.findAll({
            where: whereClause,
            attributes: [
                'user_id',
                [this.db.repo.Bonus.sequelize.fn('COUNT', this.db.repo.Bonus.sequelize.col('Bonus.id')), 'total_bonuses'],
                [this.db.repo.Bonus.sequelize.fn('SUM', this.db.repo.Bonus.sequelize.col('amount')), 'total_amount'],
                [this.db.repo.Bonus.sequelize.fn('AVG', this.db.repo.Bonus.sequelize.col('amount')), 'avg_amount'],
            ],
            include: [
                {
                    model: this.db.repo.Consultant,
                    attributes: ['first_name', 'last_name', 'email', 'level'],
                },
            ],
            group: ['user_id', 'user.id'],
            order: [[this.db.repo.Bonus.sequelize.fn('SUM', this.db.repo.Bonus.sequelize.col('amount')), 'DESC']],
            limit,
        });

        return earners.map(earner => {
            const data = earner.get() as any;
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

    async getTeamBonusPerformance(userId: string): Promise<any> {
        // Get user's direct downlines and their bonus performance
        const directDownlines = await this.db.repo.Consultant.findAll({
            where: { sponsor_id: userId },
            attributes: ['id', 'first_name', 'last_name', 'email', 'level'],
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

        // Sort by total amount descending
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
}
