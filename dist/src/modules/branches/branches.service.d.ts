import { GlobalDbService } from "../global-db/global-db.service";
export declare class BranchesService {
    private readonly db;
    constructor(db: GlobalDbService);
    create(createBranchDto: any): Promise<{
        branch: any;
        message: string;
    }>;
    findAll(params: any): any;
    findOne(id: number): string;
    update(id: string, updateBranchDto: any): any;
    remove(id: number): any;
}
