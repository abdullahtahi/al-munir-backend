import { Students } from '@/modules/students/student.entity';
import { Model } from 'sequelize-typescript';
import { DependOn } from '../depend-on/depend-on.entity';
import { Consultant } from '../consultant/consultant.entity';
export declare class Admissions extends Model {
    id: number;
    consultantId: number;
    studentId: number;
    dependOnId: number;
    admissionInClass: string;
    admissionType: string;
    feeAmount: string;
    commissionAmount: string;
    admissionDate: Date;
    admissionNumber: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    consultant: Consultant;
    Student: Students;
    DependOn: DependOn;
}
