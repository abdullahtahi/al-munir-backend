import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
  } from 'sequelize-typescript';
import { Admissions } from '../admissions/admissions.entity';
import { Consultant } from '../consultant/consultant.entity';
  
  @Table({
    tableName: 'Transactions',
    timestamps: true,
  })
  export class Transactions extends Model<Transactions> {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    })
    id!: number;
  
    @ForeignKey(() => Consultant)
    @Column({
      type: DataType.INTEGER,
      field: 'fkConsultantId',
      allowNull: true,
      comment: 'Foreign key from Consultant table',
    })
    consultantId?: number;
  
    @ForeignKey(() => Admissions)
    @Column({
      type: DataType.INTEGER,
      field: 'fkAdmissionId',
      allowNull: true,
      comment: 'Foreign key from Admission table',
    })
    admissionId?: number;
  
    @Column({
      type: DataType.ENUM('bonus_credit', 'incentive_credit', 'withdrawal', 'penalty'),
      allowNull: false,
    })
    transactionType!: 'bonus_credit' | 'incentive_credit' | 'withdrawal' | 'penalty';
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
    })
    amount!: number;
  
    @Default(DataType.NOW)
    @Column({
      type: DataType.DATE,
    })
    transactionDate!: Date;
  
    @Default(0.0)
    @Column({
      type: DataType.DECIMAL(10, 2),
    })
    fee!: number;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
    })
    netAmount!: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    paymentDetails?: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    referenceType?: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    description?: string;
  
    @Default('pending')
    @Column({
      type: DataType.ENUM('pending', 'completed', 'failed', 'cancelled'),
      allowNull: false,
    })
    status!: 'pending' | 'completed' | 'failed' | 'cancelled';
  
    @Column({
      type: DataType.DATE,
      allowNull: true,
    })
    processedAt?: Date;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    notes?: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    paymentMethod?: string;
  
    @Column({
      type: DataType.JSON,
      allowNull: true,
    })
    metadata?: Record<string, any>;
  
    // Relationships
    @BelongsTo(() => Consultant)
    consultant?: Consultant;
  
    @BelongsTo(() => Admissions)
    admission?: Admissions;
  }
  