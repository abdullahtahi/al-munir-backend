import { Consultant } from '../src/modules/consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { DependOn } from '@/modules/depend-on/depend-on.entity';
import { Admissions } from '@/modules/admissions/admissions.entity';
import { Banks } from '@/modules/bank/bank.entity';
import { Bonus } from '@/modules/bonuses/bonuses.entity';
export declare const models: (typeof Bonus | typeof Consultant | typeof Admissions | typeof Students | typeof DependOn | typeof Banks)[];
