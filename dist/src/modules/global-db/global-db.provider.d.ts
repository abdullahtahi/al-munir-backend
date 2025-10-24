import { Consultant } from '@/modules/consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { DependOn } from '../depend-on/depend-on.entity';
import { Admissions } from '../admissions/admissions.entity';
import { Banks } from '../bank/bank.entity';
export declare const globalDbPRovider: ({
    provide: string;
    useValue: typeof Consultant;
} | {
    provide: string;
    useValue: typeof Admissions;
} | {
    provide: string;
    useValue: typeof Students;
} | {
    provide: string;
    useValue: typeof DependOn;
} | {
    provide: string;
    useValue: typeof Banks;
})[];
