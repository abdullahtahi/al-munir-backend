import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
export declare class BankController {
    private readonly bankService;
    constructor(bankService: BankService);
    create(createBankDto: CreateBankDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateBankDto: UpdateBankDto): string;
    remove(id: string): string;
}
