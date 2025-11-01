import { Consultant } from '../consultant/consultant.entity';
import { Students } from '@/modules/students/student.entity';
import { Admissions } from '../admissions/admissions.entity';
import { DependOn } from '../depend-on/depend-on.entity';
import { Banks } from '../bank/bank.entity';
import { Bonus } from '../bonuses/bonuses.entity';
import { Transactions } from '../transactions/transactions.entity';
export declare class GlobalDbService {
    private readonly userRepository;
    private readonly studentRepository;
    private readonly admissionRepository;
    private readonly dependOnRepository;
    private readonly bankRepository;
    private readonly bonusRepository;
    private readonly transactionsRepository;
    private readonly logger;
    readonly repo: any;
    constructor(userRepository: typeof Consultant, studentRepository: typeof Students, admissionRepository: typeof Admissions, dependOnRepository: typeof DependOn, bankRepository: typeof Banks, bonusRepository: typeof Bonus, transactionsRepository: typeof Transactions);
    getOne(model: string, params: any): Promise<any>;
    getAll(model: string, params: any): Promise<any>;
    save(model: string, params: any, loggedInUser: any, transaction?: any): Promise<any>;
    delete(model: string, filter: any): Promise<any>;
}
