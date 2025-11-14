import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'Branches',
  timestamps: true,
  paranoid: true,
})
export class Branches extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  principleName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  principleEducation: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  logo: string;

  @Column(DataType.STRING)
  address: string;

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

