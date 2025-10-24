import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
} from 'sequelize-typescript';
@Table({
    tableName: 'DependOn',
    timestamps: true,
})
export class DependOn extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    relation: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address: string;

}
