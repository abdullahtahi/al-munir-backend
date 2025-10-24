import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript';
@Table({
    tableName: 'Students',
    timestamps: true,
})
export class Students extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    studentName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    gender: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    residentNumber: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    profileImg: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    birthCertificate: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    schoolLeavingCertificate: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fatherCnicImgFront: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fatherCnicImgBack: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    dateOfBirth: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fatherName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fatherEducation: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fatherOccupation: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,

    })
    fatherCnic: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    motherName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    motherEducation: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    motherOccupation: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,

    })
    motherCnic: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    permanentAddress: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    secondaryAddress: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    createdAt: Date;
    @Column({
        type: DataType.DATE,
    })
    updatedAt: Date;


}
