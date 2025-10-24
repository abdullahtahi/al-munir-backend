import { Model } from 'sequelize-typescript';
import { Consultant } from '@/modules/consultant/consultant.entity';
import { AdmissionType } from '@/common/enums';
export declare class Admission extends Model {
    id: string;
    user_id: string;
    Consultant: Consultant;
    student_name: string;
    student_email: string;
    student_phone: string;
    admission_type: AdmissionType;
    course_name: string;
    institution_name: string;
    fee_amount: number;
    commission_amount: number;
    admission_date: Date;
    admission_id: string;
    notes: string;
    status: string;
    metadata: object;
}
