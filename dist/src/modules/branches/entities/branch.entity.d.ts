import { Model } from 'sequelize-typescript';
export declare class Branches extends Model {
    id: number;
    name: string;
    principleName: string;
    principleEducation: string;
    logo: string;
    address: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
