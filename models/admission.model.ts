import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey,
    Index,
} from 'sequelize-typescript';
import { Consultant } from '@/modules/consultant/consultant.entity';
import { AdmissionType } from '@/common/enums';

@Table({
    tableName: 'Admissions',
    timestamps: true,
})
export class Admission extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => Consultant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @Index
    user_id: string;

    @BelongsTo(() => Consultant)
    Consultant: Consultant;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    student_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    student_email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    student_phone: string;

    @Column({
        type: DataType.ENUM(...Object.values(AdmissionType)),
        allowNull: false,
    })
    @Index
    admission_type: AdmissionType
        ;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    course_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    institution_name: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    fee_amount: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0.00,
    })
    commission_amount: number;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    admission_date: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    admission_id: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    notes: string;

    @Column({
        type: DataType.STRING,
        defaultValue: 'completed',
    })
    status: string;

    @Column({
        type: DataType.JSON,
        allowNull: true,
    })
    metadata: object;
}
