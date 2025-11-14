import { WebsiteSettingService } from './website-setting.service';
export declare class WebsiteSettingController {
    private readonly websiteSettingService;
    constructor(websiteSettingService: WebsiteSettingService);
    createAndUpdate(createWebsiteSettingDto: any): Promise<any>;
    findAll(): any;
    findOne(id: string): string;
    update(id: string, updateWebsiteSettingDto: any): string;
    remove(id: string): string;
}
