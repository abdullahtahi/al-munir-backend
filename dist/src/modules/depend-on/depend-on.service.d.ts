import { CreateDependOnDto } from './dto/create-depend-on.dto';
import { UpdateDependOnDto } from './dto/update-depend-on.dto';
export declare class DependOnService {
    create(createDependOnDto: CreateDependOnDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDependOnDto: UpdateDependOnDto): string;
    remove(id: number): string;
}
