import { Students } from '@/modules/students/student.entity';
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { DependOn } from '../depend-on/depend-on.entity';
import { Consultant } from '../consultant/consultant.entity';
@Table({
    tableName: 'Admissions',
    timestamps: true,
})
export class Admissions extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Consultant)
    @Column({
        type: DataType.INTEGER,
        field: "fkConsultantId",
        allowNull: true
    })
    consultantId: number;

    @ForeignKey(() => Students)
    @Column({
        type: DataType.INTEGER,
        field: "fkStudentId",
        allowNull: false
    })
    studentId: number;

    @ForeignKey(() => DependOn)
    @Column({
        type: DataType.INTEGER,
        field: "fkDependOnId",
        allowNull: false
    })
    dependOnId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    admissionInClass: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    admissionType: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    feeAmount: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    commissionAmount: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    admissionDate: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    admissionNumber: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    status: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    createdAt: Date;
    @Column({
        type: DataType.DATE,
    })
    updatedAt: Date;

    @BelongsTo(() => Consultant)
    consultant: Consultant;

    @BelongsTo(() => Students)
    Student: Students

    @BelongsTo(() => DependOn)
    DependOn: DependOn;
}
