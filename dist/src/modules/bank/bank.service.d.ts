import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
export declare class BankService {
    create(createBankDto: CreateBankDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateBankDto: UpdateBankDto): string;
    remove(id: number): string;
}
