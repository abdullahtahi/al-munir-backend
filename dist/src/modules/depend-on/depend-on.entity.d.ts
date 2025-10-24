import { Model } from 'sequelize-typescript';
export declare class DependOn extends Model {
    id: number;
    name: string;
    relation: string;
    address: string;
}
