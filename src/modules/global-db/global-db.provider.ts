import { ADMISSION_REPOSITORY, BANK_REPOSITORY, BONUS_REPOSITORY, DEPENDON_REPOSITORY, STUDENT_REPOSITORY, TRANSACTION_REPOSITORY, USER_REPOSITORY } from '@/constants/repositories';
import { Consultant } from '@/modules/consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { DependOn } from '../depend-on/depend-on.entity';
import { Admissions } from '../admissions/admissions.entity';
import { Banks } from '../bank/bank.entity';
import { Bonus } from '../bonuses/bonuses.entity';
import { Transactions } from '../transactions/transactions.entity';

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
];
