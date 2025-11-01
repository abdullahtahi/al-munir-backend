import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    CreatedAt,
    UpdatedAt,
    HasMany,
  } from 'sequelize-typescript';
import { Consultant } from '../consultant/consultant.entity';
import { Admissions } from '../admissions/admissions.entity';
import { Banks } from '../bank/bank.entity';
  
  export enum BonusType {
    DIRECT = 'direct',
    INDIRECT_LEVEL_1 = 'indirect_level_1',
    INDIRECT_LEVEL_2 = 'indirect_level_2',
    INDIRECT_LEVEL_3 = 'indirect_level_3',
    INDIRECT_LEVEL_4 = 'indirect_level_4',
    GLOBAL = 'global',
    PROGRESSION = 'progression',
  }
  
  export enum BonusStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
  }
  
  @Table({
    tableName: 'Bonuses',
    timestamps: true,
  })
  export class Bonus extends Model<Bonus> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    })
    id!: number;
  
    // Consultant who receives the bonus
    @ForeignKey(() => Consultant)
    @Column({
      field: 'fkConsultantId',
      type: DataType.INTEGER,
      allowNull: true,
    })
    consultantId: number;

  
    // Consultant who generated the bonus
    @ForeignKey(() => Consultant)
    @Column({
      field: 'fkFromConsultantId',
      type: DataType.INTEGER,
      allowNull: true,
    })
    fromConsultantId: number;
  
    @BelongsTo(() => Consultant, { foreignKey: 'fkConsultantId', as: 'fkConsultant' })
    @BelongsTo(() => Consultant, { foreignKey: 'fkFromConsultantId', as: 'fkFromConsultant' })
    @BelongsTo(() => Admissions, { foreignKey: 'fkAdmissionId', as: 'admission' })
  
    @Column({
      type: DataType.ENUM(...Object.values(BonusType)),
      allowNull: false,
    })
    bonusType!: BonusType;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    amount!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    percentage?: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    baseAmount!: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    levelDepth?: number;
  
    @ForeignKey(() => Admissions)
    @Column({
      field: 'fkAdmissionId',
      type: DataType.INTEGER,
      allowNull: true,
      comment: 'Foreign key from Admission table',
    })
    admissionId?: number;
  
    @Column({
      type: DataType.STRING(50),
      allowNull: true,
    })
    referenceType?: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    description?: string;
  
    @Default(BonusStatus.PENDING)
    @Column({
      type: DataType.ENUM(...Object.values(BonusStatus)),
      allowNull: false,
    })
    status!: BonusStatus;
  
    @Default(DataType.NOW)
    @Column({
      type: DataType.DATE,
      allowNull: false,
    })
    earnedDate!: Date;
  
    @Column({
      type: DataType.DATE,
      allowNull: true,
    })
    processedAt?: Date;
  
    @Column({
      type: DataType.JSON,
      allowNull: true,
    })
    metadata?: Record<string, any>;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    createdAt!: Date;
  
    @UpdatedAt
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    updatedAt!: Date;

}
  