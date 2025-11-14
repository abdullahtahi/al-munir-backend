import { ADMISSION_REPOSITORY, BANK_REPOSITORY, BONUS_REPOSITORY, BRANCHS_REPOSITORY, COURSES_REPOSITORY, DEPENDON_REPOSITORY, STUDENT_REPOSITORY, TRANSACTION_REPOSITORY, USER_REPOSITORY, WEBSITE_SETTING_REPOSITORY } from '@/constants/repositories';
import { Consultant } from '@/modules/consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { DependOn } from '../depend-on/depend-on.entity';
import { Admissions } from '../admissions/admissions.entity';
import { Banks } from '../bank/bank.entity';
import { Bonus } from '../bonuses/bonuses.entity';
import { Transactions } from '../transactions/transactions.entity';
import { Branches } from '@/modules/branches/entities/branch.entity';
import { Courses } from '@/modules/courses/entities/course.entity';
import { WebsiteSetting } from '../website-setting/entities/website-setting.entity';

export const globalDbPRovider = [
  {
    provide: USER_REPOSITORY,
    useValue: Consultant,
  },
  {
    provide: ADMISSION_REPOSITORY,
    useValue: Admissions,
  },
  {
    provide: STUDENT_REPOSITORY,
    useValue: Students,
  },
  {
    provide: DEPENDON_REPOSITORY,
    useValue: DependOn,
  },
  {
    provide: BANK_REPOSITORY,
    useValue: Banks,
  },
  {
    provide: BONUS_REPOSITORY,
    useValue: Bonus,
  },
  {
    provide: TRANSACTION_REPOSITORY,
    useValue: Transactions,
  },
  {
    provide: BRANCHS_REPOSITORY,
    useValue: Branches,
  },
  {
    provide: COURSES_REPOSITORY,
    useValue: Courses,
  },
  {
    provide: COURSES_REPOSITORY,
    useValue: Courses,
  },
  {
    provide: WEBSITE_SETTING_REPOSITORY,
    useValue: WebsiteSetting,
  },
];
