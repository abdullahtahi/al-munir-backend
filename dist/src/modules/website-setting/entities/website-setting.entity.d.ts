export declare class Branch {
}
import { Model } from 'sequelize-typescript';
export declare class WebsiteSetting extends Model {
    id: number;
    vision: string;
    address: string;
    phone: string;
    logo: string;
    facebookLink: string;
    youtubeLink: string;
    email: string;
}
