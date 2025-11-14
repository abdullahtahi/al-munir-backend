export declare class Branch {
}
import { Model } from 'sequelize-typescript';
export declare class Courses extends Model {
    id: number;
    name: string;
    logo: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
