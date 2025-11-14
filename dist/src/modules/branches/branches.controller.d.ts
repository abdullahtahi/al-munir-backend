import { BranchesService } from './branches.service';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(createBranchDto: any): Promise<{
        branch: any;
        message: string;
    }>;
    findAll(params: any): any;
    findOne(id: string): string;
    update(id: string, updateBranchDto: any): any;
    remove(id: string): any;
}
