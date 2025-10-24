// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   BelongsTo,
//   ForeignKey,
//   Index,
// } from 'sequelize-typescript';
// import { User } from './user.model';
// import { TransactionType, TransactionStatus } from '../../common/enums';

// @Table({
//   tableName: 'transactions',
//   timestamps: true,
// })
// export class Transaction extends Model {
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     primaryKey: true,
//   })
//   id: string;

//   @ForeignKey(() => User)
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   @Index
//   user_id: string;

//   @BelongsTo(() => User)
//   user: User;

//   @Column({
//     type: DataType.ENUM(...Object.values(TransactionType)),
//     allowNull: false,
//   })
//   @Index
//   transaction_type: TransactionType;

//   @Column({
//     type: DataType.DECIMAL(10, 2),
//     allowNull: false,
//   })
//   amount: number;

//   @Column({
//     type: DataType.DECIMAL(10, 2),
//     defaultValue: 0.00,
//   })
//   fee: number;

//   @Column({
//     type: DataType.DECIMAL(10, 2),
//     allowNull: false,
//   })
//   net_amount: number;

//   @Column({
//     type: DataType.ENUM(...Object.values(TransactionStatus)),
//     defaultValue: TransactionStatus.PENDING,
//   })
//   status: TransactionStatus;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true,
//   })
//   reference_id: string;
//   @Column({
//     type: DataType.STRING,
//     allowNull: true,
//   })
//   payment_details: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true,
//   })
//   reference_type: string;

//   @Column({
//     type: DataType.TEXT,
//     allowNull: true,
//   })
//   description: string;

//   @Column({
//     type: DataType.TEXT,
//     allowNull: true,
//   })
//   notes: string;

//   @Column({
//     type: DataType.DATE,
//     defaultValue: DataType.NOW,
//   })
//   transaction_date: Date;

//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//   })
//   processed_at: Date;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true,
//   })
//   payment_method: string;

//   @Column({
//     type: DataType.JSON,
//     allowNull: true,
//   })
//   metadata: object;
// }
