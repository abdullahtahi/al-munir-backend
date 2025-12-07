import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Sequelize, Transaction, where } from "sequelize";
// import { User } from '../../database/models';
import { PaginationDto } from "../../common/dto/pagination.dto";
import {
  ConsultantStatus,
  UserLevel,
  AdmissionType,
  UserRole,
} from "../../common/enums";
import { getErrorMessage, getPaginationOptions } from "@/helpers";
import * as _ from "lodash";
import { SEQUELIZE } from "@/constants";
import { LEVEL_REQUIREMENTS } from "../../common/constants";
import { Consultant } from "@/modules/consultant/consultant.entity";
import { GlobalDbService } from "../global-db/global-db.service";
import { BonusesService } from "../bonuses/bonuses.service";

@Injectable()
export class ConsultantService {
  constructor(
    private readonly db: GlobalDbService,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    @Inject(forwardRef(() => BonusesService))
    private readonly bonusesService: BonusesService
  ) {}

  async create(createUserDto: any): Promise<any> {
    try {
      await this.sequelize.transaction(async (transaction) => {
        const { bankName, accountNumber, accountAddress, sponsorId, ...rest } =
          createUserDto;

        const bank = await this.db.repo.Bank.create(
          {
            name: bankName,
            accountNumber,
            accountAddress,
          },
          { transaction }
        );
        console.log("line 32", bank.id);
        if (bank.id) {
          await this.db.repo.Consultant.create(
            {
              bankId: bank.id,
              sponsorId: sponsorId == "" ? null : sponsorId, // You can also use sponsorId if it’s provided
              ...rest,
            },
            { transaction }
          );
        }
      });
      return {
        message: "Consultant Created Sucessfully",
      };
    } catch (error) {
      console.log("error", error);
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  async findAll(params) {
    let pagination = getPaginationOptions(params);
    let where: any = {};

    where.role = { [Op.notIn]: [UserRole.SUPER_ADMIN] };

    if (!_.isEmpty(params.userName)) {
      const namePattern = `%${params.userName}%`;
      where[Op.and] = {
        [Op.or]: [
          { firstName: { [Op.iLike]: namePattern } },
          { lastName: { [Op.iLike]: namePattern } },
          this.sequelize.literal(
            `CONCAT("Consultant"."firstName", ' ', "Consultant"."lastName") ILIKE '${namePattern}'`
          ),
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
      where.cnic = { [Op.like]: `%${params.cnic}%` };
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

  async findById(id: number): Promise<Consultant | null> {
    return this.db.repo.Consultant.findByPk(id);
  }

  async findByEmail(email: string): Promise<Consultant | null> {
    return this.db.repo.Consultant.findOne({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<Consultant | null> {
    return this.db.repo.Consultant.findOne({
      where: { phone },
    });
  }

  async findByReferralCode(referralCode: string): Promise<Consultant | null> {
    return this.db.repo.Consultant.findOne({
      where: { referral_code: referralCode },
    });
  }

  async update(id: number, updateUserDto: any) {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const {
        password,
        bankName,
        accountNumber,
        accountAddress,
        bankId,
        sponsorId,
        ...rest
      } = updateUserDto;
      await this.sequelize.transaction(async (transaction) => {
        await this.db.repo.Bank.update(
          {
            name: bankName,
            accountNumber: accountNumber,
            accountAddress: accountAddress,
          },
          {
            where: {
              id: bankId,
            },
          },
          { transaction }
        );

        await this.db.repo.Consultant.update(
          {
            consultantId:sponsorId,
            ...rest,
          },
          {
            where: {
              id,
            },
          },
          { transaction }
        );
      });
      return {
        message: "Updated SuccessFully",
      };
    } catch (error) {
      console.log("line 138", error);
      throw new BadRequestException(error);
    }
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await user.update({ password: newPassword });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.db.repo.Consultant.update(
      { last_login: new Date() },
      { where: { id } }
    );
  }

  async updateStatus(
    id: number,
    status: ConsultantStatus
  ): Promise<Consultant> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await user.update({ status });
    return user.reload();
  }

  async updateLevel(id: number, level: UserLevel): Promise<Consultant> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await user.update({ level });
    return user.reload();
  }

  async checkAndPromoteUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;

    const currentLevel = user.level;
    let nextLevel: UserLevel | null = null;
    let isTeamPromotion = false;

    // Determine next level and promotion type
    switch (currentLevel) {
      case UserLevel.LEVEL_1:
        nextLevel = UserLevel.LEVEL_2;
        break;
      case UserLevel.LEVEL_2:
        nextLevel = UserLevel.LEVEL_3;
        break;
      case UserLevel.LEVEL_3:
        nextLevel = UserLevel.LEVEL_4;
        isTeamPromotion = true; // Level 3 -> 4 requires team structure
        break;
      case UserLevel.LEVEL_4:
        nextLevel = UserLevel.MANAGER;
        isTeamPromotion = true; // Level 4 -> Manager requires team structure
        break;
      // Add more transitions if needed
      default:
        return;
    }

    if (nextLevel) {
      let shouldPromote = false;

      if (isTeamPromotion) {
        // Check team structure requirements
        shouldPromote = await this.checkTeamStructurePromotion(userId, nextLevel);
      } else {
        // Check personal admission requirements (Levels 1-3)
        const requirements = LEVEL_REQUIREMENTS[nextLevel];
        if (requirements) {
          const hasMetSchool = user.schoolAdmissions >= (requirements[AdmissionType.SCHOOL] || 0);
          const hasMetAcademy = user.academyAdmissions >= (requirements[AdmissionType.ACADEMY] || 0);
          const hasMetTechnical = user.technicalAdmissions >= (requirements[AdmissionType.TECHNICAL] || 0);
          shouldPromote = hasMetSchool && hasMetAcademy && hasMetTechnical;
        }
      }

      if (shouldPromote) {
        console.log(`Promoting user ${userId} from ${currentLevel} to ${nextLevel}`);
        
        // Update level
        await this.updateLevel(userId, nextLevel);

        // Process progression bonus
        await this.bonusesService.processProgressionBonus(
          userId.toString(),
          currentLevel,
          nextLevel
        );
      }
    }
  }

  private async checkTeamStructurePromotion(userId: number, targetLevel: UserLevel): Promise<boolean> {
    // Logic based on PDF requirements:
    // To Level 4: Lead at least 5 Level 3 Consultants (from different lines)
    // To Manager: Lead at least 5 Level 4 Consultants (from different lines) - *Assumed based on pattern, user to confirm*
    // For now implementing the "5 downlines of previous level in different lines" rule

    let requiredDownlineLevel: UserLevel;
    let requiredCount = 5;

    if (targetLevel === UserLevel.LEVEL_4) {
      requiredDownlineLevel = UserLevel.LEVEL_3;
    } else if (targetLevel === UserLevel.MANAGER) {
      requiredDownlineLevel = UserLevel.LEVEL_4;
    } else {
      return false;
    }

    // Get direct downlines (lines)
    const directDownlines = await this.db.repo.Consultant.findAll({
      where: { sponsorId: userId },
      attributes: ['id']
    });

    if (directDownlines.length < requiredCount) return false;

    let qualifiedLines = 0;

    // Check each line for at least one consultant at the required level
    for (const line of directDownlines) {
      const hasQualifiedMember = await this.checkLineForLevel(line.id, requiredDownlineLevel);
      if (hasQualifiedMember) {
        qualifiedLines++;
      }
    }

    return qualifiedLines >= requiredCount;
  }

  private async checkLineForLevel(rootId: number, targetLevel: UserLevel): Promise<boolean> {
    // Check root of the line
    const root = await this.db.repo.Consultant.findByPk(rootId, { attributes: ['level'] });
    if (root && root.level === targetLevel) return true;

    // Check downlines recursively (BFS/DFS)
    // For performance, we might want to limit depth or use a recursive CTE if possible, 
    // but for now we'll use a recursive function with depth limit
    return this.searchLineRecursive(rootId, targetLevel);
  }

  private async searchLineRecursive(parentId: number, targetLevel: UserLevel, currentDepth: number = 0, maxDepth: number = 10): Promise<boolean> {
    if (currentDepth > maxDepth) return false;

    const children = await this.db.repo.Consultant.findAll({
      where: { sponsorId: parentId },
      attributes: ['id', 'level']
    });

    for (const child of children) {
      if (child.level === targetLevel) return true;
      
      const foundInSubtree = await this.searchLineRecursive(child.id, targetLevel, currentDepth + 1, maxDepth);
      if (foundInSubtree) return true;
    }

    return false;
  }

  async getTeamStructure(userId: number, depth: number = 3): Promise<any> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.buildTeamTree(userId, depth);
  }

  private async buildTeamTree(
    userId: number,
    depth: number,
    currentDepth: number = 0
  ): Promise<any> {
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
          model: Consultant,
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

    if (!user) return null;

    const children = [];
    if (user.downlines) {
      for (const downline of user.downlines) {
        const child = await this.buildTeamTree(
          downline.id,
          depth,
          currentDepth + 1
        );
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

  async getTeamStats(userId: number): Promise<any> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Get all downlines recursively
    const allDownlines = await this.getAllDownlines(userId);

    const stats = {
      total_team_members: allDownlines.length,
      active_members: allDownlines.filter(
        (u) => u.status === ConsultantStatus.ACTIVE
      ).length,
      total_team_admissions: allDownlines.reduce(
        (sum, u) => sum + u.totalAdmissions,
        0
      ),
      level_distribution: {},
      admission_type_distribution: {
        [AdmissionType.SCHOOL]: 0,
        [AdmissionType.ACADEMY]: 0,
        [AdmissionType.TECHNICAL]: 0,
      },
    };

    // Calculate level distribution
    allDownlines.forEach((user) => {
      const level = `level_${user.level}`;
      stats.level_distribution[level] =
        (stats.level_distribution[level] || 0) + 1;
    });

    // Calculate admission type distribution
    allDownlines.forEach((user) => {
      stats.admission_type_distribution[AdmissionType.SCHOOL] +=
        user.schoolAdmissions;
      stats.admission_type_distribution[AdmissionType.ACADEMY] +=
        user.academyAdmissions;
      stats.admission_type_distribution[AdmissionType.TECHNICAL] +=
        user.technicalAdmissions;
    });

    return stats;
  }

  private async getAllDownlines(
    userId: number,
    collected: Consultant[] = []
  ): Promise<Consultant[]> {
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

  async searchUsers(query: string, paginationDto: PaginationDto) {
    const { page, limit, offset } = paginationDto;

    const whereClause = {
      [Op.or]: [
        { first_name: { [Op.iLike]: `%${query}%` } },
        { last_name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
        { phone: { [Op.iLike]: `%${query}%` } },
        { referral_code: { [Op.iLike]: `%${query}%` } },
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

  async updateAdmissionCounts(
    userId: number,
    admissionType: AdmissionType
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updateData: any = {};

    switch (admissionType) {
      case AdmissionType.SCHOOL:
        updateData.schoolAdmissions = user.schoolAdmissions + 1;
        break;
      case AdmissionType.ACADEMY:
        updateData.academyAdmissions = user.academyAdmissions + 1;
        break;
      case AdmissionType.TECHNICAL:
        updateData.technicalAdmissions = user.technicalAdmissions + 1;
        break;
    }

    await user.update(updateData);
  }

  async updateBalance(
    userOrId: any,
    amount: number,
    transaction?: Transaction
  ): Promise<void> {
    let user = userOrId;
    if (typeof userOrId === 'number' || typeof userOrId === 'string') {
      user = await this.findById(Number(userOrId));
    }

    if (!user) {
      throw new NotFoundException("User not found for balance update");
    }

    const currentTotal = user.totalEarnings ? parseFloat(user.totalEarnings.toString()) : 0;
    const currentAvailable = user.availableBalance ? parseFloat(user.availableBalance.toString()) : 0;

    const newTotalEarnings = currentTotal + amount;
    const newAvailableBalance = currentAvailable + amount;

    await this.db.repo.Consultant.update(
      {
        totalEarnings: newTotalEarnings,
        availableBalance: newAvailableBalance,
      },
      {
        where: {
          id: user.id
        },
        transaction
      }
    );
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await user.update({
      status: ConsultantStatus.INACTIVE,
      deletedAt: new Date(),
    });
  }
}
