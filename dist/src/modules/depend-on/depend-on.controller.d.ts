import { DependOnService } from './depend-on.service';
import { CreateDependOnDto } from './dto/create-depend-on.dto';
import { UpdateDependOnDto } from './dto/update-depend-on.dto';
export declare class DependOnController {
    private readonly dependOnService;
    constructor(dependOnService: DependOnService);
    create(createDependOnDto: CreateDependOnDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDependOnDto: UpdateDependOnDto): string;
    remove(id: string): string;
}
