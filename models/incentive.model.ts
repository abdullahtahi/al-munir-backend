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
// import { IncentiveType } from '../../common/enums';

// @Table({
//   tableName: 'incentives',
//   timestamps: true,
// })
// export class Incentive extends Model {
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
//     type: DataType.ENUM(...Object.values(IncentiveType)),
//     allowNull: false,
//   })
//   @Index
//   incentive_type: IncentiveType;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   title: string;

//   @Column({
//     type: DataType.TEXT,
//     allowNull: true,
//   })
//   description: string;

//   @Column({
//     type: DataType.DECIMAL(10, 2),
//     allowNull: false,
//   })
//   value: number;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false,
//   })
//   target_admissions: number;

//   @Column({
//     type: DataType.INTEGER,
//     defaultValue: 0,
//   })
//   current_admissions: number;

//   @Column({
//     type: DataType.DECIMAL(5, 2),
//     defaultValue: 0.00,
//   })
//   completion_percentage: number;

//   @Column({
//     type: DataType.STRING,
//     defaultValue: 'pending',
//   })
//   status: string;

//   @Column({
//     type: DataType.DATE,
//     defaultValue: DataType.NOW,
//   })
//   created_date: Date;

//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//   })
//   achieved_date: Date;

//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//   })
//   delivered_date: Date;

//   @Column({
//     type: DataType.TEXT,
//     allowNull: true,
//   })
//   delivery_notes: string;

//   @Column({
//     type: DataType.JSON,
//     allowNull: true,
//   })
//   metadata: object;
// }
