// import {
//   IsString,
//   IsEmail,
//   IsNotEmpty,
//   IsEnum,
//   IsNumber,
//   IsUUID,
//   IsOptional,
//   IsDecimal,
//   Min,
// } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { AdmissionType } from '../../../common/enums';

// export class CreateAdmissionDto {
//   @ApiProperty({ description: 'Student full name', example: 'John Doe' })
//   @IsString()
//   @IsNotEmpty()
//   student_name: string;

//   @ApiProperty({ description: 'Student email address', example: 'john.doe@example.com' })
//   @IsEmail()
//   @IsNotEmpty()
//   student_email: string;
//   @ApiProperty({ description: 'Student email address', example: '123123' })
//   @IsNotEmpty()
//   user_id: string;

//   @ApiProperty({ description: 'Student phone number', example: '+923001234567' })
//   @IsString()
//   @IsNotEmpty()
//   student_phone: string;

//   @ApiProperty({ description: 'Type of admission', enum: AdmissionType, example: AdmissionType.SCHOOL })
//   @IsEnum(AdmissionType)
//   admission_type: AdmissionType;

//   @ApiProperty({ description: 'Name of the course', example: 'Computer Science' })
//   @IsString()
//   @IsNotEmpty()
//   course_name: string;

//   @ApiPropertyOptional({ description: 'Name of the institution', example: 'Al-Munir Academy' })
//   @IsOptional()
//   @IsString()
//   institution_name?: string;

//   @ApiProperty({ description: 'Fee amount in PKR', example: 50000, minimum: 0 })
//   @IsNumber({ maxDecimalPlaces: 2 })
//   @Min(0)
//   fee_amount: number;

//   @ApiPropertyOptional({ description: 'Commission amount (auto-calculated if not provided)', example: 7500, minimum: 0 })
//   @IsOptional()
//   @IsNumber({ maxDecimalPlaces: 2 })
//   @Min(0)
//   commission_amount?: number;

//   @ApiPropertyOptional({ description: 'Institution admission ID', example: 'ADM-2024-001' })
//   @IsOptional()
//   @IsString()
//   admission_id?: string;

//   @ApiPropertyOptional({ description: 'Additional notes', example: 'Student needs scholarship assistance' })
//   @IsOptional()
//   @IsString()
//   notes?: string;
// }

// export class UpdateAdmissionDto {
//   @IsOptional()
//   @IsString()
//   student_name?: string;

//   @IsOptional()
//   @IsEmail()
//   student_email?: string;

//   @IsOptional()
//   @IsString()
//   student_phone?: string;

//   @IsOptional()
//   @IsEnum(AdmissionType)
//   admission_type?: AdmissionType;

//   @IsOptional()
//   @IsString()
//   course_name?: string;

//   @IsOptional()
//   @IsString()
//   institution_name?: string;

//   @IsOptional()
//   @IsNumber({ maxDecimalPlaces: 2 })
//   @Min(0)
//   fee_amount?: number;

//   @IsOptional()
//   @IsNumber({ maxDecimalPlaces: 2 })
//   @Min(0)
//   commission_amount?: number;

//   @IsOptional()
//   @IsString()
//   admission_id?: string;

//   @IsOptional()
//   @IsString()
//   notes?: string;

//   @IsOptional()
//   @IsString()
//   status?: string;
// }

// export class AdmissionFilterDto {
//   @IsOptional()
//   @IsEnum(AdmissionType)
//   admission_type?: AdmissionType;

//   @IsOptional()
//   @IsUUID()
//   user_id?: string;

//   @IsOptional()
//   @IsString()
//   status?: string;

//   @IsOptional()
//   @IsString()
//   course_name?: string;

//   @IsOptional()
//   @IsString()
//   institution_name?: string;

//   @IsOptional()
//   @IsString()
//   date_from?: string;

//   @IsOptional()
//   @IsString()
//   date_to?: string;
// }

// export interface AdmissionStatsDto {
//   total_admissions: number;
//   school_admissions: number;
//   academy_admissions: number;
//   technical_admissions: number;
//   total_fees: number;
//   total_commissions: number;
//   monthly_stats: {
//     month: string;
//     admissions: number;
//     fees: number;
//     commissions: number;
//   }[];
//   top_courses: {
//     course_name: string;
//     count: number;
//     total_fees: number;
//   }[];
//   top_performers: {
//     user_id: string;
//     user_name: string;
//     admissions: number;
//     total_fees: number;
//   }[];
// }
