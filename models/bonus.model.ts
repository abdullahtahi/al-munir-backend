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
// import { BonusType } from '../../common/enums';

// @Table({
//   tableName: 'bonuses',
//   timestamps: true,
// })
// export class Bonus extends Model {
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

//   @ForeignKey(() => User)
//   @Column({
//     type: DataType.UUID,
//     allowNull: true,
//   })
//   @Index
//   from_user_id: string;

//   @BelongsTo(() => User, 'from_user_id')
//   fromUser: User;

//   @Column({
//     type: DataType.ENUM(...Object.values(BonusType)),
//     allowNull: false,
//   })
//   @Index
//   bonus_type: BonusType;

//   @Column({
//     type: DataType.DECIMAL(10, 2),
//     allowNull: false,
//   })
//   amount: number;

//   @Column({
//     type: DataType.DECIMAL(5, 2),
//     allowNull: false,
//   })
//   percentage: number;

//   @Column({
//     type: DataType.DECIMAL(10, 2),
//     allowNull: false,
//   })
//   base_amount: number;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true,
//   })
//   level_depth: number;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true,
//   })
//   reference_id: string;

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
//     type: DataType.DATE,
//     defaultValue: DataType.NOW,
//   })
//   earned_date: Date;

//   @Column({
//     type: DataType.STRING,
//     defaultValue: 'pending',
//   })
//   status: string;

//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//   })
//   processed_at: Date;

//   @Column({
//     type: DataType.JSON,
//     allowNull: true,
//   })
//   metadata: object;
// }
