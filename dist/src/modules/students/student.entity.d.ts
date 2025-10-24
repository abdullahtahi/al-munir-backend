import { Model } from 'sequelize-typescript';
export declare class Students extends Model {
    id: number;
    studentName: string;
    gender: string;
    phone: string;
    residentNumber: string;
    profileImg: string;
    birthCertificate: string;
    schoolLeavingCertificate: string;
    fatherCnicImgFront: string;
    fatherCnicImgBack: string;
    dateOfBirth: string;
    fatherName: string;
    fatherEducation: string;
    fatherOccupation: string;
    fatherCnic: string;
    motherName: string;
    motherEducation: string;
    motherOccupation: string;
    motherCnic: string;
    permanentAddress: string;
    secondaryAddress: string;
    createdAt: Date;
    updatedAt: Date;
}
