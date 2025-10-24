import { Model } from 'sequelize-typescript';
export declare class Banks extends Model {
    id: number;
    name: string;
    accountNumber: string;
    accountAddress: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
