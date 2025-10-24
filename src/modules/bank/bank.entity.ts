import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    DataType,
    ForeignKey,
} from 'sequelize-typescript';

@Table({
    tableName: 'Banks',
    timestamps: true,
    paranoid: true,
})
export class Banks extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    accountNumber: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    accountAddress: string;

    @Column(DataType.BOOLEAN)
    isActive: boolean;


    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt: Date;

    @Column(DataType.DATE)
    updatedAt: Date;

    @Column(DataType.DATE)
    deletedAt: Date;
}
