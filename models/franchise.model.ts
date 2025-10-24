import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { Consultant } from '../src/modules/consultant/consultant.entity';

@Table({
  tableName: 'franchises',
  timestamps: true,
})
export class Franchise extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  state: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @ForeignKey(() => Consultant)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Index
  sector_head_id: string;

  @BelongsTo(() => Consultant, 'sector_head_id')
  sectorHead: Consultant;

  @Column({
    type: DataType.STRING,
    defaultValue: 'active',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  established_date: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0.00,
  })
  total_revenue: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_admissions: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  settings: object;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata: object;
}
