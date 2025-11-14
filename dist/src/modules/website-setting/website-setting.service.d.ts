import { GlobalDbService } from "../global-db/global-db.service";
export declare class WebsiteSettingService {
    private readonly db;
    constructor(db: GlobalDbService);
    create(createWebsiteSettingDto: any): Promise<any>;
    findAll(): any;
    findOne(id: number): string;
    update(id: number, updateWebsiteSettingDto: any): string;
    remove(id: number): string;
}
