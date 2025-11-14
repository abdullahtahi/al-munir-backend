import { Consultant } from '../src/modules/consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { DependOn } from '@/modules/depend-on/depend-on.entity';
import { Admissions } from '@/modules/admissions/admissions.entity';
import { Banks } from '@/modules/bank/bank.entity';
import { Bonus } from '@/modules/bonuses/bonuses.entity';
import { Transactions } from '@/modules/transactions/transactions.entity';
import { Branches } from '@/modules/branches/entities/branch.entity';
import { Courses } from '@/modules/courses/entities/course.entity';
import { WebsiteSetting } from '@/modules/website-setting/entities/website-setting.entity';

export const models = [
    Consultant,
    Admissions,
    Students,
    DependOn,
    Banks,
    Bonus,
    Transactions,
    Branches,Courses,
    WebsiteSetting
]