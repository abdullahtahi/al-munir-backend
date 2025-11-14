import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import {
  ADMISSION_REPOSITORY,
  BANK_REPOSITORY,
  BONUS_REPOSITORY,
  BRANCHS_REPOSITORY,
  COURSES_REPOSITORY,
  DEPENDON_REPOSITORY,
  STUDENT_REPOSITORY,
  TRANSACTION_REPOSITORY,
  USER_REPOSITORY,
  WEBSITE_SETTING_REPOSITORY
} from 'src/constants/repositories';
import { Consultant } from '../consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { Admissions } from '../admissions/admissions.entity';
import { DependOn } from '../depend-on/depend-on.entity';
import { Banks } from '../bank/bank.entity';
import { Bonus } from '../bonuses/bonuses.entity';
import { Transactions } from '../transactions/transactions.entity';
import { Branches } from '@/modules/branches/entities/branch.entity';
import { Courses } from '@/modules/courses/entities/course.entity';
import { WebsiteSetting } from '../website-setting/entities/website-setting.entity';


@Injectable()
export class GlobalDbService {
  private readonly logger = new Logger('GlobalDbService');
  public readonly repo: any = {};

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof Consultant,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: typeof Students,
    @Inject(ADMISSION_REPOSITORY)
    private readonly admissionRepository: typeof Admissions,
    @Inject(DEPENDON_REPOSITORY)
    private readonly dependOnRepository: typeof DependOn,
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: typeof Banks,
    @Inject(BONUS_REPOSITORY)
    private readonly bonusRepository: typeof Bonus,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionsRepository: typeof Transactions,
    @Inject(BRANCHS_REPOSITORY)
    private readonly branchRepository: typeof Branches,
    @Inject(COURSES_REPOSITORY)
    private readonly coursesRepository: typeof Courses,
    @Inject(WEBSITE_SETTING_REPOSITORY)
    private readonly websiteSettingRepository: typeof WebsiteSetting,



  ) {
    this.repo.Consultant = this.userRepository;
    this.repo.Student = this.studentRepository;
    this.repo.Admission = this.admissionRepository;
    this.repo.DependOn = this.dependOnRepository;
    this.repo.Bank = this.bankRepository;
    this.repo.Bonus = this.bonusRepository;
    this.repo.Transactions = this.transactionsRepository;
    this.repo.Branch = this.branchRepository;
    this.repo.Course = this.coursesRepository;
    this.repo.WebsiteSetting = this.websiteSettingRepository;
  }

  async getOne(model: string, params: any) {
    try {
      const result = await this.getAll(model, params);
      return (result.rows && _.first(result.rows)) || null;
    } catch (e) {
      this.logger.error('Error while saving ', e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(model: string, params: any) {
    try {
      const options: any = { where: params.where || {} };
      if (params.attributes) {
        options.attributes = params.attributes;
      }
      return this.repo[model].findAndCountAll(options);
    } catch (e) {
      this.logger.error('Error while saving ', e);
      throw new InternalServerErrorException();
    }
  }

  async save(
    model: string,
    params: any,
    loggedInUser: any,
    transaction = null
  ) {
    try {
      const { id } = params;
      params.updatedBy = loggedInUser.id;
      if (id) {
        return this.repo[model].update(params, { where: { id } }, transaction);
      } else {
        params.createdBy = loggedInUser.id;
        return this.repo[model].create(params, { transaction });
      }
    } catch (e) {
      this.logger.error('Error while saving ', e);
      throw new InternalServerErrorException();
    }
  }

  async delete(model: string, filter: any) {
    try {
      return await this.repo[model].destroy({ where: filter });
    } catch (e) {
      this.logger.error('Error while deleting ', e);
      throw new InternalServerErrorException();
    }
  }
}
