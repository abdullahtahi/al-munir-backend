import { Model } from 'sequelize-typescript';
import { Consultant } from '../src/modules/consultant/consultant.entity';
export declare class Franchise extends Model {
    id: string;
    name: string;
    code: string;
    description: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    email: string;
    sector_head_id: string;
    sectorHead: Consultant;
    status: string;
    established_date: Date;
    total_revenue: number;
    total_admissions: number;
    settings: object;
    metadata: object;
}
