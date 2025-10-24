import { Consultant } from '../src/modules/consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { DependOn } from '@/modules/depend-on/depend-on.entity';
import { Admissions } from '@/modules/admissions/admissions.entity';
import { Banks } from '@/modules/bank/bank.entity';

export const models = [
    Consultant,
    Admissions,
    Students,
    DependOn,
    Banks
]